import Link from "./src/link.vue";
import type {
  LinkClickHandler,
  LinkProps,
  LinkTarget,
  LinkType,
  LinkUnderline,
  LinkUnderlineMode
} from "./src/link";
import { withInstall } from "@xiaoye/primitives";

export type { LinkClickHandler, LinkProps, LinkTarget, LinkType, LinkUnderline, LinkUnderlineMode };

export const XyLink = withInstall(Link, "xy-link");
export default XyLink;
