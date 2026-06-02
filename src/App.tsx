import { useEffect, useRef, useState } from "react";
import type { ViewKey } from "@/types";
import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { InboxPage } from "@/pages/Inbox";
import { Today } from "@/pages/Today";
import { Matrix } from "@/pages/Matrix";
import { Weekly } from "@/pages/Weekly";
import { Recurring } from "@/pages/Recurring";
import { OutputLogPage } from "@/pages/OutputLog";
import { Review } from "@/pages/Review";
import { Settings } from "@/pages/Settings";
import { useAuth } from "@/hooks/useAuth";
import { useSyncStatus } from "@/hooks/useSync";
import { useTaskStore } from "@/hooks/useTasks";
import { isReviewTime, todayISO } from "@/utils/date";

export default function App() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const { data, actions, message } = useTaskStore();
  const auth = useAuth();
  const { online } = useSyncStatus();
  const bootstrappedUserRef = useRef<string | null>(null);
  const lastAutoSyncPayloadRef = useRef("");
  const syncingRef = useRef(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const key = `daily-execution-os:review-notified:${todayISO()}`;
      if (!data.user_settings.notification_enabled || localStorage.getItem(key) || !isReviewTime(data.user_settings.reminder_time)) return;
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("到 17:00 复盘时间了", { body: "整理今天的完成、顺延和明日 Top 3。" });
        localStorage.setItem(key, "1");
      }
    };
    tick();
    const interval = window.setInterval(tick, 60_000);
    return () => window.clearInterval(interval);
  }, [data.user_settings.notification_enabled, data.user_settings.reminder_time]);

  useEffect(() => {
    if (!auth.user || !auth.configured || !online || bootstrappedUserRef.current === auth.user.id) return;
    bootstrappedUserRef.current = auth.user.id;
    syncingRef.current = true;
    actions
      .syncNow(auth.user.id)
      .then(() => {
        lastAutoSyncPayloadRef.current = actions.exportJson();
      })
      .catch((error) => {
        actions.setMessage(error instanceof Error ? error.message : "首次云同步失败，已保留本地数据");
        bootstrappedUserRef.current = null;
      })
      .finally(() => {
        syncingRef.current = false;
      });
  }, [actions, auth.configured, auth.user, online]);

  useEffect(() => {
    if (!auth.user || !auth.configured || !online || bootstrappedUserRef.current !== auth.user.id || syncingRef.current) return;
    const userId = auth.user.id;
    const payload = JSON.stringify(data);
    if (payload === lastAutoSyncPayloadRef.current) return;
    const timer = window.setTimeout(() => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      actions
        .pushToCloud(userId)
        .then(() => {
          lastAutoSyncPayloadRef.current = payload;
        })
        .catch((error) => {
          actions.setMessage(error instanceof Error ? error.message : "自动同步失败，已保留本地数据");
        })
        .finally(() => {
          syncingRef.current = false;
        });
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [actions, auth.configured, auth.user, data, online]);

  const pages: Record<ViewKey, React.ReactNode> = {
    dashboard: <Dashboard data={data} actions={actions} setView={setView} />,
    inbox: <InboxPage data={data} actions={actions} />,
    today: <Today data={data} actions={actions} />,
    matrix: <Matrix data={data} actions={actions} />,
    weekly: <Weekly data={data} actions={actions} />,
    recurring: <Recurring data={data} actions={actions} />,
    outputs: <OutputLogPage data={data} actions={actions} />,
    review: <Review data={data} actions={actions} />,
    settings: <Settings data={data} actions={actions} user={auth.user} login={auth.login} register={auth.register} logout={auth.logout} configured={auth.configured} />,
  };

  return (
    <AppShell view={view} setView={setView}>
      {message && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
        </div>
      )}
      {pages[view]}
    </AppShell>
  );
}
