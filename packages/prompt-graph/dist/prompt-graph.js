"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNodeRegistry = void 0;
exports.deriveCacheKey = deriveCacheKey;
exports.markNodeDirty = markNodeDirty;
exports.applyNodeResult = applyNodeResult;
exports.computeNode = computeNode;
exports.recomputeDirtyNodes = recomputeDirtyNodes;
exports.defaultNodeRegistry = {};
function deriveCacheKey(parts) {
    return parts.filter(Boolean).join("::");
}
function markNodeDirty(node) {
    return { ...node, state: "dirty" };
}
function applyNodeResult(node, result) {
    if (result.status === "failed") {
        return { ...node, state: "failed", error: result.error ?? "Unknown node failure" };
    }
    if (result.status === "pending") {
        return { ...node, state: "pending" };
    }
    return {
        ...node,
        state: "clean",
        value: (result.value ?? null),
        outputHash: result.outputHash ?? node.outputHash,
        error: null,
    };
}
async function computeNode(node, defs, graph, ctx) {
    const def = defs[node.type];
    if (!def) {
        return {
            node: { ...node, state: "failed", error: `Missing node definition: ${node.type}` },
            patchHints: [],
        };
    }
    const deps = {};
    for (const dep of node.deps)
        deps[dep] = graph[dep]?.value;
    const result = await def.compute(node.id, deps, ctx);
    return {
        node: applyNodeResult(node, result),
        patchHints: result.patchHints ?? [],
    };
}
async function recomputeDirtyNodes(snapshot, defs, ctx) {
    const nextNodes = { ...snapshot.nodes };
    const patchHints = new Set();
    for (const node of Object.values(snapshot.nodes)) {
        if (node.state !== "dirty")
            continue;
        const { node: updated, patchHints: hints } = await computeNode(node, defs, nextNodes, ctx);
        nextNodes[node.id] = updated;
        for (const hint of hints)
            patchHints.add(hint);
    }
    return {
        snapshot: { ...snapshot, nodes: nextNodes, updatedAt: new Date().toISOString() },
        patchHints: [...patchHints],
    };
}
