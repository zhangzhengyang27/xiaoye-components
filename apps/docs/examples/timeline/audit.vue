<script setup lang="ts">
const auditGroups = [
  {
    title: "今天",
    description: "后台操作记录 / 审批流转 / 发布日志",
    records: [
      {
        timestamp: "09:20",
        title: "字段变更",
        meta: "运营 / 发布面板 / 工单 #A-2034",
        type: "primary",
        state: "done",
        description: "运营在发布面板修改了展示优先级，并同步到活动中心。"
      },
      {
        timestamp: "10:05",
        title: "审批流转",
        meta: "财务复核 / 预算编号待确认",
        type: "warning",
        state: "current",
        description: "审批单进入财务复核，等待确认预算编号与合同主体。"
      },
      {
        timestamp: "11:40",
        title: "发布日志",
        meta: "灰度系统 / 华东租户",
        type: "success",
        state: "blocked",
        description: "灰度批次 2 已完成，发布范围扩大到华东区域租户。"
      }
    ]
  }
];
</script>

<template>
  <div class="demo-timeline-scene">
    <div class="demo-timeline-scene__intro">
      <h4 class="demo-timeline-scene__intro-title">操作审计 / 审批流 / 发布日志</h4>
      <p class="demo-timeline-scene__intro-description">
        把“谁在什么时候做了什么”收口到一条连续时间线上，方便审计和复盘。
      </p>
    </div>

    <xy-card
      v-for="group in auditGroups"
      :key="group.title"
      class="demo-timeline-scene__card"
      shadow="hover"
    >
      <template #header>
        <div class="demo-timeline-scene__header">
          <strong>活动流 / 操作审计</strong>
          <xy-tag status="primary" round>最近 24 小时</xy-tag>
        </div>
      </template>

      <xy-timeline density="compact">
        <xy-timeline-group :title="group.title" :description="group.description">
          <template #extra>
            <span class="demo-timeline-scene__badge">{{ group.records.length }} 条</span>
          </template>

          <xy-timeline-item
            v-for="record in group.records"
            :key="record.timestamp"
            :timestamp="record.timestamp"
            :type="record.type"
            :state="record.state"
          >
            <template #title>
              {{ record.title }}
            </template>

            <template #meta>
              {{ record.meta }}
            </template>

            <template #actions>
              <xy-button text size="sm">查看</xy-button>
            </template>

            {{ record.description }}
          </xy-timeline-item>
        </xy-timeline-group>
      </xy-timeline>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-timeline-scene {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.demo-timeline-scene__intro-title {
  margin: 0 0 6px;
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-timeline-scene__intro-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.65;
}

.demo-timeline-scene__card {
  overflow: hidden;
}

.demo-timeline-scene__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.demo-timeline-scene__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--xy-radius-pill);
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: var(--xy-color-primary);
  font-size: 12px;
}
</style>
