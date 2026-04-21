import { withInstall } from "xiaoye-primitives";
import Link from "./link.vue";
import type { LinkProps, LinkInstance, LinkType, LinkUnderline } from "./link";

export type { LinkProps, LinkInstance, LinkType, LinkUnderline };

export const XyuLink = withInstall(Link, "XyuLink");

export default XyuLink;
