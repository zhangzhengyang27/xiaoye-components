import type Affix from "./affix.vue";

export const affixPositions = ["top", "bottom"] as const;

export type AffixPosition = (typeof affixPositions)[number];
export type AffixZIndex = number | string;

export interface AffixScrollPayload {
  scrollTop: number;
  fixed: boolean;
}

export interface AffixProps {
  zIndex?: AffixZIndex;
  target?: string;
  offset?: number;
  position?: AffixPosition;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
}

export type AffixInstance = InstanceType<typeof Affix>;
