import { cloneVNode, Comment, defineComponent, isVNode, mergeProps, Text } from "vue";

function pickRenderableChild(children: unknown[]) {
  return children.find((child) => {
    if (!isVNode(child)) {
      return false;
    }

    return child.type !== Comment && child.type !== Text;
  });
}

export const FrontSlot = defineComponent({
  name: "XyFrontSlot",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      const children = slots.default?.() ?? [];
      const child = pickRenderableChild(children);

      if (!child || !isVNode(child)) {
        return null;
      }

      return cloneVNode(child, mergeProps(child.props ?? {}, attrs), true);
    };
  }
});
