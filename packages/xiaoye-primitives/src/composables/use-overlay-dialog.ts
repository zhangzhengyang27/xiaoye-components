import { computed, watch } from "vue";
import { toValue } from "vue";
import type { MaybeRefOrGetter, ComputedRef } from "vue";
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
  destroyStrategy?: "content" | "wrapper";
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
}

export interface OverlayDialogReturn {
  visible: ReturnType<typeof useFloatingVisibility>["visible"];
  rendered: ReturnType<typeof useFloatingVisibility>["rendered"];
  showModal: ComputedRef<boolean>;
  zIndex: ComputedRef<number>;
  appendTo: ComputedRef<string | HTMLElement>;
  teleportDisabled: ComputedRef<boolean>;
  contentRendered: ComputedRef<boolean>;
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

  const visibility = useFloatingVisibility({
    modelValue: options.modelValue,
    openDelay: options.openDelay,
    closeDelay: options.closeDelay,
    beforeOpen: () => {
      callbacks.onOpen?.();
    },
    beforeClose: () => {
      callbacks.onClose?.();
    },
    onOpen: () => {
      callbacks.onOpened?.();
    },
    onClose: () => {
      callbacks.onClosed?.();
      if (toValue(options.destroyOnClose)) {
        visibility.rendered.value = false;
      }
    }
  });
  const { visible, rendered, close } = visibility;

  const appendTo = computed(() => {
    return toValue(options.appendTo) ?? "body";
  });

  const teleportDisabled = computed(() => {
    if (typeof document === "undefined") {
      return true;
    }

    if (toValue(options.appendToBody)) {
      return false;
    }

    const target = toValue(options.appendTo);
    return target == null || target === "body";
  });

  const contentRendered = computed(() => {
    if (callbacks.destroyStrategy === "content" && toValue(options.destroyOnClose)) {
      return visible.value;
    }

    return rendered.value;
  });

  function handleAfterLeave() {
    if (toValue(options.destroyOnClose)) {
      visibility.rendered.value = false;
      return;
    }

    visibility.handleAfterLeave();
  }

  const showModal = computed(() => {
    return Boolean(toValue(options.modal) && visible.value);
  });

  const zIndex = computed(() => {
    const base = toValue(options.zIndex);
    if (base != null) return base;
    return overlayStack.zIndex.value;
  });

  watch(
    visible,
    (value) => {
      if (value) {
        overlayStack.openLayer();
        return;
      }

      overlayStack.closeLayer();
    },
    { immediate: true }
  );

  return {
    visible,
    rendered,
    showModal,
    zIndex,
    appendTo,
    teleportDisabled,
    contentRendered,
    isTopMost: overlayStack.isTopMost,
    close,
    handleAfterEnter: () => {},
    handleAfterLeave
  };
}
