<script setup lang="ts">
import { computed, provide } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import type { DescriptionsProps } from "./descriptions";
import { descriptionsKey } from "./context";

const props = withDefaults(defineProps<DescriptionsProps>(), {
  column: 3,
  border: false,
  size: undefined,
  title: "",
  extra: "",
  labelWidth: undefined,
  direction: "horizontal"
});

const ns = useNamespace("descriptions");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const gridTemplateColumns = computed(() => `repeat(${Math.max(props.column, 1)}, minmax(0, 1fr))`);

provide(descriptionsKey, {
  border: computed(() => props.border),
  direction: computed(() => props.direction),
  labelWidth: computed(() => props.labelWidth),
  size: mergedSize
});
</script>

<template>
  <div
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      props.border ? 'is-bordered' : '',
      `is-${props.direction}`
    ]"
  >
    <div v-if="props.title || props.extra || $slots.title || $slots.extra" class="xy-descriptions__header">
      <div class="xy-descriptions__title">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div class="xy-descriptions__extra">
        <slot name="extra">{{ props.extra }}</slot>
      </div>
    </div>
    <div class="xy-descriptions__body" :style="{ gridTemplateColumns }">
      <slot />
    </div>
  </div>
</template>
