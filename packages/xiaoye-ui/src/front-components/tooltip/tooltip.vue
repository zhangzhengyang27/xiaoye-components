<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import type { TooltipProps } from "./tooltip";

const props = withDefaults(defineProps<TooltipProps>(), {
  content: "",
  placement: "top",
  trigger: "hover",
  disabled: false,
  delay: 100,
  offset: 8,
  maxWidth: 280
});

const slots = defineSlots<{
  default?: () => unknown;
}>();

const ns = "xyu-tooltip";
const triggerRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
const visible = ref(false);
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const tooltipStyle = computed(() => {
  if (!triggerRef.value) return {};
  const rect = triggerRef.value.getBoundingClientRect();
  const placement = props.placement ?? "top";
  const gap = props.offset ?? 8;
  let top = 0, left = 0;

  if (placement.startsWith("top")) {
    top = rect.top - rect.height - gap;
    left = rect.left + rect.width / 2;
  } else if (placement.startsWith("bottom")) {
    top = rect.bottom + gap;
    left = rect.left + rect.width / 2;
  } else if (placement === "left") {
    top = rect.top + rect.height / 2;
    left = rect.left - gap;
  } else if (placement === "right") {
    top = rect.top + rect.height / 2;
    left = rect.right + gap;
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    maxWidth: typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth
  };
});

function show() {
  if (props.disabled) return;
  if (hideTimer) clearTimeout(hideTimer);
  showTimer = setTimeout(() => { visible.value = true; }, props.delay);
}

function hide() {
  if (showTimer) clearTimeout(showTimer);
  hideTimer = setTimeout(() => { visible.value = false; }, 100);
}

onBeforeUnmount(() => {
  if (showTimer) clearTimeout(showTimer);
  if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
  <div
    :class="ns"
    @mouseenter="props.trigger === 'hover' ? show() : undefined"
    @mouseleave="props.trigger === 'hover' ? hide() : undefined"
    @focusin="props.trigger === 'focus' ? show() : undefined"
    @focusout="props.trigger === 'focus' ? hide() : undefined"
    @click="props.trigger === 'click' ? (visible ? hide() : show()) : undefined"
  >
    <span
      :ref="(el) => { triggerRef = el as HTMLElement; }"
      :class="`${ns}__trigger`"
    >
      <slot />
    </span>

    <teleport to="body">
      <transition name="xyu-tooltip">
        <div
          v-if="visible && props.content"
          :ref="(el) => { tooltipRef = el as HTMLElement; }"
          :class="['xyu-popper', `${ns}__popper`, `xyu-popper--${props.placement}`]"
          :style="tooltipStyle"
          role="tooltip"
        >
          {{ props.content }}
        </div>
      </transition>
    </teleport>
  </div>
</template>
