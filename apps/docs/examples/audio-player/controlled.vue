<script setup lang="ts">
import { computed, ref } from "vue";
import type { AudioPlayerInstance, AudioPlayerTrack } from "@xiaoye/components";

const playerRef = ref<AudioPlayerInstance | null>(null);
const currentIndex = ref(0);
const externalVolume = ref(0.7);

const tracks: AudioPlayerTrack[] = [
  {
    src: "https://www.w3schools.com/html/horse.mp3",
    title: "巡检播报",
    artist: "系统语音"
  },
  {
    src: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    title: "背景示例音频",
    artist: "公开演示资源"
  }
];

const currentTrack = computed(() => tracks[currentIndex.value]);

function switchTrack(index: number) {
  currentIndex.value = index;
}

function applyVolume() {
  playerRef.value?.setVolume(externalVolume.value);
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-space>
      <xy-button
        v-for="(track, index) in tracks"
        :key="track.title"
        :type="currentIndex === index ? 'primary' : 'default'"
        @click="switchTrack(index)"
      >
        {{ track.title }}
      </xy-button>
    </xy-space>

    <xy-space align="center">
      <xy-text>外部音量</xy-text>
      <xy-slider v-model="externalVolume" :min="0" :max="1" :step="0.05" style="width: 220px" />
      <xy-button plain @click="applyVolume">应用到播放器</xy-button>
    </xy-space>

    <xy-audio-player
      ref="playerRef"
      :track="currentTrack"
      :volume="externalVolume"
      @update:volume="externalVolume = $event"
    />
  </div>
</template>
