export type NodeState = "clean" | "dirty" | "pending" | "failed";
export interface PromptNode<T = unknown> {
    id: string;
    type: string;
    deps: string[];
    version: string;
    state: NodeState;
    inputHash: string;
    outputHash: string | null;
    value: T | null;
    error: string | null;
}
export interface NodeCache {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
}
export interface ComputeContext {
    workspaceId?: string;
    modelProfile: string;
    policyVersion: string;
    cache: NodeCache;
}
export interface ComputeResult<T> {
    status: "unchanged" | "changed" | "pending" | "failed";
    value?: T;
    outputHash?: string;
    patchHints?: string[];
    error?: string;
}
export interface NodeDefinition<T = unknown> {
    type: string;
    compute(nodeId: string, deps: Record<string, unknown>, ctx: ComputeContext): Promise<ComputeResult<T>>;
}
export interface UIPatch {
    promptId: string;
    changedCards: Array<"structure" | "constraints" | "format" | "variants" | "history">;
    removedCards: string[];
    insertedCards: Array<{
        slot: string;
        cardId: string;
    }>;
    badges: Record<string, "cached" | "updated" | "pending" | "error">;
    preserveStateKeys: string[];
}
export interface PromptGraphSnapshot {
    graphId: string;
    sessionId: string;
    activePromptDraftId: string;
    nodes: Record<string, PromptNode>;
    updatedAt: string;
}
export declare const defaultNodeRegistry: Record<string, NodeDefinition>;
export declare function deriveCacheKey(parts: Array<string | undefined | null>): string;
export declare function markNodeDirty<T>(node: PromptNode<T>): PromptNode<T>;
export declare function applyNodeResult<T>(node: PromptNode<T>, result: ComputeResult<T>): PromptNode<T>;
export declare function computeNode<T>(node: PromptNode<T>, defs: Record<string, NodeDefinition>, graph: Record<string, PromptNode>, ctx: ComputeContext): Promise<{
    node: PromptNode<T>;
    patchHints: string[];
}>;
export declare function recomputeDirtyNodes(snapshot: PromptGraphSnapshot, defs: Record<string, NodeDefinition>, ctx: ComputeContext): Promise<{
    snapshot: PromptGraphSnapshot;
    patchHints: string[];
}>;
