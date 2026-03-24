<script setup lang="ts">
defineOptions({
  name: "XyUploadList"
});

import { computed, ref } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { UploadFileItem, UploadListType } from "./upload";

const props = withDefaults(
  defineProps<{
    files: UploadFileItem[];
    listType?: UploadListType;
    disabled?: boolean;
  }>(),
  {
    listType: "text",
    disabled: false
  }
);

const emit = defineEmits<{
  preview: [file: UploadFileItem];
  remove: [file: UploadFileItem];
  retry: [file: UploadFileItem];
}>();

const ns = useNamespace("upload-list");
const isPicture = computed(() => props.listType === "picture");
const isPictureCard = computed(() => props.listType === "picture-card");
const failedImageUrls = ref<Record<string, string>>({});

function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getStatusText(status: UploadFileItem["status"]) {
  return (
    {
      ready: "待上传",
      uploading: "上传中",
      fail: "失败"
    } as const
  )[status as "ready" | "uploading" | "fail"];
}

function shouldShowStatus(status: UploadFileItem["status"]) {
  return status === "ready" || status === "uploading" || status === "fail";
}

function hasAvailableImage(file: UploadFileItem) {
  return Boolean(file.url) && failedImageUrls.value[file.uid] !== file.url;
}

function handleImageError(file: UploadFileItem) {
  if (!file.url) {
    return;
  }

  failedImageUrls.value = {
    ...failedImageUrls.value,
    [file.uid]: file.url
  };
}
</script>

<template>
  <div :class="[ns.base.value, `${ns.base.value}--${props.listType}`]">
    <template v-if="isPictureCard">
      <div
        v-for="(file, index) in props.files"
        :key="file.uid"
        class="xy-upload-list__card"
        :class="file.status ? `is-${file.status}` : ''"
      >
        <slot v-if="$slots.default" :file="file" :index="index" />
        <template v-else>
          <button type="button" class="xy-upload-list__preview" @click.stop="emit('preview', file)">
            <img
              v-if="hasAvailableImage(file)"
              :src="file.url"
              :alt="file.name"
              class="xy-upload-list__image"
              @error="handleImageError(file)"
            />
            <span v-else class="xy-upload-list__placeholder">{{ file.name.slice(0, 1) }}</span>
          </button>

          <div class="xy-upload-list__card-mask">
            <span v-if="shouldShowStatus(file.status)" class="xy-upload-list__card-status">
              {{ getStatusText(file.status) }}
            </span>
            <div class="xy-upload-list__card-actions">
              <button
                type="button"
                class="xy-upload-list__card-action"
                aria-label="预览"
                title="预览"
                @click.stop="emit('preview', file)"
              >
                <XyIcon icon="mdi:eye-outline" :size="16" />
              </button>
              <button
                v-if="file.status === 'fail' && file.raw && !props.disabled"
                type="button"
                class="xy-upload-list__card-action"
                aria-label="重试"
                title="重试"
                @click.stop="emit('retry', file)"
              >
                <XyIcon icon="mdi:refresh" :size="16" />
              </button>
              <button
                v-if="!props.disabled"
                type="button"
                class="xy-upload-list__card-action"
                aria-label="删除"
                title="删除"
                @click.stop="emit('remove', file)"
              >
                <XyIcon icon="mdi:delete-outline" :size="16" />
              </button>
            </div>
          </div>
        </template>
      </div>

      <slot name="append" />
    </template>

    <ul v-else class="xy-upload-list__items">
      <li
        v-for="(file, index) in props.files"
        :key="file.uid"
        class="xy-upload-list__item"
        :class="[isPicture ? 'is-picture' : '', file.status ? `is-${file.status}` : '']"
      >
        <slot v-if="$slots.default" :file="file" :index="index" />
        <template v-else>
          <button
            v-if="isPicture"
            type="button"
            class="xy-upload-list__thumb"
            @click.stop="emit('preview', file)"
          >
            <img
              v-if="hasAvailableImage(file)"
              :src="file.url"
              :alt="file.name"
              class="xy-upload-list__image"
              @error="handleImageError(file)"
            />
            <span v-else class="xy-upload-list__placeholder">{{ file.name.slice(0, 1) }}</span>
          </button>

          <div class="xy-upload-list__meta">
            <button type="button" class="xy-upload-list__name" @click.stop="emit('preview', file)">
              {{ file.name }}
            </button>
            <div class="xy-upload-list__details">
              <span>{{ formatSize(file.size) }}</span>
              <span v-if="shouldShowStatus(file.status)">{{ getStatusText(file.status) }}</span>
              <span v-if="file.status === 'uploading'">{{ Math.round(file.percentage ?? 0) }}%</span>
            </div>
            <div v-if="file.status === 'uploading'" class="xy-upload-list__progress">
              <span
                class="xy-upload-list__progress-bar"
                :style="{ width: `${file.percentage ?? 0}%` }"
              />
            </div>
          </div>

          <div class="xy-upload-list__actions">
            <button
              v-if="file.status === 'fail' && file.raw && !props.disabled"
              type="button"
              class="xy-upload-list__action"
              @click.stop="emit('retry', file)"
            >
              重试
            </button>
            <button
              v-if="!props.disabled"
              type="button"
              class="xy-upload-list__action is-danger"
              @click.stop="emit('remove', file)"
            >
              删除
            </button>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>
