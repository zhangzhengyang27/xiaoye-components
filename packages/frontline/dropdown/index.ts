import FrontDropdown from "./src/front-dropdown.vue";
import type { FrontDropdownProps, FrontDropdownSurface } from "./src/dropdown";
import { withInstall } from "@xiaoye/utils";

export type { FrontDropdownProps, FrontDropdownSurface };

export const XyFrontDropdown = withInstall(FrontDropdown, "xy-front-dropdown");
export default XyFrontDropdown;
