<template>
  <div
    ref="treeRef"
    :class="[
      ns.base.value,
      {
        [`${ns.base.value}--highlight-current`]: props.highlightCurrent,
        'is-dragging': props.draggable && Boolean(dragState.draggingNode),
        'is-drop-not-allow': props.draggable && !dragState.allowDrop,
        'is-drop-inner': props.draggable && dragState.dropType === 'inner'
      }
    ]"
    role="tree"
    tabindex="0"
    :aria-multiselectable="props.showCheckbox ? 'true' : undefined"
    :aria-busy="isBusy ? 'true' : undefined"
    @focus="handleRootFocus"
    @keydown="handleKeydown"
  >
    <tree-node
      v-for="child in root.childNodes"
      :key="getRenderedNodeKey(child)"
      :node="child"
      :props-mapping="props.props"
      :accordion="props.accordion"
      :render-after-expand="props.renderAfterExpand"
      :show-checkbox="props.showCheckbox"
      :render-content="props.renderContent"
      @node-expand="handleNodeExpand"
    />

    <div v-if="isEmpty" :class="`${ns.base.value}__empty-block`">
      <slot name="empty">
        <xy-empty :description="props.emptyText" />
      </slot>
    </div>

    <div
      v-show="dragState.showDropIndicator"
      ref="dropIndicatorRef"
      :class="`${ns.base.value}__drop-indicator`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, provide, ref, useSlots, watch, watchEffect } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyEmpty } from "../../empty";
import Node from "./model/node";
import TreeStore from "./model/tree-store";
import TreeNode from "./tree-node.vue";
import { useDragNodeHandler } from "./model/use-drag-node";
import { collectFocusableNodes, collectVisibleNodes, handleCurrentChange } from "./model/util";
import { treeEmits, treeProps } from "./tree";
import { ROOT_TREE_INJECTION_KEY } from "./tokens";
import type { RootTreeType, TreeExposes, TreeKey, TreeNodeData } from "./tree.type";

defineOptions({
  name: "XyTree"
});

const KEYBOARD_ENTER_KEYS = new Set(["Enter", "NumpadEnter"]);
const KEYBOARD_SPACE_KEYS = new Set([" ", "Spacebar"]);

const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);
const slots = useSlots();
const emitTreeEvent: RootTreeType["emit"] = (event: string, ...args: any[]) => {
  (emit as (...payload: any[]) => void)(event, ...args);
};

if (!props.nodeKey) {
  if (props.currentNodeKey !== undefined && props.currentNodeKey !== null) {
    throw new Error("[Tree] nodeKey is required when using currentNodeKey");
  }

  if ((props.defaultExpandedKeys?.length ?? 0) > 0) {
    throw new Error("[Tree] nodeKey is required when using defaultExpandedKeys");
  }

  if ((props.defaultCheckedKeys?.length ?? 0) > 0) {
    throw new Error("[Tree] nodeKey is required when using defaultCheckedKeys");
  }
}

const ns = useNamespace("tree");
const treeRef = ref<HTMLElement | null>(null);
const dropIndicatorRef = ref<HTMLElement | null>(null);
const store = ref(
  new TreeStore({
    key: props.nodeKey,
    data: props.data,
    lazy: props.lazy,
    props: props.props,
    load: props.load,
    currentNodeKey: props.currentNodeKey ?? null,
    checkStrictly: props.checkStrictly,
    checkDescendants: props.checkDescendants,
    defaultCheckedKeys: props.defaultCheckedKeys,
    defaultExpandedKeys: props.defaultExpandedKeys,
    autoExpandParent: props.autoExpandParent,
    defaultExpandAll: props.defaultExpandAll,
    filterNodeMethod: props.filterNodeMethod,
    accordion: props.accordion
  })
);

store.value.initialize();

const root = ref<Node>(store.value.root);
const instance = getCurrentInstance();
const visibleNodes = computed(() => collectVisibleNodes(root.value));
const focusableNodes = computed(() => collectFocusableNodes(root.value));
const isEmpty = computed(() => visibleNodes.value.length === 0);
const isBusy = computed(() => {
  let busy = false;

  root.value.eachNode((node) => {
    if (node.loading) {
      busy = true;
    }
  });

  return busy;
});
const { dragState } = useDragNodeHandler({
  props,
  emit: emitTreeEvent,
  rootRef: treeRef,
  dropIndicatorRef,
  store,
  blockClass: ns.base.value
});

function requireNodeKey(methodName: string) {
  if (!props.nodeKey) {
    throw new Error(`[Tree] nodeKey is required in ${methodName}`);
  }
}

function getRenderedNodeKey(node: Node) {
  return node.key ?? node.id;
}

function findTreeItem(node: Node | TreeKey | null | undefined) {
  if (!treeRef.value || node === undefined || node === null) {
    return null;
  }

  const expectedKey = String(node instanceof Node ? getRenderedNodeKey(node) : node);
  const items = Array.from(treeRef.value.querySelectorAll<HTMLElement>('[role="treeitem"]'));

  return items.find((item) => item.dataset.key === expectedKey) ?? null;
}

function focusTreeItem(node: Node | null | undefined) {
  const target = findTreeItem(node);

  if (!target || !treeRef.value) {
    return;
  }

  treeRef.value.querySelectorAll<HTMLElement>('[role="treeitem"]').forEach((item) => {
    item.tabIndex = -1;
  });

  target.tabIndex = 0;
  target.focus();
}

function syncFocusableTreeItem(preferredNode?: Node | null) {
  const navigableNodes = focusableNodes.value;
  const fallbackNode =
    (preferredNode && !preferredNode.disabled ? preferredNode : null) ??
    store.value.currentNode ??
    navigableNodes.find((node) => node.checked || node.indeterminate) ??
    navigableNodes[0];

  if (!fallbackNode) {
    return;
  }

  nextTick(() => {
    focusTreeItem(fallbackNode);
  });
}

function focusNodeByIndex(nodes: Node[], index: number) {
  const targetNode = nodes[index];

  if (targetNode) {
    focusTreeItem(targetNode);
  }
}

function handleRootFocus(event: FocusEvent) {
  if (event.target !== treeRef.value) {
    return;
  }

  const visibleNodes = focusableNodes.value;

  if (visibleNodes.length === 0) {
    return;
  }

  syncFocusableTreeItem();
}

function handleKeydown(event: KeyboardEvent) {
  const visibleNodes = focusableNodes.value;

  if (visibleNodes.length === 0) {
    return;
  }

  const currentItem = (event.target as HTMLElement).closest('[role="treeitem"]') as HTMLElement | null;
  const currentIndex = currentItem
    ? visibleNodes.findIndex((node) => String(getRenderedNodeKey(node)) === currentItem.dataset.key)
    : -1;
  const currentNode = currentIndex > -1 ? visibleNodes[currentIndex] : null;

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();

    if (currentIndex === -1) {
      focusNodeByIndex(visibleNodes, 0);
      return;
    }

    const offset = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + offset + visibleNodes.length) % visibleNodes.length;
    focusNodeByIndex(visibleNodes, nextIndex);
    return;
  }

  if (!currentNode || !currentItem) {
    if (
      event.key === "ArrowRight" ||
      KEYBOARD_ENTER_KEYS.has(event.key) ||
      KEYBOARD_SPACE_KEYS.has(event.key)
    ) {
      event.preventDefault();
      focusNodeByIndex(visibleNodes, 0);
    }

    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();

    if (currentNode.isLeaf) {
      return;
    }

    if (!currentNode.expanded) {
      currentItem.querySelector<HTMLButtonElement>(`.${ns.base.value}__expand-icon`)?.click();
      return;
    }

    const firstVisibleChild = currentNode.childNodes.find((node) => node.visible);

    if (firstVisibleChild) {
      focusTreeItem(firstVisibleChild);
    }

    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();

    if (!currentNode.isLeaf && currentNode.expanded) {
      currentItem.querySelector<HTMLButtonElement>(`.${ns.base.value}__expand-icon`)?.click();
      return;
    }

    if (currentNode.parent && currentNode.parent.level > 0) {
      focusTreeItem(currentNode.parent);
    }

    return;
  }

  if (KEYBOARD_ENTER_KEYS.has(event.key) || KEYBOARD_SPACE_KEYS.has(event.key)) {
    event.preventDefault();

    const checkbox = currentItem.querySelector<HTMLInputElement>(".xy-checkbox__original");

    if (checkbox) {
      checkbox.click();
      return;
    }

    currentItem.click();
  }
}

watchEffect(() => {
  store.value.props = props.props;
  store.value.load = props.load;
  store.value.lazy = props.lazy;
  store.value.filterNodeMethod = props.filterNodeMethod;
  store.value.autoExpandParent = props.autoExpandParent;
  store.value.defaultExpandAll = props.defaultExpandAll;
  store.value.accordion = props.accordion;
  store.value.checkDescendants = props.checkDescendants;
});

watch(
  () => props.currentNodeKey,
  (newValue) => {
    if (newValue !== undefined && newValue !== null) {
      requireNodeKey("currentNodeKey");
    }

    store.value.setCurrentNodeKey(newValue ?? null);
    syncFocusableTreeItem(store.value.currentNode);
  }
);

watch(
  () => props.defaultCheckedKeys,
  (newValue) => {
    if ((newValue?.length ?? 0) > 0) {
      requireNodeKey("defaultCheckedKeys");
    }

    store.value.setDefaultCheckedKey(newValue ?? []);
    syncFocusableTreeItem();
  }
);

watch(
  () => props.defaultExpandedKeys,
  (newValue) => {
    if ((newValue?.length ?? 0) > 0) {
      requireNodeKey("defaultExpandedKeys");
    }

    store.value.setDefaultExpandedKeys(newValue ?? []);
    syncFocusableTreeItem();
  }
);

watch(
  () => props.data,
  (newValue) => {
    store.value.setData(newValue);
    syncFocusableTreeItem();
  },
  {
    deep: true
  }
);

watch(
  () => props.checkStrictly,
  (newValue) => {
    store.value.checkStrictly = newValue;

    if (!newValue) {
      root.value.childNodes.forEach((node) => node.reInitChecked());
    }

    syncFocusableTreeItem();
  }
);

function filter(value: string | number | boolean | null | undefined) {
  if (!props.filterNodeMethod) {
    throw new Error("[Tree] filterNodeMethod is required when filter");
  }

  store.value.filter(value);
  syncFocusableTreeItem();
}

function getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
  return store.value.getCheckedNodes(leafOnly, includeHalfChecked);
}

function getNodePath(data: TreeKey | TreeNodeData) {
  requireNodeKey("getNodePath");

  const node = store.value.getNode(data);

  if (!node) {
    return [];
  }

  const path: TreeNodeData[] = [node.data as TreeNodeData];
  let parent = node.parent;

  while (parent && parent !== root.value) {
    path.push(parent.data as TreeNodeData);
    parent = parent.parent;
  }

  return path.reverse();
}

function setCheckedNodes(nodes: TreeNodeData[], leafOnly = false) {
  store.value.setCheckedNodes(nodes, leafOnly);
}

function getCheckedKeys(leafOnly = false) {
  requireNodeKey("getCheckedKeys");
  return store.value.getCheckedKeys(leafOnly);
}

function setCheckedKeys(keys: TreeKey[], leafOnly = false) {
  requireNodeKey("setCheckedKeys");
  store.value.setCheckedKeys(keys, leafOnly);
}

function setChecked(data: TreeKey | TreeNodeData, checked: boolean, deep: boolean) {
  store.value.setChecked(data, checked, deep);
}

function getHalfCheckedNodes() {
  return store.value.getHalfCheckedNodes();
}

function getHalfCheckedKeys() {
  requireNodeKey("getHalfCheckedKeys");
  return store.value.getHalfCheckedKeys();
}

function getCurrentNode() {
  const currentNode = store.value.getCurrentNode();
  return currentNode ? (currentNode.data as TreeNodeData) : null;
}

function getCurrentKey() {
  requireNodeKey("getCurrentKey");
  return store.value.currentNode?.key ?? null;
}

function setCurrentNode(node: TreeNodeData | TreeKey | Node, shouldAutoExpandParent = true) {
  const currentNode = store.value.getNode(node);

  if (!currentNode) {
    return;
  }

  handleCurrentChange(store, emitTreeEvent, () => {
    store.value.setUserCurrentNode(currentNode, shouldAutoExpandParent);
  });
  syncFocusableTreeItem(currentNode);
}

function setCurrentKey(key: TreeKey | null = null, shouldAutoExpandParent = true) {
  requireNodeKey("setCurrentKey");

  handleCurrentChange(store, emitTreeEvent, () => {
    store.value.setCurrentNodeKey(key, shouldAutoExpandParent);
  });
  syncFocusableTreeItem(store.value.currentNode);
}

function getNode(data: TreeKey | TreeNodeData) {
  return store.value.getNode(data);
}

function remove(data: TreeNodeData | Node) {
  store.value.remove(data);
}

function append(data: TreeNodeData, parentNode?: TreeNodeData | TreeKey | Node) {
  store.value.append(data, parentNode);
}

function insertBefore(data: TreeNodeData, refNode: TreeKey | TreeNodeData | Node) {
  store.value.insertBefore(data, refNode);
}

function insertAfter(data: TreeNodeData, refNode: TreeKey | TreeNodeData | Node) {
  store.value.insertAfter(data, refNode);
}

function updateKeyChildren(key: TreeKey, data: TreeNodeData[]) {
  requireNodeKey("updateKeyChildren");
  store.value.updateChildren(key, data);
}

function handleNodeExpand(nodeData: TreeNodeData, node: Node, nodeInstance: ReturnType<typeof getCurrentInstance>) {
  emit("node-expand", nodeData, node, nodeInstance);
}

provide(ROOT_TREE_INJECTION_KEY, {
  emit: emitTreeEvent,
  slots,
  props,
  store,
  root,
  instance,
  focusTreeItem
});

defineExpose<TreeExposes>({
  filter,
  getNodePath,
  getCheckedNodes,
  setCheckedNodes,
  getCheckedKeys,
  setCheckedKeys,
  setChecked,
  getHalfCheckedNodes,
  getHalfCheckedKeys,
  getCurrentNode,
  getCurrentKey,
  setCurrentNode,
  setCurrentKey,
  getNode,
  remove,
  append,
  insertBefore,
  insertAfter,
  updateKeyChildren
});
</script>
