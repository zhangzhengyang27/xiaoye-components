<script setup lang="ts">
defineOptions({
  name: "XySkeleton",
  inheritAttrs: false
});

import { computed, toRef, useAttrs } from "vue";
import { useNamespace, useThrottleRender } from "@xiaoye/composables";
import XySkeletonItem from "./skeleton-item.vue";
import type { SkeletonProps } from "./skeleton";

const props = withDefaults(defineProps<SkeletonProps>(), {
  animated: false,
  count: 1,
  rows: 3,
  loading: true,
  throttle: 0
});

const slots = defineSlots<{
  template?: () => unknown;
  default?: (props: Record<string, unknown>) => unknown;
}>();

const attrs = useAttrs();
const ns = useNamespace("skeleton");

const nativeAttrs = computed<Record<string, unknown>>(() => {
  const rest = { ...attrs };
  delete rest.class;
  delete rest.style;
  return rest;
});

const normalizedCount = computed(() => Math.max(1, Math.floor(props.count)));
const normalizedRows = computed(() => Math.max(0, Math.floor(props.rows)));
const uiLoading = useThrottleRender(toRef(props, "loading"), props.throttle);

const rootKls = computed(() => [
  ns.base.value,
  ns.is("animated", props.animated),
  attrs.class
]);

defineExpose({
  uiLoading
});
</script>

<template>
  <div
    v-if="uiLoading"
    :class="rootKls"
    :style="attrs.style"
    v-bind="nativeAttrs"
  >
    <template
      v-for="index in normalizedCount"
      :key="index"
    >
      <slot v-if="slots.template" name="template" />
      <template v-else>
        <XySkeletonItem :class="ns.is('first', true)" variant="p" />
        <XySkeletonItem
          v-for="row in normalizedRows"
          :key="row"
          :class="[
            `${ns.base.value}__paragraph`,
            ns.is('last', row === normalizedRows && normalizedRows > 1)
          ]"
          variant="p"
        />
      </template>
    </template>
  </div>
  <slot v-else v-bind="attrs" />
</template>
