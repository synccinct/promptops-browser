import { BaseAdapter } from "./base";

export class ClaudeAdapter extends BaseAdapter {
  name = "Claude";

  matches(url: string): boolean {
    return url.includes("claude.ai");
  }

  findPromptInput(): HTMLElement | null {
    return document.querySelector("[contenteditable='true']") as HTMLElement;
  }

  getConversationTitle(): string | null {
    return document.title;
  }

  getModelProfile(): string | null {
    return "claude-3-5-sonnet";
  }
}
