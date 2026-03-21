import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size as floatingSize
} from "@floating-ui/dom";
import { ref, toValue } from "vue";
import type { Placement } from "@floating-ui/dom";
import type { MaybeRefOrGetter, Ref } from "vue";

export interface FloatingPanelOptions {
  placement?: Placement;
  offset?: number;
  matchTriggerWidth?: boolean;
  zIndex?: MaybeRefOrGetter<number>;
}

export function useFloatingPanel(
  referenceRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  options: FloatingPanelOptions = {}
) {
  const floatingStyle = ref<Record<string, string>>({});
  let cleanup: (() => void) | null = null;

  async function updatePosition() {
    if (!referenceRef.value || !floatingRef.value) {
      return;
    }

    const middleware = [offset(options.offset ?? 10), flip(), shift({ padding: 8 })];

    if (options.matchTriggerWidth) {
      middleware.push(
        floatingSize({
          apply({ rects, elements }) {
            elements.floating.style.width = `${rects.reference.width}px`;
          }
        })
      );
    }

    const { x, y } = await computePosition(referenceRef.value, floatingRef.value, {
      placement: options.placement ?? "bottom-start",
      middleware
    });

    floatingStyle.value = {
      left: `${x}px`,
      top: `${y}px`,
      position: "fixed",
      zIndex: `${toValue(options.zIndex) ?? 2000}`
    };
  }

  function startAutoUpdate() {
    stopAutoUpdate();

    if (!referenceRef.value || !floatingRef.value) {
      return;
    }

    cleanup = autoUpdate(referenceRef.value, floatingRef.value, updatePosition);
  }

  function stopAutoUpdate() {
    cleanup?.();
    cleanup = null;
  }

  return {
    floatingStyle,
    updatePosition,
    startAutoUpdate,
    stopAutoUpdate
  };
}
