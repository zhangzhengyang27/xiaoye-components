<script lang="ts">
import {
  Fragment,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  provide,
  toRef,
  useSlots
} from "vue";
import type { PropType, StyleValue, VNode, VNodeArrayChildren } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyTooltip from "../../tooltip";
import XyAvatar from "./avatar.vue";
import { avatarGroupContextKey } from "./context";
import type { AvatarShape } from "./avatar";
import type { AvatarGroupProps } from "./avatar-group";

function flattenChildren(children?: VNodeArrayChildren) {
  const queue: VNode[] = [];

  (children ?? []).forEach((child) => {
    if (isVNode(child)) {
      queue.push(child);
    }
  });

  const result: VNode[] = [];

  while (queue.length) {
    const vnode = queue.shift();
    if (!vnode) {
      continue;
    }

    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        if (isVNode(child)) {
          queue.push(child);
        }
      });
      continue;
    }

    result.push(vnode);
  }

  return result;
}

export default defineComponent({
  name: "XyAvatarGroup",
  props: {
    size: {
      type: [Number, String] as PropType<AvatarGroupProps["size"]>,
      default: undefined
    },
    shape: {
      type: String as PropType<AvatarShape | undefined>,
      default: undefined
    },
    collapseAvatars: {
      type: Boolean,
      default: false
    },
    collapseAvatarsTooltip: {
      type: Boolean,
      default: false
    },
    maxCollapseAvatars: {
      type: Number,
      default: 1
    },
    placement: {
      type: String as PropType<AvatarGroupProps["placement"]>,
      default: "top"
    },
    collapseClass: {
      type: String,
      default: ""
    },
    collapseStyle: {
      type: [String, Array, Object] as PropType<StyleValue>,
      default: ""
    }
  },
  setup(props) {
    const slots = useSlots();
    const ns = useNamespace("avatar-group");

    provide(avatarGroupContextKey, {
      size: toRef(props, "size"),
      shape: toRef(props, "shape")
    });

    return () => {
      const avatars = flattenChildren(slots.default?.());
      const shouldCollapse =
        props.collapseAvatars && avatars.length > Math.max(props.maxCollapseAvatars, 0);

      const visibleAvatars = shouldCollapse
        ? avatars.slice(0, Math.max(props.maxCollapseAvatars, 0))
        : avatars;
      const hiddenAvatars = shouldCollapse ? avatars.slice(Math.max(props.maxCollapseAvatars, 0)) : [];

      const nodes = visibleAvatars.map((node, index) =>
        cloneVNode(node, {
          key: node.key ?? `avatar-${index}`
        })
      );

      if (hiddenAvatars.length) {
        const collapseAvatar = h(
          XyAvatar,
          {
            size: props.size,
            shape: props.shape,
            class: props.collapseClass,
            style: props.collapseStyle
          },
          () => `+${hiddenAvatars.length}`
        );

        const collapseNode = props.collapseAvatarsTooltip
          ? h(
              XyTooltip,
              {
                placement: props.placement
              },
              {
                default: () => collapseAvatar,
                content: () =>
                  h(
                    "div",
                    {
                      class: `${ns.base.value}__collapse-avatars`
                    },
                    hiddenAvatars.map((node, index) =>
                      cloneVNode(node, {
                        key: node.key ?? `hidden-avatar-${index}`
                      })
                    )
                  )
              }
            )
          : collapseAvatar;

        nodes.push(collapseNode);
      }

      return h(
        "div",
        {
          class: ns.base.value
        },
        nodes
      );
    };
  }
});
</script>
