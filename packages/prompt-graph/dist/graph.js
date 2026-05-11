"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptGraph = void 0;
const trace_1 = require("./trace");
const cache_1 = require("./cache");
const registry_1 = require("./registry");
class PromptGraph {
    registry = new registry_1.NodeRegistry();
    cache = new cache_1.GraphCache();
    async run(context) {
        const tracer = new trace_1.Tracer();
        const results = {};
        const nodes = this.registry.getAll();
        for (const node of nodes) {
            const prev = this.cache.get(node.id);
            const dirty = node.isDirty(context, prev);
            if (dirty || !this.cache.has(node.id)) {
                tracer.record(node.id, "inputs_changed", "updated");
                try {
                    const result = await node.compute(results, context);
                    this.cache.set(node.id, result);
                    results[node.id] = result;
                }
                catch (err) {
                    tracer.record(node.id, String(err), "failed");
                }
            }
            else {
                tracer.record(node.id, "unchanged", "cached");
                results[node.id] = prev;
            }
        }
        return { results, traces: tracer.getTraces() };
    }
}
exports.PromptGraph = PromptGraph;
