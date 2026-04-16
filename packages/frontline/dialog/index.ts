import FrontDialog from "./src/front-dialog.vue";
import type { FrontDialogProps, FrontDialogSize, FrontDialogSurface } from "./src/dialog";
import { withInstall } from "@xiaoye/utils";

export type { FrontDialogProps, FrontDialogSize, FrontDialogSurface };

export const XyFrontDialog = withInstall(FrontDialog, "xy-front-dialog");
export default XyFrontDialog;
