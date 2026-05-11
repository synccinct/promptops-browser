import { GraphNode } from "./node";

export class Scheduler {
  schedule(nodes: GraphNode[]): GraphNode[][] {
    // Very simple topological sort/execution plan. For now just run sequentially or parallel based on no deps.
    // Assuming sequential for MVP.
    return [nodes];
  }
}
