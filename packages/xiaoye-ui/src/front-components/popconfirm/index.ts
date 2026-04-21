import { withInstall } from "xiaoye-primitives";
import Popconfirm from "./popconfirm.vue";
import type { PopconfirmProps, PopconfirmEmits, PopconfirmInstance } from "./popconfirm";

export type { PopconfirmProps, PopconfirmEmits, PopconfirmInstance };

export const XyuPopconfirm = withInstall(Popconfirm, "XyuPopconfirm");

export default XyuPopconfirm;
