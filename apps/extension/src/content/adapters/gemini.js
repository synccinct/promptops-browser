import { BaseAdapter } from "./base";
export class GeminiAdapter extends BaseAdapter {
    name = "Gemini";
    matches(url) {
        return url.includes("gemini.google.com");
    }
    findPromptInput() {
        return document.querySelector(".textarea");
    }
    getConversationTitle() {
        return document.title;
    }
    getModelProfile() {
        return "gemini-pro";
    }
}
