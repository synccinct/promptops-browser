"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRegistry = void 0;
class NodeRegistry {
    nodes = new Map();
    register(node) {
        this.nodes.set(node.id, node);
    }
    get(id) {
        return this.nodes.get(id);
    }
    getAll() {
        return Array.from(this.nodes.values());
    }
}
exports.NodeRegistry = NodeRegistry;
