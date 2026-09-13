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
  immediateExternal?: MaybeRefOrGetter<boolean | undefined>;
  /**
   * 探测面板关闭动画是否仍在播放（仅在真实浏览器检测到 CSS transition/animation 时为 true）。
   * 用于在关闭动画未结束前忽略触发器的 toggle 请求，避免“开→关→又开”的时序错乱。
   */
  isLeaveAnimating?: () => boolean;
}

export interface FloatingVisibilityChangeOptions {
  emitModelValue?: boolean;
  source?: "internal" | "external";
}

/**
 * 读取元素当前计算样式的动画总时长（transition 与 animation 中的最大值，单位毫秒）。
 * 只有真实浏览器把 CSS 规则应用到元素上时才会返回大于 0 的值；
 * jsdom 等无法应用样式表的环境恒返回 0。
 */
export function readFloatingAnimationDuration(element: HTMLElement | null): number {
  if (!element || typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
    return 0;
  }

  const styles = window.getComputedStyle(element);
  const readMaxDuration = (raw: string | null | undefined) =>
    String(raw ?? "")
      .split(",")
      .reduce((max, part) => {
        const seconds = Number.parseFloat(part.trim());
        return Number.isFinite(seconds) && seconds > 0 ? Math.max(max, seconds * 1000) : max;
      }, 0);

  return Math.max(
    readMaxDuration(styles.transitionDuration),
    readMaxDuration(styles.animationDuration)
  );
}

export function useFloatingVisibility(options: FloatingVisibilityOptions = {}) {
  const visible = ref(false);
  const rendered = ref(Boolean(toValue(options.modelValue)) || Boolean(toValue(options.persistent)));
  const isAnimating = ref(false);
  let openTimer: number | null = null;
  let closeTimer: number | null = null;

  function clearTimers() {
    if (openTimer != null) {
      if (typeof window !== "undefined") {
        window.clearTimeout(openTimer);
      }
      openTimer = null;
    }

    if (closeTimer != null) {
      if (typeof window !== "undefined") {
        window.clearTimeout(closeTimer);
      }
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
      isAnimating.value = true;
    }

    if (visible.value === nextVisible) {
      isAnimating.value = false;
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
      openTimer = typeof window !== "undefined"
        ? window.setTimeout(() => {
            setVisible(true, optionsOverride);
          }, delay)
        : null;
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
      closeTimer = typeof window !== "undefined"
        ? window.setTimeout(() => {
            setVisible(false, optionsOverride);
          }, delay)
        : null;
      return;
    }

    setVisible(false, optionsOverride);
  }

  function toggle(optionsOverride: FloatingVisibilityChangeOptions = {}) {
    // 关闭动画仍在播放时（真实浏览器下 after-leave 尚未触发）忽略触发器的 toggle 请求，
    // 防止“开→关→又开/又关”的双重状态切换；无动画环境（如 jsdom）行为保持不变。
    if (!visible.value && options.isLeaveAnimating?.()) {
      return;
    }

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
    isAnimating.value = false;
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

      if (value) {
        open({
          emitModelValue: false,
          source: "external",
          immediate: Boolean(toValue(options.immediateExternal))
        });
        return;
      }

      close({
        emitModelValue: false,
        source: "external",
        immediate: Boolean(toValue(options.immediateExternal))
      });
    },
    {
      immediate: true
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
    isAnimating,
    clearTimers,
    setVisible,
    open,
    close,
    toggle,
    handleAfterLeave
  };
}
