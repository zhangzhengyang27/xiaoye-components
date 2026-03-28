<script setup lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";
import type { PropType, VNodeChild } from "vue";
import { useNamespace, useZIndex } from "@xiaoye/composables";
import XyIcon from "../../icon";
import {
  NOTIFICATION_CLOSE_ICON,
  NOTIFICATION_TYPE_ICON_MAP,
  type NotificationCloseReason,
  type NotificationProps
} from "./notification";

const RenderVNode = defineComponent({
  name: "NotificationRenderVNode",
  props: {
    renderer: {
      type: Function as PropType<(() => VNodeChild) | undefined>,
      default: undefined
    }
  },
  setup(props) {
    return () => props.renderer?.() ?? null;
  }
});

defineOptions({
  name: "XyNotification"
});

const props = withDefaults(defineProps<NotificationProps>(), {
  modelValue: undefined,
  title: "",
  message: "",
  type: "",
  duration: 4500,
  showClose: true,
  customClass: "",
  icon: "",
  closeIcon: NOTIFICATION_CLOSE_ICON,
  dangerouslyUseHTMLString: false,
  zIndex: undefined,
  timerKey: 0
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [reason: NotificationCloseReason];
  closed: [reason: NotificationCloseReason];
  click: [event: MouseEvent];
}>();

const slots = defineSlots<{
  title?: () => unknown;
  default?: () => unknown;
  actions?: () => unknown;
}>();

const instance = getCurrentInstance();
const ns = useNamespace("notification");
const { next } = useZIndex();
const pendingReason = ref<NotificationCloseReason>("programmatic");
const runtimeZIndex = ref<number>(0);
const closingRequested = ref(false);
let timer: number | null = null;

const isControlled = computed(
  () =>
    props.modelValue !== undefined ||
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "modelValue")
);
const visible = ref(isControlled.value ? Boolean(props.modelValue) : true);
const hasTitleSlot = computed(() => Boolean(slots.title));
const iconName = computed(() => {
  if (props.type) {
    return NOTIFICATION_TYPE_ICON_MAP[props.type] ?? props.icon;
  }

  return props.icon;
});
const hasSlotContent = computed(() => Boolean(slots.default));
const hasActions = computed(() => Boolean(slots.actions));
const hasRichMessage = computed(
  () => typeof props.message === "function" || isVNode(props.message)
);
const hasTitle = computed(() => hasTitleSlot.value || Boolean(props.title));
const hasMessage = computed(() => {
  if (hasSlotContent.value || hasRichMessage.value) {
    return true;
  }

  return typeof props.message === "string" && props.message.length > 0;
});
const messageText = computed(() =>
  typeof props.message === "string" ? props.message : ""
);
const rootClasses = computed(() => [
  ns.base.value,
  props.type ? `${ns.base.value}--${props.type}` : "",
  ns.is("with-title", hasTitle.value),
  ns.is("with-actions", hasActions.value),
  ns.is("closable", props.showClose),
  props.customClass
]);
const rootStyle = computed(() => ({
  zIndex: `${runtimeZIndex.value}`
}));

function resolveRenderer(): VNodeChild {
  if (typeof props.message === "function") {
    return props.message();
  }

  return props.message as VNodeChild;
}

function clearTimer() {
  if (timer !== null && typeof window !== "undefined") {
    window.clearTimeout(timer);
  }

  timer = null;
}

function startTimer() {
  clearTimer();

  if (!visible.value || props.duration <= 0 || typeof window === "undefined") {
    return;
  }

  timer = window.setTimeout(() => {
    close("auto");
  }, props.duration);
}

function close(reason: NotificationCloseReason = "programmatic") {
  if (!visible.value || closingRequested.value) {
    return;
  }

  pendingReason.value = reason;
  closingRequested.value = true;
  emit("close", reason);

  if (isControlled.value) {
    emit("update:modelValue", false);
    return;
  }

  visible.value = false;
}

function handleMouseLeave() {
  startTimer();
}

function handleClick(event: MouseEvent) {
  emit("click", event);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && visible.value) {
    close("escape");
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!isControlled.value) {
      return;
    }

    visible.value = Boolean(value);

    if (value) {
      pendingReason.value = "programmatic";
    }
  },
  {
    immediate: true
  }
);

watch(
  visible,
  (value, oldValue) => {
    if (value) {
      closingRequested.value = false;
      startTimer();
      return;
    }

    clearTimer();

    if (!oldValue) {
      return;
    }

    emit("closed", pendingReason.value);
  },
  {
    immediate: true
  }
);

watch(
  () => props.duration,
  () => {
    if (visible.value) {
      startTimer();
    }
  }
);

watch(
  () => props.timerKey,
  () => {
    if (visible.value) {
      startTimer();
    }
  }
);

watch(
  () => props.zIndex,
  (value) => {
    if (value === undefined) {
      return;
    }

    runtimeZIndex.value = value;
  }
);

onMounted(() => {
  runtimeZIndex.value = props.zIndex ?? next();

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", handleKeydown);
  }
});

onBeforeUnmount(() => {
  clearTimer();

  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", handleKeydown);
  }
});

defineExpose({
  close,
  visible
});
</script>

<template>
  <Transition name="xy-notification-fade">
    <div
      v-show="visible"
      :class="rootClasses"
      :style="rootStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <XyIcon
        v-if="iconName"
        :icon="iconName"
        class="xy-notification__icon"
        :size="24"
      />

      <div class="xy-notification__group">
        <h3 v-if="hasTitle" class="xy-notification__title">
          <slot name="title">
            {{ props.title }}
          </slot>
        </h3>

        <div
          v-if="hasMessage"
          class="xy-notification__content"
          :style="hasTitle ? undefined : { marginTop: 0 }"
        >
          <slot>
            <RenderVNode
              v-if="hasRichMessage"
              :renderer="resolveRenderer"
            />
            <p
              v-else-if="props.dangerouslyUseHTMLString"
              v-html="messageText"
            />
            <p v-else>{{ messageText }}</p>
          </slot>
        </div>

        <div v-if="hasActions" class="xy-notification__actions">
          <slot name="actions" />
        </div>
      </div>

      <button
        v-if="props.showClose"
        type="button"
        class="xy-notification__close"
        aria-label="关闭通知"
        @click.stop="close('manual')"
      >
        <XyIcon :icon="props.closeIcon" :size="16" />
      </button>
    </div>
  </Transition>
</template>
