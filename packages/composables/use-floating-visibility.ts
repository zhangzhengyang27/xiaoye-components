import { ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";

export interface FloatingVisibilityOptions {
  modelValue?: MaybeRefOrGetter<boolean | undefined>;
  disabled?: MaybeRefOrGetter<boolean | undefined>;
  persistent?: MaybeRefOrGetter<boolean | undefined>;
  openDelay?: MaybeRefOrGetter<number | undefined>;
  closeDelay?: MaybeRefOrGetter<number | undefined>;
  beforeOpen?: (source: "internal" | "external") => void;
  beforeClose?: (source: "internal" | "external") => void;
  emitModelValue?: (value: boolean) => void;
  onOpen?: (source: "internal" | "external") => void;
  onClose?: (source: "internal" | "external") => void;
}

export interface FloatingVisibilityChangeOptions {
  emitModelValue?: boolean;
  source?: "internal" | "external";
}

export function useFloatingVisibility(options: FloatingVisibilityOptions = {}) {
  const visible = ref(toValue(options.modelValue) ?? false);
  const rendered = ref(visible.value || Boolean(toValue(options.persistent)));
  let openTimer: number | null = null;
  let closeTimer: number | null = null;

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

  function setVisible(
    nextVisible: boolean,
    { emitModelValue = true, source = "internal" }: FloatingVisibilityChangeOptions = {}
  ) {
    clearTimers();

    if (nextVisible) {
      rendered.value = true;
    }

    if (visible.value === nextVisible) {
      return;
    }

    if (nextVisible) {
      options.beforeOpen?.(source);
    } else {
      options.beforeClose?.(source);
    }

    visible.value = nextVisible;

    if (emitModelValue) {
      options.emitModelValue?.(nextVisible);
    }

    if (nextVisible) {
      options.onOpen?.(source);
      return;
    }

    options.onClose?.(source);
  }

  function open(
    optionsOverride: FloatingVisibilityChangeOptions & { immediate?: boolean } = {}
  ) {
    if (toValue(options.disabled)) {
      return;
    }

    clearTimers();

    if (visible.value) {
      return;
    }

    const delay = optionsOverride.immediate ? 0 : (toValue(options.openDelay) ?? 0);

    if (delay > 0) {
      openTimer = window.setTimeout(() => {
        setVisible(true, optionsOverride);
      }, delay);
      return;
    }

    setVisible(true, optionsOverride);
  }

  function close(
    optionsOverride: FloatingVisibilityChangeOptions & { immediate?: boolean } = {}
  ) {
    clearTimers();

    const delay = optionsOverride.immediate ? 0 : (toValue(options.closeDelay) ?? 0);

    if (delay > 0) {
      closeTimer = window.setTimeout(() => {
        setVisible(false, optionsOverride);
      }, delay);
      return;
    }

    setVisible(false, optionsOverride);
  }

  function toggle(optionsOverride: FloatingVisibilityChangeOptions = {}) {
    if (visible.value) {
      close({
        ...optionsOverride,
        immediate: true
      });
      return;
    }

    open({
      ...optionsOverride,
      immediate: true
    });
  }

  function handleAfterLeave() {
    if (!toValue(options.persistent) && !visible.value) {
      rendered.value = false;
    }
  }

  watch(
    () => toValue(options.modelValue),
    (value) => {
      if (value == null) {
        return;
      }

      setVisible(Boolean(value), {
        emitModelValue: false,
        source: "external"
      });
    }
  );

  watch(
    () => toValue(options.persistent),
    (value) => {
      if (value) {
        rendered.value = true;
        return;
      }

      if (!visible.value) {
        rendered.value = false;
      }
    }
  );

  watch(
    () => toValue(options.disabled),
    (value) => {
      if (value && visible.value) {
        close({
          immediate: true
        });
      }
    }
  );

  return {
    visible,
    rendered,
    clearTimers,
    setVisible,
    open,
    close,
    toggle,
    handleAfterLeave
  };
}
