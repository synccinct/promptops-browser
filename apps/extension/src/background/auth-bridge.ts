// Background Worker Component

import { ApiClient } from "@optiprompt/sdk/src/api-client";
import { storage } from "./storage";

// Using a mock default if VITE_API_URL is missing
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";
export const apiClient = new ApiClient(API_BASE_URL);

/**
 * Handles authentication token synchronization
 * @security: Only accepts messages from extension contexts
 */
export class AuthBridge {
  async init() {
    const token = await storage.get<string>("authToken");
    if (token) {
      apiClient.setToken(token);
    }

    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessageExternal) {
      chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
        // Verify sender origin
        if (sender.origin && sender.origin.startsWith("moz-extension://")) {
          if (request.type === "SYNC_AUTH_TOKEN" && request.token) {
            this.setToken(request.token).then(() => {
              sendResponse({ success: true });
            });
            return true;
          }
        }
        return false;
      });
    }
  }

  async setToken(token: string) {
    await storage.set("authToken", token);
    apiClient.setToken(token);
  }

  async getToken(): Promise<string | null> {
    return await storage.get<string>("authToken");
  }
}

/**
 * @security: Background worker singleton for auth operations
 */
export const authBridge = new AuthBridge();
