<script setup lang="ts">
const sections = [
  {
    key: "summary",
    title: "回访摘要"
  },
  {
    key: "record",
    title: "录音回放"
  }
];

const breadcrumbs = [
  {
    label: "质检台",
    href: "/"
  },
  {
    label: "回访详情"
  }
];

const attachments = [
  {
    id: "script-1",
    name: "回访话术.pdf",
    size: "84 KB",
    status: "success" as const
  }
];

const logs = [
  {
    id: "log-1",
    title: "提交复核",
    operator: "小叶",
    timestamp: "2026-03-30 14:20",
    status: "processing" as const
  }
];
</script>

<template>
  <xy-detail-page
    title="客服回访详情"
    description="DetailPage 负责详情页骨架，AudioPlayer 负责录音回放能力。"
    :breadcrumbs="breadcrumbs"
    :sections="sections"
    :attachments="attachments"
    :logs="logs"
  >
    <template #actions>
      <xy-button plain>转交复核</xy-button>
      <xy-button type="primary">通过质检</xy-button>
    </template>

    <template #summary>
      <xy-descriptions :column="2" border>
        <xy-descriptions-item label="客户">深圳南山门店</xy-descriptions-item>
        <xy-descriptions-item label="责任人">客服一组</xy-descriptions-item>
        <xy-descriptions-item label="问题类型">售后咨询</xy-descriptions-item>
        <xy-descriptions-item label="当前状态">待复核</xy-descriptions-item>
      </xy-descriptions>
    </template>

    <template #record>
      <xy-audio-player
        :track="{
          src: 'https://www.w3schools.com/html/horse.mp3',
          title: '客服回访录音',
          artist: '工单 #A-2048'
        }"
      />
    </template>
  </xy-detail-page>
</template>
