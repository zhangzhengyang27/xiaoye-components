<script setup lang="ts">
const sections = [
  {
    key: "base",
    title: "基础信息"
  },
  {
    key: "preview",
    title: "视频片段",
    description: "把 VideoPlayer 直接接入 DetailPage 的详情 section。"
  }
];

const attachments = [
  {
    id: "frame-shot",
    name: "关键帧截图.zip",
    size: "3.4 MB",
    status: "success" as const
  }
];

const logs = [
  {
    id: "log-1",
    title: "发起视频审核",
    operator: "运营质检组",
    timestamp: "2026-03-30 14:15",
    status: "processing" as const
  }
];

const poster = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#1f2937"/>
  <rect x="56" y="56" width="848" height="428" rx="28" fill="#374151"/>
  <circle cx="480" cy="270" r="76" fill="#f59e0b"/>
  <path d="M452 224L548 270L452 316Z" fill="#111827"/>
  <text x="92" y="116" font-size="34" fill="#fff" font-family="Arial">Audit Preview</text>
</svg>
`)}`;
</script>

<template>
  <xy-detail-page
    title="门店巡检详情"
    description="DetailPage 负责承接详情页结构，VideoPlayer 放在媒体预览 section 中。"
    :sections="sections"
    :attachments="attachments"
    :logs="logs"
  >
    <template #base>
      <xy-descriptions :column="2" border>
        <xy-descriptions-item label="门店">杭州武林店</xy-descriptions-item>
        <xy-descriptions-item label="审核状态">待复核</xy-descriptions-item>
        <xy-descriptions-item label="巡检时间">2026-03-30 13:40</xy-descriptions-item>
        <xy-descriptions-item label="审核人">小叶</xy-descriptions-item>
      </xy-descriptions>
    </template>

    <template #preview>
      <div class="xy-doc-stack">
        <xy-video-player
          :poster="poster"
          :height="360"
          :sources="[
            {
              src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
              type: 'video/mp4'
            }
          ]"
        />
        <xy-space wrap>
          <xy-tag status="warning">重点关注收银区停留</xy-tag>
          <xy-tag status="primary">建议结合门店日志复核</xy-tag>
        </xy-space>
      </div>
    </template>
  </xy-detail-page>
</template>
