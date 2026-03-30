<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Howl } from "howler";
import { useNamespace } from "@xiaoye/composables";
import XyButton from "../../button";
import XySlider from "../../slider";
import XyIcon from "../../icon";
import type { SliderValue } from "../../slider/src/slider";
import type { AudioPlayerProps } from "./audio-player";

defineOptions({
  name: "XyAudioPlayer"
});

const props = withDefaults(defineProps<AudioPlayerProps>(), {
  src: undefined,
  track: undefined,
  title: "",
  artist: "",
  autoplay: false,
  loop: false,
  muted: false,
  volume: 1,
  playbackRates: () => [0.75, 1, 1.25, 1.5, 2]
});

const emit = defineEmits<{
  init: [howl: Howl];
  ready: [howl: Howl];
  play: [];
  pause: [];
  end: [];
  "update:volume": [value: number];
  "time-update": [currentTime: number, duration: number];
}>();

const ns = useNamespace("audio-player");
const howlRef = ref<Howl | null>(null);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const currentVolume = ref(props.volume);
const currentRateIndex = ref(
  Math.max(
    props.playbackRates.findIndex((rate) => rate === 1),
    0
  )
);
const playing = ref(false);
let rafId: number | null = null;

const resolvedSrc = computed(() => props.track?.src ?? props.src ?? []);
const resolvedTitle = computed(() => props.track?.title ?? props.title);
const resolvedArtist = computed(() => props.track?.artist ?? props.artist);
const resolvedCover = computed(() => props.track?.cover ?? "");
const rate = computed(() => props.playbackRates[currentRateIndex.value] ?? 1);

function cancelFrame() {
  if (typeof window === "undefined" || rafId === null) {
    return;
  }

  window.cancelAnimationFrame(rafId);
  rafId = null;
}

function tick() {
  if (!howlRef.value || !playing.value) {
    return;
  }

  const nextTime = Number(howlRef.value.seek() || 0);
  currentTime.value = nextTime;
  progress.value = duration.value > 0 ? Math.min(nextTime / duration.value, 1) : 0;
  emit("time-update", currentTime.value, duration.value);

  if (typeof window !== "undefined") {
    rafId = window.requestAnimationFrame(tick);
  }
}

function createHowl() {
  const source = Array.isArray(resolvedSrc.value)
    ? resolvedSrc.value
    : resolvedSrc.value
      ? [resolvedSrc.value]
      : [];

  howlRef.value?.unload();

  if (!source.length) {
    howlRef.value = null;
    currentTime.value = 0;
    duration.value = 0;
    progress.value = 0;
    playing.value = false;
    return;
  }

  let instance: Howl | null = null;
  const handleLoaded = () => {
    const current = instance ?? howlRef.value;

    if (!current) {
      queueMicrotask(handleLoaded);
      return;
    }

    duration.value = current.duration();
    emit("init", current);
    emit("ready", current);
  };

  instance = new Howl({
    src: source,
    autoplay: props.autoplay,
    loop: props.loop,
    mute: props.muted,
    volume: currentVolume.value,
    rate: rate.value,
    html5: true,
    onload: handleLoaded,
    onplay: () => {
      playing.value = true;
      cancelFrame();
      tick();
      emit("play");
    },
    onpause: () => {
      playing.value = false;
      cancelFrame();
      emit("pause");
    },
    onstop: () => {
      playing.value = false;
      currentTime.value = 0;
      progress.value = 0;
      cancelFrame();
    },
    onend: () => {
      playing.value = false;
      progress.value = 1;
      cancelFrame();
      emit("end");
    }
  });

  howlRef.value = instance;
}

function play() {
  howlRef.value?.play();
}

function pause() {
  howlRef.value?.pause();
}

function stop() {
  howlRef.value?.stop();
}

function seek(seconds: number) {
  if (!howlRef.value) {
    return;
  }

  howlRef.value.seek(seconds);
  currentTime.value = seconds;
  progress.value = duration.value > 0 ? Math.min(seconds / duration.value, 1) : 0;
}

function setVolume(value: SliderValue) {
  if (typeof value !== "number") {
    return;
  }

  currentVolume.value = value;
  howlRef.value?.volume(value);
  emit("update:volume", value);
}

function togglePlay() {
  if (!howlRef.value) {
    return;
  }

  if (playing.value) {
    pause();
    return;
  }

  play();
}

function stepSeek(delta: number) {
  seek(Math.max(0, Math.min(duration.value, currentTime.value + delta)));
}

function cycleRate() {
  if (!props.playbackRates.length) {
    return;
  }

  currentRateIndex.value = (currentRateIndex.value + 1) % props.playbackRates.length;
  howlRef.value?.rate(rate.value);
}

watch(
  () => [resolvedSrc.value, props.autoplay, props.loop, props.muted] as const,
  () => {
    createHowl();
  },
  {
    deep: true
  }
);

watch(
  () => props.volume,
  (value) => {
    currentVolume.value = value;
    howlRef.value?.volume(value);
  }
);

watch(progress, (value) => {
  if (!duration.value || !howlRef.value) {
    return;
  }

  const nextTime = Number((value * duration.value).toFixed(2));
  const diff = Math.abs(nextTime - currentTime.value);

  if (diff < 0.25) {
    return;
  }

  seek(nextTime);
});

onMounted(() => {
  createHowl();
});

onBeforeUnmount(() => {
  cancelFrame();
  howlRef.value?.unload();
  howlRef.value = null;
});

defineExpose({
  howl: howlRef,
  play,
  pause,
  stop,
  seek,
  setVolume
});
</script>

<template>
  <div :class="ns.base.value">
    <div v-if="resolvedCover" class="xy-audio-player__cover">
      <img :src="resolvedCover" :alt="resolvedTitle || 'audio cover'" />
    </div>

    <div class="xy-audio-player__body">
      <div class="xy-audio-player__meta">
        <div>
          <strong v-if="resolvedTitle" class="xy-audio-player__title">{{ resolvedTitle }}</strong>
          <p v-if="resolvedArtist" class="xy-audio-player__artist">{{ resolvedArtist }}</p>
        </div>
        <button class="xy-audio-player__rate" type="button" @click="cycleRate">
          {{ rate }}x
        </button>
      </div>

      <div class="xy-audio-player__progress">
        <span>{{ currentTime.toFixed(0) }}s</span>
        <xy-slider v-model="progress" :min="0" :max="1" :step="0.01" />
        <span>{{ duration.toFixed(0) }}s</span>
      </div>

      <div class="xy-audio-player__actions">
        <xy-button text @click="stepSeek(-15)">
          <xy-icon icon="mdi:rewind-15" />
        </xy-button>
        <xy-button type="primary" @click="togglePlay">
          <xy-icon :icon="playing ? 'mdi:pause' : 'mdi:play'" />
          {{ playing ? "暂停" : "播放" }}
        </xy-button>
        <xy-button text @click="stepSeek(15)">
          <xy-icon icon="mdi:fast-forward-15" />
        </xy-button>
      </div>

      <div class="xy-audio-player__volume">
        <span>音量</span>
        <xy-slider
          :model-value="currentVolume"
          :min="0"
          :max="1"
          :step="0.05"
          @update:model-value="setVolume"
        />
      </div>
    </div>
  </div>
</template>
