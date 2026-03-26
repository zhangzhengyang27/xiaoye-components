import Alert from "./src/alert.vue";
import type {
  AlertCloseReason,
  AlertEffect,
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
import { withInstall } from "@xiaoye/utils";

export type {
  AlertBeforeCloseFn,
  AlertCloseReason,
  AlertDoneFn,
  AlertEffect,
  AlertOverflowStrategy,
  AlertProps,
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
