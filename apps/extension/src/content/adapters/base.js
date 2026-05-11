export class BaseAdapter {
    capturePrompt(rawText) {
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
