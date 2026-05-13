"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
class ApiClient {
    baseUrl;
    token = null;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    setToken(token) {
        this.token = token;
    }
    getHeaders() {
        const headers = {
            "Content-Type": "application/json"
        };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }
        return headers;
    }
    async createSession(session) {
        const res = await fetch(`${this.baseUrl}/api/extension/session/start`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(session)
        });
        if (!res.ok)
            throw new Error("Failed to create session");
        return res.json();
    }
    async requestSuggestions(payload) {
        const res = await fetch(`${this.baseUrl}/api/extension/suggestions`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(payload)
        });
        if (!res.ok)
            throw new Error("Failed to request suggestions");
        return res.json();
    }
}
exports.ApiClient = ApiClient;
