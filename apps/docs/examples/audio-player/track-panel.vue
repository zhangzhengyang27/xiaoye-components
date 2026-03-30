<script setup lang="ts">
import { ref } from "vue";

const volume = ref(0.8);
const current = ref(0);
const duration = ref(0);
const ended = ref(false);

const cover = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <rect width="320" height="320" rx="36" fill="#dbeafe"/>
  <circle cx="160" cy="160" r="88" fill="#93c5fd"/>
  <circle cx="160" cy="160" r="24" fill="#eff6ff"/>
  <path d="M212 92V206C212 228 196 244 174 244C152 244 136 228 136 206C136 184 152 168 174 168C185 168 194 171 202 177V122L242 112V92Z" fill="#1d4ed8"/>
</svg>
`)}`;

const track = {
  src: "https://www.w3schools.com/html/horse.mp3",
  title: "客服回访录音",
  artist: "工单 #A-2048",
  cover
};

function handleTimeUpdate(nextCurrent: number, nextDuration: number) {
  current.value = nextCurrent;
  duration.value = nextDuration;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-audio-player
      v-model:volume="volume"
      :track="track"
      :playback-rates="[1, 1.25, 1.5, 2]"
      @time-update="handleTimeUpdate"
      @end="ended = true"
      @play="ended = false"
    />

    <xy-space wrap>
      <xy-tag status="primary">音量：{{ volume.toFixed(2) }}</xy-tag>
      <xy-tag status="neutral">进度：{{ current.toFixed(0) }} / {{ duration.toFixed(0) }}s</xy-tag>
      <xy-tag :status="ended ? 'success' : 'warning'">
        {{ ended ? "本段录音已播放结束" : "播放中或待播放" }}
      </xy-tag>
    </xy-space>
  </div>
</template>
