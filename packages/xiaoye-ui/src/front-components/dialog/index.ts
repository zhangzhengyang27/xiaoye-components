import { withInstall } from "xiaoye-primitives";
import Dialog from "./dialog.vue";
import type { DialogProps, DialogInstance, DialogSize, DialogEffect } from "./dialog";

export type { DialogProps, DialogInstance, DialogSize, DialogEffect };

export const XyuDialog = withInstall(Dialog, "XyuDialog");

export default XyuDialog;
