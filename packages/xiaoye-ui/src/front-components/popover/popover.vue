<script setup lang="ts">
import { computed, ref, onBeforeUnmount, onMounted, onUnmounted, watch, nextTick } from "vue";
import type { PopoverProps, PopoverEmits } from "./popover";

defineOptions({ name: "XyuPopover" });

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
  if (val) {
    nextTick(updatePopoverPosition);
  }
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

  let top = 0;
  let left = 0;
  const triggerWidth = rect.width;
  const triggerHeight = rect.height;

  // Extract vertical/horizontal positioning intent
  const isTop = placement.startsWith("top");
  const isBottom = placement.startsWith("bottom");
  const isLeft = placement === "left";
  const isRight = placement === "right";

  if (isTop) {
    // Position above trigger, then offset by gap
    top = rect.top - gap;
    if (isLeft) {
      // Align left edge of popover with left edge of trigger
      left = rect.left;
    } else if (isRight) {
      // Align right edge of popover with right edge of trigger
      left = rect.right;
    } else {
      // Center: left = center of trigger, CSS will translateX(-50%)
      left = rect.left + triggerWidth / 2;
    }
  } else if (isBottom) {
    top = rect.bottom + gap;
    if (isLeft) {
      left = rect.left;
    } else if (isRight) {
      left = rect.right;
    } else {
      left = rect.left + triggerWidth / 2;
    }
  } else if (isLeft) {
    left = rect.left - gap;
    top = rect.top + triggerHeight / 2;
  } else if (isRight) {
    left = rect.right + gap;
    top = rect.top + triggerHeight / 2;
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

function updatePopoverPosition() {
  // Force reactivity re-computation is handled by Vue automatically
  // This function exists for external callers (scroll/resize handled externally)
}

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

function handleClickOutside(e: MouseEvent) {
  if (!innerVisible.value || isManual.value) return;
  const target = e.target as Node;
  if (triggerRef.value && triggerRef.value.contains(target)) return;
  if (popoverRef.value && popoverRef.value.contains(target)) return;
  doHide();
}

function handleScroll() {
  if (innerVisible.value) doHide();
}

function handleResize() {
  if (innerVisible.value) updatePopoverPosition();
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
  window.addEventListener("scroll", handleScroll, true);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
  window.removeEventListener("scroll", handleScroll, true);
  window.removeEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  if (showTimer) clearTimeout(showTimer);
  if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
  <div :class="ns">
    <span
      ref="triggerRef"
      :class="`${ns}__trigger`"
      @mouseenter="onTriggerMouseenter"
      @mouseleave="onTriggerMouseleave"
      @focusin="onTriggerFocusin"
      @focusout="onTriggerFocusout"
      @click="onTriggerClick"
    >
      <slot />
    </span>

    <teleport v-if="props.appendToBody" to="body">
      <transition :name="props.transitionName">
        <div
          v-if="innerVisible"
          ref="popoverRef"
          :class="popoverClass"
          :style="popoverStyle"
        >
          <div v-if="$slots.title || props.title" :class="`${ns}__title`">
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
