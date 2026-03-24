import type { ComponentSize } from "@xiaoye/utils";

export type UploadStatus = "ready" | "uploading" | "success" | "fail";
export type Awaitable<T> = T | Promise<T>;
export type UploadListType = "text" | "picture" | "picture-card";

export interface UploadRawFile extends File {
  uid: string;
}

export interface UploadFileItem {
  uid: string;
  name: string;
  size: number;
  type?: string;
  status?: UploadStatus;
  percentage?: number;
  response?: unknown;
  url?: string;
  raw?: UploadRawFile;
}

export interface UploadProgressEvent extends ProgressEvent {
  percent: number;
}

export interface UploadRequestOptions {
  action: string;
  method: string;
  data: Record<string, unknown>;
  filename: string;
  file: UploadRawFile;
  headers: Record<string, string | number | boolean | null | undefined>;
  withCredentials: boolean;
  onProgress: (event: UploadProgressEvent) => void;
  onSuccess: (response: unknown) => void;
  onError: (error: Error) => void;
}

export type UploadRequestHandler = (
  options: UploadRequestOptions
) => XMLHttpRequest | Promise<unknown> | void;

export interface UploadProps {
  fileList?: UploadFileItem[];
  action?: string;
  headers?: Record<string, string | number | boolean | null | undefined>;
  method?: string;
  data?:
    | Awaitable<Record<string, unknown>>
    | ((file: UploadRawFile) => Awaitable<Record<string, unknown>>);
  name?: string;
  accept?: string;
  multiple?: boolean;
  limit?: number;
  disabled?: boolean;
  drag?: boolean;
  tip?: string;
  size?: ComponentSize;
  autoUpload?: boolean;
  showFileList?: boolean;
  withCredentials?: boolean;
  listType?: UploadListType;
  beforeUpload?: (
    file: UploadRawFile
  ) => Awaitable<boolean | void | null | undefined | File | Blob>;
  beforeRemove?: (file: UploadFileItem, files: UploadFileItem[]) => Awaitable<boolean>;
  onRemove?: (file: UploadFileItem, files: UploadFileItem[]) => void;
  onChange?: (file: UploadFileItem, files: UploadFileItem[]) => void;
  onPreview?: (file: UploadFileItem) => void;
  onSuccess?: (response: unknown, file: UploadFileItem, files: UploadFileItem[]) => void;
  onProgress?: (event: UploadProgressEvent, file: UploadFileItem, files: UploadFileItem[]) => void;
  onError?: (error: Error, file: UploadFileItem, files: UploadFileItem[]) => void;
  onExceed?: (files: File[], filesList: UploadFileItem[]) => void;
  httpRequest?: UploadRequestHandler;
}

let uploadSeed = 0;

export function genFileId() {
  uploadSeed += 1;
  return `xy-upload-${Date.now()}-${uploadSeed}`;
}

export function ajaxUpload(options: UploadRequestOptions) {
  if (!options.action || options.action === "#") {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        options.onProgress({
          lengthComputable: true,
          loaded: options.file.size,
          total: options.file.size,
          percent: 100
        } as UploadProgressEvent);
        options.onSuccess({ ok: true });
        resolve({ ok: true });
      }, 0);
    });
  }

  const xhr = new XMLHttpRequest();
  xhr.open(options.method.toUpperCase(), options.action, true);
  xhr.withCredentials = options.withCredentials;

  Object.entries(options.headers).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    xhr.setRequestHeader(key, String(value));
  });

  xhr.upload.addEventListener("progress", (event) => {
    const percent = event.total ? (event.loaded / event.total) * 100 : 0;
    options.onProgress(
      Object.assign(event, {
        percent
      }) as UploadProgressEvent
    );
  });

  xhr.addEventListener("error", () => {
    options.onError(new Error("上传失败"));
  });

  xhr.addEventListener("abort", () => {
    options.onError(new Error("上传已取消"));
  });

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const responseText = xhr.responseText;

      try {
        options.onSuccess(responseText ? JSON.parse(responseText) : responseText);
      } catch {
        options.onSuccess(responseText);
      }
      return;
    }

    options.onError(new Error(`上传失败（${xhr.status}）`));
  });

  const formData = new FormData();

  Object.entries(options.data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item instanceof Blob ? item : String(item));
      });
      return;
    }

    formData.append(key, value instanceof Blob ? value : String(value));
  });

  formData.append(options.filename, options.file);
  xhr.send(formData);
  return xhr;
}
