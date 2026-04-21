import Cascader from "./src/cascader.vue";
import type {
  CascaderInstance,
  CascaderFieldNames,
  CascaderKey,
  CascaderLoadFunction,
  CascaderOptionData,
  CascaderProps,
  CascaderSearchChangeHandler,
  CascaderValue
  ,
  CascaderValueChangeHandler,
  CascaderVisibleChangeHandler
} from "./src/cascader";
import { withInstall } from "@xiaoye/primitives";

export type {
  CascaderInstance,
  CascaderFieldNames,
  CascaderKey,
  CascaderLoadFunction,
  CascaderOptionData,
  CascaderProps,
  CascaderSearchChangeHandler,
  CascaderValue
  ,
  CascaderValueChangeHandler,
  CascaderVisibleChangeHandler
};

export const XyCascader = withInstall(Cascader, "xy-cascader");
export default XyCascader;
