import { BaseAdapter } from "./base";

export class ChatGPTAdapter extends BaseAdapter {
  name = "ChatGPT";

  matches(url: string): boolean {
    return url.includes("chatgpt.com");
  }

  findPromptInput(): HTMLElement | null {
    return document.getElementById("prompt-textarea");
  }

  getConversationTitle(): string | null {
    return document.title.replace(" - ChatGPT", "");
  }

  getModelProfile(): string | null {
    // Basic detection - can be improved
    return document.querySelector("[data-testid='model-selector']")?.textContent || "gpt-4";
  }
}
