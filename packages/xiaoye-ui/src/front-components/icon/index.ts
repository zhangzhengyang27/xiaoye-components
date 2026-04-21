import { withInstall } from "xiaoye-primitives";
import Icon from "./icon.vue";

export interface XyuIconProps {
  icon: string;
  size?: number | string;
  rotate?: number;
  spin?: boolean;
}

export const XyuIcon = withInstall(Icon, "XyuIcon");

export default XyuIcon;
