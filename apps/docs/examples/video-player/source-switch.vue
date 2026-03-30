<script setup lang="ts">
import { ref } from "vue";

type VideoPlayerExpose = {
  play: () => Promise<void> | void;
  pause: () => void;
  load: (sources?: Array<{ src: string; type?: string }>) => void;
} | null;

const playerRef = ref<VideoPlayerExpose>(null);
const currentLabel = ref("花朵示例");

const sourceMap = {
  花朵示例: [
    {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      type: "video/mp4"
    }
  ],
  大片段示例: [
    {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "video/mp4"
    }
  ]
};

function switchSource(label: keyof typeof sourceMap) {
  currentLabel.value = label;
  playerRef.value?.load(sourceMap[label]);
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button
        v-for="label in Object.keys(sourceMap)"
        :key="label"
        :type="currentLabel === label ? 'primary' : 'default'"
        @click="switchSource(label as keyof typeof sourceMap)"
      >
        {{ label }}
      </xy-button>
      <xy-button plain @click="playerRef?.play()">播放</xy-button>
      <xy-button plain @click="playerRef?.pause()">暂停</xy-button>
    </xy-space>

    <xy-video-player
      ref="playerRef"
      :sources="sourceMap[currentLabel as keyof typeof sourceMap]"
      :height="360"
    />

    <xy-tag status="neutral">当前视频源：{{ currentLabel }}</xy-tag>
  </div>
</template>
