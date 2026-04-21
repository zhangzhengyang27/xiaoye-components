<script setup lang="ts">
import { computed, ref } from "vue";
import type { ImageProps } from "./image";

const props = withDefaults(defineProps<ImageProps>(), {
  src: "",
  alt: "",
  fit: "cover",
  width: "",
  height: "",
  lazy: false,
  preview: false,
  previewSrcList: () => [],
  zIndex: 2000
});

const ns = "xyu-image";
const loaded = ref(false);
const error = ref(false);
const previewVisible = ref(false);

const imgStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height,
  objectFit: props.fit
}));

function handleLoad() {
  loaded.value = true;
}

function handleError() {
  error.value = true;
}

function openPreview() {
  if (props.preview || props.previewSrcList.length > 0) {
    previewVisible.value = true;
  }
}

function closePreview() {
  previewVisible.value = false;
}
</script>

<template>
  <div :class="[ns, { 'is-loaded': loaded, 'is-error': error }]" :style="imgStyle">
    <img
      v-if="props.src"
      :src="props.src"
      :alt="props.alt"
      :class="`${ns}__img`"
      :style="imgStyle"
      :loading="props.lazy ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
      @click="openPreview"
    />
    <div v-else :class="`${ns}__placeholder`">
      <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>

    <!-- Preview overlay -->
    <teleport to="body">
      <transition name="xyu-image-fade">
        <div
          v-if="previewVisible"
          :class="`${ns}__preview`"
          :style="{ zIndex: props.zIndex }"
          @click="closePreview"
        >
          <img
            :src="props.previewSrcList[0] || props.src"
            :class="`${ns}__preview-img`"
            @click.stop
          />
          <button :class="`${ns}__preview-close`" @click="closePreview" aria-label="关闭">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>
