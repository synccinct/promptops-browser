import { RequestSuggestionsPayload, PromptSession } from "@optiprompt/domain";

export class ApiClient {
  private token: string | null = null;

  constructor(private baseUrl: string) {}

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async createSession(session: Partial<PromptSession> & { id: string }): Promise<PromptSession> {
    const res = await fetch(`${this.baseUrl}/api/extension/session/start`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(session)
    });
    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
  }

  async requestSuggestions(payload: RequestSuggestionsPayload & { draftId: string, suggestionId?: string }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/extension/suggestions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to request suggestions");
    return res.json();
  }
}
