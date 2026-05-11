import { GraphNode } from "./node";
export declare class NodeRegistry {
    private nodes;
    register(node: GraphNode): void;
    get(id: string): GraphNode | undefined;
    getAll(): GraphNode[];
}
