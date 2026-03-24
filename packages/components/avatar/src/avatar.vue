<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import type { CSSProperties } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import { avatarGroupContextKey } from "./context";
import type { AvatarProps } from "./avatar";

const props = withDefaults(defineProps<AvatarProps>(), {
  size: undefined,
  shape: undefined,
  icon: "",
  src: "",
  alt: "",
  srcSet: "",
  fit: "cover"
});

const emit = defineEmits<{
  error: [event: Event];
}>();

const ns = useNamespace("avatar");
const { size: globalSize } = useConfig();
const avatarGroup = inject(avatarGroupContextKey, null);
const hasLoadError = ref(false);

const effectiveSize = computed(() => props.size ?? avatarGroup?.size?.value ?? globalSize.value);
const mergedSize = computed(() =>
  typeof effectiveSize.value === "number" ? undefined : effectiveSize.value
);
const isImageVisible = computed(() => Boolean(props.src || props.srcSet) && !hasLoadError.value);
const showIcon = computed(() => !isImageVisible.value && Boolean(props.icon));
const numericSize = computed(() =>
  typeof effectiveSize.value === "number" ? effectiveSize.value : null
);
const mergedShape = computed(() => props.shape ?? avatarGroup?.shape?.value ?? "circle");
const iconSize = computed(() => {
  if (numericSize.value !== null) {
    return Math.max(Math.round(numericSize.value * 0.45), 14);
  }

  return {
    sm: 12,
    md: 18,
    lg: 24
  }[mergedSize.value ?? "md"];
});

const avatarClasses = computed(() => [
  ns.base.value,
  mergedSize.value ? `${ns.base.value}--${mergedSize.value}` : "",
  `${ns.base.value}--${mergedShape.value}`,
  showIcon.value ? "is-icon" : "",
  isImageVisible.value ? "is-image" : ""
]);

const sizeStyle = computed<CSSProperties | undefined>(() => {
  if (numericSize.value === null) {
    return undefined;
  }

  const iconSize = Math.max(Math.round(numericSize.value * 0.45), 14);
  const textSize = Math.max(Math.round(numericSize.value * 0.4), 12);

  return {
    "--xy-avatar-size": `${numericSize.value}px`,
    "--xy-avatar-icon-size": `${iconSize}px`,
    "--xy-avatar-text-size": `${textSize}px`
  } as CSSProperties;
});

const fitStyle = computed<CSSProperties>(() => ({
  objectFit: props.fit
}));

watch(
  () => [props.src, props.srcSet],
  () => {
    hasLoadError.value = false;
  }
);

function handleError(event: Event) {
  hasLoadError.value = true;
  emit("error", event);
}
</script>

<template>
  <span :class="avatarClasses" :style="sizeStyle">
    <img
      v-if="isImageVisible"
      class="xy-avatar__image"
      :src="props.src"
      :alt="props.alt"
      :srcset="props.srcSet"
      :style="fitStyle"
      @error="handleError"
    />
    <XyIcon v-else-if="showIcon" class="xy-avatar__icon" :icon="props.icon" :size="iconSize" />
    <span v-else class="xy-avatar__text">
      <slot />
    </span>
  </span>
</template>
