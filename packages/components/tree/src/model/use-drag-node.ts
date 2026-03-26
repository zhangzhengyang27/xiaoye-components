import { provide, ref } from "vue";
import type { InjectionKey, Ref } from "vue";
import type {
  AllowDragFunction,
  AllowDropFunction,
  FakeNode,
  NodeDropType,
  RootTreeType,
  TreeDragPayload,
  TreeNodeData
} from "../tree.type";
import type TreeStore from "./tree-store";
import type Node from "./node";

export interface TreeDragNode {
  node: Node;
  $el?: HTMLElement | null;
}

interface DragOptions {
  event: DragEvent;
  treeNode: TreeDragNode;
}

interface UseDragNodeOptions {
  props: {
    allowDrag?: AllowDragFunction;
    allowDrop?: AllowDropFunction;
  };
  emit: RootTreeType["emit"];
  rootRef: Ref<HTMLElement | null>;
  dropIndicatorRef: Ref<HTMLElement | null>;
  store: Ref<TreeStore>;
  blockClass: string;
}

export interface DragEvents {
  treeNodeDragStart: (options: DragOptions) => void;
  treeNodeDragOver: (options: DragOptions) => void;
  treeNodeDragEnd: (event: DragEvent) => void;
}

export const dragEventsKey: InjectionKey<DragEvents> = Symbol("xiaoye-tree-drag-events");

function addClass(element: HTMLElement | null | undefined, className: string) {
  if (element) {
    element.classList.add(className);
  }
}

function removeClass(element: HTMLElement | null | undefined, className: string) {
  if (element) {
    element.classList.remove(className);
  }
}

function getElementKey(node: Node) {
  return String(node.key ?? node.id);
}

export function useDragNodeHandler({
  props,
  emit,
  rootRef,
  dropIndicatorRef,
  store,
  blockClass
}: UseDragNodeOptions) {
  const innerDropClass = "is-drop-inner";
  const autoExpandDelay = 240;
  let latestDragOptions: DragOptions | null = null;
  let dragOverFrame = 0;
  let dragExpandTimer: ReturnType<typeof globalThis.setTimeout> | number | null = null;
  let expandTargetId: number | null = null;

  const dragState = ref<{
    allowDrop: boolean;
    dropType: NodeDropType | null;
    draggingNode: TreeDragNode | null;
    showDropIndicator: boolean;
    dropNode: TreeDragNode | null;
  }>({
    allowDrop: true,
    dropType: null,
    draggingNode: null,
    showDropIndicator: false,
    dropNode: null
  });

  function resetDragState() {
    dragState.value.showDropIndicator = false;
    dragState.value.draggingNode = null;
    dragState.value.dropNode = null;
    dragState.value.allowDrop = true;
    dragState.value.dropType = null;
    latestDragOptions = null;

    if (dragOverFrame !== 0) {
      cancelAnimationFrame(dragOverFrame);
      dragOverFrame = 0;
    }

    if (dragExpandTimer) {
      clearTimeout(dragExpandTimer);
      dragExpandTimer = null;
      expandTargetId = null;
    }
  }

  function scheduleExpand(dropNode: TreeDragNode) {
    if (dropNode.node.isLeaf || dropNode.node.expanded) {
      if (dragExpandTimer) {
        clearTimeout(dragExpandTimer);
        dragExpandTimer = null;
        expandTargetId = null;
      }
      return;
    }

    if (expandTargetId === dropNode.node.id) {
      return;
    }

    if (dragExpandTimer) {
      clearTimeout(dragExpandTimer);
    }

    expandTargetId = dropNode.node.id;
    dragExpandTimer = window.setTimeout(() => {
      dropNode.node.expand();
      dragExpandTimer = null;
      expandTargetId = null;
    }, autoExpandDelay);
  }

  function buildDragPayload(
    oldParent: Node | null,
    oldIndex: number,
    finalNode: Node | null
  ): TreeDragPayload {
    const newParent = finalNode?.parent ?? oldParent;
    const newIndex = finalNode && newParent ? newParent.childNodes.indexOf(finalNode) : oldIndex;

    return {
      oldParent: oldParent && !Array.isArray(oldParent.data) ? (oldParent.data as TreeNodeData) : null,
      newParent: newParent && !Array.isArray(newParent.data) ? (newParent.data as TreeNodeData) : null,
      oldIndex,
      newIndex
    };
  }

  function treeNodeDragStart({ event, treeNode }: DragOptions) {
    if (!event.dataTransfer) {
      return;
    }

    if (typeof props.allowDrag === "function" && !props.allowDrag(treeNode.node)) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";

    try {
      event.dataTransfer.setData("text/plain", "");
    } catch {
      // noop
    }

    dragState.value.draggingNode = treeNode;
    emit("node-drag-start", treeNode.node, event);
  }

  function processDragOver({ event, treeNode }: DragOptions) {
    if (!event.dataTransfer) {
      return;
    }

    event.preventDefault();

    const dropNode = treeNode;
    const oldDropNode = dragState.value.dropNode;

    if (oldDropNode && oldDropNode.node.id !== dropNode.node.id) {
      removeClass(oldDropNode.$el, innerDropClass);
    }

    const draggingNode = dragState.value.draggingNode;

    if (!draggingNode || !dropNode.$el) {
      return;
    }

    let dropPrev = true;
    let dropInner = true;
    let dropNext = true;
    let userAllowDropInner = true;

    if (typeof props.allowDrop === "function") {
      dropPrev = props.allowDrop(draggingNode.node, dropNode.node, "prev");
      userAllowDropInner = dropInner = props.allowDrop(draggingNode.node, dropNode.node, "inner");
      dropNext = props.allowDrop(draggingNode.node, dropNode.node, "next");
    }

    event.dataTransfer.dropEffect = dropInner || dropPrev || dropNext ? "move" : "none";

    if (
      (dropPrev || dropInner || dropNext) &&
      oldDropNode?.node.id !== dropNode.node.id
    ) {
      if (dragExpandTimer) {
        clearTimeout(dragExpandTimer);
        dragExpandTimer = null;
        expandTargetId = null;
      }

      if (oldDropNode) {
        emit("node-drag-leave", draggingNode.node, oldDropNode.node, event);
      }

      emit("node-drag-enter", draggingNode.node, dropNode.node, event);
    }

    if (dropPrev || dropInner || dropNext) {
      dragState.value.dropNode = dropNode;
      scheduleExpand(dropNode);
    } else {
      dragState.value.dropNode = null;
    }

    if (dropNode.node.nextSibling === draggingNode.node) {
      dropNext = false;
    }

    if (dropNode.node.previousSibling === draggingNode.node) {
      dropPrev = false;
    }

    if (dropNode.node.contains(draggingNode.node, false)) {
      dropInner = false;
    }

    if (
      draggingNode.node === dropNode.node ||
      draggingNode.node.contains(dropNode.node)
    ) {
      dropPrev = false;
      dropInner = false;
      dropNext = false;
    }

    const contentElement = dropNode.$el.querySelector<HTMLElement>(`.${blockClass}__node-content`);
    const indicatorAnchor = dropNode.$el.querySelector<HTMLElement>(
      `.${blockClass}__expand-icon, .${blockClass}__expand-placeholder`
    );
    const treeElement = rootRef.value;
    const dropIndicator = dropIndicatorRef.value;

    if (!contentElement || !indicatorAnchor || !treeElement || !dropIndicator) {
      return;
    }

    const targetPosition = contentElement.getBoundingClientRect();
    const treePosition = treeElement.getBoundingClientRect();
    const treeScrollTop = treeElement.scrollTop;
    const distance = event.clientY - targetPosition.top;

    const prevPercent = dropPrev
      ? dropInner
        ? 0.25
        : dropNext
          ? 0.45
          : 1
      : Number.NEGATIVE_INFINITY;

    const nextPercent = dropNext
      ? dropInner
        ? 0.75
        : dropPrev
          ? 0.55
          : 0
      : Number.POSITIVE_INFINITY;

    let dropType: NodeDropType = "none";

    if (distance < targetPosition.height * prevPercent) {
      dropType = "before";
    } else if (distance > targetPosition.height * nextPercent) {
      dropType = "after";
    } else if (dropInner) {
      dropType = "inner";
    }

    const iconPosition = indicatorAnchor.getBoundingClientRect();
    let indicatorTop = -9999;

    if (dropType === "before") {
      indicatorTop = iconPosition.top - treePosition.top + treeScrollTop;
    } else if (dropType === "after") {
      indicatorTop = iconPosition.bottom - treePosition.top + treeScrollTop;
    }

    dropIndicator.style.top = `${indicatorTop}px`;
    dropIndicator.style.left = `${iconPosition.right - treePosition.left}px`;

    if (dropType === "inner") {
      addClass(dropNode.$el, innerDropClass);
    } else {
      removeClass(dropNode.$el, innerDropClass);
    }

    dragState.value.showDropIndicator = dropType === "before" || dropType === "after";
    dragState.value.allowDrop = dragState.value.showDropIndicator || userAllowDropInner;
    dragState.value.dropType = dropType;

    emit("node-drag-over", draggingNode.node, dropNode.node, event);
  }

  function flushPendingDragOver() {
    if (dragOverFrame !== 0) {
      cancelAnimationFrame(dragOverFrame);
      dragOverFrame = 0;
    }

    if (latestDragOptions) {
      const nextOptions = latestDragOptions;
      latestDragOptions = null;
      processDragOver(nextOptions);
    }
  }

  function treeNodeDragOver(options: DragOptions) {
    latestDragOptions = options;

    if (dragOverFrame !== 0) {
      return;
    }

    dragOverFrame = requestAnimationFrame(() => {
      dragOverFrame = 0;
      flushPendingDragOver();
    });
  }

  function treeNodeDragEnd(event: DragEvent) {
    flushPendingDragOver();

    const { draggingNode, dropType, dropNode } = dragState.value;

    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }

    if (draggingNode?.node.data && dropNode) {
      const oldParent = draggingNode.node.parent;
      const oldIndex = oldParent ? oldParent.childNodes.indexOf(draggingNode.node) : -1;
      const draggingNodeCopy: FakeNode = {
        data: draggingNode.node.data
      };

      if (dropType !== "none" && dropType !== null) {
        draggingNode.node.remove();
      }

      if (dropType === "before") {
        dropNode.node.parent?.insertBefore(draggingNodeCopy, dropNode.node);
      } else if (dropType === "after") {
        dropNode.node.parent?.insertAfter(draggingNodeCopy, dropNode.node);
      } else if (dropType === "inner") {
        dropNode.node.insertChild(draggingNodeCopy);
      }

      if (dropType !== "none" && dropType !== null && store.value.key) {
        draggingNode.node.eachNode((node) => {
          const nextNode = store.value.nodesMap[getElementKey(node)];

          if (!nextNode) {
            return;
          }

          nextNode.expanded = node.expanded;
          nextNode.setChecked(node.checked, !store.value.checkStrictly);

          if (node.isCurrent) {
            store.value.setCurrentNode(nextNode);
          }
        });
      }

      const finalNode =
        dropType !== "none" && dropType !== null
          ? store.value.getNode(draggingNodeCopy.data)
          : draggingNode.node;
      const payload = buildDragPayload(oldParent, oldIndex, finalNode);

      removeClass(dropNode.$el, innerDropClass);

      emit("node-drag-end", draggingNode.node, dropNode.node, dropType ?? "none", event, payload);

      if (dropType && dropType !== "none") {
        emit("node-drop", draggingNode.node, dropNode.node, dropType, event, payload);
      }
    } else if (draggingNode) {
      const oldParent = draggingNode.node.parent;
      const oldIndex = oldParent ? oldParent.childNodes.indexOf(draggingNode.node) : -1;
      const payload = buildDragPayload(oldParent, oldIndex, draggingNode.node);
      emit("node-drag-end", draggingNode.node, null, dropType ?? "none", event, payload);
    }

    resetDragState();
  }

  provide(dragEventsKey, {
    treeNodeDragStart,
    treeNodeDragOver,
    treeNodeDragEnd
  });

  return {
    dragState
  };
}
