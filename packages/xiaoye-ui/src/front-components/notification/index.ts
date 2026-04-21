import { createVNode, render, type VNode } from "vue";
import NotificationComponent from "./notification.vue";
import type { NotificationOptions, Notification } from "./types";

const instances: VNode[] = [];

const NotificationFn: Notification = (options) => {
  const container = document.createElement("div");
  const vnode = createVNode(NotificationComponent, {
    ...options,
    onClose: () => {
      render(null, container);
      const idx = instances.indexOf(vnode);
      if (idx > -1) instances.splice(idx, 1);
      options.onClose?.();
    }
  });
  render(vnode, container);
  document.body.appendChild(container);
  instances.push(vnode);
  return { close: () => vnode.component?.exposed ? (vnode.component.exposed as { close: () => void }).close() : undefined };
};

const types = ["success", "warning", "error", "info"] as const;
types.forEach((type) => {
  (NotificationFn as Record<string, unknown>)[type] = (title: string, message?: string) =>
    NotificationFn({ title, message, type });
});

export default NotificationFn as Notification;
