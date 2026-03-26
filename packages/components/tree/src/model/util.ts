import type Node from "./node";
import type { RootTreeType, TreeKey, TreeNodeData } from "../tree.type";

export const NODE_KEY = "$treeNodeId";

export function markNodeData(node: Node, data: TreeNodeData | null): void {
  if (!data || data[NODE_KEY] !== undefined) {
    return;
  }

  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: false,
    writable: false
  });
}

export function getNodeKey(key: string | undefined, data: TreeNodeData | null | undefined) {
  if (!data) {
    return undefined;
  }

  return data[key ?? NODE_KEY] as TreeKey | undefined;
}

export function handleCurrentChange(
  store: RootTreeType["store"],
  emit: RootTreeType["emit"],
  setCurrent: () => void
) {
  const previousCurrentNode = store.value.currentNode;

  setCurrent();

  const currentNode = store.value.currentNode;

  if (previousCurrentNode === currentNode) {
    return;
  }

  emit("current-change", currentNode ? currentNode.data : null, currentNode);
}
