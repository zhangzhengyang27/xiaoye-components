import Anchor from "./src/anchor.vue";
import AnchorLink from "./src/anchor-link.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type { AnchorContainer, AnchorDirection, AnchorInstance, AnchorProps } from "./src/anchor";
import type { AnchorLinkProps } from "./src/anchor-link";

export type { AnchorContainer, AnchorDirection, AnchorInstance, AnchorLinkProps, AnchorProps };

export const XyAnchorLink = withInstall(AnchorLink, "xy-anchor-link");

export const XyAnchor = withInstall(Anchor, "xy-anchor") as SFCWithInstall<typeof Anchor> & {
  Link: typeof XyAnchorLink;
};

XyAnchor.Link = XyAnchorLink;

export default XyAnchor;
