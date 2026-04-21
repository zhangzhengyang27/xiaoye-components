<script setup lang="ts">
import { computed, ref } from "vue";
import type { AvatarProps } from "./avatar";
import XyuIcon from "../icon/icon.vue";

const props = withDefaults(defineProps<AvatarProps>(), {
  src: "",
  alt: "avatar",
  size: "md",
  shape: "circle",
  fit: "cover"
});

const ns = "xyu-avatar";
const error = ref(false);

const sizeMap: Record<string, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 72
};

const computedSize = computed(() => {
  if (typeof props.size === "number") return `${props.size}px`;
  return `${sizeMap[props.size] ?? 40}px`;
});

const showInitials = computed(() => !props.src || error.value);

const avatarStyle = computed(() => ({
  width: computedSize.value,
  height: computedSize.value,
  fontSize: `calc(${computedSize.value} * 0.4)`
}));

function handleError() {
  error.value = true;
}
</script>

<template>
  <div :class="[ns, `${ns}--${props.shape}`]" :style="avatarStyle">
    <img
      v-if="props.src && !error"
      :src="props.src"
      :alt="props.alt"
      :class="`${ns}__image`"
      :style="{ objectFit: props.fit }"
      @error="handleError"
    />
    <span v-else-if="props.initials && showInitials" :class="`${ns}__initials`">
      {{ props.initials.slice(0, 2) }}
    </span>
      <XyuIcon icon="mdi:account" :size="iconSize" />
  </div>
</template>
