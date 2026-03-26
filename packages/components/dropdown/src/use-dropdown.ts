import { inject } from "vue";
import { dropdownContextKey } from "./tokens";

export function useDropdown() {
  return inject(dropdownContextKey, null);
}
