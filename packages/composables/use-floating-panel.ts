import {
  autoUpdate,
  arrow as floatingArrow,
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
  placement?: MaybeRefOrGetter<Placement>;
  offset?: MaybeRefOrGetter<number>;
  matchTriggerWidth?: MaybeRefOrGetter<boolean>;
  arrowRef?: Ref<HTMLElement | null>;
  arrowPadding?: number;
  zIndex?: MaybeRefOrGetter<number>;
}

export function useFloatingPanel(
  referenceRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  options: FloatingPanelOptions = {}
) {
  const arrowStyle = ref<Record<string, string>>({});
  const floatingStyle = ref<Record<string, string>>({});
  const actualPlacement = ref<Placement>(toValue(options.placement) ?? "bottom-start");
  let cleanup: (() => void) | null = null;

  async function updatePosition() {
    if (!referenceRef.value || !floatingRef.value) {
      return;
    }

    const middleware = [offset(toValue(options.offset) ?? 10), flip(), shift({ padding: 8 })];

    if (toValue(options.matchTriggerWidth)) {
      middleware.push(
        floatingSize({
          apply({ rects, elements }) {
            elements.floating.style.width = `${rects.reference.width}px`;
          }
        })
      );
    }

    if (options.arrowRef?.value) {
      middleware.push(
        floatingArrow({
          element: options.arrowRef.value,
          padding: options.arrowPadding ?? 8
        })
      );
    }

    const { x, y, placement, middlewareData } = await computePosition(
      referenceRef.value,
      floatingRef.value,
      {
      placement: toValue(options.placement) ?? "bottom-start",
      middleware
      }
    );

    actualPlacement.value = placement;

    const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
    const staticSideMap: Record<string, string> = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right"
    };
    const staticSide = staticSideMap[placement.split("-")[0] ?? "bottom"];

    arrowStyle.value = {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-5px"
    };

    floatingStyle.value = {
      left: `${x}px`,
      top: `${y}px`,
      position: "absolute",
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
    actualPlacement,
    arrowStyle,
    floatingStyle,
    updatePosition,
    startAutoUpdate,
    stopAutoUpdate
  };
}
