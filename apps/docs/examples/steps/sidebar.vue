<script setup lang="ts">
const activities = [
  {
    title: "接收工单",
    time: "09:12",
    icon: "mdi:inbox-arrow-down-outline",
    note: "系统已自动归类到支付链路，工单优先级为 P2。",
    owner: "接单人：Nora"
  },
  {
    title: "分配处理人",
    time: "09:28",
    icon: "mdi:account-switch-outline",
    note: "已从值班席转交给交易平台负责人继续处理。",
    owner: "当前处理人：Mia"
  },
  {
    title: "同步客户说明",
    time: "09:43",
    icon: "mdi:message-badge-outline",
    note: "已同步影响范围、规避建议和预计恢复时间。",
    owner: "客户沟通：Ethan"
  },
  {
    title: "关闭归档",
    time: "待完成",
    icon: "mdi:archive-check-outline",
    note: "需要补齐复盘摘要后才能进入最终归档。",
    owner: "归档负责人：待确认"
  }
];
</script>

<template>
  <div class="demo-steps-sidebar">
    <xy-card class="demo-steps-sidebar__card" shadow="hover">
      <template #header>
        <div class="demo-steps-sidebar__header">
          <strong>工单详情侧栏</strong>
          <xy-text size="sm" type="info">vertical + 结构化插槽</xy-text>
        </div>
      </template>

      <xy-steps direction="vertical" :active="2" space="92px" finish-status="success">
        <xy-step
          v-for="activity in activities"
          :key="activity.title"
          :icon="activity.icon"
        >
          <template #title>
            <div class="demo-steps-sidebar__title">
              <span>{{ activity.title }}</span>
              <xy-tag :status="activity.time === '待完成' ? 'warning' : 'primary'" round>
                {{ activity.time }}
              </xy-tag>
            </div>
          </template>

          <template #description>
            <div class="demo-steps-sidebar__description">
              <strong>{{ activity.owner }}</strong>
              <p>{{ activity.note }}</p>
            </div>
          </template>
        </xy-step>
      </xy-steps>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-steps-sidebar {
  display: flex;
  justify-content: flex-end;
}

.demo-steps-sidebar__card {
  width: min(100%, 440px);
}

.demo-steps-sidebar__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-steps-sidebar__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.demo-steps-sidebar__description {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-steps-sidebar__description strong {
  color: var(--xy-text-color);
  font-size: 13px;
}

.demo-steps-sidebar__description p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.7;
}
</style>
