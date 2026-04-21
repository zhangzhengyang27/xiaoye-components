<script setup lang="ts">
import { ref, computed } from "vue";
import type { UploadProps, UploadEmits, UploadFile } from "./upload";

const props = withDefaults(defineProps<UploadProps>(), {
  action: "",
  headers: () => ({}),
  data: () => ({}),
  multiple: false,
  accept: "",
  maxSize: Infinity,
  maxCount: Infinity,
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

function generateId() {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatSize(size?: number) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
  if (props.maxCount && fileList.value.length + fileArr.length > props.maxCount) {
    emit("exceed", fileArr[0], fileList.value);
    return;
  }
  for (const rawFile of fileArr) {
    if (rawFile.size > props.maxSize) {
      fileList.value.push({
        name: rawFile.name,
        size: rawFile.size,
        status: "fail",
        error: `文件大小超过限制 (${formatSize(props.maxSize)})`
      });
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
      file.response = JSON.parse(xhr.responseText || "{}");
      emit("success", file.response, file);
    } else {
      file.status = "fail";
      file.error = xhr.statusText;
      emit("error", new Error(xhr.statusText), file);
    }
    emit("change", file, fileList.value);
    emit("update:fileList", fileList.value);
  };
  xhr.onerror = () => {
    file.status = "fail";
    file.error = "Network error";
    emit("error", new Error("Network error"), file);
  };
  xhr.send(formData);
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
  fileList.value = fileList.value.filter((f) => f.id !== file.id);
  emit("remove", file);
  emit("update:fileList", fileList.value);
  emit("change", file, fileList.value);
}

function handlePreview(file: UploadFile) {
  emit("preview", file);
}

const slots = defineSlots<{
  default?: () => unknown;
  trigger?: () => unknown;
  tip?: () => unknown;
}>();
</script>

<template>
  <div :class="ns">
    <!-- 隐藏的 file input -->
    <input
      ref="inputRef"
      type="file"
      :class="`${ns}__input`"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="handleChange"
    />

    <!-- 拖拽区域或触发区域 -->
    <div
      v-if="props.draggable"
      :class="[`${ns}__drap-area`, dragover ? 'is-dragover' : '', props.disabled ? 'is-disabled' : '']"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragleave="handleDragleave"
    >
      <slot name="trigger">
        <div :class="`${ns}__drag-content`">
          <div :class="`${ns}__drag-icon`">📤</div>
          <div :class="`${ns}__drag-text`">
            <slot name="default">
              <span>将文件拖到此处，或 <em>点击上传</em></span>
            </slot>
          </div>
          <div v-if="slots.tip" :class="`${ns}__tip`">
            <slot name="tip" />
          </div>
        </div>
      </slot>
    </div>

    <!-- 非拖拽模式 -->
    <div
      v-else
      :class="[`${ns}__trigger`, props.disabled ? 'is-disabled' : '']"
      @click="handleClick"
    >
      <slot name="trigger">
        <slot />
      </slot>
    </div>

    <!-- 文件列表 -->
    <div
      v-if="props.showFileList && uploadFiles.length > 0"
      :class="[`${ns}__list`, `${ns}__list--${props.listType}`]"
    >
      <div
        v-for="file in uploadFiles"
        :key="file.id"
        :class="[`${ns}__file`, `${ns}__file--${file.status || 'ready'}`]"
      >
        <!-- picture-card 模式 -->
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
                  :stroke-dasharray="`${(file.percentage ?? 0) * 1.005} 100.5`"
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
          <div v-else :class="`${ns}__file-icon`">📄</div>
          <span v-if="file.status !== 'uploading'" :class="`${ns}__file-remove`" @click.stop="handleRemove(file)">✕</span>
        </template>

        <!-- text / picture 模式 -->
        <template v-else>
          <div :class="`${ns}__file-info`">
            <span
              v-if="props.listType === 'picture'"
              :class="`${ns}__file-thumb`"
            >
              <img v-if="file.url" :src="file.url" :alt="file.name" />
              <span v-else>📄</span>
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
            <span :class="`${ns}__remove`" @click="handleRemove(file)">✕</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
