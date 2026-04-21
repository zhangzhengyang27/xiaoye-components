import { createVNode, render, type VNode } from "vue";
import MessageComponent from "./message.vue";
import type { MessageOptions, Message } from "./types";

const instances: VNode[] = [];

function Message(options: string | MessageOptions): { close: () => void } {
  const opts: MessageOptions = typeof options === "string" ? { message: options } : options;
  const container = document.createElement("div");
  const vnode = createVNode(MessageComponent, {
    ...opts,
    onClose: () => {
      render(null, container);
      const idx = instances.indexOf(vnode);
      if (idx > -1) instances.splice(idx, 1);
      opts.onClose?.();
    }
  });
  render(vnode, container);
  document.body.appendChild(container);
  instances.push(vnode);
  return { close: () => vnode.component?.exposed ? (vnode.component.exposed as { close: () => void }).close() : undefined };
}

const types = ["success", "warning", "error", "info"] as const;
types.forEach((type) => {
  (Message as Record<string, unknown>)[type] = (message: string, options?: Partial<MessageOptions>) =>
    Message({ ...options, message, type });
});

export default Message as Message;
