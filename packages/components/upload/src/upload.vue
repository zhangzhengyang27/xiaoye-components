<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import type { ComponentSize } from "@xiaoye/utils";
import { formItemKey } from "../../form/src/context";

export interface UploadFileItem {
  uid: string;
  name: string;
  size: number;
  type?: string;
  status?: "ready";
  raw?: File;
}

export interface UploadProps {
  modelValue?: UploadFileItem[];
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
  drag?: boolean;
  tip?: string;
  size?: ComponentSize;
}

const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  accept: "",
  multiple: false,
  maxCount: undefined,
  disabled: false,
  drag: false,
  tip: "",
  size: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: UploadFileItem[]];
  change: [value: UploadFileItem[]];
  remove: [file: UploadFileItem];
  exceed: [files: File[]];
}>();

const formItem = inject(formItemKey, null);
const ns = useNamespace("upload");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const inputRef = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const files = ref<UploadFileItem[]>([...props.modelValue]);

function createFileItem(file: File): UploadFileItem {
  return {
    uid: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "ready",
    raw: file
  };
}

function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function syncFiles(nextFiles: UploadFileItem[]) {
  files.value = nextFiles;
  emit("update:modelValue", nextFiles);
  emit("change", nextFiles);
  await formItem?.validate("change");
}

async function appendFiles(selectedFiles: File[]) {
  if (props.disabled || !selectedFiles.length) {
    return;
  }

  let nextFiles = [...files.value];

  if (props.maxCount !== undefined) {
    const available = props.maxCount - nextFiles.length;

    if (available <= 0) {
      emit("exceed", selectedFiles);
      return;
    }

    if (selectedFiles.length > available) {
      emit("exceed", selectedFiles.slice(available));
      selectedFiles = selectedFiles.slice(0, available);
    }
  }

  nextFiles = nextFiles.concat(selectedFiles.map(createFileItem));
  await syncFiles(nextFiles);
}

async function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedFiles = target.files ? [...target.files] : [];

  await appendFiles(selectedFiles);

  if (target) {
    target.value = "";
  }
}

function openDialog() {
  if (props.disabled) {
    return;
  }

  inputRef.value?.click();
}

async function removeFile(file: UploadFileItem) {
  const nextFiles = files.value.filter((item) => item.uid !== file.uid);

  files.value = nextFiles;
  emit("remove", file);
  emit("update:modelValue", nextFiles);
  emit("change", nextFiles);
  await formItem?.validate("change");
}

function handleDragOver(event: DragEvent) {
  if (!props.drag || props.disabled) {
    return;
  }

  event.preventDefault();
  isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

async function handleDrop(event: DragEvent) {
  if (!props.drag || props.disabled) {
    return;
  }

  event.preventDefault();
  isDragOver.value = false;
  const dropped = event.dataTransfer?.files ? [...event.dataTransfer.files] : [];
  await appendFiles(dropped);
}

watch(
  () => props.modelValue,
  (value) => {
    files.value = [...value];
  },
  {
    deep: true
  }
);
</script>

<template>
  <div
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      props.drag ? 'is-drag' : '',
      isDragOver ? 'is-drag-over' : '',
      props.disabled ? 'is-disabled' : '',
      formItem?.validateState.value === 'error' ? 'is-error' : ''
    ]"
  >
    <input
      :id="formItem?.inputId"
      ref="inputRef"
      class="xy-upload__input"
      type="file"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      :aria-describedby="formItem?.message.value ? formItem.messageId : undefined"
      :aria-invalid="formItem?.validateState.value === 'error'"
      @change="handleInputChange"
    />

    <div
      class="xy-upload__trigger"
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      @click="openDialog"
      @keydown.enter.prevent="openDialog"
      @keydown.space.prevent="openDialog"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <strong>{{ props.drag ? "拖拽文件到此处" : "点击选择文件" }}</strong>
      <p>{{ props.drag ? "或点击选择文件" : "支持本地文件上传" }}</p>
      <small v-if="props.tip">{{ props.tip }}</small>
    </div>

    <ul v-if="files.length" class="xy-upload__list">
      <li v-for="file in files" :key="file.uid" class="xy-upload__item">
        <div class="xy-upload__meta">
          <strong>{{ file.name }}</strong>
          <span>{{ formatSize(file.size) }}</span>
        </div>
        <button type="button" aria-label="remove" @click="removeFile(file)">移除</button>
      </li>
    </ul>
  </div>
</template>

