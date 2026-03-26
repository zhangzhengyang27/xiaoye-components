import Dialog from "./src/dialog.vue";
import type { DialogBeforeCloseFn, DialogCloseReason, DialogGlobalConfig, DialogProps } from "./src/dialog";
import type { DialogContentInstance } from "./src/dialog-content";
import type {
  DialogAlertOptions,
  DialogConfirmOptions,
  DialogPromptOptions,
  DialogServiceHandle,
  DialogServiceOpenOptions,
  DialogServiceResult,
  DialogServiceUpdateOptions
} from "./src/dialog-service";
import { XyDialogService } from "./src/service";
import { withInstall } from "@xiaoye/utils";

export type {
  DialogAlertOptions,
  DialogBeforeCloseFn,
  DialogCloseReason,
  DialogConfirmOptions,
  DialogGlobalConfig,
  DialogPromptOptions,
  DialogProps,
  DialogServiceHandle,
  DialogServiceOpenOptions,
  DialogServiceResult,
  DialogServiceUpdateOptions
};
export type DialogInstance = InstanceType<typeof Dialog> & {
  dialogContentRef: DialogContentInstance | null;
};

export const XyDialog = withInstall(Dialog, "xy-dialog");
export { XyDialogService };
export default XyDialog;
