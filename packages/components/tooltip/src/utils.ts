import type { ReferenceElement } from "@floating-ui/dom";
import type { TooltipTrigger } from "./tooltip";

export function normalizeTooltipTriggers(
  trigger: TooltipTrigger | TooltipTrigger[] | undefined
): TooltipTrigger[] {
  if (!trigger) {
    return ["hover"];
  }

  return Array.isArray(trigger) ? [...trigger] : [trigger];
}

export function includesTooltipTrigger(
  triggers: TooltipTrigger[],
  target: TooltipTrigger
) {
  return triggers.includes(target);
}

export function resolveReferenceElement(
  reference: ReferenceElement | null | undefined
) {
  if (!reference || typeof window === "undefined") {
    return null;
  }

  if (reference instanceof HTMLElement) {
    return reference;
  }

  if ("contextElement" in reference && reference.contextElement instanceof HTMLElement) {
    return reference.contextElement;
  }

  return null;
}

export function isTooltipTriggerKeyMatched(event: KeyboardEvent, triggerKeys: string[]) {
  return triggerKeys.some((value) => {
    if (value === event.key || value === event.code) {
      return true;
    }

    if (value === "Space") {
      return event.key === " " || event.code === "Space";
    }

    if (value === " ") {
      return event.key === " " || event.code === "Space";
    }

    return false;
  });
}
