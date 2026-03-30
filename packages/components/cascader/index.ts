import Cascader from "./src/cascader.vue";
import type {
  CascaderFieldNames,
  CascaderKey,
  CascaderLoadFunction,
  CascaderOptionData,
  CascaderProps,
  CascaderValue
} from "./src/cascader";
import { withInstall } from "@xiaoye/utils";

export type {
  CascaderFieldNames,
  CascaderKey,
  CascaderLoadFunction,
  CascaderOptionData,
  CascaderProps,
  CascaderValue
};

export const XyCascader = withInstall(Cascader, "xy-cascader");
export default XyCascader;
