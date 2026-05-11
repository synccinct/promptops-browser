import { PromptCapturedPayload } from "@optiprompt/domain";

export abstract class BaseAdapter {
  abstract name: string;
  abstract matches(url: string): boolean;
  abstract findPromptInput(): HTMLElement | null;
  abstract getConversationTitle(): string | null;
  abstract getModelProfile(): string | null;

  capturePrompt(rawText: string): PromptCapturedPayload {
    return {
      sessionId: "", // To be resolved by session manager
      promptText: rawText,
      sourceSite: this.name,
      tabUrl: window.location.href,
      conversationTitle: this.getConversationTitle(),
      capturedAt: new Date().toISOString(),
    };
  }
}
