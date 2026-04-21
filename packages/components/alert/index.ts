import Alert from "./src/alert.vue";
import type {
  AlertAutoCloseHandler,
  AlertCloseHandler,
  AlertCloseReason,
  AlertEffect,
  AlertModelValueChangeHandler,
  AlertOverflowStrategy,
  AlertProps,
  AlertServiceSnapshot,
  AlertServiceSnapshotEntry,
  AlertType,
  AlertVariant
} from "./src/alert";
import type {
  AlertBeforeCloseFn,
  AlertDoneFn,
  AlertServiceClosedFn,
  AlertServiceHandle,
  AlertServiceOptions,
  AlertServiceUpdateOptions
} from "./src/alert";
import { XyAlertService } from "./src/service";
import type { AlertService } from "./src/service";
import { withInstall } from "@xiaoye/primitives";

export type {
  AlertAutoCloseHandler,
  AlertBeforeCloseFn,
  AlertCloseHandler,
  AlertCloseReason,
  AlertDoneFn,
  AlertEffect,
  AlertModelValueChangeHandler,
  AlertOverflowStrategy,
  AlertProps,
  AlertService,
  AlertServiceClosedFn,
  AlertServiceHandle,
  AlertServiceOptions,
  AlertServiceSnapshot,
  AlertServiceSnapshotEntry,
  AlertServiceUpdateOptions,
  AlertType,
  AlertVariant
};

export const XyAlert = withInstall(Alert, "xy-alert");
export { XyAlertService };
export default XyAlert;
