<script setup lang="ts">
defineOptions({
  name: "XyResult",
  inheritAttrs: false
});

import { computed, useAttrs } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { ResultProps } from "./result";
import {
  RESULT_ICON_NAME_MAP,
  RESULT_ICON_STATUS_MAP,
  RESULT_STATUS_ICON_MAP
} from "./result";

const props = withDefaults(defineProps<ResultProps>(), {
  title: undefined,
  subTitle: "",
  icon: undefined,
  status: "neutral",
  description: undefined,
  size: undefined,
  variant: "plain",
  iconSize: undefined
});

const slots = defineSlots<{
  icon?: () => unknown;
  title?: () => unknown;
  description?: () => unknown;
  "sub-title"?: () => unknown;
  default?: () => unknown;
  extra?: () => unknown;
}>();

const attrs = useAttrs();
const ns = useNamespace("result");
const { size: globalSize } = useConfig();

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const mergedSize = computed<ComponentSize>(() => props.size ?? globalSize.value);
const resolvedTone = computed(() =>
  props.icon ? RESULT_ICON_STATUS_MAP[props.icon] : props.status
);
const resolvedIcon = computed(() =>
  props.icon ? RESULT_ICON_NAME_MAP[props.icon] : RESULT_STATUS_ICON_MAP[props.status]
);
const resolvedIconSize = computed(() => {
  if (props.iconSize !== undefined && props.iconSize !== "") {
    return props.iconSize;
  }

  return "var(--xy-result-icon-size)";
});
const resolvedDescription = computed(() =>
  props.description !== undefined ? props.description : props.subTitle
);
const hasTitle = computed(() => Boolean(slots.title) || props.title !== undefined && props.title !== "");
const hasDescription = computed(
  () =>
    Boolean(slots.description) ||
    (props.description !== undefined
      ? props.description !== ""
      : Boolean(slots["sub-title"]) || props.subTitle !== "")
);
const showLegacyDescriptionSlot = computed(
  () => !slots.description && props.description === undefined && Boolean(slots["sub-title"])
);
const hasContent = computed(() => Boolean(slots.default));
const hasExtra = computed(() => Boolean(slots.extra));

const rootClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  `${ns.base.value}--${props.variant}`,
  ns.is(resolvedTone.value, true),
  attrs.class
]);
</script>

<template>
  <section :class="rootClasses" :style="attrs.style" v-bind="nativeAttrs">
    <div class="xy-result__icon">
      <slot name="icon">
        <div class="xy-result__icon-shell" aria-hidden="true">
          <XyIcon class="xy-result__icon-symbol" :icon="resolvedIcon" :size="resolvedIconSize" />
        </div>
      </slot>
    </div>

    <div v-if="hasTitle" class="xy-result__title">
      <slot name="title">
        <p>{{ props.title }}</p>
      </slot>
    </div>

    <div v-if="hasDescription" class="xy-result__description">
      <slot v-if="slots.description" name="description" />
      <slot v-else-if="showLegacyDescriptionSlot" name="sub-title" />
      <p v-else>{{ resolvedDescription }}</p>
    </div>

    <div v-if="hasContent" class="xy-result__content">
      <slot />
    </div>

    <div v-if="hasExtra" class="xy-result__extra">
      <slot name="extra" />
    </div>
  </section>
</template>
