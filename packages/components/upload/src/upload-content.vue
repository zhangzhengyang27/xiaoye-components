<script setup lang="ts">
defineOptions({
  name: "XyUploadContent",
  inheritAttrs: false
});

import { computed, ref, shallowRef } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { ajaxUpload, genFileId } from "./upload";
import type {
  Awaitable,
  UploadFileItem,
  UploadListType,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions
} from "./upload";

interface UploadContentProps
  extends Pick<
    UploadProps,
    | "action"
    | "headers"
    | "method"
    | "data"
    | "name"
    | "multiple"
    | "accept"
    | "drag"
    | "withCredentials"
    | "autoUpload"
    | "disabled"
    | "limit"
    | "beforeUpload"
    | "httpRequest"
  > {
  fileList: UploadFileItem[];
  listType: UploadListType;
  inputId?: string;
  onStart: (file: UploadRawFile) => Awaitable<void>;
  onProgress: (event: UploadProgressEvent, file: UploadRawFile) => Awaitable<void>;
  onSuccess: (response: unknown, file: UploadRawFile) => Awaitable<void>;
  onError: (error: Error, file: UploadRawFile) => Awaitable<void>;
  onRemove: (
    file: UploadRawFile | UploadFileItem,
    options?: { skipBeforeRemove?: boolean; emitRemove?: boolean }
  ) => Awaitable<void>;
  onUpdateRawFile: (uid: string, rawFile: UploadRawFile) => Awaitable<void>;
  onExceed: (files: File[], fileList: UploadFileItem[]) => void;
}

const props = withDefaults(defineProps<UploadContentProps>(), {
  action: "#",
  headers: () => ({}),
  method: "post",
  data: () => ({}),
  name: "file",
  multiple: false,
  accept: "",
  drag: false,
  withCredentials: false,
  autoUpload: true,
  disabled: false,
  limit: undefined,
  beforeUpload: undefined,
  httpRequest: undefined,
  inputId: undefined
});

const ns = useNamespace("upload");
const inputRef = shallowRef<HTMLInputElement | null>(null);
const requests = shallowRef<
  Record<
    string,
    {
      rawFile: UploadRawFile;
      request: XMLHttpRequest | Promise<unknown>;
      canceled: boolean;
    }
  >
>({});
const isDragOver = ref(false);

const contentKls = computed(() => [
  `${ns.base.value}__content`,
  `${ns.base.value}__content--${props.listType}`,
  props.drag ? "is-drag" : "",
  isDragOver.value ? "is-drag-over" : "",
  props.disabled ? "is-disabled" : ""
]);

function assignUid(file: File) {
  return Object.assign(file, {
    uid: genFileId()
  }) as UploadRawFile;
}

async function resolveData(rawFile: UploadRawFile) {
  if (typeof props.data === "function") {
    return props.data(rawFile);
  }

  return await props.data;
}

async function upload(rawFile: UploadRawFile): Promise<void> {
  if (inputRef.value) {
    inputRef.value.value = "";
  }

  let nextRawFile = rawFile;

  if (props.beforeUpload) {
    let beforeUploadResult: boolean | void | null | undefined | File | Blob;

    try {
      beforeUploadResult = await props.beforeUpload(rawFile);
    } catch {
      beforeUploadResult = false;
    }

    if (beforeUploadResult === false) {
      await props.onRemove(rawFile, {
        skipBeforeRemove: true,
        emitRemove: false
      });
      return;
    }

    if (beforeUploadResult instanceof Blob) {
      const nextFile =
        beforeUploadResult instanceof File
          ? beforeUploadResult
          : new File([beforeUploadResult], rawFile.name, {
              type: beforeUploadResult.type || rawFile.type
            });

      nextRawFile = Object.assign(nextFile, {
        uid: rawFile.uid
      }) as UploadRawFile;

      await props.onUpdateRawFile(rawFile.uid, nextRawFile);
    }
  }

  let requestData: Record<string, unknown>;

  try {
    requestData = await resolveData(nextRawFile);
  } catch {
    await props.onError(new Error("上传参数解析失败"), nextRawFile);
    return;
  }

  const requestOptions: UploadRequestOptions = {
    action: props.action,
    method: props.method,
    data: requestData ?? {},
    filename: props.name,
    file: nextRawFile,
    headers: props.headers,
    withCredentials: props.withCredentials,
    onProgress: (event) => {
      const requestRecord = requests.value[nextRawFile.uid];

      if (!requestRecord || requestRecord.canceled) {
        return;
      }

      void props.onProgress(event, nextRawFile);
    },
    onSuccess: (response) => {
      const requestRecord = requests.value[nextRawFile.uid];

      if (!requestRecord || requestRecord.canceled) {
        return;
      }

      delete requests.value[nextRawFile.uid];
      void props.onSuccess(response, nextRawFile);
    },
    onError: (error) => {
      const requestRecord = requests.value[nextRawFile.uid];

      if (!requestRecord || requestRecord.canceled) {
        return;
      }

      delete requests.value[nextRawFile.uid];
      void props.onError(error, nextRawFile);
    }
  };

  const request = (props.httpRequest ?? ajaxUpload)(requestOptions);

  if (request instanceof XMLHttpRequest || request instanceof Promise) {
    requests.value[nextRawFile.uid] = {
      rawFile: nextRawFile,
      request,
      canceled: false
    };
  }

  if (request instanceof Promise) {
    request.then(requestOptions.onSuccess).catch((error: unknown) => {
      requestOptions.onError(error instanceof Error ? error : new Error("上传失败"));
    });
  }
}

async function uploadFiles(selectedFiles: File[]) {
  if (!selectedFiles.length) {
    return;
  }

  const files = [...selectedFiles];

  if (props.limit !== undefined && props.fileList.length + files.length > props.limit) {
    props.onExceed(files, props.fileList);
    return;
  }

  const normalizedFiles = props.multiple ? files : files.slice(0, 1);

  for (const file of normalizedFiles) {
    const rawFile = assignUid(file);
    await props.onStart(rawFile);

    if (props.autoUpload) {
      await upload(rawFile);
    }
  }
}

async function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files ? Array.from(target.files) : [];
  await uploadFiles(selectedFiles);
  target.value = "";
}

function handleClick() {
  if (props.disabled) {
    return;
  }

  if (inputRef.value) {
    inputRef.value.value = "";
    inputRef.value.click();
  }
}

function handleKeydown() {
  handleClick();
}

function handleDragOver() {
  if (!props.drag || props.disabled) {
    return;
  }

  isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

async function handleDrop(event: DragEvent) {
  if (!props.drag || props.disabled) {
    return;
  }

  isDragOver.value = false;
  await uploadFiles(Array.from(event.dataTransfer?.files ?? []));
}

function abort(file?: UploadFileItem) {
  const entries = Object.entries(requests.value).filter(([uid]) =>
    file ? file.uid === uid : true
  );

  entries.forEach(([uid, requestRecord]) => {
    requestRecord.canceled = true;
    delete requests.value[uid];

    if (requestRecord.request instanceof XMLHttpRequest) {
      requestRecord.request.abort();
    }

    void props.onError(new Error("上传已取消"), requestRecord.rawFile);
  });
}

defineExpose({
  abort,
  upload,
  handleClick
});
</script>

<template>
  <div
    :class="contentKls"
    :tabindex="props.disabled ? undefined : 0"
    :aria-disabled="props.disabled"
    role="button"
    @click="handleClick"
    @keydown.self.enter.prevent="handleKeydown"
    @keydown.self.space.prevent="handleKeydown"
  >
    <div
      class="xy-upload__trigger"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <slot />
    </div>

    <input
      :id="props.inputId"
      ref="inputRef"
      class="xy-upload__input"
      type="file"
      :name="props.name"
      :disabled="props.disabled"
      :multiple="props.multiple"
      :accept="props.accept"
      @change="handleInputChange"
      @click.stop
    />
  </div>
</template>
