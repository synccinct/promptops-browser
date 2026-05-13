import { storage } from "./storage";
import { apiClient } from "./auth-bridge";

export interface SyncTask {
  id: string;
  type: "CREATE_SESSION" | "CREATE_DRAFT";
  payload: any;
  retryCount: number;
  timestamp: string;
}

export class SyncManager {

  async queueSyncTask(type: SyncTask["type"], payload: any) {
    const tasks = await storage.getOrDefault<SyncTask[]>("syncTasks", []);
    const task: SyncTask = {
      id: crypto.randomUUID(),
      type,
      payload,
      retryCount: 0,
      timestamp: new Date().toISOString()
    };
    
    tasks.push(task);
    await storage.set("syncTasks", tasks);
    
    this.processQueue().catch(console.error);
  }

  async processQueue() {
    const lock = await storage.get<{ timestamp: number }>("syncProcessingLock");
    if (lock) {
      if (Date.now() - lock.timestamp < 30000) {
        return; // Lock is still valid
      }
      // Lock is stale, proceed
    }

    await storage.set("syncProcessingLock", { timestamp: Date.now() });

    try {
      const tasks = await storage.getOrDefault<SyncTask[]>("syncTasks", []);
      if (tasks.length === 0) return;

      const remainingTasks: SyncTask[] = [];

      for (const task of tasks) {
        try {
          if (task.type === "CREATE_SESSION") {
            await apiClient.createSession(task.payload);
          } else if (task.type === "CREATE_DRAFT") {
            const token = await storage.get<string>("authToken");
            const baseUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
            const res = await fetch(`${baseUrl}/api/extension/draft`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
              },
              body: JSON.stringify(task.payload)
            });
            if (!res.ok) throw new Error(`Draft sync failed: ${res.statusText}`);
          }
        } catch (err) {
          console.error(`Sync task failed (ID: ${task.id})`, err);
          task.retryCount += 1;
          if (task.retryCount < 5) {
            remainingTasks.push(task);
          }
        }
      }

      await storage.set("syncTasks", remainingTasks);
    } finally {
      await storage.remove("syncProcessingLock");
    }
  }
}

export const syncManager = new SyncManager();
