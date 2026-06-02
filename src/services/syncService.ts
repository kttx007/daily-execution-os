import type { AppData, SyncTableName, SyncTombstone } from "@/types";
import { supabase } from "@/services/supabase";
import { nowISO } from "@/utils/date";

const TABLES = ["tasks", "inbox_items", "weekly_tasks", "recurring_tasks", "output_logs", "daily_reviews"] as const;
type SyncTable = (typeof TABLES)[number];

function timestampOf(row: Record<string, unknown>) {
  const value = row.updated_at || row.completed_at || row.created_at;
  return typeof value === "string" ? Date.parse(value) || 0 : 0;
}

function mergeRows<T extends { id: string }>(localRows: T[], cloudRows: T[], tombstones: SyncTombstone[], table: SyncTableName) {
  const deleted = new Set(tombstones.filter((item) => item.table === table).map((item) => item.id));
  const map = new Map<string, T>();
  for (const row of cloudRows) map.set(row.id, row);
  for (const row of localRows) {
    const existing = map.get(row.id);
    if (!existing || timestampOf(row as Record<string, unknown>) >= timestampOf(existing as Record<string, unknown>)) {
      map.set(row.id, row);
    }
  }
  return Array.from(map.values()).filter((row) => !deleted.has(row.id));
}

export const syncService = {
  async pushLocalToCloud(data: AppData, userId: string, tombstones: SyncTombstone[] = []) {
    if (!supabase) throw new Error("Supabase 尚未配置。");
    for (const item of tombstones) {
      const { error } = await supabase.from(item.table).delete().eq("id", item.id).eq("user_id", userId);
      if (error) throw error;
    }
    for (const table of TABLES) {
      const rows = data[table].map((row) => ({ ...row, user_id: userId }));
      if (rows.length) {
        const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
        if (error) throw error;
      }
    }
    const settings = { ...data.user_settings, user_id: userId, updated_at: nowISO() };
    const { error } = await supabase.from("user_settings").upsert(settings, { onConflict: "id" });
    if (error) throw error;
    return { ...data, user_settings: settings };
  },

  async pullCloudToLocal(current: AppData, userId: string): Promise<AppData> {
    if (!supabase) throw new Error("Supabase 尚未配置。");
    const next = { ...current };
    for (const table of TABLES) {
      const { data, error } = await supabase.from(table).select("*").eq("user_id", userId);
      if (error) throw error;
      next[table] = (data ?? []) as never;
    }
    const { data: settings, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    if (settings) next.user_settings = settings as AppData["user_settings"];
    return next;
  },

  async mergeCloudAndLocal(current: AppData, userId: string, tombstones: SyncTombstone[]): Promise<AppData> {
    const cloud = await this.pullCloudToLocal(current, userId);
    const next: AppData = { ...current };
    for (const table of TABLES) {
      const localRows = current[table] as Array<{ id: string }>;
      const cloudRows = cloud[table] as Array<{ id: string }>;
      next[table] = mergeRows(localRows, cloudRows, tombstones, table as SyncTable) as never;
    }
    next.user_settings =
      timestampOf(current.user_settings as unknown as Record<string, unknown>) >= timestampOf(cloud.user_settings as unknown as Record<string, unknown>)
        ? current.user_settings
        : cloud.user_settings;
    return next;
  },
};
