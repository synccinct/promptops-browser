import type { SuggestionTrace } from "@optiprompt/schemas";
export type TraceState = SuggestionTrace;
export declare class Tracer {
    private traces;
    record(nodeId: string, reason: string, state: TraceState["state"]): void;
    getTraces(): TraceState[];
}
