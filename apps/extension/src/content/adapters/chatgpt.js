import { BaseAdapter } from "./base";
export class ChatGPTAdapter extends BaseAdapter {
    name = "ChatGPT";
    matches(url) {
        return url.includes("chatgpt.com");
    }
    findPromptInput() {
        return document.getElementById("prompt-textarea");
    }
    getConversationTitle() {
        return document.title.replace(" - ChatGPT", "");
    }
    getModelProfile() {
        // Basic detection - can be improved
        return document.querySelector("[data-testid='model-selector']")?.textContent || "gpt-4";
    }
}
