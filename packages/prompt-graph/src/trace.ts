import type { SuggestionTrace } from "@optiprompt/schemas";

export type TraceState = SuggestionTrace;

export class Tracer {
  private traces: TraceState[] = [];

  record(nodeId: string, reason: string, state: TraceState["state"]) {
    this.traces.push({ nodeId, reason, state });
  }

  getTraces(): TraceState[] {
    return this.traces;
  }
}
