<script setup lang="ts">
import { ref } from "vue";

type AudioPlayerExpose = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
} | null;

const playerRef = ref<AudioPlayerExpose>(null);
const volume = ref(0.6);

function jumpTo(seconds: number) {
  playerRef.value?.seek(seconds);
}

function changeVolume(nextVolume: number) {
  volume.value = nextVolume;
  playerRef.value?.setVolume(nextVolume);
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-audio-player
      ref="playerRef"
      v-model:volume="volume"
      src="https://www.w3schools.com/html/horse.mp3"
      title="外部控制台示例"
      artist="语音质检台"
    />

    <xy-space wrap>
      <xy-button type="primary" @click="playerRef?.play()">播放</xy-button>
      <xy-button plain @click="playerRef?.pause()">暂停</xy-button>
      <xy-button plain @click="playerRef?.stop()">停止</xy-button>
      <xy-button text @click="jumpTo(10)">跳到 10 秒</xy-button>
      <xy-button text @click="jumpTo(20)">跳到 20 秒</xy-button>
      <xy-button text @click="changeVolume(0.3)">音量 30%</xy-button>
      <xy-button text @click="changeVolume(0.9)">音量 90%</xy-button>
    </xy-space>
  </div>
</template>
