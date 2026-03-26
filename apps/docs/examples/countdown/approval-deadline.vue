<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

const deadline = ref<ReturnType<typeof dayjs> | null>(null);
const timedOut = ref(false);

onMounted(() => {
  deadline.value = dayjs().add(14, "minute").add(30, "second");
});
</script>

<template>
  <xy-card class="countdown-approval-panel" shadow="always">
    <template #header>
      <div class="countdown-approval-panel__header">
        <div>
          <strong>审批截止面板</strong>
          <p>适合接在财务复核、发版审批和风控人工确认这类“超时后必须有后续动作”的面板里。</p>
        </div>
        <xy-tag :status="timedOut ? 'warning' : 'primary'" round>
          {{ timedOut ? "已自动退回" : "等待处理" }}
        </xy-tag>
      </div>
    </template>

    <div v-if="!timedOut" class="countdown-approval-panel__body">
      <div class="countdown-approval-panel__summary">
        <xy-countdown
          v-if="deadline"
          :value="deadline"
          format="HH:mm:ss"
          @finish="timedOut = true"
        >
          <template #title>
            <div class="countdown-approval-panel__title">
              距离自动退回
              <span>审批单 AP-20260326-018</span>
            </div>
          </template>
          <template #suffix>
            <span class="countdown-approval-panel__suffix">退回</span>
          </template>
        </xy-countdown>

        <div class="countdown-approval-panel__meta">
          <strong>待确认风险项</strong>
          <ul>
            <li>本次折扣会影响存量合同的最低价保护</li>
            <li>审批通过后会立即触发渠道价格同步</li>
            <li>若超时未处理，系统会自动撤回并通知提交人</li>
          </ul>
        </div>
      </div>

      <div class="countdown-approval-panel__actions">
        <xy-button type="primary">立即处理</xy-button>
        <xy-button>转交复核</xy-button>
        <xy-button text>查看历史记录</xy-button>
      </div>
    </div>

    <xy-result
      v-else
      title="审批已自动退回"
      description="处理窗口已经结束，系统已撤回本次申请并向提交人发送了站内通知。你可以查看历史记录或重新发起审批。"
      status="warning"
      size="sm"
    >
      <template #extra>
        <xy-button type="primary">重新发起</xy-button>
        <xy-button text>查看详情</xy-button>
      </template>
    </xy-result>
  </xy-card>
</template>

<style scoped>
.countdown-approval-panel {
  max-width: 760px;
}

.countdown-approval-panel__header,
.countdown-approval-panel__summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.countdown-approval-panel__header p,
.countdown-approval-panel__meta ul {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.countdown-approval-panel__body {
  display: grid;
  gap: 18px;
}

.countdown-approval-panel__summary :deep(.xy-countdown) {
  flex: 0 0 280px;
}

.countdown-approval-panel__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.countdown-approval-panel__title span,
.countdown-approval-panel__suffix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.countdown-approval-panel__meta {
  min-width: 0;
}

.countdown-approval-panel__meta strong {
  display: block;
  color: var(--xy-text-color);
}

.countdown-approval-panel__meta ul {
  padding-left: 18px;
}

.countdown-approval-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.countdown-approval-panel :deep(.xy-result) {
  max-width: none;
  padding-inline: 0;
}

@media (max-width: 640px) {
  .countdown-approval-panel__header,
  .countdown-approval-panel__summary {
    flex-direction: column;
  }

  .countdown-approval-panel__summary :deep(.xy-countdown) {
    flex-basis: auto;
  }
}
</style>
