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
  insertedCards: Array<{ slot: string; cardId: string }>;
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

export const defaultNodeRegistry: Record<string, NodeDefinition> = {};

export function deriveCacheKey(parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join("::");
}

export function markNodeDirty<T>(node: PromptNode<T>): PromptNode<T> {
  return { ...node, state: "dirty" };
}

export function applyNodeResult<T>(node: PromptNode<T>, result: ComputeResult<T>): PromptNode<T> {
  if (result.status === "failed") {
    return { ...node, state: "failed", error: result.error ?? "Unknown node failure" };
  }

  if (result.status === "pending") {
    return { ...node, state: "pending" };
  }

  return {
    ...node,
    state: "clean",
    value: (result.value ?? null) as T | null,
    outputHash: result.outputHash ?? node.outputHash,
    error: null,
  };
}

export async function computeNode<T>(
  node: PromptNode<T>,
  defs: Record<string, NodeDefinition>,
  graph: Record<string, PromptNode>,
  ctx: ComputeContext,
): Promise<{ node: PromptNode<T>; patchHints: string[] }> {
  const def = defs[node.type];
  if (!def) {
    return {
      node: { ...node, state: "failed", error: `Missing node definition: ${node.type}` },
      patchHints: [],
    };
  }

  const deps: Record<string, unknown> = {};
  for (const dep of node.deps) deps[dep] = graph[dep]?.value;

  const result = await def.compute(node.id, deps, ctx) as ComputeResult<T>;
  return {
    node: applyNodeResult(node, result),
    patchHints: result.patchHints ?? [],
  };
}

export async function recomputeDirtyNodes(
  snapshot: PromptGraphSnapshot,
  defs: Record<string, NodeDefinition>,
  ctx: ComputeContext,
): Promise<{ snapshot: PromptGraphSnapshot; patchHints: string[] }> {
  const nextNodes = { ...snapshot.nodes };
  const patchHints = new Set<string>();

  for (const node of Object.values(snapshot.nodes)) {
    if (node.state !== "dirty") continue;
    const { node: updated, patchHints: hints } = await computeNode(node, defs, nextNodes, ctx);
    nextNodes[node.id] = updated;
    for (const hint of hints) patchHints.add(hint);
  }

  return {
    snapshot: { ...snapshot, nodes: nextNodes, updatedAt: new Date().toISOString() },
    patchHints: [...patchHints],
  };
}
