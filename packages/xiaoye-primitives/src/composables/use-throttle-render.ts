import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { Ref } from "vue";

export interface ThrottleRenderOptions {
  leading?: number;
  trailing?: number;
  initVal?: boolean;
}

export type ThrottleType = number | ThrottleRenderOptions;

export function useThrottleRender(
  loading: Ref<boolean>,
  throttle: ThrottleType = 0
) {
  if (throttle === 0 || throttle === undefined) {
    return loading;
  }

  const initialValue =
    typeof throttle === "object" && throttle !== null ? Boolean(throttle.initVal) : false;
  const throttled = ref(initialValue);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function clearTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function dispatch(delay: number | undefined) {
    if (delay === undefined) {
      clearTimer();
      throttled.value = loading.value;
      return;
    }

    clearTimer();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      throttled.value = loading.value;
    }, delay);
  }

  function trigger(type: "leading" | "trailing") {
    if (type === "leading") {
      if (typeof throttle === "number") {
        dispatch(throttle);
      } else {
        dispatch(throttle.leading);
      }

      return;
    }

    if (typeof throttle === "object" && throttle !== null) {
      dispatch(throttle.trailing);
      return;
    }

    clearTimer();
    throttled.value = false;
  }

  onMounted(() => {
    trigger("leading");
  });

  watch(
    () => loading.value,
    (value) => {
      trigger(value ? "leading" : "trailing");
    }
  );

  onBeforeUnmount(() => {
    clearTimer();
  });

  return throttled;
}
