"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
class ApiClient {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async createSession(session) {
        const res = await fetch(`${this.baseUrl}/api/extension/session/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(session)
        });
        if (!res.ok)
            throw new Error("Failed to create session");
        return res.json();
    }
    async requestSuggestions(payload) {
        const res = await fetch(`${this.baseUrl}/api/extension/suggestions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error("Failed to request suggestions");
        return res.json();
    }
}
exports.ApiClient = ApiClient;
