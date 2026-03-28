<script setup lang="ts">
import type { ComponentSize } from "@xiaoye/utils";
import {
  Comment,
  Fragment,
  Text,
  computed,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  type VNode
} from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import {
  ALERT_CLOSE_ICON,
  ALERT_TYPE_ICON_MAP,
  invokeAlertBeforeClose,
  type AlertProps
} from "./alert";

defineOptions({
  name: "XyAlert"
});

const props = withDefaults(defineProps<AlertProps>(), {
  modelValue: undefined,
  title: "",
  description: "",
  type: "info",
  closable: true,
  closeText: "",
  showIcon: false,
  center: false,
  effect: "light",
  duration: 0,
  size: undefined,
  variant: "default",
  beforeClose: undefined,
  pauseOnHover: false,
  pauseOnFocus: false,
  pauseOnPageHidden: false,
  collapsible: false,
  defaultExpanded: false,
  lineClamp: 2,
  expandText: "展开详情",
  collapseText: "收起详情"
});

const slots = defineSlots<{
  default?: () => unknown;
  title?: () => unknown;
  icon?: () => unknown;
  actions?: () => unknown;
}>();

const emit = defineEmits<{
  close: [event: MouseEvent];
  "update:modelValue": [value: boolean];
  "auto-close": [];
}>();

const instance = getCurrentInstance();
const ns = useNamespace("alert");
const { size: globalSize } = useConfig();
const rootRef = ref<HTMLDivElement | null>(null);
const isControlled = computed(
  () =>
    props.modelValue !== undefined ||
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "modelValue")
);
const visible = ref(isControlled.value ? Boolean(props.modelValue) : true);
const expanded = ref(props.collapsible ? props.defaultExpanded : true);
const paused = ref(false);
let autoCloseTimer: number | null = null;
let autoCloseStartAt = 0;
let autoCloseRemaining = 0;
const pauseReasons = new Set<"hover" | "focus" | "page-hidden">();

const iconName = computed(() => ALERT_TYPE_ICON_MAP[props.type]);
const mergedSize = computed<ComponentSize>(() => props.size ?? globalSize.value);
const normalizedDuration = computed(() =>
  Number.isFinite(props.duration) && props.duration > 0 ? props.duration : 0
);
const normalizedLineClamp = computed(() =>
  Number.isFinite(props.lineClamp) && props.lineClamp > 0 ? Math.trunc(props.lineClamp) : 2
);
const hasTitle = computed(() => Boolean(props.title) || Boolean(slots.title));
const hasActions = computed(() => Boolean(slots.actions));
const hasDescription = computed(() => {
  if (props.description) {
    return true;
  }

  return hasMeaningfulContent(slots.default?.() as VNode[] | undefined);
});
const iconSize = computed(() =>
  `var(${hasDescription.value ? "--xy-alert-icon-large-size" : "--xy-alert-icon-size"})`
);
const canCollapse = computed(() => props.collapsible && hasDescription.value);
const isCollapsed = computed(() => canCollapse.value && !expanded.value);
const detailToggleLabel = computed(() =>
  expanded.value ? props.collapseText : props.expandText
);
const descriptionStyle = computed(() => ({
  "--xy-alert-line-clamp": String(normalizedLineClamp.value)
}));
const rootClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type}`,
  `${ns.base.value}--${mergedSize.value}`,
  `${ns.base.value}--${props.variant}`,
  ns.is(props.effect, true),
  ns.is("center", props.center),
  ns.is("paused", paused.value),
  ns.is("text-close", Boolean(props.closeText))
]);

function syncPausedState() {
  paused.value = pauseReasons.size > 0;
}

function clearPauseReasons() {
  pauseReasons.clear();
  syncPausedState();
}

function performManualClose(event: MouseEvent) {
  clearAutoCloseTimer(true);
  clearPauseReasons();

  if (isControlled.value) {
    emit("update:modelValue", false);
  } else {
    visible.value = false;
  }

  emit("close", event);
}

function requestManualClose(event: MouseEvent) {
  invokeAlertBeforeClose(props.beforeClose, () => {
    performManualClose(event);
  });
}

function performAutoClose() {
  clearAutoCloseTimer(true);
  clearPauseReasons();

  if (isControlled.value) {
    emit("update:modelValue", false);
  } else {
    visible.value = false;
  }

  emit("auto-close");
}

function clearAutoCloseTimer(resetRemaining = false) {
  if (autoCloseTimer != null && typeof window !== "undefined") {
    window.clearTimeout(autoCloseTimer);
  }

  autoCloseTimer = null;
  autoCloseStartAt = 0;

  if (resetRemaining) {
    autoCloseRemaining = 0;
  }
}

function scheduleAutoClose(delay = normalizedDuration.value) {
  clearAutoCloseTimer();

  if (
    !visible.value ||
    normalizedDuration.value <= 0 ||
    typeof window === "undefined" ||
    pauseReasons.size > 0
  ) {
    return;
  }

  const nextDelay = Math.max(0, delay);

  if (nextDelay === 0) {
    performAutoClose();
    return;
  }

  autoCloseRemaining = nextDelay;
  autoCloseStartAt = Date.now();
  autoCloseTimer = window.setTimeout(() => {
    autoCloseRemaining = 0;
    autoCloseStartAt = 0;
    paused.value = false;
    performAutoClose();
  }, nextDelay);
}

function pauseAutoClose(reason: "hover" | "focus" | "page-hidden") {
  if (normalizedDuration.value <= 0 || !visible.value || pauseReasons.has(reason)) {
    return;
  }

  pauseReasons.add(reason);

  if (autoCloseTimer != null && autoCloseStartAt !== 0) {
    const elapsed = Date.now() - autoCloseStartAt;
    autoCloseRemaining = Math.max(autoCloseRemaining - elapsed, 0);
    clearAutoCloseTimer();
  }

  syncPausedState();
}

function resumeAutoClose(reason: "hover" | "focus" | "page-hidden") {
  if (!pauseReasons.delete(reason)) {
    return;
  }

  syncPausedState();

  if (pauseReasons.size > 0 || !visible.value || normalizedDuration.value <= 0) {
    return;
  }

  scheduleAutoClose(autoCloseRemaining > 0 ? autoCloseRemaining : normalizedDuration.value);
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}

function handleMouseEnter() {
  if (props.pauseOnHover) {
    pauseAutoClose("hover");
  }
}

function handleMouseLeave() {
  if (props.pauseOnHover) {
    resumeAutoClose("hover");
  }
}

function handleFocusIn() {
  if (props.pauseOnFocus) {
    pauseAutoClose("focus");
  }
}

function handleFocusOut(event: FocusEvent) {
  if (!props.pauseOnFocus) {
    return;
  }

  const nextFocused = event.relatedTarget as Node | null;

  if (nextFocused && rootRef.value?.contains(nextFocused)) {
    return;
  }

  resumeAutoClose("focus");
}

function syncPageHiddenPause() {
  if (
    !props.pauseOnPageHidden ||
    typeof document === "undefined" ||
    normalizedDuration.value <= 0 ||
    !visible.value
  ) {
    resumeAutoClose("page-hidden");
    return;
  }

  if (document.hidden) {
    pauseAutoClose("page-hidden");
    return;
  }

  resumeAutoClose("page-hidden");
}

function handleDocumentVisibilityChange() {
  syncPageHiddenPause();
}

function hasMeaningfulContent(nodes: VNode[] | undefined): boolean {
  if (!nodes?.length) {
    return false;
  }

  return nodes.some((node) => {
    if (node.type === Comment) {
      return false;
    }

    if (node.type === Text) {
      return String(node.children ?? "").trim().length > 0;
    }

    if (node.type === Fragment) {
      return hasMeaningfulContent(
        Array.isArray(node.children) ? (node.children as VNode[]) : undefined
      );
    }

    return true;
  });
}

watch(
  [() => props.modelValue, isControlled],
  ([value, controlled]) => {
    if (!controlled) {
      return;
    }

    visible.value = Boolean(value);
  },
  {
    immediate: true
  }
);

watch(
  [visible, normalizedDuration],
  ([nextVisible, nextDuration]) => {
    clearAutoCloseTimer(true);
    clearPauseReasons();

    if (!nextVisible || nextDuration <= 0) {
      return;
    }

    autoCloseRemaining = nextDuration;
    syncPageHiddenPause();
    scheduleAutoClose(nextDuration);
  },
  {
    immediate: true
  }
);

watch(
  [() => props.collapsible, () => props.defaultExpanded],
  ([collapsible, defaultExpanded]) => {
    expanded.value = collapsible ? defaultExpanded : true;
  },
  {
    immediate: true
  }
);

watch(
  [() => props.pauseOnPageHidden, visible, normalizedDuration],
  () => {
    syncPageHiddenPause();
  },
  {
    immediate: true
  }
);

onMounted(() => {
  if (typeof document === "undefined") {
    return;
  }

  document.addEventListener("visibilitychange", handleDocumentVisibilityChange);
  syncPageHiddenPause();
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", handleDocumentVisibilityChange);
  }

  clearAutoCloseTimer(true);
  clearPauseReasons();
});
</script>

<template>
  <transition name="xy-alert-fade">
    <div
      ref="rootRef"
      v-show="visible"
      :class="rootClasses"
      role="alert"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
    >
      <span
        v-if="props.showIcon"
        :class="[
          `${ns.base.value}__icon`,
          ns.is('big', hasDescription)
        ]"
        aria-hidden="true"
      >
        <slot name="icon">
          <XyIcon :icon="iconName" :size="iconSize" />
        </slot>
      </span>

      <div :class="`${ns.base.value}__main`">
        <div :class="`${ns.base.value}__content`">
          <span
            v-if="hasTitle"
            :class="[
              `${ns.base.value}__title`,
              { 'with-description': hasDescription }
            ]"
          >
            <slot name="title">{{ props.title }}</slot>
          </span>

          <div
            v-if="hasDescription"
            :class="[
              `${ns.base.value}__description`,
              ns.is('collapsed', isCollapsed)
            ]"
            :style="descriptionStyle"
          >
            <slot>
              {{ props.description }}
            </slot>
          </div>

          <button
            v-if="canCollapse"
            :class="`${ns.base.value}__toggle`"
            type="button"
            :aria-expanded="expanded"
            @click="toggleExpanded"
          >
            {{ detailToggleLabel }}
          </button>
        </div>

        <div
          v-if="hasActions && props.variant !== 'banner'"
          :class="`${ns.base.value}__actions`"
        >
          <slot name="actions" />
        </div>
      </div>

      <div
        v-if="hasActions && props.variant === 'banner'"
        :class="[
          `${ns.base.value}__actions`,
          `${ns.base.value}__actions--banner`
        ]"
      >
        <slot name="actions" />
      </div>

      <button
        v-if="props.closable"
        :class="[
          `${ns.base.value}__close-btn`,
          ns.is('customed', Boolean(props.closeText))
        ]"
        type="button"
        aria-label="close"
        @click="requestManualClose"
      >
        <template v-if="props.closeText">
          {{ props.closeText }}
        </template>
        <XyIcon v-else :icon="ALERT_CLOSE_ICON" size="var(--xy-alert-close-font-size)" />
      </button>
    </div>
  </transition>
</template>
