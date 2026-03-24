import Scheduler from "./src/scheduler.vue";
import type {
  SchedulerDateClickPayload,
  SchedulerDateInput,
  SchedulerDropPayload,
  SchedulerDateSelectPayload,
  SchedulerDayCellContentSlotProps,
  SchedulerEvent,
  SchedulerEventChangePayload,
  SchedulerEventClickPayload,
  SchedulerEventContentSlotProps,
  SchedulerEventReceivePayload,
  SchedulerProps,
  SchedulerRRuleInput,
  SchedulerView,
  SchedulerViewChangePayload
} from "./src/scheduler";
import { withInstall } from "@xiaoye/utils";

export type {
  SchedulerDateClickPayload,
  SchedulerDateInput,
  SchedulerDropPayload,
  SchedulerDateSelectPayload,
  SchedulerDayCellContentSlotProps,
  SchedulerEvent,
  SchedulerEventChangePayload,
  SchedulerEventClickPayload,
  SchedulerEventContentSlotProps,
  SchedulerEventReceivePayload,
  SchedulerProps,
  SchedulerRRuleInput,
  SchedulerView,
  SchedulerViewChangePayload
};

export const XyScheduler = withInstall(Scheduler, "xy-scheduler");
export default XyScheduler;
