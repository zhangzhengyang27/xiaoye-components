import { nextTick, onBeforeUnmount, onMounted, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { focusFirstDescendant, trapFocus } from "@xiaoye/utils";

export type FocusTrapFocusReason = "pointer" | "keyboard" | null;

export interface FocusTrapFocusoutPreventedEvent {
  detail: {
    focusReason: FocusTrapFocusReason;
  };
  readonly defaultPrevented: boolean;
  preventDefault: () => void;
}

export interface FocusTrapOptions {
  active: MaybeRefOrGetter<boolean>;
  autoFocus?: "first" | "container" | false;
  restoreFocus?: boolean;
  onAutoFocus?: () => void;
  onRestoreFocus?: () => void;
  onReleaseRequested?: (event: KeyboardEvent) => void;
  onFocusoutPrevented?: (event: FocusTrapFocusoutPreventedEvent) => void;
}

export function useFocusTrap(
  containerRef: MaybeRefOrGetter<HTMLElement | null>,
  options: FocusTrapOptions
) {
  let lastFocusedElement: HTMLElement | null = null;
  let lastFocusedInsideElement: HTMLElement | null = null;
  let lastFocusReason: FocusTrapFocusReason = null;
  let currentContainer: HTMLElement | null = null;

  function createFocusoutPreventedEvent(): FocusTrapFocusoutPreventedEvent {
    let prevented = false;

    return {
      detail: {
        focusReason: lastFocusReason
      },
      get defaultPrevented() {
        return prevented;
      },
      preventDefault() {
        prevented = true;
      }
    };
  }

  function restoreFocusInside(container: HTMLElement | null) {
    if (!container) {
      return;
    }

    if (lastFocusedInsideElement && container.contains(lastFocusedInsideElement)) {
      lastFocusedInsideElement.focus();
      return;
    }

    if (!focusFirstDescendant(container)) {
      container.focus();
    }
  }

  function handleDocumentPointerDown() {
    lastFocusReason = "pointer";
  }

  function handleDocumentKeydown() {
    lastFocusReason = "keyboard";
  }

  function handleFocusIn(event: FocusEvent) {
    if (!toValue(options.active)) {
      return;
    }

    const container = toValue(containerRef);
    const target = event.target;

    if (!container || !(target instanceof HTMLElement) || !container.contains(target)) {
      return;
    }

    lastFocusedInsideElement = target;
  }

  function handleFocusOut(event: FocusEvent) {
    if (!toValue(options.active)) {
      return;
    }

    const container = toValue(containerRef);
    const relatedTarget = event.relatedTarget;

    if (!container) {
      return;
    }

    if (relatedTarget instanceof HTMLElement && container.contains(relatedTarget)) {
      return;
    }

    window.setTimeout(() => {
      if (!toValue(options.active)) {
        return;
      }

      const latestContainer = toValue(containerRef);
      const activeElement = document.activeElement;

      if (!latestContainer) {
        return;
      }

      if (activeElement instanceof HTMLElement && latestContainer.contains(activeElement)) {
        lastFocusedInsideElement = activeElement;
        return;
      }

      const focusoutPreventedEvent = createFocusoutPreventedEvent();
      options.onFocusoutPrevented?.(focusoutPreventedEvent);

      if (focusoutPreventedEvent.defaultPrevented) {
        return;
      }

      restoreFocusInside(latestContainer);
    }, 0);
  }

  function bindContainer(container: HTMLElement | null) {
    if (currentContainer === container) {
      return;
    }

    if (currentContainer) {
      currentContainer.removeEventListener("focusin", handleFocusIn);
      currentContainer.removeEventListener("focusout", handleFocusOut);
    }

    currentContainer = container;

    if (currentContainer) {
      currentContainer.addEventListener("focusin", handleFocusIn);
      currentContainer.addEventListener("focusout", handleFocusOut);
    }
  }

  async function focusOnOpen() {
    await nextTick();
    const container = toValue(containerRef);
    lastFocusedInsideElement = null;

    if (options.autoFocus === "container") {
      container?.focus();
      options.onAutoFocus?.();
      return;
    }

    if (options.autoFocus === false) {
      return;
    }

    if (!focusFirstDescendant(container)) {
      container?.focus();
    }
    options.onAutoFocus?.();
  }

  async function restoreOnClose() {
    if (!options.restoreFocus || !lastFocusedElement) {
      return;
    }

    await nextTick();
    lastFocusedElement.focus();
    options.onRestoreFocus?.();
    lastFocusedElement = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!toValue(options.active)) {
      return;
    }

    if (event.key === "Escape") {
      options.onReleaseRequested?.(event);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    trapFocus(toValue(containerRef), event);
  }

  watch(
    () => toValue(options.active),
    async (value) => {
      if (value) {
        lastFocusedElement =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        await focusOnOpen();
        return;
      }

      await restoreOnClose();
    },
    {
      immediate: true
    }
  );

  watch(
    () => toValue(containerRef),
    (container) => {
      bindContainer(container);
    },
    {
      immediate: true
    }
  );

  onMounted(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.addEventListener("mousedown", handleDocumentPointerDown, true);
    document.addEventListener("touchstart", handleDocumentPointerDown, true);
    document.addEventListener("keydown", handleDocumentKeydown, true);
  });

  onBeforeUnmount(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("mousedown", handleDocumentPointerDown, true);
      document.removeEventListener("touchstart", handleDocumentPointerDown, true);
      document.removeEventListener("keydown", handleDocumentKeydown, true);
    }

    bindContainer(null);
    lastFocusedElement = null;
    lastFocusedInsideElement = null;
    lastFocusReason = null;
  });

  return {
    handleKeydown,
    restoreOnClose
  };
}
