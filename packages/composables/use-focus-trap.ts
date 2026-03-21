import { nextTick, onBeforeUnmount, toValue, watch } from "vue";
import type { MaybeRefOrGetter, Ref } from "vue";
import { focusFirstDescendant, trapFocus } from "@xiaoye/utils";

export interface FocusTrapOptions {
  active: MaybeRefOrGetter<boolean>;
  autoFocus?: "first" | "container" | false;
  restoreFocus?: boolean;
}

export function useFocusTrap(
  containerRef: Ref<HTMLElement | null>,
  options: FocusTrapOptions
) {
  let lastFocusedElement: HTMLElement | null = null;

  async function focusOnOpen() {
    await nextTick();

    if (options.autoFocus === "container") {
      containerRef.value?.focus();
      return;
    }

    if (options.autoFocus === false) {
      return;
    }

    if (!focusFirstDescendant(containerRef.value)) {
      containerRef.value?.focus();
    }
  }

  async function restoreOnClose() {
    if (!options.restoreFocus || !lastFocusedElement) {
      return;
    }

    await nextTick();
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!toValue(options.active) || event.key !== "Tab") {
      return;
    }

    trapFocus(containerRef.value, event);
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

  onBeforeUnmount(() => {
    lastFocusedElement = null;
  });

  return {
    handleKeydown,
    restoreOnClose
  };
}
