<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

const releaseRows = [
  {
    name: "订单中心发布",
    owner: "Livia",
    status: "已完成",
    progress: "100%"
  },
  {
    name: "素材服务扩容",
    owner: "Nora",
    status: "灰度中",
    progress: "72%"
  },
  {
    name: "清结算修复",
    owner: "Ethan",
    status: "待确认",
    progress: "48%"
  }
];
</script>

<template>
  <div class="demo-skeleton-dashboard">
    <xy-space wrap>
      <xy-button type="primary" @click="loading = !loading">
        {{ loading ? "查看真实内容" : "切回骨架态" }}
      </xy-button>
      <xy-tag :status="loading ? 'warning' : 'success'" round>
        {{ loading ? "控制台加载中" : "控制台已就绪" }}
      </xy-tag>
    </xy-space>

    <div class="demo-skeleton-dashboard__hero">
      <xy-card
        v-for="item in ['发布窗口', '风险水位', '异常队列']"
        :key="item"
        variant="muted"
        shadow="never"
      >
        <xy-skeleton :loading="loading" animated>
          <template #template>
            <div class="demo-skeleton-dashboard__metric">
              <xy-skeleton-item variant="h3" style="width: 52%;" />
              <xy-skeleton-item variant="text" style="width: 72%;" />
              <xy-skeleton-item variant="circle" />
            </div>
          </template>

          <div class="demo-skeleton-dashboard__metric-real">
            <strong>{{ item }}</strong>
            <p>当前窗口稳定，适合继续推进核心发布任务。</p>
            <xy-tag status="primary" round>已更新</xy-tag>
          </div>
        </xy-skeleton>
      </xy-card>
    </div>

    <div class="demo-skeleton-dashboard__main">
      <xy-card shadow="never">
        <template #header>
          <div class="demo-skeleton-dashboard__head">
            <strong>发布任务队列</strong>
            <xy-tag status="neutral" round>波次 A</xy-tag>
          </div>
        </template>

        <xy-skeleton :loading="loading" animated>
          <template #template>
            <div class="demo-skeleton-dashboard__table">
              <div
                v-for="item in 4"
                :key="item"
                class="demo-skeleton-dashboard__table-row"
              >
                <xy-skeleton-item variant="h3" style="width: 32%;" />
                <xy-skeleton-item variant="text" style="width: 22%;" />
                <xy-skeleton-item variant="p" />
              </div>
            </div>
          </template>

          <div class="demo-skeleton-dashboard__table-real">
            <div
              v-for="item in releaseRows"
              :key="item.name"
              class="demo-skeleton-dashboard__table-real-row"
            >
              <div>
                <strong>{{ item.name }}</strong>
                <p>Owner · {{ item.owner }}</p>
              </div>
              <xy-tag :status="item.status === '已完成' ? 'success' : item.status === '灰度中' ? 'primary' : 'warning'">
                {{ item.status }}
              </xy-tag>
              <xy-text type="info">推进状态：{{ item.progress }}</xy-text>
            </div>
          </div>
        </xy-skeleton>
      </xy-card>

      <xy-card shadow="never">
        <template #header>
          <div class="demo-skeleton-dashboard__head">
            <strong>摘要与建议</strong>
            <xy-tag status="warning" round>需关注</xy-tag>
          </div>
        </template>

        <xy-skeleton :loading="loading" animated>
          <template #template>
            <div class="demo-skeleton-dashboard__aside">
              <xy-skeleton-item variant="h3" style="width: 48%;" />
              <xy-skeleton-item variant="text" />
              <xy-skeleton-item variant="text" style="width: 78%;" />
              <xy-skeleton-item variant="button" />
            </div>
          </template>

          <div class="demo-skeleton-dashboard__aside-real">
            <strong>当前窗口建议先完成灰度验证</strong>
            <p>发布、风控和消息中心的任务都还在同一波次内，建议先确认灰度指标再继续放量。</p>
            <xy-button plain>查看发布 checklist</xy-button>
          </div>
        </xy-skeleton>
      </xy-card>
    </div>
  </div>
</template>

<style scoped>
.demo-skeleton-dashboard {
  display: grid;
  gap: 18px;
}

.demo-skeleton-dashboard__hero {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.demo-skeleton-dashboard__main {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.95fr);
  gap: 16px;
}

.demo-skeleton-dashboard__metric,
.demo-skeleton-dashboard__metric-real,
.demo-skeleton-dashboard__aside,
.demo-skeleton-dashboard__aside-real {
  display: grid;
  gap: 12px;
}

.demo-skeleton-dashboard__metric-real p,
.demo-skeleton-dashboard__table-real-row p,
.demo-skeleton-dashboard__aside-real p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

.demo-skeleton-dashboard__table {
  display: grid;
  gap: 14px;
}

.demo-skeleton-dashboard__table-row,
.demo-skeleton-dashboard__table-real-row {
  display: grid;
  grid-template-columns: minmax(180px, 1.2fr) 96px minmax(120px, 0.8fr);
  gap: 14px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 80%, white);
}

.demo-skeleton-dashboard__table-row:last-child,
.demo-skeleton-dashboard__table-real-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.demo-skeleton-dashboard__table-real {
  display: grid;
  gap: 14px;
}

.demo-skeleton-dashboard__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 960px) {
  .demo-skeleton-dashboard__hero,
  .demo-skeleton-dashboard__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .demo-skeleton-dashboard__table-row,
  .demo-skeleton-dashboard__table-real-row {
    grid-template-columns: 1fr;
  }

  .demo-skeleton-dashboard__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
