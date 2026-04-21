<script setup lang="ts">
import { computed, ref } from "vue";
import type { ImageProps } from "./image";
import XyuIcon from "../icon/icon.vue";

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
      <XyuIcon icon="mdi:image-outline" :size="40" />
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
            <XyuIcon icon="mdi:close" :size="24" />
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>
