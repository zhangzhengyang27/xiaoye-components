<script setup lang="ts">
defineOptions({
  name: "XyPopconfirm"
});

import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { StyleValue } from "vue";
import { focusFirstDescendant } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyButton from "../../button";
import XyIcon from "../../icon";
import XyTooltip from "../../tooltip";
import type { ButtonProps } from "../../button/src/button";
import type { TooltipExposed } from "../../tooltip";
import type {
  PopconfirmAction,
  PopconfirmActionContext,
  PopconfirmButtonType,
  PopconfirmProps
} from "./popconfirm";

const props = withDefaults(defineProps<PopconfirmProps>(), {
  modelValue: false,
  title: "",
  content: "",
  placement: "bottom",
  disabled: false,
  width: 150,
  openDelay: 80,
  closeDelay: 60,
  showAfter: undefined,
  hideAfter: 200,
  effect: "light",
  teleported: true,
  appendTo: "body",
  persistent: false,
  offset: 10,
  triggerKeys: undefined,
  showArrow: true,
  closeOnEsc: true,
  closeOnOutside: true,
  popperClass: "",
  popperStyle: undefined,
  transition: "xy-fade",
  popperOptions: undefined,
  icon: "mdi:help-circle-outline",
  iconColor: "#f90",
  hideIcon: false,
  confirmButtonText: undefined,
  cancelButtonText: undefined,
  confirmButtonType: "primary",
  cancelButtonType: "text",
  confirmButtonProps: undefined,
  cancelButtonProps: undefined,
  beforeConfirm: undefined,
  beforeCancel: undefined,
  virtualRef: null,
  virtualTriggering: false
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "before-show": [];
  show: [];
  "before-hide": [];
  hide: [];
  open: [];
  close: [];
  confirm: [event: MouseEvent];
  cancel: [event: MouseEvent];
}>();

const slots = defineSlots<{
  reference?: () => unknown;
  default?: (scope: {
    confirm: (event: MouseEvent) => Promise<void>;
    cancel: (event: MouseEvent) => Promise<void>;
    close: () => void;
    confirming: boolean;
    cancelling: boolean;
  }) => unknown;
  actions?: (scope: {
    confirm: (event: MouseEvent) => Promise<void>;
    cancel: (event: MouseEvent) => Promise<void>;
    close: () => void;
    confirming: boolean;
    cancelling: boolean;
  }) => unknown;
}>();

const ns = useNamespace("popconfirm");
const { locale } = useConfig();
const tooltipRef = ref<TooltipExposed | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const bodyRef = ref<HTMLElement | null>(null);
const actionsRef = ref<HTMLElement | null>(null);
const innerVisible = ref(props.modelValue);
const confirming = ref(false);
const cancelling = ref(false);
const titleId = `xy-popconfirm-title-${Math.random().toString(36).slice(2, 10)}`;
const bodyId = `xy-popconfirm-body-${Math.random().toString(36).slice(2, 10)}`;
const isClient = typeof document !== "undefined";
let restoreFocusedElement: HTMLElement | null = null;
let closeTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

const hasBodyContent = computed(() => Boolean(slots.default) || props.content !== "");
const isActionPending = computed(() => confirming.value || cancelling.value);
const tooltipMaxWidth = computed(() =>
  typeof props.width === "number" ? `${Math.max(props.width, 150)}px` : props.width
);
const tooltipPanelClass = computed(() =>
  [
    `${ns.base.value}__panel`,
    `${ns.base.value}__panel--${props.effect}`,
    props.popperClass
  ]
    .filter(Boolean)
    .join(" ")
);
const tooltipPanelStyle = computed<StyleValue>(() => [
  {
    width: tooltipMaxWidth.value,
    minWidth: "150px"
  },
  props.popperStyle
]);
const resolvedConfirmButtonText = computed(
  () => props.confirmButtonText ?? locale.value.popconfirmConfirmButtonText ?? "确定"
);
const resolvedCancelButtonText = computed(
  () => props.cancelButtonText ?? locale.value.popconfirmCancelButtonText ?? "取消"
);
const panelAriaDescribedby = computed(() => (hasBodyContent.value ? bodyId : undefined));
const slotScope = computed(() => ({
  confirm: handleConfirm,
  cancel: handleCancel,
  close: hide,
  confirming: confirming.value,
  cancelling: cancelling.value
}));

const confirmActionButtonProps = computed<Partial<ButtonProps>>(() =>
  resolveActionButtonProps(props.confirmButtonType, props.confirmButtonProps, confirming.value)
);
const cancelActionButtonProps = computed<Partial<ButtonProps>>(() =>
  resolveActionButtonProps(props.cancelButtonType, props.cancelButtonProps, cancelling.value)
);

watch(
  () => props.modelValue,
  (value) => {
    clearScheduledClose();
    innerVisible.value = value;
  }
);

function clearScheduledClose() {
  if (closeTimer != null) {
    globalThis.clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function clearPendingActions() {
  confirming.value = false;
  cancelling.value = false;
}

function resolveActionButtonProps(
  buttonType: PopconfirmButtonType,
  externalProps: Partial<ButtonProps> | undefined,
  loading: boolean
): Partial<ButtonProps> {
  const {
    type: _externalType,
    text: _externalText,
    loading: _externalLoading,
    disabled: externalDisabled,
    ...restProps
  } = externalProps ?? {};

  const baseProps: Partial<ButtonProps> =
    buttonType === "text"
      ? {
          size: "sm",
          text: true
        }
      : {
          size: "sm",
          type: buttonType
        };

  return {
    ...restProps,
    ...baseProps,
    loading,
    disabled: Boolean(externalDisabled) || isActionPending.value
  };
}

function syncVisible(value: boolean) {
  innerVisible.value = value;
  emit("update:modelValue", value);
}

function closePanel(immediate = true) {
  clearScheduledClose();

  const applyClose = () => {
    if (!innerVisible.value) {
      return;
    }

    syncVisible(false);
  };

  if (immediate) {
    applyClose();
    return;
  }

  const delay = props.hideAfter ?? props.closeDelay ?? 0;

  if (delay > 0) {
    closeTimer = globalThis.setTimeout(() => {
      closeTimer = null;
      applyClose();
    }, delay);
    return;
  }

  applyClose();
}

function hide() {
  clearPendingActions();
  closePanel(true);
}

function createActionContext(
  action: PopconfirmAction,
  event: MouseEvent
): PopconfirmActionContext {
  return {
    action,
    event,
    close: hide,
    hide
  };
}

async function runAction(
  action: PopconfirmAction,
  event: MouseEvent,
  hook: PopconfirmProps["beforeConfirm"] | PopconfirmProps["beforeCancel"],
  done: (event: MouseEvent) => void
) {
  if (isActionPending.value) {
    return;
  }

  if (action === "confirm") {
    confirming.value = true;
  } else {
    cancelling.value = true;
  }

  try {
    const result = await hook?.(createActionContext(action, event));

    if (result === false) {
      clearPendingActions();
      return;
    }

    done(event);
    closePanel(false);
  } catch {
    clearPendingActions();
  }
}

function handleTooltipModelValueChange(value: boolean) {
  clearScheduledClose();
  innerVisible.value = value;
  emit("update:modelValue", value);
}

function handleBeforeShow() {
  if (!props.virtualTriggering) {
    restoreFocusedElement =
      isClient && document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  emit("before-show");
}

async function handleShow() {
  emit("show");
  await nextTick();

  if (focusFirstDescendant(bodyRef.value)) {
    return;
  }

  if (focusFirstDescendant(actionsRef.value)) {
    return;
  }

  panelRef.value?.focus();
}

function handleBeforeHide() {
  emit("before-hide");
}

function handleOpen() {
  emit("open");
}

function handleClose() {
  clearScheduledClose();
  emit("close");

  if (!props.virtualTriggering) {
    restoreFocusedElement?.focus();
  }

  restoreFocusedElement = null;
  clearPendingActions();
}

function handleHide() {
  emit("hide");
}

async function handleConfirm(event: MouseEvent) {
  await runAction("confirm", event, props.beforeConfirm, (currentEvent) => {
    emit("confirm", currentEvent);
  });
}

async function handleCancel(event: MouseEvent) {
  await runAction("cancel", event, props.beforeCancel, (currentEvent) => {
    emit("cancel", currentEvent);
  });
}

onBeforeUnmount(() => {
  clearScheduledClose();
});

defineExpose({
  hide,
  popperRef: panelRef
});
</script>

<template>
  <XyTooltip
    ref="tooltipRef"
    :model-value="innerVisible"
    trigger="click"
    :placement="props.placement"
    :disabled="props.disabled"
    :open-delay="props.openDelay"
    :close-delay="props.closeDelay"
    :show-after="props.showAfter"
    :hide-after="props.hideAfter"
    :trigger-keys="props.triggerKeys"
    :offset="props.offset"
    :show-arrow="props.showArrow"
    :max-width="tooltipMaxWidth"
    :teleported="props.teleported"
    :append-to="props.appendTo"
    :persistent="props.persistent"
    :popper-class="tooltipPanelClass"
    :popper-style="tooltipPanelStyle"
    :close-on-esc="props.closeOnEsc && !isActionPending"
    :close-on-outside="props.closeOnOutside && !isActionPending"
    :effect="props.effect"
    :transition="props.transition"
    :virtual-ref="props.virtualRef"
    :virtual-triggering="props.virtualTriggering"
    :popper-options="props.popperOptions"
    @update:model-value="handleTooltipModelValueChange"
    @before-show="handleBeforeShow"
    @show="handleShow"
    @before-hide="handleBeforeHide"
    @hide="handleHide"
    @open="handleOpen"
    @close="handleClose"
  >
    <span
      v-if="$slots.reference"
      class="xy-popconfirm__trigger"
    >
      <slot name="reference" />
    </span>

    <template #content>
      <section
        ref="panelRef"
        :class="[
          ns.base.value,
          ns.is('confirming', confirming),
          ns.is('cancelling', cancelling)
        ]"
        role="alertdialog"
        aria-modal="false"
        :aria-labelledby="props.title ? titleId : undefined"
        :aria-describedby="panelAriaDescribedby"
        tabindex="-1"
      >
        <header
          v-if="props.title || (!props.hideIcon && props.icon)"
          class="xy-popconfirm__header"
        >
          <XyIcon
            v-if="!props.hideIcon && props.icon"
            class="xy-popconfirm__icon"
            :icon="props.icon"
            :size="18"
            :style="{ color: props.iconColor }"
          />
          <p
            v-if="props.title"
            :id="titleId"
            class="xy-popconfirm__title"
          >
            {{ props.title }}
          </p>
        </header>

        <div
          v-if="hasBodyContent"
          :id="bodyId"
          ref="bodyRef"
          class="xy-popconfirm__body"
        >
          <slot v-bind="slotScope">
            {{ props.content }}
          </slot>
        </div>

        <div
          ref="actionsRef"
          class="xy-popconfirm__actions"
        >
          <slot
            name="actions"
            v-bind="slotScope"
          >
            <XyButton
              v-bind="cancelActionButtonProps"
              @click="handleCancel"
            >
              {{ resolvedCancelButtonText }}
            </XyButton>
            <XyButton
              v-bind="confirmActionButtonProps"
              @click="handleConfirm"
            >
              {{ resolvedConfirmButtonText }}
            </XyButton>
          </slot>
        </div>
      </section>
    </template>
  </XyTooltip>
</template>
