import { ExtensionEvent } from "@optiprompt/domain";

export function sendMessage<TResponse = any>(message: ExtensionEvent): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    if (typeof chrome === "undefined" || !chrome.runtime) {
      return reject(new Error("chrome.runtime is not available"));
    }
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(response);
    });
  });
}

export function sendTabMessage<TResponse = any>(tabId: number, message: ExtensionEvent): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    if (typeof chrome === "undefined" || !chrome.tabs) {
      return reject(new Error("chrome.tabs is not available"));
    }
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(response);
    });
  });
}
