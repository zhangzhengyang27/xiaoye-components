import { Fragment, createTextVNode, isVNode } from "vue";
import type { Slot, VNode, VNodeArrayChildren } from "vue";

function getComponentName(node: VNode) {
  if (typeof node.type === "object" && node.type !== null) {
    return (node.type as { name?: string }).name ?? "";
  }

  return "";
}

export function flattenTimelineChildren(children?: VNodeArrayChildren) {
  const result: VNode[] = [];

  const traverse = (nodes?: VNodeArrayChildren) => {
    (nodes ?? []).forEach((child) => {
      if (Array.isArray(child)) {
        traverse(child);
        return;
      }

      if (typeof child === "string" || typeof child === "number") {
        result.push(createTextVNode(String(child)));
        return;
      }

      if (!isVNode(child)) {
        return;
      }

      if (child.type === Fragment && Array.isArray(child.children)) {
        traverse(child.children as VNodeArrayChildren);
        return;
      }

      result.push(child);
    });
  };

  traverse(children);

  return result;
}

export function isTimelineItemVNode(node: VNode) {
  return getComponentName(node) === "XyTimelineItem";
}

export function isTimelineGroupVNode(node: VNode) {
  return getComponentName(node) === "XyTimelineGroup";
}

function resolveTimelineGroupSlot(node: VNode) {
  if (!node.children || typeof node.children !== "object" || Array.isArray(node.children)) {
    return [];
  }

  const slot = (node.children as { default?: Slot }).default;

  if (typeof slot !== "function") {
    return [];
  }

  return flattenTimelineChildren(slot());
}

export function countTimelineItemsInNode(node: VNode): number {
  if (isTimelineItemVNode(node)) {
    return 1;
  }

  if (isTimelineGroupVNode(node)) {
    return resolveTimelineGroupSlot(node).reduce((count, child) => {
      return count + countTimelineItemsInNode(child);
    }, 0);
  }

  return 0;
}
