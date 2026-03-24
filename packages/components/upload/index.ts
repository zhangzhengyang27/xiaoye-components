import Upload from "./src/upload.vue";
import type {
  UploadFileItem,
  UploadListType,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadRequestHandler,
  UploadRequestOptions,
  UploadStatus
} from "./src/upload";
import { withInstall } from "@xiaoye/utils";

export type {
  UploadFileItem,
  UploadListType,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadRequestHandler,
  UploadRequestOptions,
  UploadStatus
};

export const XyUpload = withInstall(Upload, "xy-upload");
export default XyUpload;
