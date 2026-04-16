<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

interface TicketSlaItem {
  title: string;
  owner: string;
  target: ReturnType<typeof dayjs> | null;
  status: "primary" | "warning" | "danger" | "success";
  summary: string;
  remainingMinutes: number;
}

const tickets = ref<TicketSlaItem[]>([
  {
    title: "支付回调积压",
    owner: "P1 · 值班人 Mia",
    target: null,
    status: "primary",
    summary: "API 侧已止损，等待补偿批次完成",
    remainingMinutes: 0
  },
  {
    title: "发票推送失败",
    owner: "P2 · 值班人 Lucas",
    target: null,
    status: "warning",
    summary: "外部网关恢复中，需在 15 分钟内确认是否切备用通道",
    remainingMinutes: 0
  },
  {
    title: "库存锁定延迟",
    owner: "P1 · 值班人 Sophie",
    target: null,
    status: "danger",
    summary: "已经逼近升级阈值，需决定是否执行限流策略",
    remainingMinutes: 0
  }
]);

onMounted(() => {
  const start = dayjs();
  const offsets = [52, 19, 6];

  tickets.value = tickets.value.map((ticket, index) => ({
    ...ticket,
    target: start.add(offsets[index] ?? 10, "minute")
  }));
});

function handleChange(index: number, remainingMs: number) {
  const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

  tickets.value[index] = {
    ...tickets.value[index],
    remainingMinutes,
    status:
      remainingMinutes <= 5
        ? "danger"
        : remainingMinutes <= 15
          ? "warning"
          : "primary"
  };
}

function handleFinish(index: number) {
  tickets.value[index] = {
    ...tickets.value[index],
    remainingMinutes: 0,
    status: "success",
    summary: "已超出处理窗口，系统已自动升级到上一级值班组"
  };
}
</script>

<template>
  <div class="countdown-sla-grid">
    <xy-card
      v-for="(ticket, index) in tickets"
      :key="ticket.title"
      shadow="hover"
      class="countdown-sla-grid__card"
    >
      <template #header>
        <div class="countdown-sla-grid__header">
          <div>
            <strong>{{ ticket.title }}</strong>
            <p class="countdown-sla-grid__header-description">{{ ticket.owner }}</p>
          </div>
          <xy-tag :status="ticket.status" round>
            {{
              ticket.status === "danger"
                ? "立即处理"
                : ticket.status === "warning"
                  ? "临近升级"
                  : ticket.status === "success"
                    ? "已升级"
                    : "窗口充足"
            }}
          </xy-tag>
        </div>
      </template>

      <xy-countdown
        v-if="ticket.target"
        :value="ticket.target"
        title="距离自动升级"
        format="mm:ss"
        @change="handleChange(index, $event)"
        @finish="handleFinish(index)"
      >
        <template #suffix>
          <span class="countdown-sla-grid__suffix">
            {{ ticket.remainingMinutes }} 分钟
          </span>
        </template>
      </xy-countdown>

      <p class="countdown-sla-grid__summary">{{ ticket.summary }}</p>
    </xy-card>
  </div>
</template>

<style scoped>
.countdown-sla-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.countdown-sla-grid__card {
  min-height: 220px;
}

.countdown-sla-grid__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.countdown-sla-grid__header-description,
.countdown-sla-grid__summary {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.countdown-sla-grid__suffix {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .countdown-sla-grid__header {
    flex-direction: column;
  }
}
</style>
