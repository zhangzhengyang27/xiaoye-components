import { withInstall } from "xiaoye-primitives";
import Cascader from "./cascader.vue";
import type { CascaderProps, CascaderEmits, CascaderInstance, CascaderOption } from "./cascader";

export type { CascaderProps, CascaderEmits, CascaderInstance, CascaderOption };

export const XyuCascader = withInstall(Cascader, "XyuCascader");

export default XyuCascader;
