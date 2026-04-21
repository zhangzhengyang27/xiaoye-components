import { computed } from "vue";
import { DEFAULT_NAMESPACE } from "./shared-context";

export function useConfig() {
  return {
    namespace: computed(() => DEFAULT_NAMESPACE),
    size: computed(() => "md"),
    zIndex: computed(() => 2000),
    locale: computed(() => ({})),
    dialog: computed(() => ({})),
    loading: computed(() => ({})),
    message: computed(() => ({})),
    notification: computed(() => ({}))
  };
}
