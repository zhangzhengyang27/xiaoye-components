<script setup lang="ts">
const activities = [
  {
    title: "客户补充备注",
    description: "补充了线下合同扫描件，等待法务复核。",
    timestamp: "5 分钟前",
    meta: "法务复核 / 附件 2 个",
    type: "primary",
    state: "current" as const
  },
  {
    title: "处理人已变更",
    description: "由售前支持转交给交付经理继续跟进。",
    timestamp: "20 分钟前",
    meta: "售前支持 -> 交付经理",
    type: "warning",
    state: "pending" as const
  },
  {
    title: "状态更新为已解决",
    description: "问题定位完成，修复已推送到客户专属分支。",
    timestamp: "1 小时前",
    meta: "客户专属分支 / 已回归",
    type: "success",
    state: "done" as const
  }
];
</script>

<template>
  <div class="demo-timeline-detail">
    <xy-card class="demo-timeline-detail__card" shadow="hover">
      <template #header>
        <div class="demo-timeline-detail__header">
          <strong>侧栏详情页 / 最近动态 / 处理记录</strong>
          <xy-text size="sm" type="info">compact + 结构化插槽</xy-text>
        </div>
      </template>

      <xy-timeline density="compact">
        <xy-timeline-group title="今天" description="右侧面板常见布局">
          <xy-timeline-item
            v-for="activity in activities"
            :key="activity.title"
            :timestamp="activity.timestamp"
            :type="activity.type"
            :state="activity.state"
          >
            <template #title>
              {{ activity.title }}
            </template>

            <template #meta>
              {{ activity.meta }}
            </template>

            <template #actions>
              <xy-button text size="sm">查看</xy-button>
            </template>

            {{ activity.description }}
          </xy-timeline-item>
        </xy-timeline-group>
      </xy-timeline>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-timeline-detail {
  display: flex;
  justify-content: flex-end;
}

.demo-timeline-detail__card {
  width: min(100%, 420px);
}

.demo-timeline-detail__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
