import type { AppData } from "@/types";
import { localStorageService } from "@/services/localStorage";
import { syncService } from "@/services/syncService";

export const storageService = {
  load() {
    return localStorageService.getData();
  },
  save(data: AppData) {
    localStorageService.saveData(data);
  },
  export(data: AppData) {
    return localStorageService.exportData(data);
  },
  import(json: string) {
    return localStorageService.importData(json);
  },
  clear() {
    localStorageService.clear();
  },
  reset() {
    return localStorageService.reset();
  },
  async pushToCloud(data: AppData, userId: string) {
    const tombstones = localStorageService.getTombstones();
    const pushed = await syncService.pushLocalToCloud(data, userId, tombstones);
    localStorageService.clearTombstones();
    localStorageService.saveData(pushed);
    return pushed;
  },
  async pullFromCloud(data: AppData, userId: string) {
    const pulled = await syncService.pullCloudToLocal(data, userId);
    localStorageService.saveData(pulled);
    return pulled;
  },
  async syncNow(data: AppData, userId: string) {
    const tombstones = localStorageService.getTombstones();
    const merged = await syncService.mergeCloudAndLocal(data, userId, tombstones);
    const pushed = await syncService.pushLocalToCloud(merged, userId, tombstones);
    localStorageService.clearTombstones();
    localStorageService.saveData(pushed);
    return pushed;
  },
  markDeleted: localStorageService.addTombstone.bind(localStorageService),
};
