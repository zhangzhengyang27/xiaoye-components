import { onBeforeUnmount, onMounted, toValue } from "vue";
import type { MaybeRefOrGetter, Ref } from "vue";

export interface DismissibleLayerOptions {
  enabled: MaybeRefOrGetter<boolean>;
  refs: Array<Ref<HTMLElement | null>>;
  onDismiss: (reason: "escape" | "outside") => void | Promise<void>;
  closeOnEscape?: boolean;
  closeOnOutside?: boolean;
  isTopMost?: () => boolean;
}

export function useDismissibleLayer(options: DismissibleLayerOptions) {
  const handlePointerDown = (event: Event) => {
    if (!toValue(options.enabled)) {
      return;
    }

    if (!options.closeOnOutside) {
      return;
    }

    if (options.isTopMost && !options.isTopMost()) {
      return;
    }

    const target = event.target as Node | null;

    if (!target) {
      return;
    }

    const isInside = options.refs.some((targetRef) => targetRef.value?.contains(target));

    if (!isInside) {
      void options.onDismiss("outside");
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!options.closeOnEscape || !toValue(options.enabled) || event.key !== "Escape") {
      return;
    }

    if (options.isTopMost && !options.isTopMost()) {
      return;
    }

    event.preventDefault();
    void options.onDismiss("escape");
  };

  onMounted(() => {
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeydown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handlePointerDown);
    document.removeEventListener("touchstart", handlePointerDown);
    document.removeEventListener("keydown", handleKeydown);
  });
}
