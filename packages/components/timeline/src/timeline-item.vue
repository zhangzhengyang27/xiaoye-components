<script setup lang="ts">
defineOptions({
  name: "XyTimelineItem"
});

import { computed, inject, useSlots } from "vue";
import type { CSSProperties } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { timelineContextKey } from "./context";
import type { TimelineDensity, TimelineMode } from "./timeline";
import type { TimelineItemProps } from "./timeline-item";

interface TimelineItemInternalProps extends TimelineItemProps {
  itemIndex?: number;
  isLast?: boolean;
}

const props = withDefaults(defineProps<TimelineItemInternalProps>(), {
  timestamp: "",
  hideTimestamp: false,
  center: false,
  placement: "bottom",
  type: "",
  color: "",
  size: "normal",
  icon: "",
  hollow: false,
  state: "default",
  itemIndex: 0,
  isLast: false
});

const slots = useSlots();
const ns = useNamespace("timeline-item");
const timelineContext = inject(timelineContextKey, null);

const currentMode = computed<TimelineMode>(() => timelineContext?.mode.value ?? "start");
const currentDensity = computed<TimelineDensity>(() => timelineContext?.density.value ?? "default");
const hasTimestamp = computed(() => !props.hideTimestamp && Boolean(props.timestamp));
const hasDotSlot = computed(() => Boolean(slots.dot));
const supportsCenteredTimestamp = computed(
  () => currentMode.value === "alternate" || currentMode.value === "alternate-reverse"
);
const showCenteredTimestamp = computed(
  () => hasTimestamp.value && props.center && supportsCenteredTimestamp.value
);
const showInlineTimestamp = computed(
  () => hasTimestamp.value && (!props.center || !supportsCenteredTimestamp.value)
);
const hasTitle = computed(() => Boolean(slots.title));
const hasMeta = computed(() => Boolean(slots.meta));
const hasActions = computed(() => Boolean(slots.actions));
const hasHeader = computed(() => hasTitle.value || hasMeta.value || hasActions.value);
const hasDefault = computed(() => Boolean(slots.default));
const hasExtra = computed(() => Boolean(slots.extra));
const isHollowNode = computed(() => props.hollow || props.state === "pending");

const side = computed(() => {
  switch (currentMode.value) {
    case "end":
      return "end";
    case "alternate":
      return props.itemIndex % 2 === 0 ? "start" : "end";
    case "alternate-reverse":
      return props.itemIndex % 2 === 0 ? "end" : "start";
    case "start":
    default:
      return "start";
  }
});

const rootKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type || "neutral"}`,
  `${ns.base.value}--${props.size}`,
  `${ns.base.value}--${currentDensity.value}`,
  `${ns.base.value}--${currentMode.value}`,
  `${ns.base.value}--side-${side.value}`,
  `${ns.base.value}--placement-${props.placement}`,
  `${ns.base.value}--state-${props.state}`,
  ns.is("headerless", !hasHeader.value),
  ns.is("center", props.center),
  ns.is("hollow", isHollowNode.value),
  ns.is("last", props.isLast),
  ns.is("custom-dot", hasDotSlot.value)
]);

const rootStyle = computed<CSSProperties>(
  () =>
    ({
      "--xy-timeline-node-color": props.color || undefined
    }) as CSSProperties
);

const nodeIconSize = computed(() => (props.size === "large" ? 12 : 10));
</script>

<template>
  <div :class="rootKls" :style="rootStyle" role="listitem">
    <div v-if="showCenteredTimestamp" :class="`${ns.base.value}__timestamp-opposite`">
      {{ props.timestamp }}
    </div>

    <div :class="`${ns.base.value}__tail`" />

    <div v-if="hasDotSlot" :class="`${ns.base.value}__dot`" aria-hidden="true">
      <slot name="dot" />
    </div>
    <div v-else :class="`${ns.base.value}__node`" aria-hidden="true">
      <XyIcon v-if="props.icon" :icon="props.icon" :size="nodeIconSize" />
    </div>

    <div :class="`${ns.base.value}__wrapper`">
      <div
        v-if="showInlineTimestamp && props.placement === 'top'"
        :class="[`${ns.base.value}__timestamp`, `${ns.base.value}__timestamp--top`]"
      >
        {{ props.timestamp }}
      </div>

      <div :class="`${ns.base.value}__main`">
        <div v-if="hasHeader" :class="`${ns.base.value}__header`">
          <div :class="`${ns.base.value}__head`">
            <div v-if="hasTitle" :class="`${ns.base.value}__title`">
              <slot name="title" />
            </div>

            <div v-if="hasMeta" :class="`${ns.base.value}__meta`">
              <slot name="meta" />
            </div>
          </div>

          <div v-if="hasActions" :class="`${ns.base.value}__actions`">
            <slot name="actions" />
          </div>
        </div>

        <div v-if="hasDefault" :class="`${ns.base.value}__content`">
          <slot />
        </div>

        <div v-if="hasExtra" :class="`${ns.base.value}__extra`">
          <slot name="extra" />
        </div>
      </div>

      <div
        v-if="showInlineTimestamp && props.placement === 'bottom'"
        :class="[`${ns.base.value}__timestamp`, `${ns.base.value}__timestamp--bottom`]"
      >
        {{ props.timestamp }}
      </div>
    </div>
  </div>
</template>
