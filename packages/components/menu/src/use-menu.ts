import { computed, inject } from "vue";
import { menuContextKey, subMenuContextKey } from "./tokens";

export function useMenu(index: () => string) {
  const rootMenu = inject(menuContextKey, null);
  const parentSubMenu = inject(subMenuContextKey, null);

  const indexPath = computed(() => {
    const value = index();

    if (!value) {
      return parentSubMenu?.indexPath.value ?? [];
    }

    return [...(parentSubMenu?.indexPath.value ?? []), value];
  });

  const level = computed(() => parentSubMenu?.level ?? 0);

  return {
    rootMenu,
    parentSubMenu,
    indexPath,
    level
  };
}
