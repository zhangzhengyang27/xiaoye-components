import { withInstallFunction } from "xiaoye-primitives";
import service from "./service";

const XyuMessageBox = withInstallFunction(service, "XyuMessageBox");

export { XyuMessageBox };
export { default as XyuMessageBoxService } from "./service";
export type { MessageBoxOptions, MessageBoxResult } from "./types";
export default XyuMessageBox;
export type { XyuMessageBoxStatic };
