import { computed, nextTick, onBeforeUnmount, ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "@xiaoye/utils";
import { useOverlayStack } from "@xiaoye/composables";

export interface DialogLikeProps {
  modelValue?: boolean;
  destroyOnClose?: boolean;
  lockScroll?: boolean;
  openDelay?: number;
  closeDelay?: number;
  appendToBody?: boolean;
  appendTo?: string | HTMLElement;
  modal?: boolean;
  modalClass?: string;
  modalPenetrable?: boolean;
}

export interface UseDialogOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  zIndex?: MaybeRefOrGetter<number | undefined>;
}

export function useDialog(props: DialogLikeProps, options: UseDialogOptions = {}) {
  const rendered = ref(Boolean(props.modelValue));
  const visible = ref(Boolean(props.modelValue));
  const isClosing = ref(false);
  const { zIndex: overlayZIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
  const appendTo = computed(() => props.appendTo ?? "body");
  const appendToBody = computed(() => props.appendToBody ?? true);
  const teleportDisabled = computed(() => appendTo.value === "body" ? !appendToBody.value : false);
  const showModal = computed(() => props.modal ?? true);
  const isPenetrable = computed(() => Boolean(props.modalPenetrable) && !showModal.value);
  let openedNotified = false;
  let closedNotified = !props.modelValue;
  let openTimer: number | null = null;
  let closeTimer: number | null = null;

  function notifyOpened() {
    if (openedNotified) {
      return;
    }

    openedNotified = true;
    closedNotified = false;
    options.onOpened?.();
  }

  function notifyClosed() {
    if (closedNotified) {
      return;
    }

    closedNotified = true;
    openedNotified = false;
    options.onClosed?.();
  }

  function clearTimers() {
    if (openTimer != null) {
      window.clearTimeout(openTimer);
      openTimer = null;
    }

    if (closeTimer != null) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function applyLockScroll(locked: boolean) {
    if (!props.lockScroll) {
      return;
    }

    if (locked) {
      lockBodyScroll();
      return;
    }

    unlockBodyScroll();
  }

  function show() {
    rendered.value = true;

    if (visible.value) {
      return;
    }

    visible.value = true;
    isClosing.value = false;
    openedNotified = false;
    closedNotified = false;
    openLayer();
    applyLockScroll(true);
    options.onOpen?.();
    void nextTick(() => {
      if (visible.value) {
        notifyOpened();
      }
    });
  }

  function hide() {
    if (!visible.value) {
      if (props.destroyOnClose) {
        rendered.value = false;
      }
      return;
    }

    visible.value = false;
    isClosing.value = true;
    applyLockScroll(false);
    closeLayer();
    options.onClose?.();
    void nextTick(() => {
      if (!visible.value) {
        notifyClosed();
      }
    });
  }

  function scheduleOpen() {
    clearTimers();
    rendered.value = true;
    const delay = props.openDelay ?? 0;

    if (delay > 0) {
      openTimer = window.setTimeout(() => {
        show();
      }, delay);
      return;
    }

    show();
  }

  function scheduleClose() {
    clearTimers();
    const delay = props.closeDelay ?? 0;

    if (delay > 0) {
      closeTimer = window.setTimeout(() => {
        hide();
      }, delay);
      return;
    }

    hide();
  }

  function handleAfterEnter() {
    notifyOpened();
  }

  function handleAfterLeave() {
    isClosing.value = false;
    if (props.destroyOnClose) {
      rendered.value = false;
    }
    notifyClosed();
  }

  watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        scheduleOpen();
        return;
      }

      scheduleClose();
    },
    {
      immediate: true
    }
  );

  watch(
    () => toValue(options.zIndex),
    (value) => {
      if (value != null) {
        overlayZIndex.value = value;
      }
    },
    {
      immediate: true
    }
  );

  onBeforeUnmount(() => {
    clearTimers();
    applyLockScroll(false);
    closeLayer();
  });

  return {
    appendTo,
    handleAfterEnter,
    handleAfterLeave,
    isClosing,
    isPenetrable,
    isTopMost,
    showModal,
    rendered,
    teleportDisabled,
    visible,
    zIndex: overlayZIndex
  };
}
