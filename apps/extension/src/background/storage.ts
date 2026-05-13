export const STORAGE_KEYS = {
  ACTIVE_SESSION: "activeSession",
  CURRENT_DRAFT: "currentDraft",
  AUTH_TOKEN: "authToken",
  SYNC_TASKS: "syncTasks",
  ACTIVE_TAB_ID: "activeTabId",
  SYNC_PROCESSING_LOCK: "syncProcessingLock",
} as const;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const data = await chrome.storage.local.get(key);
    return data[key] || null;
  },
  async getOrDefault<T>(key: string, fallback: T): Promise<T> {
    const data = await chrome.storage.local.get(key);
    return data[key] !== undefined ? data[key] : fallback;
  },
  async set(key: string, value: any): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },
  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }
};
