<script setup lang="ts">
import {
  computed,
  defineComponent,
  isVNode,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";
import { useNamespace, useZIndex } from "@xiaoye/composables";
import XyIcon from "../../icon";
import {
  invokeMessageBeforeClose,
  MESSAGE_CLOSE_ICON,
  MESSAGE_DEFAULT_TRANSITION,
  MESSAGE_TYPE_ICON_MAP,
  type MessageActionContext,
  type MessageCloseReason,
  type MessageProps
} from "./message";
import { getLastOffset, getOffsetOrSpace } from "./instance";

defineOptions({
  name: "XyMessageItem"
});

const props = withDefaults(defineProps<MessageProps>(), {
  customClass: "",
  dangerouslyUseHTMLString: false,
  duration: 3000,
  icon: "",
  id: "",
  message: "",
  render: undefined,
  onClose: undefined,
  onClick: undefined,
  showClose: false,
  showIcon: true,
  type: "info",
  plain: false,
  offset: 16,
  placement: "top",
  repeatNum: 1,
  targetKey: "",
  groupKey: undefined,
  zIndex: undefined,
  beforeClose: undefined,
  closeOnClick: false,
  closeOnPressEscape: true,
  pauseOnHover: true,
  pauseOnFocus: false,
  pauseOnPageHidden: false,
  transition: MESSAGE_DEFAULT_TRANSITION,
  resetOnRepeat: true
});

const emit = defineEmits<{
  "close-start": [reason: MessageCloseReason];
  closed: [reason: MessageCloseReason];
  destroy: [];
}>();

const ns = useNamespace("message");
const { next } = useZIndex();
const messageRef = ref<HTMLElement | null>(null);
const visible = ref(false);
const height = ref(0);
const runtimeZIndex = ref<number>(0);
const closeReason = ref<MessageCloseReason>("programmatic");
const pauseReasons = new Set<"hover" | "focus" | "page-hidden">();
let timer: number | null = null;
let destroyTimer: number | null = null;
let autoCloseStartAt = 0;
let autoCloseRemaining = 0;
let resizeObserver: ResizeObserver | null = null;
let closedTriggered = false;

const iconName = computed(() => props.icon || MESSAGE_TYPE_ICON_MAP[props.type]);
const messageText = computed(() =>
  typeof props.message === "string" || typeof props.message === "number"
    ? String(props.message)
    : ""
);
const richContentComponent = computed(() => {
  if (!props.render && typeof props.message !== "function" && !isVNode(props.message)) {
    return null;
  }

  return defineComponent({
    name: "XyMessageRichContent",
    render() {
      if (props.render) {
        return props.render();
      }

      if (typeof props.message === "function") {
        return props.message();
      }

      return props.message;
    }
  });
});
const placement = computed(() => props.placement);
const lastOffset = computed(() => getLastOffset(props.id, placement.value, props.targetKey));
const offset = computed(
  () =>
    getOffsetOrSpace(props.id, props.offset, placement.value, props.targetKey) + lastOffset.value
);
const bottom = computed(() => height.value + offset.value);
const horizontalClass = computed(() => {
  if (placement.value.includes("left")) {
    return ns.is("left", true);
  }

  if (placement.value.includes("right")) {
    return ns.is("right", true);
  }

  return ns.is("center", true);
});
const verticalProperty = computed(() => (placement.value.startsWith("top") ? "top" : "bottom"));
const rootClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.type}`,
  horizontalClass.value,
  ns.is("plain", props.plain),
  ns.is("closable", props.showClose),
  ns.is("bottom", verticalProperty.value === "bottom"),
  ns.is("clickable", props.closeOnClick),
  props.customClass
]);
const customStyle = computed(() => ({
  [verticalProperty.value]: `${offset.value}px`,
  zIndex: String(runtimeZIndex.value)
}));

function createActionContext(reason: MessageCloseReason): MessageActionContext {
  return {
    id: props.id,
    type: props.type,
    placement: props.placement,
    targetKey: props.targetKey,
    repeatNum: props.repeatNum,
    groupKey: props.groupKey,
    reason,
    close(nextReason = "programmatic") {
      close(nextReason);
    }
  };
}

function syncHeight() {
  height.value = messageRef.value?.getBoundingClientRect().height ?? 0;
}

function clearTimer() {
  if (timer !== null && typeof window !== "undefined") {
    window.clearTimeout(timer);
  }

  timer = null;
  autoCloseStartAt = 0;
}

function clearDestroyTimer() {
  if (destroyTimer !== null && typeof window !== "undefined") {
    window.clearTimeout(destroyTimer);
  }

  destroyTimer = null;
}

function emitClosedOnce(reason: MessageCloseReason) {
  if (closedTriggered) {
    return;
  }

  closedTriggered = true;
  props.onClosed?.(createActionContext(reason));
  emit("closed", reason);
}

function emitDestroyOnce() {
  clearDestroyTimer();
  emit("destroy");
}

function scheduleDestroyFallback() {
  clearDestroyTimer();

  if (typeof window === "undefined") {
    emitClosedOnce(closeReason.value);
    emitDestroyOnce();
    return;
  }

  destroyTimer = window.setTimeout(() => {
    if (!visible.value) {
      emitClosedOnce(closeReason.value);
      emitDestroyOnce();
    }
  }, 280);
}

function scheduleAutoClose(delay = props.duration) {
  clearTimer();

  if (
    !visible.value ||
    props.duration <= 0 ||
    typeof window === "undefined" ||
    pauseReasons.size > 0
  ) {
    return;
  }

  const nextDelay = Math.max(0, delay);

  if (nextDelay === 0) {
    close("auto");
    return;
  }

  autoCloseRemaining = nextDelay;
  autoCloseStartAt = Date.now();
  timer = window.setTimeout(() => {
    autoCloseRemaining = 0;
    autoCloseStartAt = 0;
    close("auto");
  }, nextDelay);
}

function pauseAutoClose(reason: "hover" | "focus" | "page-hidden") {
  if (props.duration <= 0 || !visible.value || pauseReasons.has(reason)) {
    return;
  }

  pauseReasons.add(reason);

  if (timer !== null && autoCloseStartAt !== 0) {
    const elapsed = Date.now() - autoCloseStartAt;
    autoCloseRemaining = Math.max(autoCloseRemaining - elapsed, 0);
    clearTimer();
  }
}

function resumeAutoClose(reason: "hover" | "focus" | "page-hidden") {
  if (!pauseReasons.delete(reason)) {
    return;
  }

  if (pauseReasons.size > 0 || !visible.value || props.duration <= 0) {
    return;
  }

  scheduleAutoClose(autoCloseRemaining > 0 ? autoCloseRemaining : props.duration);
}

function performClose(reason: MessageCloseReason) {
  if (!visible.value) {
    return;
  }

  closeReason.value = reason;
  emit("close-start", reason);
  props.onClose?.(createActionContext(reason));
  clearTimer();
  visible.value = false;
  scheduleDestroyFallback();

  void nextTick().then(() => {
    if (!messageRef.value?.isConnected) {
      emitClosedOnce(reason);
      emitDestroyOnce();
    }
  });
}

function close(reason: MessageCloseReason = "programmatic") {
  if (!visible.value) {
    return;
  }

  invokeMessageBeforeClose(props.beforeClose, createActionContext(reason), () => {
    performClose(reason);
  });
}

function handleRootClick(event: MouseEvent) {
  props.onClick?.({
    ...createActionContext("click"),
    event
  });

  if (props.closeOnClick) {
    close("click");
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.closeOnPressEscape) {
    close("escape");
  }
}

function handleVisibilityChange() {
  if (!props.pauseOnPageHidden || typeof document === "undefined") {
    return;
  }

  if (document.hidden) {
    pauseAutoClose("page-hidden");
    return;
  }

  resumeAutoClose("page-hidden");
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

  const nextTarget = event.relatedTarget as Node | null;

  if (nextTarget && messageRef.value?.contains(nextTarget)) {
    return;
  }

  resumeAutoClose("focus");
}

onMounted(() => {
  runtimeZIndex.value = props.zIndex ?? next();
  syncHeight();

  if (typeof ResizeObserver !== "undefined" && messageRef.value) {
    resizeObserver = new ResizeObserver(() => {
      syncHeight();
    });
    resizeObserver.observe(messageRef.value);
  }

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", handleKeydown);

    if (props.pauseOnPageHidden) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
  }

  visible.value = true;
  scheduleAutoClose();
});

onBeforeUnmount(() => {
  clearTimer();
  clearDestroyTimer();
  resizeObserver?.disconnect();

  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", handleKeydown);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  }
});

watch(
  () => props.repeatNum,
  () => {
    if (visible.value && props.resetOnRepeat) {
      scheduleAutoClose();
    }
  }
);

watch(
  () => props.duration,
  () => {
    if (visible.value) {
      scheduleAutoClose();
    }
  }
);

watch(
  () => props.zIndex,
  (value) => {
    if (value !== undefined) {
      runtimeZIndex.value = value;
    }
  }
);

watch(
  () => [props.message, props.render],
  () => {
    void nextTick().then(syncHeight);
  }
);

watch(
  () => props.pauseOnPageHidden,
  (value) => {
    if (typeof document === "undefined") {
      return;
    }

    document.removeEventListener("visibilitychange", handleVisibilityChange);

    if (value) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      pauseReasons.delete("page-hidden");
    }
  }
);

defineExpose({
  bottom,
  close,
  visible
});
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <Transition
    :name="props.transition"
    @after-leave="
      () => {
        emitClosedOnce(closeReason);
        emitDestroyOnce();
      }
    "
  >
    <div
      v-show="visible"
      :id="props.id"
      ref="messageRef"
      :class="rootClasses"
      :style="customStyle"
      role="alert"
      tabindex="0"
      @click="handleRootClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
    >
      <span v-if="props.repeatNum > 1" class="xy-message__badge">
        {{ props.repeatNum }}
      </span>
      <XyIcon
        v-if="props.showIcon && iconName"
        :icon="iconName"
        class="xy-message__icon"
        :size="18"
      />
      <slot>
        <div v-if="richContentComponent" class="xy-message__content xy-message__content--rich">
          <component :is="richContentComponent" />
        </div>
        <p
          v-else-if="props.dangerouslyUseHTMLString"
          class="xy-message__content"
          v-html="messageText"
        />
        <p v-else class="xy-message__content">
          {{ messageText }}
        </p>
      </slot>
      <button
        v-if="props.showClose"
        type="button"
        class="xy-message__close"
        aria-label="关闭提示"
        @click.stop="close('manual')"
      >
        <XyIcon :icon="MESSAGE_CLOSE_ICON" :size="14" />
      </button>
    </div>
  </Transition>
</template>
