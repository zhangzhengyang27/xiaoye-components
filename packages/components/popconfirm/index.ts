import Popconfirm from "./src/popconfirm.vue";
import type {
  PopconfirmAction,
  PopconfirmActionHandler,
  PopconfirmActionContext,
  PopconfirmButtonType,
  PopconfirmEffect,
  PopconfirmHook,
  PopconfirmInstance,
  PopconfirmModelValueChangeHandler,
  PopconfirmProps
  ,
  PopconfirmSlotProps
} from "./src/popconfirm";
import { withInstall } from "@xiaoye/utils";

export type {
  PopconfirmAction,
  PopconfirmActionHandler,
  PopconfirmActionContext,
  PopconfirmButtonType,
  PopconfirmEffect,
  PopconfirmHook,
  PopconfirmInstance,
  PopconfirmModelValueChangeHandler,
  PopconfirmProps
  ,
  PopconfirmSlotProps
};

export const XyPopconfirm = withInstall(Popconfirm, "xy-popconfirm");
export default XyPopconfirm;
