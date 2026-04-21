export type UploadFileStatus = "ready" | "uploading" | "success" | "fail" | "remove";

export interface UploadFile {
  id?: string;
  name: string;
  size?: number;
  percentage?: number;
  status?: UploadFileStatus;
  url?: string;
  raw?: File;
  response?: unknown;
  error?: string;
}

export interface UploadProps {
  action?: string;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxCount?: number;
  disabled?: boolean;
  draggable?: boolean;
  listType?: "text" | "picture" | "picture-card";
  showFileList?: boolean;
  autoUpload?: boolean;
  withCredentials?: boolean;
  name?: string;
}

export interface UploadEmits {
  (e: "update:fileList", files: UploadFile[]): void;
  (e: "change", file: UploadFile, fileList: UploadFile[]): void;
  (e: "success", response: unknown, file: UploadFile): void;
  (e: "error", error: unknown, file: UploadFile): void;
  (e: "progress", percentage: number, file: UploadFile): void;
  (e: "exceed", file: File, fileList: UploadFile[]): void;
  (e: "remove", file: UploadFile): void;
  (e: "preview", file: UploadFile): void;
}

export type UploadInstance = InstanceType<import("./upload.vue").default>;
