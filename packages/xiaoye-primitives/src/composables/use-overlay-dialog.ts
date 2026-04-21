import { computed, watch } from "vue";
import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useFloatingVisibility } from "./use-floating-visibility";
import { useOverlayStack } from "./use-overlay-stack";

export interface OverlayDialogOptions {
  modelValue?: MaybeRefOrGetter<boolean | undefined>;
  destroyOnClose?: MaybeRefOrGetter<boolean | undefined>;
  lockScroll?: MaybeRefOrGetter<boolean | undefined>;
  openDelay?: MaybeRefOrGetter<number | undefined>;
  closeDelay?: MaybeRefOrGetter<number | undefined>;
  appendToBody?: MaybeRefOrGetter<boolean | undefined>;
  appendTo?: MaybeRefOrGetter<string | HTMLElement | undefined>;
  modal?: MaybeRefOrGetter<boolean | undefined>;
  zIndex?: MaybeRefOrGetter<number | undefined>;
}

export interface OverlayDialogCallbacks {
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
}

export interface OverlayDialogReturn {
  visible: ReturnType<typeof useFloatingVisibility>["visible"];
  showModal: ReturnType<typeof computed<boolean>>;
  zIndex: ReturnType<typeof computed<number>>;
  isTopMost: () => boolean;
  close: () => void;
  handleAfterEnter: () => void;
  handleAfterLeave: () => void;
}

export function useOverlayDialog(
  options: OverlayDialogOptions,
  callbacks: OverlayDialogCallbacks = {}
): OverlayDialogReturn {
  const overlayStack = useOverlayStack();

  const { visible, close, handleAfterLeave } = useFloatingVisibility({
    modelValue: () => options.modelValue,
    openDelay: () => options.openDelay,
    closeDelay: () => options.closeDelay,
    beforeOpen: (source) => {
      if (source === "internal") {
        callbacks.onOpen?.();
      }
    },
    beforeClose: (source) => {
      if (source === "internal") {
        callbacks.onClose?.();
      }
    },
    onOpen: () => {
      callbacks.onOpened?.();
    },
    onClose: () => {
      callbacks.onClosed?.();
    }
  });

  const showModal = computed(() => {
    return toValue(options.modal) && visible.value;
  });

  const zIndex = computed(() => {
    const base = toValue(options.zIndex);
    if (base != null) return base;
    return overlayStack.zIndex.value;
  });

  watch(
    visible,
    (value) => {
      if (!value) return;
      overlayStack.openLayer();
    },
    { immediate: true }
  );

  return {
    visible,
    showModal,
    zIndex,
    isTopMost: overlayStack.isTopMost,
    close,
    handleAfterEnter: () => {},
    handleAfterLeave
  };
}
