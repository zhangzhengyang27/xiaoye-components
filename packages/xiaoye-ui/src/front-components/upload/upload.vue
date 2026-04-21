<script setup lang="ts">
import { ref, computed } from "vue";
import type { UploadProps, UploadEmits, UploadFile } from "./upload";
import XyuIcon from "../icon/icon.vue";

defineOptions({ name: "XyuUpload" });

const props = withDefaults(defineProps<UploadProps>(), {
  action: "",
  headers: () => ({}),
  data: () => ({}),
  multiple: false,
  accept: "",
  maxSize: 0,
  maxCount: 0,
  disabled: false,
  draggable: false,
  listType: "text",
  showFileList: true,
  autoUpload: true,
  withCredentials: false,
  name: "file"
});

const emit = defineEmits<UploadEmits>();

const ns = "xyu-upload";
const inputRef = ref<HTMLInputElement | null>(null);
const dragover = ref(false);
const fileList = ref<UploadFile[]>([]);
const xhrMap = new Map<string, XMLHttpRequest>();

function generateId() {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSize(size?: number) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const CIRCUMFERENCE = 2 * Math.PI * 16;

function getStrokeDasharray(percentage: number) {
  const clampedPct = Math.max(0, Math.min(100, percentage));
  const filled = (clampedPct / 100) * CIRCUMFERENCE;
  return `${filled.toFixed(2)} ${CIRCUMFERENCE.toFixed(2)}`;
}

const uploadFiles = computed(() => fileList.value);

function addFile(rawFile: File) {
  const id = generateId();
  const file: UploadFile = {
    id,
    name: rawFile.name,
    size: rawFile.size,
    percentage: 0,
    status: "ready",
    raw: rawFile
  };
  fileList.value.push(file);
  emit("update:fileList", fileList.value);
  emit("change", file, fileList.value);
  if (props.autoUpload && props.action) {
    uploadFile(file);
  }
}

function handleFiles(files: FileList | null) {
  if (!files || files.length === 0) return;
  const fileArr = Array.from(files);
  const max = props.maxCount || Infinity;
  if (fileList.value.length + fileArr.length > max) {
    emit("exceed", fileArr[0], fileList.value);
    return;
  }
  for (const rawFile of fileArr) {
    const limit = props.maxSize || Infinity;
    if (limit !== Infinity && limit > 0 && rawFile.size > limit) {
      const failFile: UploadFile = {
        id: generateId(),
        name: rawFile.name,
        size: rawFile.size,
        status: "fail",
        error: `文件大小超过限制 (${formatSize(props.maxSize)})`
      };
      fileList.value.push(failFile);
      emit("change", failFile, fileList.value);
      continue;
    }
    addFile(rawFile);
  }
  if (!props.autoUpload) {
    emit("update:fileList", fileList.value);
  }
}

function uploadFile(file: UploadFile) {
  if (!file.raw || !props.action) return;
  file.status = "uploading";
  const xhr = new XMLHttpRequest();
  if (file.id) xhrMap.set(file.id, xhr);
  const formData = new FormData();
  formData.append(props.name, file.raw);
  Object.entries(props.data).forEach(([key, val]) => {
    formData.append(key, String(val));
  });
  xhr.open("POST", props.action);
  if (props.withCredentials) xhr.withCredentials = true;
  Object.entries(props.headers).forEach(([key, val]) => {
    xhr.setRequestHeader(key, val);
  });
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      file.percentage = Math.round((e.loaded / e.total) * 100);
      emit("progress", file.percentage, file);
    }
  };
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      file.status = "success";
      try {
        file.response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        file.response = {};
      }
      emit("success", file.response, file);
    } else {
      file.status = "fail";
      file.error = xhr.statusText;
      emit("error", new Error(xhr.statusText), file);
    }
    emit("change", file, fileList.value);
    emit("update:fileList", fileList.value);
    if (file.id) xhrMap.delete(file.id);
  };
  xhr.onerror = () => {
    file.status = "fail";
    file.error = "Network error";
    emit("error", new Error("Network error"), file);
    emit("change", file, fileList.value);
    emit("update:fileList", fileList.value);
    if (file.id) xhrMap.delete(file.id);
  };
  xhr.onabort = () => {
    file.status = "ready";
    file.percentage = 0;
    if (file.id) xhrMap.delete(file.id);
  };
  xhr.send(formData);
}

function abort(file?: UploadFile) {
  if (file && file.id) {
    const xhr = xhrMap.get(file.id);
    if (xhr) xhr.abort();
  } else {
    xhrMap.forEach((xhr) => xhr.abort());
    xhrMap.clear();
  }
}

function handleClick() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  handleFiles(target.files);
  target.value = "";
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  dragover.value = false;
  if (props.disabled) return;
  handleFiles(e.dataTransfer?.files ?? null);
}

function handleDragover(e: DragEvent) {
  e.preventDefault();
  if (!props.disabled) dragover.value = true;
}

function handleDragleave() {
  dragover.value = false;
}

function handleRemove(file: UploadFile) {
  if (file.status === "uploading") {
    abort(file);
  }
  fileList.value = fileList.value.filter((f) => f.id !== file.id);
  emit("remove", file);
  emit("update:fileList", fileList.value);
  emit("change", file, fileList.value);
}

function handlePreview(file: UploadFile) {
  emit("preview", file);
}

defineExpose({ abort, uploadFile });
</script>

<template>
  <div :class="ns">
    <input
      ref="inputRef"
      type="file"
      :class="`${ns}__input`"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="handleChange"
    />

    <div
      v-if="props.draggable"
      :class="[`${ns}__drag-area`, dragover ? 'is-dragover' : '', props.disabled ? 'is-disabled' : '']"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragleave="handleDragleave"
    >
      <slot name="trigger">
        <div :class="`${ns}__drag-content`">
          <div :class="`${ns}__drag-icon`">
            <XyuIcon icon="mdi:upload" :size="36" />
          </div>
          <div :class="`${ns}__drag-text`">
            <slot>
              <span>将文件拖到此处，或 <em>点击上传</em></span>
            </slot>
          </div>
          <div v-if="$slots.tip" :class="`${ns}__tip`">
            <slot name="tip" />
          </div>
        </div>
      </slot>
    </div>

    <div
      v-else
      :class="[`${ns}__trigger`, props.disabled ? 'is-disabled' : '']"
      @click="handleClick"
    >
      <slot name="trigger">
        <slot />
      </slot>
    </div>

    <div
      v-if="props.showFileList && uploadFiles.length > 0"
      :class="[`${ns}__list`, `${ns}__list--${props.listType}`]"
    >
      <div
        v-for="file in uploadFiles"
        :key="file.id"
        :class="[`${ns}__file`, `${ns}__file--${file.status || 'ready'}`]"
      >
        <template v-if="props.listType === 'picture-card'">
          <div
            v-if="file.status === 'uploading'"
            :class="`${ns}__file-uploading`"
          >
            <div :class="`${ns}__progress-ring`">
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="var(--xyu-border-color)" stroke-width="3"/>
                <circle
                  cx="20" cy="20" r="16"
                  fill="none"
                  stroke="var(--xyu-primary)"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="getStrokeDasharray(file.percentage ?? 0)"
                  transform="rotate(-90 20 20)"
                />
              </svg>
            </div>
          </div>
          <img
            v-else-if="file.url"
            :src="file.url"
            :alt="file.name"
            :class="`${ns}__preview-img`"
            @click="handlePreview(file)"
          />
          <div v-else :class="`${ns}__file-icon`">
            <XyuIcon icon="mdi:file-upload" :size="36" />
          </div>
          <span v-if="file.status !== 'uploading'" :class="`${ns}__file-remove`" @click.stop="handleRemove(file)">
            <XyuIcon icon="mdi:close" :size="10" />
          </span>
        </template>

        <template v-else>
          <div :class="`${ns}__file-info`">
            <span
              v-if="props.listType === 'picture'"
              :class="`${ns}__file-thumb`"
            >
              <img v-if="file.url" :src="file.url" :alt="file.name" />
              <span v-else>
                <XyuIcon icon="mdi:file-upload" :size="32" />
              </span>
            </span>
            <div :class="`${ns}__file-details`">
              <span :class="`${ns}__file-name`" @click="handlePreview(file)">{{ file.name }}</span>
              <span v-if="file.size" :class="`${ns}__file-size`">{{ formatSize(file.size) }}</span>
              <span v-if="file.error" :class="`${ns}__file-error`">{{ file.error }}</span>
            </div>
          </div>
          <div :class="`${ns}__file-actions`">
            <span
              v-if="file.status === 'uploading'"
              :class="`${ns}__progress-text`"
            >{{ file.percentage }}%</span>
            <span
              v-if="file.status === 'fail' && props.autoUpload"
              :class="`${ns}__retry`"
              @click="uploadFile(file)"
            >重试</span>
            <span :class="`${ns}__remove`" @click="handleRemove(file)">
              <XyuIcon icon="mdi:close" :size="12" />
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
