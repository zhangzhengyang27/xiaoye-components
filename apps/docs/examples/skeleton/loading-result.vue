<script setup lang="ts">
import { ref } from "vue";

type DemoState = "loading" | "ready" | "empty" | "error";

const state = ref<DemoState>("loading");

const actions: Array<{ label: string; value: DemoState; status: "primary" | "success" | "warning" | "danger" }> = [
  { label: "骨架态", value: "loading", status: "primary" },
  { label: "真实内容", value: "ready", status: "success" },
  { label: "空结果", value: "empty", status: "warning" },
  { label: "失败态", value: "error", status: "danger" }
];
</script>

<template>
  <div class="demo-skeleton-stateflow">
    <xy-space wrap>
      <xy-button
        v-for="item in actions"
        :key="item.value"
        :type="state === item.value ? item.status : undefined"
        :plain="state !== item.value"
        @click="state = item.value"
      >
        {{ item.label }}
      </xy-button>
    </xy-space>

    <xy-card shadow="never">
      <xy-skeleton :loading="state === 'loading'" animated>
        <template #template>
          <div class="demo-skeleton-stateflow__template">
            <xy-skeleton-item variant="circle" />
            <div class="demo-skeleton-stateflow__template-copy">
              <xy-skeleton-item variant="h3" style="width: 42%;" />
              <xy-skeleton-item variant="text" />
              <xy-skeleton-item variant="text" style="width: 68%;" />
              <xy-skeleton-item variant="button" />
            </div>
          </div>
        </template>

        <div v-if="state === 'ready'" class="demo-skeleton-stateflow__content">
          <xy-avatar size="lg">OPS</xy-avatar>
          <div class="demo-skeleton-stateflow__content-copy">
            <strong>发布窗口已同步完成</strong>
            <p class="demo-skeleton-stateflow__content-description">
              最新一轮灰度指标已写回控制台，接下来可以继续确认清结算链路和消息中心异常项。
            </p>
            <xy-space wrap>
              <xy-button type="primary">查看窗口详情</xy-button>
              <xy-button plain>打开监控看板</xy-button>
            </xy-space>
          </div>
        </div>

        <xy-empty
          v-else-if="state === 'empty'"
          title="暂无待发布任务"
          description="当前时间范围内没有需要继续推进的发布任务。"
        >
          <xy-space wrap>
            <xy-button type="primary">新建发布窗口</xy-button>
            <xy-button plain>查看历史记录</xy-button>
          </xy-space>
        </xy-empty>

        <xy-result
          v-else
          status="danger"
          title="窗口状态同步失败"
          description="发布记录服务超时，当前无法拉取最新窗口详情。"
        >
          <template #extra>
            <xy-space wrap>
              <xy-button type="primary">重新加载</xy-button>
              <xy-button plain>查看告警记录</xy-button>
            </xy-space>
          </template>
        </xy-result>
      </xy-skeleton>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-skeleton-stateflow {
  display: grid;
  gap: 16px;
  max-width: 720px;
}

.demo-skeleton-stateflow__template,
.demo-skeleton-stateflow__content {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 16px;
}

.demo-skeleton-stateflow__template-copy,
.demo-skeleton-stateflow__content-copy {
  display: grid;
  gap: 12px;
}

.demo-skeleton-stateflow__content-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .demo-skeleton-stateflow__template,
  .demo-skeleton-stateflow__content {
    grid-template-columns: 1fr;
  }
}
</style>
