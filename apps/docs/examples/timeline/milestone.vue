<script setup lang="ts">
const phases = [
  {
    title: "M1 需求冻结",
    subtitle: "确认接口、字段、权限和上线窗口。",
    meta: "第 1 周 / 已完成",
    timestamp: "计划 03-20",
    state: "done" as const
  },
  {
    title: "M2 核心功能完成",
    subtitle: "交付首轮联调包，并把异常链路接入埋点。",
    meta: "第 3 周 / 当前阶段",
    timestamp: "计划 04-03",
    state: "current" as const
  },
  {
    title: "M3 验收与培训",
    subtitle: "准备演示环境、培训材料和上线 checklist。",
    meta: "第 5 周 / 待开始",
    timestamp: "计划 04-17",
    state: "pending" as const
  },
  {
    title: "M4 正式发布",
    subtitle: "按租户批次切流，并在稳定后关闭兼容分支。",
    meta: "第 6 周 / 风险项未清",
    timestamp: "计划 04-24",
    state: "blocked" as const
  }
];
</script>

<template>
  <div class="demo-timeline-milestone">
    <xy-card shadow="hover">
      <template #header>
        <div class="demo-timeline-milestone__header">
          <strong class="demo-timeline-milestone__header-title">项目里程碑 / 阶段流</strong>
          <span class="demo-timeline-milestone__header-description">和活动流共用同一套 Group + state + 结构化区域</span>
        </div>
      </template>

      <xy-timeline mode="alternate">
        <xy-timeline-group title="Q2 版本节奏" description="计划时间 / 当前阶段 / 风险提醒">
          <template #extra>
            <xy-tag status="primary" round>版本 2.4</xy-tag>
          </template>

          <xy-timeline-item
            v-for="phase in phases"
            :key="phase.title"
            :timestamp="phase.timestamp"
            :type="phase.state === 'blocked' ? 'warning' : 'primary'"
            :state="phase.state"
            icon="mdi:flag-variant"
          >
            <template #title>
              {{ phase.title }}
            </template>

            <template #meta>
              {{ phase.meta }}
            </template>

            {{ phase.subtitle }}
          </xy-timeline-item>
        </xy-timeline-group>
      </xy-timeline>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-timeline-milestone__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-timeline-milestone__header-title {
  color: var(--xy-text-color);
}

.demo-timeline-milestone__header-description {
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}
</style>
