import { withInstall } from "xiaoye-primitives";
import Alert from "./alert.vue";
import type { AlertProps, AlertInstance, AlertType, AlertDisplayMode } from "./alert";

export type { AlertProps, AlertInstance, AlertType, AlertDisplayMode };

export const XyuAlert = withInstall(Alert, "XyuAlert");

export default XyuAlert;
