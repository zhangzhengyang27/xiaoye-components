<script setup lang="ts">
import { computed } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import ImgEmpty from "./img-empty.vue";

export interface EmptyProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imageSize?: number | string;
}

const props = withDefaults(defineProps<EmptyProps>(), {
  image: "",
  imageAlt: "",
  imageSize: ""
});
const slots = defineSlots<{
  image?: () => unknown;
  title?: () => unknown;
  description?: () => unknown;
  default?: () => unknown;
}>();

const ns = useNamespace("empty");
const { locale } = useConfig();
const resolvedTitle = computed(() => props.title ?? locale.value.emptyTitle ?? "暂无数据");
const resolvedDescription = computed(
  () => props.description ?? locale.value.emptyDescription ?? "这里还没有可展示的内容"
);
const hasTitle = computed(() => Boolean(slots.title) || resolvedTitle.value !== "");
const hasDescription = computed(
  () => Boolean(slots.description) || resolvedDescription.value !== ""
);
const imageStyle = computed(() =>
  props.imageSize !== undefined && props.imageSize !== ""
    ? {
        width: typeof props.imageSize === "number" ? `${props.imageSize}px` : props.imageSize
      }
    : undefined
);
</script>

<template>
  <div :class="ns.base.value">
    <div class="xy-empty__illustration" :style="imageStyle">
      <slot name="image">
        <img
          v-if="props.image"
          class="xy-empty__image"
          :src="props.image"
          :alt="props.imageAlt"
        />
        <img-empty v-else />
      </slot>
    </div>
    <strong v-if="hasTitle" class="xy-empty__title">
      <slot name="title">
        {{ resolvedTitle }}
      </slot>
    </strong>
    <div v-if="hasDescription" class="xy-empty__description">
      <slot name="description">
        <p>{{ resolvedDescription }}</p>
      </slot>
    </div>
    <div v-if="slots.default" class="xy-empty__footer">
      <slot />
    </div>
  </div>
</template>
