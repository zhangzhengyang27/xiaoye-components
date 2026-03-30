<script setup lang="ts">
import { computed, ref } from "vue";
import type { AudioPlayerTrack } from "@xiaoye/components";

const activeIndex = ref(0);

const tracks: AudioPlayerTrack[] = [
  {
    src: "https://www.w3schools.com/html/horse.mp3",
    title: "客服回访录音",
    artist: "工单 #A-2048"
  },
  {
    src: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    title: "投诉复核录音",
    artist: "工单 #B-1092"
  }
];

const activeTrack = computed(() => tracks[activeIndex.value]);
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="语音质检回放台">
      <div
        style="
          display: grid;
          grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.6fr);
          gap: 16px;
        "
      >
        <xy-card header="录音列表">
          <xy-space direction="vertical" fill>
            <xy-button
              v-for="(track, index) in tracks"
              :key="track.title"
              :type="activeIndex === index ? 'primary' : 'default'"
              plain
              @click="activeIndex = index"
            >
              {{ track.title }}
            </xy-button>
          </xy-space>
        </xy-card>

        <div class="xy-doc-stack">
          <xy-audio-player :track="activeTrack" />

          <xy-card header="质检备注">
            <xy-space wrap>
              <xy-tag status="warning">情绪波动</xy-tag>
              <xy-tag status="primary">需要回访</xy-tag>
            </xy-space>
            <p style="margin-bottom: 0">
              建议重点复核第 18 秒到第 35 秒的沟通内容，确认是否需要补充解释说明。
            </p>
          </xy-card>
        </div>
      </div>
    </xy-card>
  </div>
</template>
