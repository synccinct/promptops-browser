import { RequestSuggestionsPayload, PromptSession } from "@optiprompt/domain";
export declare class ApiClient {
    private baseUrl;
    constructor(baseUrl: string);
    createSession(session: Partial<PromptSession> & {
        id: string;
    }): Promise<PromptSession>;
    requestSuggestions(payload: RequestSuggestionsPayload & {
        draftId: string;
        suggestionId?: string;
    }): Promise<any>;
}
