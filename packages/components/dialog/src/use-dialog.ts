import { computed, nextTick, ref, watch } from "vue";
import { useConfig, useDismissibleLayer, useFocusTrap, useOverlayDialog } from "@xiaoye/composables";
import { useDialogResizable } from "./use-dialog-resizable";
import type {
  DialogCloseReason,
  DialogGlobalConfig,
  DialogProps,
  DialogTransition
} from "./dialog";
import type { DialogContentInstance } from "./dialog-content";

function addUnit(value?: string | number) {
  if (value == null || value === "") {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
}

function mergeTransitionHooks(
  transition: DialogTransition | undefined,
  defaultName: string,
  hooks: {
    onAfterEnter: () => void;
    onAfterLeave: () => void;
  }
) {
  const callHook = (
    hook: ((element: Element) => void) | Array<(element: Element) => void> | undefined,
    element: Element
  ) => {
    if (!hook) {
      return;
    }

    if (Array.isArray(hook)) {
      hook.forEach((entry) => {
        entry(element);
      });
      return;
    }

    hook(element);
  };

  if (!transition) {
    return {
      name: defaultName,
      appear: true,
      ...hooks
    };
  }

  if (typeof transition === "string") {
    return {
      name: transition,
      appear: true,
      ...hooks
    };
  }

  return {
    ...transition,
    appear: transition.appear ?? true,
    name: transition.name ?? defaultName,
    onAfterEnter: (element: Element) => {
      callHook(transition.onAfterEnter, element);
      hooks.onAfterEnter();
    },
    onAfterLeave: (element: Element) => {
      callHook(transition.onAfterLeave, element);
      hooks.onAfterLeave();
    }
  };
}

export function useDialog(
  props: DialogProps,
  options: {
    emitUpdateModelValue: (value: boolean) => void;
    emitUpdateFullscreen: (value: boolean) => void;
    emitOpen: () => void;
    emitOpened: () => void;
    emitClose: () => void;
    emitClosed: () => void;
    emitOpenAutoFocus: () => void;
    emitCloseAutoFocus: () => void;
    emitMaximize: () => void;
    emitRestore: () => void;
    emitResizeStart: (event: MouseEvent, width: number, height: number) => void;
    emitResize: (event: MouseEvent, width: number, height: number) => void;
    emitResizeEnd: (event: MouseEvent, width: number, height: number) => void;
    hasLabelledTitle: () => boolean;
    dialogContentRef: { value: DialogContentInstance | null };
    overlayRef: { value: HTMLElement | null };
  }
) {
  const { dialog: globalDialogConfig } = useConfig();
  const titleId = `xy-dialog-title-${Math.random().toString(36).slice(2, 10)}`;
  const bodyId = `xy-dialog-body-${Math.random().toString(36).slice(2, 10)}`;
  const closing = ref(false);
  const downOnOverlay = ref(false);
  const localFullscreen = ref(false);
  let isClosingByBeforeClose = false;

  const dialogElement = computed(() => options.dialogContentRef.value?.dialogRef ?? null);
  const mergedConfig = computed<DialogGlobalConfig>(() => globalDialogConfig.value ?? {});
  const resolvedCloseOnClickModal = computed(
    () => props.closeOnClickModal ?? mergedConfig.value.closeOnClickModal ?? true
  );
  const resolvedCloseOnPressEscape = computed(
    () => props.closeOnPressEscape ?? mergedConfig.value.closeOnPressEscape ?? true
  );
  const resolvedLockScroll = computed(() => props.lockScroll ?? mergedConfig.value.lockScroll ?? true);
  const resolvedAlignCenter = computed(
    () => props.alignCenter ?? mergedConfig.value.alignCenter ?? false
  );
  const resolvedFullscreen = computed(() => props.fullscreen ?? localFullscreen.value);
  const resolvedDraggable = computed(
    () => (props.draggable ?? mergedConfig.value.draggable ?? false) && !resolvedFullscreen.value
  );
  const resolvedOverflow = computed(() => props.overflow ?? mergedConfig.value.overflow ?? false);
  const resolvedResizable = computed(
    () => (props.resizable ?? mergedConfig.value.resizable ?? false) && !resolvedFullscreen.value
  );
  const resolvedMaximizable = computed(
    () => props.maximizable ?? mergedConfig.value.maximizable ?? false
  );
  const resolvedStickyHeader = computed(
    () => props.stickyHeader ?? mergedConfig.value.stickyHeader ?? false
  );
  const resolvedStickyFooter = computed(
    () => props.stickyFooter ?? mergedConfig.value.stickyFooter ?? false
  );
  const resolvedTransition = computed(
    () => props.transition ?? mergedConfig.value.transition
  );

  watch(
    () => props.fullscreen,
    (value) => {
      if (value == null) {
        return;
      }

      localFullscreen.value = value;
    },
    {
      immediate: true
    }
  );

  watch(
    resolvedFullscreen,
    (value, oldValue) => {
      if (value === oldValue) {
        return;
      }

      if (value) {
        options.emitMaximize();
        return;
      }

      options.emitRestore();
    }
  );

  const overlay = useOverlayDialog(
    {
      modelValue: () => props.modelValue,
      destroyOnClose: () => props.destroyOnClose,
      lockScroll: resolvedLockScroll,
      openDelay: () => props.openDelay,
      closeDelay: () => props.closeDelay,
      appendToBody: () => props.appendToBody,
      appendTo: () => props.appendTo,
      modal: () => props.modal,
      zIndex: () => props.zIndex
    },
    {
      onOpen: () => {
        closing.value = false;
        options.emitOpen();
        void nextTick(() => {
          options.overlayRef.value?.scrollTo?.({
            top: 0,
            left: 0
          });
          dialogElement.value?.scrollTo?.({
            top: 0,
            left: 0
          });
        });
      },
      onClose: () => {
        closing.value = true;
        options.emitClose();
      },
      onOpened: () => {
        options.emitOpened();
      },
      onClosed: () => {
        closing.value = false;
        options.emitClosed();
        options.emitUpdateModelValue(false);
      }
    }
  );

  const { customSizeStyle, handleResizeStart, isResizing } = useDialogResizable(dialogElement, {
    width: () => props.width ?? "50%",
    minWidth: () => props.minWidth,
    maxWidth: () => props.maxWidth,
    minHeight: () => props.minHeight,
    maxHeight: () => props.maxHeight,
    enabled: resolvedResizable,
    fullscreen: resolvedFullscreen,
    onResizeStart: (event, size) => {
      options.emitResizeStart(event, size.width, size.height);
    },
    onResize: (event, size) => {
      options.emitResize(event, size.width, size.height);
    },
    onResizeEnd: (event, size) => {
      options.emitResizeEnd(event, size.width, size.height);
    }
  });

  const panelStyle = computed(() => [
    {
      width: resolvedFullscreen.value ? undefined : addUnit(props.width ?? "50%"),
      minWidth: resolvedFullscreen.value ? undefined : addUnit(props.minWidth),
      maxWidth: resolvedFullscreen.value ? undefined : addUnit(props.maxWidth),
      minHeight: resolvedFullscreen.value ? undefined : addUnit(props.minHeight),
      maxHeight: resolvedFullscreen.value ? undefined : addUnit(props.maxHeight)
    },
    customSizeStyle.value
  ]);

  const rootStyle = computed(() => ({
    zIndex: `${overlay.zIndex.value}`,
    "--xy-dialog-margin-top": props.top ?? "15vh"
  }));

  const isPenetrable = computed(
    () => Boolean(props.modalPenetrable) && !overlay.showModal.value && !resolvedFullscreen.value
  );
  const hasLabelledTitle = computed(() => options.hasLabelledTitle());
  const ariaLabelledby = computed(() => hasLabelledTitle.value ? titleId : undefined);
  const ariaLabel = computed(() => hasLabelledTitle.value ? undefined : props.title || undefined);
  const transitionConfig = computed(() =>
    mergeTransitionHooks(resolvedTransition.value, "xy-dialog-fade", {
      onAfterEnter: overlay.handleAfterEnter,
      onAfterLeave: overlay.handleAfterLeave
    })
  );

  const focusTrap = useFocusTrap(dialogElement, {
    active: () => overlay.visible.value,
    autoFocus: "first",
    restoreFocus: true,
    onAutoFocus: () => {
      options.emitOpenAutoFocus();
    },
    onRestoreFocus: () => {
      options.emitCloseAutoFocus();
    }
  });

  function setFullscreen(nextValue: boolean) {
    if (props.fullscreen == null) {
      localFullscreen.value = nextValue;
    }

    options.emitUpdateFullscreen(nextValue);
  }

  function toggleFullscreen() {
    setFullscreen(!resolvedFullscreen.value);
  }

  function finishClose(cancel?: boolean) {
    if (cancel) {
      return;
    }

    overlay.close();
  }

  function handleClose(reason: DialogCloseReason = "programmatic") {
    if (isClosingByBeforeClose || closing.value) {
      return;
    }

    if (!props.beforeClose) {
      finishClose();
      return;
    }

    isClosingByBeforeClose = true;
    let doneCalled = false;
    const done = (cancel?: boolean) => {
      if (doneCalled) {
        return;
      }

      doneCalled = true;
      isClosingByBeforeClose = false;
      finishClose(cancel);
    };

    try {
      const result = props.beforeClose(done, reason);
      if (result && typeof (result as Promise<void>).catch === "function") {
        void (result as Promise<void>).catch(() => {
          isClosingByBeforeClose = false;
        });
      }
    } catch {
      isClosingByBeforeClose = false;
    }
  }

  useDismissibleLayer({
    enabled: () => overlay.visible.value,
    refs: [dialogElement],
    closeOnEscape: resolvedCloseOnPressEscape,
    closeOnOutside: false,
    isTopMost: () => overlay.isTopMost.value,
    onDismiss: () => {
      handleClose("escape");
    }
  });

  function handleOverlayMouseDown(event: MouseEvent) {
    downOnOverlay.value = overlay.showModal.value && event.target === event.currentTarget;
  }

  function handleOverlayMouseUp(event: MouseEvent) {
    downOnOverlay.value = downOnOverlay.value && event.target === event.currentTarget;
  }

  function handleOverlayClick(event: MouseEvent) {
    const canClose =
      overlay.showModal.value &&
      resolvedCloseOnClickModal.value &&
      overlay.isTopMost.value &&
      downOnOverlay.value &&
      event.target === event.currentTarget;

    downOnOverlay.value = false;

    if (canClose) {
      handleClose("backdrop");
    }
  }

  return {
    ariaLabel,
    ariaLabelledby,
    bodyId,
    closing,
    focusTrap,
    handleClose,
    handleOverlayClick,
    handleOverlayMouseDown,
    handleOverlayMouseUp,
    handleResizeStart,
    handleToggleFullscreen: toggleFullscreen,
    isPenetrable,
    isResizing,
    overlay,
    panelStyle,
    resolvedAlignCenter,
    resolvedDraggable,
    resolvedFullscreen,
    resolvedMaximizable,
    resolvedOverflow,
    resolvedResizable,
    resolvedStickyFooter,
    resolvedStickyHeader,
    rootStyle,
    titleId,
    transitionConfig
  };
}
