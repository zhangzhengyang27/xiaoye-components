import Dialog from "./src/dialog.vue";
import type {
  DialogBeforeCloseFn,
  DialogCloseReason,
  DialogFullscreenChangeHandler,
  DialogGlobalConfig,
  DialogModelValueChangeHandler,
  DialogProps,
  DialogResizeHandler
} from "./src/dialog";
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
import { withInstall } from "@xiaoye/primitives";

export type {
  DialogAlertOptions,
  DialogBeforeCloseFn,
  DialogCloseReason,
  DialogConfirmOptions,
  DialogFullscreenChangeHandler,
  DialogGlobalConfig,
  DialogModelValueChangeHandler,
  DialogPromptOptions,
  DialogProps,
  DialogResizeHandler,
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
