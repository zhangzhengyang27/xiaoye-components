<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);

const operationTags = [
  { label: "生产环境", status: "danger" as const },
  { label: "波次 A", status: "primary" as const },
  { label: "最近 24 小时", status: "neutral" as const }
] as const;

const metrics = [
  {
    title: "发布窗口",
    value: "12 / 16",
    label: "已完成批次",
    hint: "较昨晚提前 18 分钟",
    tag: "推进正常",
    tagStatus: "success" as const
  },
  {
    title: "风险水位",
    value: "2",
    label: "需人工确认",
    hint: "较上一窗口少 1 项",
    tag: "可继续灰度",
    tagStatus: "warning" as const
  },
  {
    title: "异常队列",
    value: "7",
    label: "待处理告警",
    hint: "核心链路已回落到低位",
    tag: "持续观察",
    tagStatus: "primary" as const
  }
] as const;

const releaseRows = [
  {
    name: "订单中心发布",
    owner: "Livia",
    env: "生产环境",
    status: "已完成",
    progress: 100,
    eta: "10:12 完成",
    risk: "低风险",
    riskStatus: "success" as const
  },
  {
    name: "素材服务扩容",
    owner: "Nora",
    env: "多活环境",
    status: "灰度中",
    progress: 72,
    eta: "预计 10:36",
    risk: "需观察",
    riskStatus: "warning" as const
  },
  {
    name: "清结算修复",
    owner: "Ethan",
    env: "预发环境",
    status: "待确认",
    progress: 48,
    eta: "等待 QA 回归",
    risk: "待确认",
    riskStatus: "danger" as const
  }
] as const;

const checklist = [
  "先确认素材服务扩容后的错误率和延迟走势",
  "清结算修复需补最后一轮支付链路回归",
  "异常队列里的 2 条订单告警建议留到下一波次处理"
] as const;
</script>

<template>
  <div class="demo-skeleton-dashboard">
    <div class="demo-skeleton-dashboard__toolbar">
      <div class="demo-skeleton-dashboard__toolbar-copy">
        <strong>发布控制台</strong>
        <p class="demo-skeleton-dashboard__toolbar-description">
          同一屏里同时承接 KPI、任务队列和摘要区块，是 Skeleton 在后台页面最常见的落点。
        </p>
      </div>

      <div class="demo-skeleton-dashboard__toolbar-actions">
        <xy-space wrap>
          <xy-tag
            v-for="item in operationTags"
            :key="item.label"
            :status="item.status"
            round
          >
            {{ item.label }}
          </xy-tag>
          <xy-tag :status="loading ? 'warning' : 'success'" round>
            {{ loading ? "控制台加载中" : "控制台已就绪" }}
          </xy-tag>
        </xy-space>
        <xy-button type="primary" @click="loading = !loading">
          {{ loading ? "查看真实内容" : "切回骨架态" }}
        </xy-button>
      </div>
    </div>

    <div class="demo-skeleton-dashboard__hero">
      <xy-card
        v-for="item in metrics"
        :key="item.title"
        variant="muted"
        shadow="never"
      >
        <xy-skeleton :loading="loading" animated>
          <template #template>
            <div class="demo-skeleton-dashboard__metric">
              <xy-skeleton-item variant="h3" style="width: 44%;" />
              <xy-skeleton-item variant="caption" style="width: 58%;" />
              <xy-skeleton-item variant="h1" style="width: 36%;" />
              <xy-skeleton-item variant="text" style="width: 72%;" />
              <xy-skeleton-item variant="button" />
            </div>
          </template>

          <div class="demo-skeleton-dashboard__metric-real">
            <div class="demo-skeleton-dashboard__metric-head">
              <strong>{{ item.title }}</strong>
              <xy-tag :status="item.tagStatus" round>{{ item.tag }}</xy-tag>
            </div>
            <div class="demo-skeleton-dashboard__metric-value">{{ item.value }}</div>
            <p class="demo-skeleton-dashboard__metric-description">{{ item.label }}</p>
            <span class="demo-skeleton-dashboard__metric-hint">{{ item.hint }}</span>
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
                :class="{ 'is-last': item === 4 }"
              >
                <xy-skeleton-item variant="h3" style="width: 60%;" />
                <xy-skeleton-item variant="button" style="width: 84px;" />
                <div class="demo-skeleton-dashboard__table-progress">
                  <xy-skeleton-item variant="text" style="width: 92%;" />
                  <xy-skeleton-item variant="caption" style="width: 54%;" />
                </div>
                <xy-skeleton-item variant="button" style="width: 72px;" />
              </div>
            </div>
          </template>

          <div class="demo-skeleton-dashboard__table-real">
            <div
              v-for="(item, index) in releaseRows"
              :key="item.name"
              class="demo-skeleton-dashboard__table-real-row"
              :class="{ 'is-last': index === releaseRows.length - 1 }"
            >
              <div class="demo-skeleton-dashboard__service">
                <strong>{{ item.name }}</strong>
                <p class="demo-skeleton-dashboard__table-description">{{ item.env }} · Owner {{ item.owner }}</p>
              </div>
              <xy-tag :status="item.status === '已完成' ? 'success' : item.status === '灰度中' ? 'primary' : 'warning'">
                {{ item.status }}
              </xy-tag>
              <div class="demo-skeleton-dashboard__row-meta">
                <xy-progress
                  :percentage="item.progress"
                  :status="item.status === '已完成' ? 'success' : item.status === '待确认' ? 'warning' : ''"
                  :show-text="false"
                />
                <span class="demo-skeleton-dashboard__row-meta-note">{{ item.eta }}</span>
              </div>
              <xy-tag :status="item.riskStatus" round>{{ item.risk }}</xy-tag>
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
            <div class="demo-skeleton-dashboard__aside-headline">
              <strong>当前窗口建议先完成灰度验证</strong>
              <xy-tag status="warning" round>需人工确认 2 项</xy-tag>
            </div>
            <p class="demo-skeleton-dashboard__aside-description">
              发布、风控和消息中心的任务都还在同一波次内，建议先确认灰度指标再继续放量。
            </p>
            <ul class="demo-skeleton-dashboard__checklist">
              <li
                v-for="item in checklist"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
            <xy-space wrap>
              <xy-button type="primary">查看发布 checklist</xy-button>
              <xy-button plain>打开监控看板</xy-button>
            </xy-space>
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

.demo-skeleton-dashboard__toolbar,
.demo-skeleton-dashboard__toolbar-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-skeleton-dashboard__toolbar-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-skeleton-dashboard__toolbar-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

.demo-skeleton-dashboard__toolbar-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
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

.demo-skeleton-dashboard__metric-head,
.demo-skeleton-dashboard__aside-headline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.demo-skeleton-dashboard__metric-value {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  color: var(--xy-text-color);
}

.demo-skeleton-dashboard__metric-hint,
.demo-skeleton-dashboard__row-meta-note {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-skeleton-dashboard__metric-description,
.demo-skeleton-dashboard__table-description,
.demo-skeleton-dashboard__aside-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

.demo-skeleton-dashboard__service {
  min-width: 0;
}

.demo-skeleton-dashboard__row-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-skeleton-dashboard__checklist {
  margin: 0;
  padding-left: 18px;
  color: var(--xy-text-color-secondary);
  display: grid;
  gap: 8px;
}

.demo-skeleton-dashboard__table {
  display: grid;
  gap: 14px;
}

.demo-skeleton-dashboard__table-progress {
  display: grid;
  gap: 10px;
}

.demo-skeleton-dashboard__table-row,
.demo-skeleton-dashboard__table-real-row {
  display: grid;
  grid-template-columns: minmax(180px, 1.2fr) 96px minmax(180px, 1fr) 96px;
  gap: 14px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--xy-border-color) 80%, white);
}

.demo-skeleton-dashboard__table-row.is-last,
.demo-skeleton-dashboard__table-real-row.is-last {
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
  .demo-skeleton-dashboard__toolbar,
  .demo-skeleton-dashboard__toolbar-actions,
  .demo-skeleton-dashboard__table-row,
  .demo-skeleton-dashboard__table-real-row {
    grid-template-columns: 1fr;
  }

  .demo-skeleton-dashboard__head,
  .demo-skeleton-dashboard__metric-head,
  .demo-skeleton-dashboard__aside-headline {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
