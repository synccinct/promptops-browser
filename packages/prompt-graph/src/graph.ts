import { GraphNode } from "./node";
import { TraceState, Tracer } from "./trace";
import { GraphCache } from "./cache";
import { NodeRegistry } from "./registry";

export class PromptGraph {
  registry = new NodeRegistry();
  cache = new GraphCache();

  async run(context: any): Promise<{ results: Record<string, any>; traces: TraceState[] }> {
    const tracer = new Tracer();
    const results: Record<string, any> = {};
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
        } catch (err) {
          tracer.record(node.id, String(err), "failed");
        }
      } else {
        tracer.record(node.id, "unchanged", "cached");
        results[node.id] = prev;
      }
    }

    return { results, traces: tracer.getTraces() };
  }
}
