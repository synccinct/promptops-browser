import { RequestSuggestionsPayload, PromptSession } from "@optiprompt/domain";
export declare class ApiClient {
    private baseUrl;
    private token;
    constructor(baseUrl: string);
    setToken(token: string | null): void;
    private getHeaders;
    createSession(session: Partial<PromptSession> & {
        id: string;
    }): Promise<PromptSession>;
    requestSuggestions(payload: RequestSuggestionsPayload & {
        draftId: string;
        suggestionId?: string;
    }): Promise<any>;
}
