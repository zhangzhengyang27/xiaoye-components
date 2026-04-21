import { onBeforeUnmount, onMounted, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

export interface DismissibleLayerOptions {
  enabled: MaybeRefOrGetter<boolean>;
  refs: Array<MaybeRefOrGetter<HTMLElement | null>>;
  onDismiss: (reason: "escape" | "outside") => void | Promise<void>;
  closeOnEscape?: MaybeRefOrGetter<boolean | undefined>;
  closeOnOutside?: MaybeRefOrGetter<boolean | undefined>;
  isTopMost?: () => boolean;
}

export function useDismissibleLayer(options: DismissibleLayerOptions) {
  let registered = false;

  const handlePointerDown = (event: Event) => {
    if (!toValue(options.enabled)) {
      return;
    }

    if (!toValue(options.closeOnOutside)) {
      return;
    }

    if (options.isTopMost && !options.isTopMost()) {
      return;
    }

    const target = event.target as Node | null;

    if (!target) {
      return;
    }

    const isInside = options.refs.some((targetRef) => toValue(targetRef)?.contains(target));

    if (!isInside) {
      void options.onDismiss("outside");
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!toValue(options.closeOnEscape) || !toValue(options.enabled) || event.key !== "Escape") {
      return;
    }

    if (options.isTopMost && !options.isTopMost()) {
      return;
    }

    event.preventDefault();
    void options.onDismiss("escape");
  };

  function registerListeners() {
    if (registered || typeof document === "undefined") {
      return;
    }

    registered = true;
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeydown);
  }

  registerListeners();

  onMounted(() => {
    registerListeners();
  });

  onBeforeUnmount(() => {
    if (!registered || typeof document === "undefined") {
      return;
    }

    registered = false;
    document.removeEventListener("mousedown", handlePointerDown);
    document.removeEventListener("touchstart", handlePointerDown);
    document.removeEventListener("keydown", handleKeydown);
  });
}
