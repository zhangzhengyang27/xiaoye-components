<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

import { computed, inject, nextTick, onBeforeUnmount, shallowRef, useAttrs, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import { formItemKey } from "../../form/src/context";
import UploadContent from "./upload-content.vue";
import UploadList from "./upload-list.vue";
import { genFileId } from "./upload";
import type {
  UploadFileItem,
  UploadProgressEvent,
  UploadProps,
  UploadRawFile
} from "./upload";

const props = withDefaults(defineProps<UploadProps>(), {
  fileList: () => [],
  action: "#",
  headers: () => ({}),
  method: "post",
  data: () => ({}),
  name: "file",
  accept: "",
  multiple: false,
  limit: undefined,
  disabled: false,
  drag: false,
  tip: "",
  size: undefined,
  autoUpload: true,
  showFileList: true,
  withCredentials: false,
  listType: "text",
  beforeUpload: undefined,
  beforeRemove: undefined,
  onRemove: undefined,
  onChange: undefined,
  onPreview: undefined,
  onSuccess: undefined,
  onProgress: undefined,
  onError: undefined,
  onExceed: undefined,
  httpRequest: undefined
});

const emit = defineEmits<{
  "update:fileList": [value: UploadFileItem[]];
}>();

type UploadContentExpose = {
  abort: (file?: UploadFileItem) => void;
  upload: (rawFile: UploadRawFile) => Promise<void>;
};

const attrs = useAttrs();
const formItem = inject(formItemKey, null);
const ns = useNamespace("upload");
const { size: globalSize } = useConfig();

const uploadRef = shallowRef<UploadContentExpose | null>(null);
const generatedObjectUrls = new Map<string, { url: string; raw?: UploadRawFile }>();
const files = shallowRef<UploadFileItem[]>([]);
const previewImageUrl = shallowRef("");
const previewImageName = shallowRef("");
const previewShellRef = shallowRef<HTMLElement | null>(null);

const mergedSize = computed(() => props.size ?? globalSize.value);
const isPictureCard = computed(() => props.listType === "picture-card");
const limit = computed(() => props.limit);

const uploadKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  props.drag ? "is-drag" : "",
  props.disabled ? "is-disabled" : "",
  formItem?.validateState.value === "error" ? "is-error" : "",
  attrs.class
]);

function getSourceFileList() {
  return props.fileList;
}

function isImageFile(file: UploadFileItem) {
  const type = file.raw?.type || file.type || "";

  if (type.startsWith("image/")) {
    return true;
  }

  const source = `${file.url ?? ""} ${file.name}`.toLowerCase();
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/.test(source) || source.includes("data:image/");
}

function ensurePreviewUrl(file: UploadFileItem) {
  const existed = generatedObjectUrls.get(file.uid);

  if (file.url) {
    if (existed) {
      revokePreviewUrl(file);
    }

    return file.url;
  }

  if (!file.raw || !isImageFile(file)) {
    if (existed) {
      revokePreviewUrl(file);
    }

    return file.url;
  }

  if (existed?.raw === file.raw) {
    return existed.url;
  }

  if (existed) {
    revokePreviewUrl(file);
  }

  const previewUrl = URL.createObjectURL(file.raw);
  generatedObjectUrls.set(file.uid, {
    url: previewUrl,
    raw: file.raw
  });
  return previewUrl;
}

function revokePreviewUrl(file: UploadFileItem) {
  const previewRecord = generatedObjectUrls.get(file.uid);

  if (!previewRecord) {
    return;
  }

  URL.revokeObjectURL(previewRecord.url);
  generatedObjectUrls.delete(file.uid);
}

function normalizeFileItem(file: UploadFileItem): UploadFileItem {
  const normalized: UploadFileItem = {
    ...file,
    uid: file.uid || genFileId(),
    status: file.status ?? (file.raw ? "ready" : "success"),
    percentage: file.percentage ?? (file.status === "success" ? 100 : 0)
  };

  const previewUrl = ensurePreviewUrl(normalized);

  if (previewUrl) {
    normalized.url = previewUrl;
  }

  return normalized;
}

function normalizeFileList(list: UploadFileItem[]) {
  return list.map(normalizeFileItem);
}

function getDisplayFiles() {
  return files.value.map((file) => ({ ...file }));
}

function emitChangeEvent(file: UploadFileItem, displayFiles: UploadFileItem[]) {
  props.onChange?.(file, displayFiles);
}

async function syncFileList(nextFiles: UploadFileItem[], validate = false) {
  files.value = nextFiles;
  const displayFiles = getDisplayFiles();
  emit("update:fileList", displayFiles);

  if (validate) {
    await formItem?.validate("change");
  }

  return displayFiles;
}

async function updateFile(uid: string, patch: Partial<UploadFileItem>) {
  const nextFiles = files.value.map((file) => {
    if (file.uid !== uid) {
      return file;
    }

    const nextFile = normalizeFileItem({
      ...file,
      ...patch
    });

    return nextFile;
  });

  return syncFileList(nextFiles);
}

async function replaceRawFile(uid: string, rawFile: UploadRawFile) {
  await updateFile(uid, {
    raw: rawFile,
    name: rawFile.name,
    size: rawFile.size,
    type: rawFile.type
  });
}

function findFile(file: UploadFileItem | UploadRawFile) {
  const uid = "uid" in file ? file.uid : "";
  return files.value.find((item) => item.uid === uid) ?? null;
}

async function handleStart(rawFile: UploadRawFile) {
  const nextFile = normalizeFileItem({
    uid: rawFile.uid,
    name: rawFile.name,
    size: rawFile.size,
    type: rawFile.type,
    status: "ready",
    percentage: 0,
    raw: rawFile
  });

  const nextFiles = files.value.concat(nextFile);
  const displayFiles = await syncFileList(nextFiles);
  emitChangeEvent(nextFile, displayFiles);
}

async function handleProgress(event: UploadProgressEvent, rawFile: UploadRawFile) {
  const nextFiles = await updateFile(rawFile.uid, {
    status: "uploading",
    percentage: event.percent
  });
  const file = findFile(rawFile);

  if (file && nextFiles) {
    props.onProgress?.(event, file, nextFiles);
  }
}

async function handleSuccess(response: unknown, rawFile: UploadRawFile) {
  const nextFiles = await updateFile(rawFile.uid, {
    status: "success",
    percentage: 100,
    response
  });
  const file = findFile(rawFile);

  if (file && nextFiles) {
    props.onSuccess?.(response, file, nextFiles);
    emitChangeEvent(file, nextFiles);
  }
}

async function handleError(error: Error, rawFile: UploadRawFile) {
  const nextFiles = await updateFile(rawFile.uid, {
    status: "fail"
  });
  const file = findFile(rawFile);

  if (file && nextFiles) {
    props.onError?.(error, file, nextFiles);
    emitChangeEvent(file, nextFiles);
  }
}

async function handleRemove(
  file: UploadFileItem | UploadRawFile,
  options?: { skipBeforeRemove?: boolean; emitRemove?: boolean }
) {
  const targetFile = findFile(file);

  if (!targetFile) {
    return;
  }

  if (!options?.skipBeforeRemove && props.beforeRemove) {
    const allowed = await props.beforeRemove(targetFile, getDisplayFiles());

    if (!allowed) {
      return;
    }
  }

  revokePreviewUrl(targetFile);

  const nextFiles = files.value.filter((item) => item.uid !== targetFile.uid);
  const displayFiles = await syncFileList(nextFiles, true);

  if (options?.emitRemove ?? true) {
    props.onRemove?.(targetFile, displayFiles);
  }
}

function handlePreview(file: UploadFileItem) {
  props.onPreview?.(file);

  if (isImageFile(file) && file.url) {
    previewImageUrl.value = file.url;
    previewImageName.value = file.name;
  }
}

function closePreview() {
  previewImageUrl.value = "";
  previewImageName.value = "";
}

function handlePreviewKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closePreview();
  }
}

async function handleRetry(file: UploadFileItem) {
  if (!file.raw) {
    return;
  }

  await uploadRef.value?.upload(file.raw);
}

function handleExceed(exceedFiles: File[], currentFiles: UploadFileItem[]) {
  props.onExceed?.(exceedFiles, currentFiles);
}

async function submit() {
  const readyFiles = files.value.filter((file) => file.status === "ready" && file.raw);

  for (const file of readyFiles) {
    await uploadRef.value?.upload(file.raw as UploadRawFile);
  }
}

function abort(file?: UploadFileItem) {
  uploadRef.value?.abort(file);
}

async function clearFiles() {
  abort();
  files.value.forEach(revokePreviewUrl);
  await syncFileList([], true);
}

watch(
  () => getSourceFileList(),
  (value) => {
    const nextFiles = normalizeFileList(value);
    const nextIds = new Set(nextFiles.map((file) => file.uid));

    files.value.forEach((file) => {
      if (!nextIds.has(file.uid)) {
        revokePreviewUrl(file);
      }
    });

    files.value = nextFiles;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(previewImageUrl, async (value) => {
  if (!value) {
    return;
  }

  await nextTick();
  previewShellRef.value?.focus();
});

onBeforeUnmount(() => {
  abort();
  files.value.forEach(revokePreviewUrl);
});

defineExpose({
  submit,
  abort,
  clearFiles,
  handleStart,
  handleRemove
});
</script>

<template>
  <div :class="uploadKls" :style="attrs.style">
    <upload-list
      v-if="isPictureCard && props.showFileList"
      :files="files"
      :list-type="props.listType"
      :disabled="props.disabled"
      @preview="handlePreview"
      @remove="handleRemove"
      @retry="handleRetry"
    >
      <template v-if="$slots.file" #default="{ file, index }">
        <slot name="file" :file="file" :index="index" />
      </template>
      <template #append>
        <upload-content
          ref="uploadRef"
          :input-id="formItem?.inputId"
          :action="props.action"
          :headers="props.headers"
          :method="props.method"
          :data="props.data"
          :name="props.name"
          :multiple="props.multiple"
          :accept="props.accept"
          :drag="props.drag"
          :with-credentials="props.withCredentials"
          :auto-upload="props.autoUpload"
          :disabled="props.disabled"
          :limit="limit"
          :before-upload="props.beforeUpload"
          :http-request="props.httpRequest"
          :file-list="files"
          :list-type="props.listType"
          :on-start="handleStart"
          :on-progress="handleProgress"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-remove="handleRemove"
          :on-update-raw-file="replaceRawFile"
          :on-exceed="handleExceed"
        >
          <slot v-if="$slots.trigger" name="trigger" />
          <slot v-else-if="$slots.default" />
          <div v-else class="xy-upload__picture-card-trigger">
            <span class="xy-upload__picture-card-plus">+</span>
            <small>上传</small>
          </div>
        </upload-content>
      </template>
    </upload-list>

    <upload-content
      v-if="!isPictureCard || (isPictureCard && !props.showFileList)"
      ref="uploadRef"
      :input-id="formItem?.inputId"
      :action="props.action"
      :headers="props.headers"
      :method="props.method"
      :data="props.data"
      :name="props.name"
      :multiple="props.multiple"
      :accept="props.accept"
      :drag="props.drag"
      :with-credentials="props.withCredentials"
      :auto-upload="props.autoUpload"
      :disabled="props.disabled"
      :limit="limit"
      :before-upload="props.beforeUpload"
      :http-request="props.httpRequest"
      :file-list="files"
      :list-type="props.listType"
      :on-start="handleStart"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-update-raw-file="replaceRawFile"
      :on-exceed="handleExceed"
    >
      <slot v-if="$slots.trigger" name="trigger" />
      <slot v-else-if="$slots.default" />
      <template v-else>
        <strong>{{ props.drag ? "拖拽文件到此处" : "点击选择文件" }}</strong>
        <p>{{ props.drag ? "或点击选择文件" : "支持本地文件上传" }}</p>
      </template>
    </upload-content>

    <div v-if="$slots.tip || props.tip" class="xy-upload__tip">
      <slot name="tip">
        {{ props.tip }}
      </slot>
    </div>

    <upload-list
      v-if="!isPictureCard && props.showFileList"
      :files="files"
      :list-type="props.listType"
      :disabled="props.disabled"
      @preview="handlePreview"
      @remove="handleRemove"
      @retry="handleRetry"
    >
      <template v-if="$slots.file" #default="{ file, index }">
        <slot name="file" :file="file" :index="index" />
      </template>
    </upload-list>

    <teleport to="body">
      <transition name="xy-fade">
        <div
          v-if="previewImageUrl"
          class="xy-upload__preview"
          role="dialog"
          aria-modal="true"
          @click="closePreview"
        >
          <div
            ref="previewShellRef"
            class="xy-upload__preview-shell"
            tabindex="-1"
            @click.stop
            @keydown="handlePreviewKeydown"
          >
            <button
              type="button"
              class="xy-upload__preview-close"
              aria-label="关闭预览"
              @click="closePreview"
            >
              ×
            </button>
            <img :src="previewImageUrl" :alt="previewImageName" class="xy-upload__preview-image" />
            <p class="xy-upload__preview-title">{{ previewImageName }}</p>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>
