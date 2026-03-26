import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { AnchorDirection } from "./anchor";

export interface AnchorLinkState {
  href: string;
  el: HTMLElement;
}

export interface AnchorContext {
  direction: ComputedRef<AnchorDirection>;
  currentAnchor: Ref<string>;
  addLink: (state: AnchorLinkState) => void;
  removeLink: (href: string) => void;
  handleClick: (event: MouseEvent, href?: string) => void;
}

export const anchorContextKey: InjectionKey<AnchorContext> = Symbol("xiaoye-anchor");
