import { computed } from "vue";

export function useControlled<T>(getter: () => T, setter: (value: T) => void) {
  return computed<T>({
    get: getter,
    set: setter
  });
}
