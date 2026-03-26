import type Anchor from "./anchor.vue";

export const anchorDirections = ["vertical", "horizontal"] as const;

export type AnchorDirection = (typeof anchorDirections)[number];
export type AnchorContainer = string | HTMLElement | Window | null;

export interface AnchorProps {
  container?: AnchorContainer;
  offset?: number;
  bound?: number;
  duration?: number;
  marker?: boolean;
  direction?: AnchorDirection;
  syncHash?: boolean;
}

export type AnchorInstance = InstanceType<typeof Anchor>;
