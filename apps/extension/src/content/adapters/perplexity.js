import { BaseAdapter } from "./base";
export class PerplexityAdapter extends BaseAdapter {
    name = "Perplexity";
    matches(url) {
        return url.includes("perplexity.ai");
    }
    findPromptInput() {
        return document.querySelector("textarea");
    }
    getConversationTitle() {
        return document.title;
    }
    getModelProfile() {
        return "perplexity-sonar";
    }
}
