<script setup lang="ts">
import { computed, ref } from "vue";
import type { VideoPlayerSource } from "@xiaoye/components";

const activeKey = ref("clip-1");

const clipMap: Record<
  string,
  {
    title: string;
    sources: VideoPlayerSource[];
    poster: string;
  }
> = {
  "clip-1": {
    title: "门店入口回放",
    poster: "https://picsum.photos/seed/audit-clip-1/960/540",
    sources: [
      {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        type: "video/mp4"
      }
    ]
  },
  "clip-2": {
    title: "收银台片段",
    poster: "https://picsum.photos/seed/audit-clip-2/960/540",
    sources: [
      {
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "video/mp4"
      }
    ]
  }
};

const activeClip = computed(() => clipMap[activeKey.value]);
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="视频审核工作台">
      <div
        style="
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.8fr);
          gap: 16px;
        "
      >
        <xy-video-player
          :sources="activeClip.sources"
          :poster="activeClip.poster"
          :height="380"
        />

        <div class="xy-doc-stack">
          <xy-card header="片段列表">
            <xy-space direction="vertical" fill>
              <xy-button
                v-for="(clip, key) in clipMap"
                :key="key"
                :type="activeKey === key ? 'primary' : 'default'"
                plain
                @click="activeKey = key"
              >
                {{ clip.title }}
              </xy-button>
            </xy-space>
          </xy-card>

          <xy-card header="审核结论">
            <xy-space wrap>
              <xy-tag status="warning">待复核</xy-tag>
              <xy-tag status="primary">疑似异常停留</xy-tag>
            </xy-space>
            <p style="margin-bottom: 0">
              当前片段为《{{ activeClip.title }}》，建议结合门店日志进一步确认当班情况。
            </p>
          </xy-card>
        </div>
      </div>
    </xy-card>
  </div>
</template>
