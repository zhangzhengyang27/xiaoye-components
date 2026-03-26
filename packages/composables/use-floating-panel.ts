import {
  autoUpdate,
  arrow as floatingArrow,
  computePosition,
  flip,
  offset,
  shift,
  size as floatingSize
} from "@floating-ui/dom";
import { ref, toRaw, toValue } from "vue";
import type { Placement, ReferenceElement, Strategy } from "@floating-ui/dom";
import type { MaybeRefOrGetter, Ref } from "vue";

export interface FloatingPanelOptions {
  placement?: MaybeRefOrGetter<Placement>;
  strategy?: MaybeRefOrGetter<Strategy>;
  offset?: MaybeRefOrGetter<number>;
  matchTriggerWidth?: MaybeRefOrGetter<boolean>;
  arrowRef?: Ref<HTMLElement | null>;
  arrowPadding?: number;
  shiftPadding?: MaybeRefOrGetter<number>;
  flip?: MaybeRefOrGetter<boolean>;
  fallbackPlacements?: MaybeRefOrGetter<Placement[] | undefined>;
  zIndex?: MaybeRefOrGetter<number>;
}

export function useFloatingPanel(
  referenceRef: Ref<ReferenceElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  options: FloatingPanelOptions = {}
) {
  const arrowStyle = ref<Record<string, string>>({});
  const floatingStyle = ref<Record<string, string>>({});
  const actualPlacement = ref<Placement>(toValue(options.placement) ?? "bottom-start");
  let cleanup: (() => void) | null = null;

  async function updatePosition() {
    const reference = referenceRef.value ? toRaw(referenceRef.value) : null;
    const floating = floatingRef.value ? toRaw(floatingRef.value) : null;

    if (!reference || !floating) {
      return;
    }

    const middleware = [offset(toValue(options.offset) ?? 10)];

    if (toValue(options.flip) ?? true) {
      const fallbackPlacements = toValue(options.fallbackPlacements);
      middleware.push(
        fallbackPlacements && fallbackPlacements.length > 0
          ? flip({
              fallbackPlacements
            })
          : flip()
      );
    }

    middleware.push(shift({ padding: toValue(options.shiftPadding) ?? 8 }));

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

    let x = 0;
    let y = 0;
    let placement = toValue(options.placement) ?? "bottom-start";
    let middlewareData: Record<string, unknown> = {};

    try {
      const result = await computePosition(reference, floating, {
        placement,
        strategy: toValue(options.strategy) ?? "absolute",
        middleware
      });

      x = result.x;
      y = result.y;
      placement = result.placement;
      middlewareData = result.middlewareData;
    } catch {
      return;
    }

    actualPlacement.value = placement;

    const { x: arrowX, y: arrowY } = (middlewareData.arrow as { x?: number; y?: number } | undefined) ?? {};
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
      position: toValue(options.strategy) ?? "absolute",
      zIndex: `${toValue(options.zIndex) ?? 2000}`
    };
  }

  function startAutoUpdate() {
    stopAutoUpdate();

    const reference = referenceRef.value ? toRaw(referenceRef.value) : null;
    const floating = floatingRef.value ? toRaw(floatingRef.value) : null;

    if (!reference || !floating) {
      return;
    }

    const referenceElement =
      reference instanceof Element
        ? reference
        : reference.contextElement ?? null;

    if (!referenceElement) {
      return;
    }

    cleanup = autoUpdate(referenceElement, floating, updatePosition);
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
