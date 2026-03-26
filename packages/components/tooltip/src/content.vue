<script setup lang="ts">
defineOptions({
  name: "XyTooltipContent"
});

import { computed, ref, watch } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { StyleValue } from "vue";
import { useNamespace } from "@xiaoye/composables";
import type { TooltipEffect } from "./tooltip";

interface TooltipContentProps {
  id?: string;
  appendTo?: string | HTMLElement;
  ariaLabel?: string;
  arrowStyle?: StyleValue;
  content?: string;
  effect?: TooltipEffect;
  floatingStyle?: StyleValue;
  maxWidth?: number | string;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: StyleValue;
  rawContent?: boolean;
  rendered?: boolean;
  showArrow?: boolean;
  teleported?: boolean;
  transition?: string;
  visible?: boolean;
  actualPlacement?: Placement;
}

const props = withDefaults(defineProps<TooltipContentProps>(), {
  id: "",
  appendTo: "body",
  ariaLabel: undefined,
  arrowStyle: undefined,
  content: "",
  effect: "dark",
  floatingStyle: undefined,
  maxWidth: 240,
  persistent: false,
  popperClass: "",
  popperStyle: undefined,
  rawContent: false,
  rendered: false,
  showArrow: true,
  teleported: true,
  transition: "xy-fade",
  visible: false,
  actualPlacement: "top"
});

const emit = defineEmits<{
  requestOpen: [event: MouseEvent];
  requestClose: [event: MouseEvent];
  keydown: [event: KeyboardEvent];
  focusout: [event: FocusEvent];
  afterEnter: [];
  afterLeave: [];
  contentRef: [element: HTMLElement | null];
  arrowRef: [element: HTMLElement | null];
}>();

const ns = useNamespace("tooltip");
const contentElementRef = ref<HTMLElement | null>(null);
const arrowElementRef = ref<HTMLElement | null>(null);

const maxWidthStyle = computed(() => ({
  maxWidth: typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth
}));
const placementSide = computed(() => props.actualPlacement.split("-")[0]);

watch(contentElementRef, (value) => {
  emit("contentRef", value);
}, { immediate: true });

watch(arrowElementRef, (value) => {
  emit("arrowRef", value);
}, { immediate: true });
</script>

<template>
  <teleport :to="props.appendTo" :disabled="!props.teleported">
    <transition
      :name="props.transition"
      @after-enter="emit('afterEnter')"
      @after-leave="emit('afterLeave')"
    >
      <div
        v-if="props.rendered"
        v-show="props.visible"
        :id="props.id"
        ref="contentElementRef"
        role="tooltip"
        :aria-hidden="!props.visible"
        :aria-label="props.ariaLabel"
        :data-placement="props.actualPlacement"
        :class="[
          `${ns.base.value}__content`,
          `${ns.base.value}__content--${props.effect}`,
          `${ns.base.value}__content--${placementSide}`,
          props.popperClass
        ]"
        :style="[props.floatingStyle, maxWidthStyle, props.popperStyle]"
        @mouseenter="emit('requestOpen', $event)"
        @mouseleave="emit('requestClose', $event)"
        @keydown="emit('keydown', $event)"
        @focusout="emit('focusout', $event)"
      >
        <span
          v-if="props.showArrow"
          ref="arrowElementRef"
          :class="['xy-popper__arrow', `${ns.base.value}__arrow`]"
          :style="props.arrowStyle"
        />
        <slot name="content">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-if="props.rawContent" v-html="props.content" />
          <template v-else>{{ props.content }}</template>
        </slot>
      </div>
    </transition>
  </teleport>
</template>
