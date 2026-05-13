"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.sendTabMessage = sendTabMessage;
function sendMessage(message) {
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
function sendTabMessage(tabId, message) {
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
