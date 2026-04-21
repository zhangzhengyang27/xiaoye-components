<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { CSSProperties, PropType } from "vue";
import { useNamespace } from "xiaoye-primitives";
import XyIcon from "@xiaoye/components/icon";

export type MarketingModalType = "coupon" | "flash-sale" | "promotion" | "custom";
export type MarketingModalVariant = "centered" | "bottom-sheet";

export interface MarketingModalProps {
  modelValue: boolean;
  type?: MarketingModalType;
  title?: string;
  backdropBlur?: boolean;
  countdown?: number;
  autoClose?: number;
  variant?: MarketingModalVariant;
  showClose?: boolean;
  closeOnClickOverlay?: boolean;
  closeOnPressEscape?: boolean;
  backdropClass?: string;
}

const props = withDefaults(defineProps<MarketingModalProps>(), {
  type: "custom",
  title: "",
  backdropBlur: true,
  countdown: 0,
  autoClose: 0,
  variant: "centered",
  showClose: true,
  closeOnClickOverlay: true,
  closeOnPressEscape: true
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  open: [];
  opened: [];
  close: [];
  closed: [];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  header?: () => unknown;
  footer?: () => unknown;
  icon?: () => unknown;
}>();

const ns = useNamespace("marketing-modal");

const visible = ref(false);
const rendered = ref(false);
const closing = ref(false);
const countdownValue = ref(0);
let autoCloseTimer: ReturnType<typeof setInterval> | null = null;
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const overlayClasses = computed(() => [
  `${ns.base.value}__overlay`,
  props.backdropBlur ? `${ns.base.value}__overlay--blur` : "",
  props.backdropClass
]);

const panelClasses = computed(() => [
  `${ns.base.value}__panel`,
  `${ns.base.value}__panel--${props.variant}`,
  `${ns.base.value}__panel--${props.type}`,
  closing.value ? "is-closing" : ""
]);

const hasCountdown = computed(() => props.countdown > 0);
const hasAutoClose = computed(() => props.autoClose > 0);
const showCountdown = computed(() => hasCountdown.value || hasAutoClose.value);

const currentCountdown = computed(() => {
  if (hasAutoClose.value) {
    return countdownValue.value;
  }
  return props.countdown;
});

const typeIcon = computed(() => {
  switch (props.type) {
    case "coupon":
      return "mdi:ticket-outline";
    case "flash-sale":
      return "mdi:lightning-bolt";
    case "promotion":
      return "mdi:tag-outline";
    default:
      return "";
  }
});

function open() {
  rendered.value = true;
  visible.value = true;
  emit("update:modelValue", true);
  emit("open");

  if (hasAutoClose.value) {
    countdownValue.value = props.autoClose;
    startAutoCloseTimer();
  }

  setTimeout(() => {
    emit("opened");
  }, 300);
}

function close() {
  if (closing.value) return;
  closing.value = true;
  clearTimers();

  setTimeout(() => {
    visible.value = false;
    rendered.value = false;
    closing.value = false;
    emit("update:modelValue", false);
    emit("close");
    emit("closed");
  }, 300);
}

function handleOverlayClick(e: MouseEvent) {
  if (!props.closeOnClickOverlay) return;
  if (e.target === e.currentTarget) {
    close();
  }
}

function handleClose() {
  close();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.closeOnPressEscape) {
    close();
  }
}

function startAutoCloseTimer() {
  clearTimers();
  countdownValue.value = props.autoClose;

  autoCloseTimer = setInterval(() => {
    countdownValue.value--;
    if (countdownValue.value <= 0) {
      close();
    }
  }, 1000);
}

function clearTimers() {
  if (autoCloseTimer) {
    clearInterval(autoCloseTimer);
    autoCloseTimer = null;
  }
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open();
    } else {
      close();
    }
  },
  {
    immediate: true
  }
);

onMounted(() => {
  if (props.modelValue) {
    open();
  }
});

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="xy-marketing-overlay">
      <div
        v-if="rendered"
        :class="overlayClasses"
        @click="handleOverlayClick"
        @keydown="handleKeydown"
      >
        <Transition name="xy-marketing-panel">
          <div
            v-if="visible"
            :class="panelClasses"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="props.title ? 'marketing-modal-title' : undefined"
          >
            <div :class="`${ns.base.value}__panel-inner`">
              <div v-if="slots.header || props.title || slots.icon || showCountdown" :class="`${ns.base.value}__header`">
                <slot name="header">
                  <div :class="`${ns.base.value}__header-content`">
                    <span v-if="slots.icon" :class="`${ns.base.value}__icon`">
                      <slot name="icon" />
                    </span>
                    <span v-else-if="typeIcon" :class="`${ns.base.value}__icon`">
                      <XyIcon :icon="typeIcon" :size="20" />
                    </span>
                    <span v-if="props.title" :id="props.title ? 'marketing-modal-title' : undefined" :class="`${ns.base.value}__title`">
                      {{ props.title }}
                    </span>
                  </div>
                </slot>

                <div :class="`${ns.base.value}__header-actions`">
                  <span v-if="showCountdown" :class="`${ns.base.value}__countdown`">
                    {{ currentCountdown }}s
                  </span>
                  <button
                    v-if="props.showClose"
                    type="button"
                    :class="`${ns.base.value}__close`"
                    aria-label="关闭"
                    @click="handleClose"
                  >
                    <XyIcon icon="mdi:close" :size="18" />
                  </button>
                </div>
              </div>

              <div :class="`${ns.base.value}__body`">
                <slot />
              </div>

              <div v-if="slots.footer" :class="`${ns.base.value}__footer`">
                <slot name="footer" />
              </div>
            </div>

            <div v-if="props.type === 'coupon'" :class="`${ns.base.value}__decoration coupon-decoration`">
              <div :class="`${ns.base.value}__coupon-dots`" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
