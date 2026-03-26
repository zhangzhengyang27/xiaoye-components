import { computed, nextTick, onBeforeUnmount, ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "@xiaoye/utils";
import { useOverlayStack } from "./use-overlay-stack";

export interface OverlayDialogProps {
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

export interface UseOverlayDialogOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  destroyStrategy?: "root" | "content";
}

export function useOverlayDialog(
  props: OverlayDialogProps,
  options: UseOverlayDialogOptions = {}
) {
  const rendered = ref(Boolean(toValue(props.modelValue)));
  const contentRendered = ref(Boolean(toValue(props.modelValue)));
  const visible = ref(false);
  const { zIndex: overlayZIndex, isTopMost, openLayer, closeLayer } = useOverlayStack();
  const appendTo = computed(() => toValue(props.appendTo) ?? "body");
  const appendToBody = computed(() => toValue(props.appendToBody) ?? true);
  const teleportDisabled = computed(() => appendTo.value === "body" ? !appendToBody.value : false);
  const showModal = computed(() => toValue(props.modal) ?? true);
  let layerOpened = false;
  let openedNotified = false;
  let closedNotified = !toValue(props.modelValue);
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
    if (!toValue(props.lockScroll)) {
      return;
    }

    if (locked) {
      lockBodyScroll();
      return;
    }

    unlockBodyScroll();
  }

  function syncZIndex() {
    const customZIndex = toValue(props.zIndex);

    if (customZIndex != null) {
      overlayZIndex.value = customZIndex;
    }
  }

  function show() {
    rendered.value = true;
    contentRendered.value = true;

    if (visible.value) {
      if (!layerOpened) {
        layerOpened = true;
        openLayer();
        syncZIndex();
        applyLockScroll(true);
        options.onOpen?.();
      }

      syncZIndex();
      return;
    }

    visible.value = true;
    openedNotified = false;
    closedNotified = false;
    openLayer();
    layerOpened = true;
    syncZIndex();
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
      return;
    }

    visible.value = false;
    applyLockScroll(false);
    if (layerOpened) {
      layerOpened = false;
      closeLayer();
    }
    if (toValue(props.destroyOnClose) && options.destroyStrategy !== "content") {
      rendered.value = false;
    }
    options.onClose?.();
    void nextTick(() => {
      if (!visible.value) {
        notifyClosed();
      }
    });
  }

  function open() {
    clearTimers();
    rendered.value = true;
    const delay = toValue(props.openDelay) ?? 0;

    if (delay > 0) {
      openTimer = window.setTimeout(() => {
        show();
      }, delay);
      return;
    }

    show();
  }

  function close() {
    clearTimers();
    const delay = toValue(props.closeDelay) ?? 0;

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
    if (toValue(props.destroyOnClose)) {
      if (options.destroyStrategy === "content") {
        contentRendered.value = false;
      } else {
        rendered.value = false;
      }
    }
    notifyClosed();
  }

  watch(
    () => toValue(props.modelValue),
    (value) => {
      if (value) {
        open();
        return;
      }

      close();
    },
    {
      immediate: true
    }
  );

  watch(
    () => toValue(props.zIndex),
    () => {
      if (visible.value) {
        syncZIndex();
      }
    }
  );

  onBeforeUnmount(() => {
    clearTimers();
    applyLockScroll(false);
    if (layerOpened) {
      layerOpened = false;
      closeLayer();
    }
  });

  return {
    appendTo,
    clearTimers,
    close,
    handleAfterEnter,
    handleAfterLeave,
    isTopMost,
    open,
    contentRendered,
    rendered,
    showModal,
    teleportDisabled,
    visible,
    zIndex: overlayZIndex
  };
}
