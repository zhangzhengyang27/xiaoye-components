<script setup lang="ts">
import { computed, ref } from "vue";
import type { VideoPlayerInstance, VideoPlayerSource } from "@xiaoye/components";

const playerRef = ref<VideoPlayerInstance | null>(null);
const activeKey = ref("flower");

const sourceMap: Record<string, VideoPlayerSource[]> = {
  flower: [
    {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      type: "video/mp4"
    }
  ],
  bunny: [
    {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "video/mp4"
    }
  ]
};

const currentSources = computed(() => sourceMap[activeKey.value]);

function switchVideo(key: string) {
  activeKey.value = key;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-space>
      <xy-button :type="activeKey === 'flower' ? 'primary' : 'default'" @click="switchVideo('flower')">
        花朵样片
      </xy-button>
      <xy-button :type="activeKey === 'bunny' ? 'primary' : 'default'" @click="switchVideo('bunny')">
        演示样片
      </xy-button>
      <xy-button plain @click="playerRef?.load(currentSources)">手动重新加载</xy-button>
    </xy-space>

    <xy-video-player ref="playerRef" :sources="currentSources" :height="360" />
  </div>
</template>
