<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watch } from "vue";
import type { PopoverProps, PopoverEmits } from "./popover";

const props = withDefaults(defineProps<PopoverProps>(), {
  content: "",
  placement: "top",
  trigger: "hover",
  disabled: false,
  delay: 100,
  offset: 8,
  width: "auto",
  maxWidth: 320,
  showArrow: true,
  transitionName: "xyu-popover",
  appendToBody: true,
  visible: false
});

const emit = defineEmits<PopoverEmits>();

const ns = "xyu-popover";
const triggerRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const innerVisible = ref(props.visible);

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

watch(() => props.visible, (val) => {
  innerVisible.value = val;
});

watch(() => innerVisible.value, (val) => {
  emit("update:visible", val);
  emit(val ? "show" : "hide");
});

const isManual = computed(() => props.trigger === "manual");
const isHover = computed(() => props.trigger === "hover");
const isClick = computed(() => props.trigger === "click");
const isFocus = computed(() => props.trigger === "focus");

const popoverStyle = computed(() => {
  if (!triggerRef.value) return {};
  const rect = triggerRef.value.getBoundingClientRect();
  const placement = props.placement ?? "top";
  const gap = props.offset ?? 8;
  let top = 0, left = 0;

  const vKey = placement.startsWith("top") ? "top" : placement.startsWith("bottom") ? "bottom" : null;
  const hKey = placement.endsWith("start") ? "start" : placement.endsWith("end") ? "end" : "center";

  const tw = triggerRef.value.offsetWidth;
  const th = triggerRef.value.offsetHeight;

  if (vKey === "top") {
    top = rect.top - gap;
    if (hKey === "center") left = rect.left + rect.width / 2;
    else if (hKey === "start") left = rect.left;
    else left = rect.right;
  } else if (vKey === "bottom") {
    top = rect.bottom + gap;
    if (hKey === "center") left = rect.left + rect.width / 2;
    else if (hKey === "start") left = rect.left;
    else left = rect.right;
  } else if (placement === "left") {
    left = rect.left - gap;
    top = rect.top + rect.height / 2;
  } else if (placement === "right") {
    left = rect.right + gap;
    top = rect.top + rect.height / 2;
  }

  const style: Record<string, string> = {
    top: `${top}px`,
    left: `${left}px`,
    maxWidth: typeof props.maxWidth === "number" ? `${props.maxWidth}px` : String(props.maxWidth)
  };
  if (props.width !== "auto") {
    style.width = typeof props.width === "number" ? `${props.width}px` : String(props.width);
  }
  return style;
});

const popoverClass = computed(() => {
  const placement = props.placement ?? "top";
  const cls = [`xyu-popper`, `${ns}__popper`, `xyu-popper--${placement}`];
  if (props.showArrow) cls.push("has-arrow");
  return cls;
});

function doShow() {
  if (props.disabled || isManual.value) return;
  if (hideTimer) clearTimeout(hideTimer);
  showTimer = setTimeout(() => {
    innerVisible.value = true;
  }, props.delay);
}

function doHide() {
  if (isManual.value) return;
  if (showTimer) clearTimeout(showTimer);
  hideTimer = setTimeout(() => {
    innerVisible.value = false;
  }, 100);
}

function onTriggerMouseenter() {
  if (isHover.value) doShow();
}

function onTriggerMouseleave() {
  if (isHover.value) doHide();
}

function onTriggerClick() {
  if (isClick.value) {
    innerVisible.value ? doHide() : doShow();
  }
}

function onTriggerFocusin() {
  if (isFocus.value) doShow();
}

function onTriggerFocusout() {
  if (isFocus.value) doHide();
}

onBeforeUnmount(() => {
  if (showTimer) clearTimeout(showTimer);
  if (hideTimer) clearTimeout(hideTimer);
});

const slots = defineSlots<{
  default?: () => unknown;
  title?: () => unknown;
  content?: () => unknown;
}>();
</script>

<template>
  <div
    :class="ns"
    @mouseenter="onTriggerMouseenter"
    @mouseleave="onTriggerMouseleave"
    @focusin="onTriggerFocusin"
    @focusout="onTriggerFocusout"
    @click="onTriggerClick"
  >
    <span
      :ref="(el) => { triggerRef = el as HTMLElement; }"
      :class="`${ns}__trigger`"
    >
      <slot />
    </span>

    <teleport v-if="props.appendToBody" to="body">
      <transition :name="props.transitionName">
        <div
          v-if="innerVisible"
          :ref="(el) => { popoverRef = el as HTMLElement; }"
          :class="popoverClass"
          :style="popoverStyle"
        >
          <div v-if="slots.title || props.title" :class="`${ns}__title`">
            <slot name="title">{{ props.title }}</slot>
          </div>
          <div :class="`${ns}__content`">
            <slot name="content">{{ props.content }}</slot>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
