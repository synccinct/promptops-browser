import { BaseAdapter } from "./base";

export class GeminiAdapter extends BaseAdapter {
  name = "Gemini";

  matches(url: string): boolean {
    return url.includes("gemini.google.com");
  }

  findPromptInput(): HTMLElement | null {
    return document.querySelector(".textarea") as HTMLElement;
  }

  getConversationTitle(): string | null {
    return document.title;
  }

  getModelProfile(): string | null {
    return "gemini-pro";
  }
}
