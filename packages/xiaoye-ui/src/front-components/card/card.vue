<script setup lang="ts">
import { computed } from "vue";
import type { CardProps, CardEmits } from "./card";

const props = withDefaults(defineProps<CardProps>(), {
  type: "default",
  bordered: true,
  hoverable: false,
  loading: false
});

const emit = defineEmits<CardEmits>();

const ns = "xyu-card";

const typeClass = computed(() => {
  if (props.type === "bordered") return "is-bordered";
  if (props.type === "shadow") return "is-shadow";
  if (props.type === "flat") return "is-flat";
  return "";
});

function handleClick(e: MouseEvent) {
  emit("click", e);
}

const slots = defineSlots<{
  default?: () => unknown;
  header?: () => unknown;
  footer?: () => unknown;
  cover?: () => unknown;
}>();
</script>

<template>
  <div
    :class="[ns, typeClass, props.hoverable ? 'is-hoverable' : '']"
    @click="handleClick"
  >
    <div
      v-if="slots.header || props.title"
      :class="`${ns}__header`"
      :style="props.headerStyle"
    >
      <slot name="header">
        <div :class="`${ns}__header-content`">
          <span v-if="props.title" :class="`${ns}__title`">{{ props.title }}</span>
          <span v-if="props.subTitle" :class="`${ns}__sub-title`">{{ props.subTitle }}</span>
        </div>
      </slot>
    </div>

    <div v-if="slots.cover" :class="`${ns}__cover`">
      <slot name="cover" />
    </div>

    <div
      :class="`${ns}__body`"
      :style="props.bodyStyle"
    >
      <slot />
    </div>

    <div v-if="slots.footer" :class="`${ns}__footer`">
      <slot name="footer" />
    </div>
  </div>
</template>
