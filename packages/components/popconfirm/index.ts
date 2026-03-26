import Popconfirm from "./src/popconfirm.vue";
import type {
  PopconfirmAction,
  PopconfirmActionContext,
  PopconfirmButtonType,
  PopconfirmEffect,
  PopconfirmHook,
  PopconfirmInstance,
  PopconfirmProps
} from "./src/popconfirm";
import { withInstall } from "@xiaoye/utils";

export type {
  PopconfirmAction,
  PopconfirmActionContext,
  PopconfirmButtonType,
  PopconfirmEffect,
  PopconfirmHook,
  PopconfirmInstance,
  PopconfirmProps
};

export const XyPopconfirm = withInstall(Popconfirm, "xy-popconfirm");
export default XyPopconfirm;
