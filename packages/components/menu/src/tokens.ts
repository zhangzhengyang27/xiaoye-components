import type { InjectionKey } from "vue";
import type { MenuProvider, SubMenuProvider } from "./types";

export const menuContextKey = Symbol("xiaoye-menu") as InjectionKey<MenuProvider>;
export const subMenuContextKey = Symbol("xiaoye-sub-menu") as InjectionKey<SubMenuProvider | null>;
