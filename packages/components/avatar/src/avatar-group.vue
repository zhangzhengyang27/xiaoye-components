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
import type { AvatarGroupItem, AvatarGroupProps } from "./avatar-group";

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
    items: {
      type: Array as PropType<AvatarGroupItem[]>,
      default: () => []
    },
    direction: {
      type: String as PropType<AvatarGroupProps["direction"]>,
      default: "horizontal"
    },
    gutter: {
      type: Number,
      default: 8
    },
    reverse: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: true
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
  emits: {
    "item-click": (_item: AvatarGroupItem, _index: number) => true
  },
  setup(props, { emit }) {
    const slots = useSlots();
    const ns = useNamespace("avatar-group");

    provide(avatarGroupContextKey, {
      size: toRef(props, "size"),
      shape: toRef(props, "shape")
    });

    function resolveStackStyle(index: number, total: number) {
      return {
        zIndex: props.reverse ? total - index : index + 1
      };
    }

    function renderDataAvatar(item: AvatarGroupItem, index: number, total: number) {
      const rendered = slots.item?.({
        item,
        index
      });

      const contentNode =
        rendered && rendered.length > 0
          ? rendered
          : h(
              XyAvatar,
              {
                size: item.size ?? props.size,
                shape: item.shape ?? props.shape,
                src: item.src,
                alt: item.alt,
                srcSet: item.srcSet,
                fit: item.fit,
                icon: item.icon
              },
              () => item.text
            );

      return h(
        "span",
        {
          key: item.key ?? item.src ?? item.text ?? `avatar-item-${index}`,
          class: [`${ns.base.value}__item`, item.className],
          style: [item.style, resolveStackStyle(index, total)],
          onClick: () => emit("item-click", item, index)
        },
        Array.isArray(contentNode) ? contentNode : [contentNode]
      );
    }

    return () => {
      const avatars =
        props.items.length > 0
          ? props.items.map((item, index) => renderDataAvatar(item, index, props.items.length))
          : flattenChildren(slots.default?.());
      const shouldCollapse =
        props.collapseAvatars && avatars.length > Math.max(props.maxCollapseAvatars, 0);

      const visibleAvatars = shouldCollapse
        ? avatars.slice(0, Math.max(props.maxCollapseAvatars, 0))
        : avatars;
      const hiddenAvatars = shouldCollapse ? avatars.slice(Math.max(props.maxCollapseAvatars, 0)) : [];

      const nodes = visibleAvatars.map((node, index) =>
        cloneVNode(node, {
          key: node.key ?? `avatar-${index}`,
          style: [node.props?.style, resolveStackStyle(index, visibleAvatars.length)]
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
          class: [
            ns.base.value,
            `is-${props.direction}`,
            props.reverse ? "is-reverse" : "",
            props.inline ? "is-inline" : "is-block"
          ],
          style: {
            "--xy-avatar-group-gap": `${Math.max(props.gutter, 0) * -1}px`
          }
        },
        nodes
      );
    };
  }
});
</script>
