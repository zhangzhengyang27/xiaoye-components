import { cloneVNode, computed, defineComponent, h, provide } from "vue";
import type { PropType } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { timelineContextKey } from "./context";
import {
  countTimelineItemsInNode,
  flattenTimelineChildren,
  isTimelineGroupVNode,
  isTimelineItemVNode
} from "./render";

export const timelineModes = ["start", "alternate", "alternate-reverse", "end"] as const;
export const timelineDensities = ["default", "compact"] as const;

export type TimelineMode = (typeof timelineModes)[number];
export type TimelineDensity = (typeof timelineDensities)[number];

export interface TimelineProps {
  mode?: TimelineMode;
  reverse?: boolean;
  density?: TimelineDensity;
}

export default defineComponent({
  name: "XyTimeline",
  inheritAttrs: false,
  props: {
    mode: {
      type: String as PropType<TimelineMode>,
      default: "start"
    },
    reverse: {
      type: Boolean,
      default: false
    },
    density: {
      type: String as PropType<TimelineDensity>,
      default: "default"
    }
  },
  setup(props, { attrs, slots }) {
    const ns = useNamespace("timeline");
    const mode = computed(() => props.mode);
    const density = computed(() => props.density);

    provide(timelineContextKey, {
      mode,
      density
    });

    return () => {
      const flattened = flattenTimelineChildren(slots.default?.());
      const orderedChildren = props.reverse ? [...flattened].reverse() : flattened;
      const totalItemCount = orderedChildren.reduce((count, node) => {
        return count + countTimelineItemsInNode(node);
      }, 0);
      let itemIndex = 0;

      const children = orderedChildren.map((node, nodeIndex) => {
        if (isTimelineItemVNode(node)) {
          const currentItemIndex = itemIndex;

          itemIndex += 1;

          return cloneVNode(node, {
            itemIndex: currentItemIndex,
            isLast: currentItemIndex === totalItemCount - 1,
            key: node.key ?? `timeline-item-${currentItemIndex}`
          });
        }

        if (isTimelineGroupVNode(node)) {
          const itemIndexBase = itemIndex;

          itemIndex += countTimelineItemsInNode(node);

          return cloneVNode(node, {
            itemIndexBase,
            lastItemIndex: totalItemCount - 1,
            key: node.key ?? `timeline-group-${nodeIndex}`
          });
        }

        return cloneVNode(node, {
          key: node.key ?? `timeline-child-${nodeIndex}`
        });
      });

      const nativeAttrs = {
        ...attrs
      };

      delete nativeAttrs.class;
      delete nativeAttrs.style;

      return h(
        "div",
        {
          ...nativeAttrs,
          class: [
            ns.base.value,
            `${ns.base.value}--${props.mode}`,
            `${ns.base.value}--${props.density}`,
            ns.is("reverse", props.reverse),
            attrs.class
          ],
          style: attrs.style,
          role: "list"
        },
        children
      );
    };
  }
});
