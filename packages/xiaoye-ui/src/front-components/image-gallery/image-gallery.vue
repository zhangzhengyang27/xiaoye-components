<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";
import { useNamespace } from "xiaoye-primitives";
import XyIcon from "@xiaoye/components/icon";
import XyImage from "@xiaoye/components/image";
import XyImageViewer from "@xiaoye/components/image";

export interface ImageGalleryImage {
  src: string;
  thumbnail?: string;
  alt?: string;
}

export type ThumbnailPosition = "bottom" | "left" | "right";

export interface ImageGalleryProps {
  images: ImageGalleryImage[];
  initialIndex?: number;
  showThumbnails?: boolean;
  thumbnailPosition?: ThumbnailPosition;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  zoomable?: boolean;
  rotatable?: boolean;
  showCounter?: boolean;
}

const props = withDefaults(defineProps<ImageGalleryProps>(), {
  images: () => [],
  initialIndex: 0,
  showThumbnails: true,
  thumbnailPosition: "bottom",
  thumbnailWidth: 80,
  thumbnailHeight: 80,
  zoomable: true,
  rotatable: true,
  showCounter: true
});

const emit = defineEmits<{
  change: [index: number];
}>();

const slots = defineSlots<{
  thumbnail?: (props: { image: ImageGalleryImage; index: number; active: boolean }) => unknown;
  overlay?: (props: { image: ImageGalleryImage; index: number }) => unknown;
}>();

const ns = useNamespace("image-gallery");

const currentIndex = ref(props.initialIndex);
const showViewer = ref(false);

const currentImage = computed(() => props.images[currentIndex.value] || null);

const previewSrcList = computed(() => props.images.map((img) => img.src));

const isFirst = computed(() => currentIndex.value === 0);
const isLast = computed(() => currentIndex.value === props.images.length - 1);

const containerClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--thumbnails-${props.thumbnailPosition}`
]);

function selectImage(index: number) {
  if (index === currentIndex.value) return;
  currentIndex.value = index;
  emit("change", index);
}

function handlePrev() {
  if (isFirst.value) return;
  currentIndex.value--;
  emit("change", currentIndex.value);
}

function handleNext() {
  if (isLast.value) return;
  currentIndex.value++;
  emit("change", currentIndex.value);
}

function openViewer() {
  showViewer.value = true;
}

function handleViewerSwitch(index: number) {
  currentIndex.value = index;
  emit("change", index);
}

function handleViewerClose() {
  showViewer.value = false;
}

watch(
  () => props.initialIndex,
  (val) => {
    currentIndex.value = val;
  }
);

watch(
  () => props.images,
  () => {
    if (currentIndex.value >= props.images.length) {
      currentIndex.value = Math.max(0, props.images.length - 1);
    }
  }
);

defineExpose({
  currentIndex,
  setIndex: selectImage,
  prev: handlePrev,
  next: handleNext
});
</script>

<template>
  <div :class="containerClasses">
    <div :class="`${ns.base.value}__main`">
      <div
        v-if="images.length > 0 && currentImage"
        :class="`${ns.base.value}__main-image`"
        @click="openViewer"
      >
        <XyImage
          :src="currentImage.src"
          :alt="currentImage.alt || `图片 ${currentIndex + 1}`"
          fit="contain"
          :preview-src-list="previewSrcList"
          :initial-index="currentIndex"
          :preview-teleported="true"
        />

        <slot :name="'overlay'" :image="currentImage" :index="currentIndex">
          <div v-if="showCounter" :class="`${ns.base.value}__counter`">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </slot>

        <div
          v-if="images.length > 1"
          :class="`${ns.base.value}__arrows`"
        >
          <button
            type="button"
            :class="[`${ns.base.value}__arrow`, `${ns.base.value}__arrow-prev`]"
            :disabled="isFirst"
            aria-label="上一张"
            @click.stop="handlePrev"
          >
            <XyIcon icon="mdi:chevron-left" :size="20" />
          </button>
          <button
            type="button"
            :class="[`${ns.base.value}__arrow`, `${ns.base.value}__arrow-next`]"
            :disabled="isLast"
            aria-label="下一张"
            @click.stop="handleNext"
          >
            <XyIcon icon="mdi:chevron-right" :size="20" />
          </button>
        </div>
      </div>

      <div v-else :class="`${ns.base.value}__empty`">
        <XyIcon icon="mdi:image-off-outline" :size="48" />
        <span>暂无图片</span>
      </div>
    </div>

    <div
      v-if="showThumbnails && images.length > 1"
      :class="[`${ns.base.value}__thumbnails`]"
      :data-position="props.thumbnailPosition"
    >
      <div
        v-if="props.thumbnailPosition === 'left'"
        :class="`${ns.base.value}__thumbnails-track`"
      >
        <button
          v-for="(image, index) in images"
          :key="index"
          type="button"
          :class="[
            `${ns.base.value}__thumb`,
            { 'is-active': index === currentIndex }
          ]"
          :style="{
            width: `${props.thumbnailWidth}px`,
            height: `${props.thumbnailHeight}px`
          }"
          @click="selectImage(index)"
        >
          <slot
            name="thumbnail"
            :image="image"
            :index="index"
            :active="index === currentIndex"
          >
            <XyImage
              :src="image.thumbnail || image.src"
              :alt="image.alt || `缩略图 ${index + 1}`"
              fit="cover"
            />
          </slot>
        </button>
      </div>

      <template v-else-if="props.thumbnailPosition === 'bottom'">
        <div
          :class="`${ns.base.value}__thumbnails-track`"
        >
          <button
            v-for="(image, index) in images"
            :key="index"
            type="button"
            :class="[
              `${ns.base.value}__thumb`,
              { 'is-active': index === currentIndex }
            ]"
            :style="{
              width: `${props.thumbnailWidth}px`,
              height: `${props.thumbnailHeight}px`
            }"
            @click="selectImage(index)"
          >
            <slot
              name="thumbnail"
              :image="image"
              :index="index"
              :active="index === currentIndex"
            >
              <XyImage
                :src="image.thumbnail || image.src"
                :alt="image.alt || `缩略图 ${index + 1}`"
                fit="cover"
              />
            </slot>
          </button>
        </div>
      </template>

      <template v-else>
        <div
          :class="`${ns.base.value}__thumbnails-track`"
        >
          <button
            v-for="(image, index) in images"
            :key="index"
            type="button"
            :class="[
              `${ns.base.value}__thumb`,
              { 'is-active': index === currentIndex }
            ]"
            :style="{
              width: `${props.thumbnailWidth}px`,
              height: `${props.thumbnailHeight}px`
            }"
            @click="selectImage(index)"
          >
            <slot
              name="thumbnail"
              :image="image"
              :index="index"
              :active="index === currentIndex"
            >
              <XyImage
                :src="image.thumbnail || image.src"
                :alt="image.alt || `缩略图 ${index + 1}`"
                fit="cover"
              />
            </slot>
          </button>
        </div>
      </template>
    </div>

    <XyImageViewer
      v-model="showViewer"
      :url-list="previewSrcList"
      :initial-index="currentIndex"
      @switch="handleViewerSwitch"
      @close="handleViewerClose"
    />
  </div>
</template>
