<script setup lang="ts">
const sections = [
  {
    key: "summary",
    title: "审核摘要"
  },
  {
    key: "preview",
    title: "视频预览"
  }
];

const breadcrumbs = [
  {
    label: "审核中心",
    href: "/"
  },
  {
    label: "视频详情"
  }
];

const changes = [
  {
    key: "risk",
    label: "风险判定",
    before: "待处理",
    after: "需复核停留行为",
    status: "changed" as const
  }
];

const logs = [
  {
    id: "log-1",
    title: "提交审核",
    operator: "运营质检组",
    timestamp: "2026-03-30 10:05",
    status: "success" as const
  }
];

const poster = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <rect width="960" height="540" fill="#0f172a"/>
  <rect x="56" y="56" width="848" height="428" rx="28" fill="#1e293b"/>
  <circle cx="480" cy="270" r="76" fill="#f59e0b"/>
  <path d="M452 222L548 270L452 318Z" fill="#0f172a"/>
  <text x="88" y="118" font-size="34" fill="#fff" font-family="Arial">Audit Preview</text>
</svg>
`)}`;
</script>

<template>
  <xy-detail-page
    title="门店巡检视频"
    description="DetailPage 负责详情页骨架，VideoPlayer 负责视频预览与回放。"
    :breadcrumbs="breadcrumbs"
    :sections="sections"
    :changes="changes"
    :logs="logs"
  >
    <template #actions>
      <xy-button plain>打回重传</xy-button>
      <xy-button type="primary">确认通过</xy-button>
    </template>

    <template #summary>
      <xy-descriptions :column="2" border>
        <xy-descriptions-item label="门店">深圳海岸城店</xy-descriptions-item>
        <xy-descriptions-item label="拍摄人">巡检专员</xy-descriptions-item>
        <xy-descriptions-item label="审核标签">疑似异常停留</xy-descriptions-item>
        <xy-descriptions-item label="当前状态">待复核</xy-descriptions-item>
      </xy-descriptions>
    </template>

    <template #preview>
      <xy-video-player
        :poster="poster"
        :height="380"
        :sources="[
          {
            src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            type: 'video/mp4'
          }
        ]"
        :options="{
          playbackRates: [1, 1.25, 1.5, 2]
        }"
      />
    </template>
  </xy-detail-page>
</template>
