import Upload from "./src/upload.vue";
import type { UploadProps, UploadFileItem } from "./src/upload.vue";
import { withInstall } from "@xiaoye/utils";

export type { UploadProps, UploadFileItem };

export const XyUpload = withInstall(Upload, "xy-upload");
export default XyUpload;

