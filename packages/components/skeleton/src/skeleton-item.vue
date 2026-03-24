<script setup lang="ts">
defineOptions({
  name: "XySkeletonItem"
});

import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { SkeletonItemProps } from "./skeleton-item";

const props = withDefaults(defineProps<SkeletonItemProps>(), {
  variant: "text"
});

const ns = useNamespace("skeleton");
</script>

<template>
  <div
    :class="[
      `${ns.base.value}__item`,
      `${ns.base.value}__${props.variant}`
    ]"
    aria-hidden="true"
  >
    <XyIcon
      v-if="props.variant === 'image'"
      class="xy-skeleton__image-icon"
      icon="mdi:image-outline"
      size="22%"
    />
  </div>
</template>
