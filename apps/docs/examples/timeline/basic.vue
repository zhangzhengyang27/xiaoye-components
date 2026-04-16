<script setup lang="ts">
const records = [
  {
    title: "创建需求单",
    description: "产品补充版本目标、交付范围和验收标准。",
    meta: "产品 / 需求池",
    timestamp: "2026-03-20 09:30"
  },
  {
    title: "技术评审",
    description: "前后端确认接口、状态流转和回滚预案。",
    meta: "研发 / 评审会",
    timestamp: "2026-03-21 14:10"
  },
  {
    title: "灰度发布",
    description: "按项目组和租户范围分批开放能力。",
    meta: "发布 / 灰度批次 1",
    timestamp: "2026-03-24 18:45"
  }
];
</script>

<template>
  <div class="demo-timeline-basic">
    <p class="demo-timeline-basic__tip">
      默认 `mode='start'` 会把时间线贴左侧展开，这是最常见的后台时间线形态。
    </p>

    <xy-timeline>
      <xy-timeline-item
        v-for="record in records"
        :key="record.title"
        :timestamp="record.timestamp"
        state="done"
      >
        <template #title>
          {{ record.title }}
        </template>

        <template #meta>
          {{ record.meta }}
        </template>

        <div class="demo-timeline-basic__content">
          {{ record.description }}
        </div>
      </xy-timeline-item>
    </xy-timeline>
  </div>
</template>

<style scoped>
.demo-timeline-basic {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-timeline-basic__tip {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.demo-timeline-basic__content {
  padding: 12px 14px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-surface-raised) 94%, white);
  box-shadow: var(--xy-shadow-xs);
}
</style>
