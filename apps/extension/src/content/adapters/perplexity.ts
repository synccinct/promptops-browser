import { BaseAdapter } from "./base";

export class PerplexityAdapter extends BaseAdapter {
  name = "Perplexity";

  matches(url: string): boolean {
    return url.includes("perplexity.ai");
  }

  findPromptInput(): HTMLElement | null {
    return document.querySelector("textarea") as HTMLElement;
  }

  getConversationTitle(): string | null {
    return document.title;
  }

  getModelProfile(): string | null {
    return "perplexity-sonar";
  }
}
