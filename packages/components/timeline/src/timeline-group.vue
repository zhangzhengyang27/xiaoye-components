<script lang="ts">
import { cloneVNode, computed, defineComponent, h, inject, useSlots } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { timelineContextKey } from "./context";
import { flattenTimelineChildren, isTimelineItemVNode } from "./render";
import type { TimelineGroupProps } from "./timeline-group";

interface TimelineGroupInternalProps extends TimelineGroupProps {
  itemIndexBase?: number;
  lastItemIndex?: number;
}

export default defineComponent({
  name: "XyTimelineGroup",
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    divider: {
      type: Boolean,
      default: true
    },
    itemIndexBase: {
      type: Number,
      default: 0
    },
    lastItemIndex: {
      type: Number,
      default: -1
    }
  },
  setup(props: TimelineGroupInternalProps) {
    const slots = useSlots();
    const ns = useNamespace("timeline-group");
    const timelineContext = inject(timelineContextKey, null);

    const density = computed(() => timelineContext?.density.value ?? "default");

    return () => {
      const flattened = flattenTimelineChildren(slots.default?.());
      const itemIndexBase = props.itemIndexBase ?? 0;
      const lastItemIndex = props.lastItemIndex ?? -1;
      let itemIndex = 0;

      const children = flattened.map((node, nodeIndex) => {
        if (!isTimelineItemVNode(node)) {
          return cloneVNode(node, {
            key: node.key ?? `timeline-group-child-${nodeIndex}`
          });
        }

        const currentItemIndex = itemIndexBase + itemIndex;

        itemIndex += 1;

        return cloneVNode(node, {
          itemIndex: currentItemIndex,
          isLast: currentItemIndex === lastItemIndex,
          key: node.key ?? `timeline-group-item-${currentItemIndex}`
        });
      });

      const hasTitle = Boolean(props.title) || Boolean(slots.title);
      const hasDescription = Boolean(props.description);
      const hasExtra = Boolean(slots.extra);
      const hasHeader = hasTitle || hasDescription || hasExtra;

      return h(
        "section",
        {
          class: [
            ns.base.value,
            `${ns.base.value}--${density.value}`,
            ns.is("dividerless", !props.divider)
          ],
          role: "group"
        },
        [
          hasHeader
            ? h("div", { class: `${ns.base.value}__header` }, [
                h("div", { class: `${ns.base.value}__head` }, [
                  hasTitle
                    ? h("div", { class: `${ns.base.value}__title` }, slots.title?.() ?? props.title)
                    : null,
                  hasDescription
                    ? h("div", { class: `${ns.base.value}__description` }, props.description)
                    : null
                ]),
                hasExtra ? h("div", { class: `${ns.base.value}__extra` }, slots.extra?.()) : null
              ])
            : null,
          h("div", { class: `${ns.base.value}__body` }, children)
        ]
      );
    };
  }
});
</script>
