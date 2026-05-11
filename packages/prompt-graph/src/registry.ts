import { GraphNode } from "./node";

export class NodeRegistry {
  private nodes: Map<string, GraphNode> = new Map();

  register(node: GraphNode) {
    this.nodes.set(node.id, node);
  }

  get(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getAll(): GraphNode[] {
    return Array.from(this.nodes.values());
  }
}
