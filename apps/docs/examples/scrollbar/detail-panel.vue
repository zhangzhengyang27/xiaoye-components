<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("overview");
const items = [
  { key: "overview", label: "概览" },
  { key: "members", label: "成员" },
  { key: "timeline", label: "时间线" }
];

const members = [
  { id: 1, name: "Xiaoye", role: "Owner", status: "在线" },
  { id: 2, name: "Alice", role: "Maintainer", status: "请假" },
  { id: 3, name: "Bob", role: "Operator", status: "在线" }
];

const activities = [
  "19:30 完成权限矩阵同步，并更新到预发环境。",
  "18:45 对账规则新增异常提示，等待产品确认文案。",
  "17:10 调整表格筛选交互，统一滚动区留白。",
  "15:20 新增审批流回退记录，补齐操作审计。"
];
</script>

<template>
  <div class="demo-scroll-detail">
    <header class="demo-scroll-detail__header">
      <div class="demo-scroll-detail__title">
        <xy-text tag="strong" type="primary">Billing Console</xy-text>
        <xy-text size="sm" type="info">右侧详情侧栏 / 固定高度内容区</xy-text>
      </div>
      <xy-space wrap>
        <xy-tag status="success" round>运行中</xy-tag>
        <xy-tag status="primary">P1 项目</xy-tag>
      </xy-space>
    </header>

    <xy-tabs v-model="activeKey" :items="items">
      <template #default="{ activeKey: key }">
        <xy-scrollbar height="280px">
          <div class="demo-scroll-detail__content">
            <template v-if="key === 'overview'">
              <section class="demo-scroll-detail__section">
                <xy-text tag="strong">项目说明</xy-text>
                <xy-text tag="p" class="demo-scroll-detail__paragraph">
                  该项目负责账单总览、异常对账和历史流水查询。右侧详情区域通常会堆叠较多说明块、标签和操作摘要，因此适合把滚动约束在局部容器里，而不是推动整个页面滚动。
                </xy-text>
              </section>

              <section class="demo-scroll-detail__section">
                <xy-text tag="strong">关键指标</xy-text>
                <div class="demo-scroll-detail__metrics">
                  <div>
                    <span>今日请求</span>
                    <strong>12,480</strong>
                  </div>
                  <div>
                    <span>异常率</span>
                    <strong>0.32%</strong>
                  </div>
                  <div>
                    <span>负责人</span>
                    <strong>Xiaoye</strong>
                  </div>
                </div>
              </section>
            </template>

            <template v-else-if="key === 'members'">
              <section class="demo-scroll-detail__section">
                <xy-text tag="strong">成员列表</xy-text>
                <xy-table :data="members" row-key="id">
                  <xy-table-column prop="name" label="成员" width="120" />
                  <xy-table-column prop="role" label="角色" width="120" />
                  <xy-table-column prop="status" label="状态" width="100">
                    <template #default="{ value }">
                      <xy-tag :status="value === '在线' ? 'success' : 'warning'">{{ value }}</xy-tag>
                    </template>
                  </xy-table-column>
                </xy-table>
              </section>
            </template>

            <template v-else>
              <section class="demo-scroll-detail__section">
                <xy-text tag="strong">最近动态</xy-text>
                <div class="demo-scroll-detail__timeline">
                  <article
                    v-for="activity in activities"
                    :key="activity"
                    class="demo-scroll-detail__timeline-item"
                  >
                    <xy-text tag="p" class="demo-scroll-detail__paragraph">
                      {{ activity }}
                    </xy-text>
                  </article>
                </div>
              </section>
            </template>
          </div>
        </xy-scrollbar>
      </template>
    </xy-tabs>
  </div>
</template>

<style scoped>
.demo-scroll-detail {
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--xy-color-primary) 10%, white),
      transparent 42%
    ),
    var(--xy-bg-color);
}

.demo-scroll-detail__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-scroll-detail__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-scroll-detail__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 8px;
}

.demo-scroll-detail__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 78%, white);
}

.demo-scroll-detail__paragraph {
  margin: 0;
}

.demo-scroll-detail__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.demo-scroll-detail__metrics div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 12px;
  background: var(--xy-bg-color);
}

.demo-scroll-detail__metrics span {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-scroll-detail__metrics strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-scroll-detail__timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-scroll-detail__timeline-item {
  padding-left: 12px;
  border-left: 2px solid color-mix(in srgb, var(--xy-color-primary) 18%, white);
}
</style>
