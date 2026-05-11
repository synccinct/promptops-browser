import { RequestSuggestionsPayload, PromptSession } from "@optiprompt/domain";

export class ApiClient {
  constructor(private baseUrl: string) {}

  async createSession(session: Partial<PromptSession> & { id: string }): Promise<PromptSession> {
    const res = await fetch(`${this.baseUrl}/api/extension/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    });
    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
  }

  async requestSuggestions(payload: RequestSuggestionsPayload & { draftId: string, suggestionId?: string }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/extension/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to request suggestions");
    return res.json();
  }
}
