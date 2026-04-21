import { withInstall } from "xiaoye-primitives";
import Upload from "./upload.vue";
import type { UploadProps, UploadEmits, UploadInstance, UploadFile } from "./upload";

export type { UploadProps, UploadEmits, UploadInstance, UploadFile };

export const XyuUpload = withInstall(Upload, "XyuUpload");

export default XyuUpload;
