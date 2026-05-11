import { BaseAdapter } from "./base";
export class ClaudeAdapter extends BaseAdapter {
    name = "Claude";
    matches(url) {
        return url.includes("claude.ai");
    }
    findPromptInput() {
        return document.querySelector("[contenteditable='true']");
    }
    getConversationTitle() {
        return document.title;
    }
    getModelProfile() {
        return "claude-3-5-sonnet";
    }
}
