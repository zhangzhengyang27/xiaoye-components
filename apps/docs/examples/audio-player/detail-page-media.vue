<script setup lang="ts">
const sections = [
  {
    key: "base",
    title: "基础信息"
  },
  {
    key: "record",
    title: "沟通录音",
    description: "把 AudioPlayer 直接放进 DetailPage 的 section 中。"
  }
];

const attachments = [
  {
    id: "transcript",
    name: "通话转写记录.md",
    size: "26 KB",
    status: "success" as const
  }
];

const logs = [
  {
    id: "log-1",
    title: "提交录音复核",
    operator: "小叶",
    timestamp: "2026-03-30 10:20",
    status: "processing" as const
  }
];
</script>

<template>
  <xy-detail-page
    title="售后工单详情"
    description="DetailPage 负责承接详情结构，AudioPlayer 放在业务 section 里承接录音回放。"
    :sections="sections"
    :attachments="attachments"
    :logs="logs"
  >
    <template #base>
      <xy-descriptions :column="2" border>
        <xy-descriptions-item label="工单编号">A-2048</xy-descriptions-item>
        <xy-descriptions-item label="客户">杭州云仓</xy-descriptions-item>
        <xy-descriptions-item label="当前状态">待复核</xy-descriptions-item>
        <xy-descriptions-item label="负责人">小叶</xy-descriptions-item>
      </xy-descriptions>
    </template>

    <template #record>
      <div class="xy-doc-stack">
        <xy-audio-player
          :track="{
            src: 'https://www.w3schools.com/html/horse.mp3',
            title: '售后回访录音',
            artist: '客服一组'
          }"
        />
        <xy-space wrap>
          <xy-tag status="warning">重点复核 18s-35s</xy-tag>
          <xy-tag status="primary">疑似承诺超时补发</xy-tag>
        </xy-space>
      </div>
    </template>
  </xy-detail-page>
</template>
