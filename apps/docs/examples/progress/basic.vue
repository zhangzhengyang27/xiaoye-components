<script setup lang="ts">
const pipelineItems = [
  {
    name: "订单中心发布",
    owner: "生产环境 · 负责人 Livia · 2 分钟前",
    percentage: 100,
    status: "success" as const,
    stage: "已完成",
    stageStatus: "success" as const,
    detail: "静态检查、单测与产物打包已完成"
  },
  {
    name: "结算链路修复",
    owner: "预发环境 · 负责人 Ethan · 8 分钟前",
    percentage: 68,
    stage: "灰度中",
    stageStatus: "primary" as const,
    color: "linear-gradient(90deg, #2563eb, #0f766e)",
    detail: "灰度 34 / 50 台节点，等待监控窗口结束"
  },
  {
    name: "素材服务扩容",
    owner: "多活环境 · 负责人 Nora · 刚刚",
    percentage: 34,
    status: "warning" as const,
    stage: "待确认",
    stageStatus: "warning" as const,
    color: "linear-gradient(90deg, #f59e0b, #ea580c)",
    detail: "支付链路仍有 2 条用例待确认"
  }
];
</script>

<template>
  <xy-card class="progress-release-board" shadow="always">
    <template #header>
      <div class="progress-release-board__header">
        <div>
          <strong>发布流水线</strong>
          <p>把构建、验证、灰度和正式发布收进同一块任务面板里看。</p>
        </div>
        <xy-tag status="primary" round>今天 09:20 更新</xy-tag>
      </div>
    </template>

    <div class="progress-release-board__list">
      <div
        v-for="item in pipelineItems"
        :key="item.name"
        class="progress-release-board__item"
      >
        <div class="progress-release-board__head">
          <div class="progress-release-board__copy">
            <strong>{{ item.name }}</strong>
            <p>{{ item.owner }}</p>
          </div>
          <xy-tag :status="item.stageStatus" round>{{ item.stage }}</xy-tag>
        </div>
        <xy-progress
          :percentage="item.percentage"
          :status="item.status"
          :color="item.color"
        >
          <span>{{ item.detail }}</span>
        </xy-progress>
      </div>
    </div>

    <template #footer>
      <span class="progress-release-board__footer">
        页面层统一维护任务状态，再把 `percentage / status / color` 映射给 `xy-progress`。
      </span>
    </template>
  </xy-card>
</template>

<style scoped>
.progress-release-board {
  max-width: 700px;
}

.progress-release-board__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.progress-release-board__header p,
.progress-release-board__copy p {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.progress-release-board__list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.progress-release-board__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 78%, white);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.96));
}

.progress-release-board__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.progress-release-board__copy {
  min-width: 0;
}

.progress-release-board__footer {
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

@media (max-width: 640px) {
  .progress-release-board__header,
  .progress-release-board__head {
    flex-direction: column;
  }
}
</style>
