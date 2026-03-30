<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useNamespace } from "@xiaoye/composables";
import type { VideoPlayerProps, VideoPlayerSource } from "./video-player";

defineOptions({
  name: "XyVideoPlayer"
});

const props = withDefaults(defineProps<VideoPlayerProps>(), {
  sources: () => [],
  poster: "",
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  preload: "metadata",
  width: "100%",
  height: 360,
  options: () => ({})
});

const emit = defineEmits<{
  init: [player: unknown];
  ready: [player: unknown];
  play: [];
  pause: [];
  ended: [];
}>();

const ns = useNamespace("video-player");
const videoRef = ref<HTMLVideoElement | null>(null);
const playerRef = ref<any>(null);

const rootStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height
}));

function normalizeSources(sources: VideoPlayerSource[]) {
  return sources.map((item) => ({
    src: item.src,
    type: item.type
  }));
}

function createPlayer() {
  if (!videoRef.value) {
    return;
  }

  playerRef.value?.dispose();
  playerRef.value = videojs(videoRef.value, {
    autoplay: props.autoplay,
    controls: props.controls,
    loop: props.loop,
    muted: props.muted,
    preload: props.preload,
    poster: props.poster,
    fluid: false,
    sources: normalizeSources(props.sources),
    ...props.options
  });

  playerRef.value.on("play", () => emit("play"));
  playerRef.value.on("pause", () => emit("pause"));
  playerRef.value.on("ended", () => emit("ended"));

  emit("init", playerRef.value);
  emit("ready", playerRef.value);
}

function play() {
  return playerRef.value?.play();
}

function pause() {
  playerRef.value?.pause();
}

function load(sources = props.sources) {
  if (!playerRef.value) {
    return;
  }

  playerRef.value.src(normalizeSources(sources));
  playerRef.value.load();
}

watch(
  () => [props.sources, props.poster, props.autoplay, props.controls, props.loop, props.muted] as const,
  async () => {
    await nextTick();
    createPlayer();
  },
  {
    deep: true
  }
);

watch(
  () => props.options,
  async () => {
    await nextTick();
    createPlayer();
  },
  {
    deep: true
  }
);

onMounted(() => {
  createPlayer();
});

onBeforeUnmount(() => {
  playerRef.value?.dispose();
  playerRef.value = null;
});

defineExpose({
  player: playerRef,
  play,
  pause,
  load
});
</script>

<template>
  <div :class="ns.base.value" :style="rootStyle">
    <video ref="videoRef" class="video-js xy-video-player__surface" playsinline />
  </div>
</template>
