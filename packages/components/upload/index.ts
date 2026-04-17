import Upload from "./src/upload.vue";
import type {
  UploadFileItem,
  UploadInstance,
  UploadListType,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadRemoveOptions,
  UploadRequestHandler,
  UploadRequestOptions,
  UploadStatus
} from "./src/upload";
import { withInstall } from "@xiaoye/utils";

export type {
  UploadFileItem,
  UploadInstance,
  UploadListType,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadRemoveOptions,
  UploadRequestHandler,
  UploadRequestOptions,
  UploadStatus
};

export const XyUpload = withInstall(Upload, "xy-upload");
export default XyUpload;
