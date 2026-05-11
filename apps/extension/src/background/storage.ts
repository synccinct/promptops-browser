export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const data = await chrome.storage.local.get(key);
    return data[key] || null;
  },
  async set(key: string, value: any): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },
  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }
};
