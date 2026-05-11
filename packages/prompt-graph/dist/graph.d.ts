import { TraceState } from "./trace";
import { GraphCache } from "./cache";
import { NodeRegistry } from "./registry";
export declare class PromptGraph {
    registry: NodeRegistry;
    cache: GraphCache;
    run(context: any): Promise<{
        results: Record<string, any>;
        traces: TraceState[];
    }>;
}
