<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

interface HoldOrder {
  id: string;
  customer: string;
  channel: string;
  amount: number;
  deadline: ReturnType<typeof dayjs> | null;
  expired: boolean;
}

const orders = ref<HoldOrder[]>([
  {
    id: "SO-20260326-1048",
    customer: "华东企业采购",
    channel: "企业转账",
    amount: 182400,
    deadline: null,
    expired: false
  },
  {
    id: "SO-20260326-1056",
    customer: "星河零售门店",
    channel: "在线支付",
    amount: 28490,
    deadline: null,
    expired: false
  },
  {
    id: "SO-20260326-1072",
    customer: "北区代理补货",
    channel: "预授权担保",
    amount: 96300,
    deadline: null,
    expired: false
  }
]);

onMounted(() => {
  const start = dayjs();

  orders.value = orders.value.map((order, index) => ({
    ...order,
    deadline: start.add(8 + index * 6, "minute").add(index * 7, "second")
  }));
});

function markExpired(orderId: string) {
  orders.value = orders.value.map((order) =>
    order.id === orderId
      ? {
          ...order,
          expired: true
        }
      : order
  );
}
</script>

<template>
  <xy-card class="countdown-payment-board" shadow="always">
    <template #header>
      <div class="countdown-payment-board__header">
        <div>
          <strong>待支付订单保留时间</strong>
          <p>付款超时后自动释放库存和优惠占位，适合订单中心、客服催付和大促履约后台。</p>
        </div>
        <xy-tag status="warning" round>3 笔处理中</xy-tag>
      </div>
    </template>

    <div class="countdown-payment-board__list">
      <div
        v-for="order in orders"
        :key="order.id"
        class="countdown-payment-board__item"
      >
        <div class="countdown-payment-board__meta">
          <div>
            <strong>{{ order.customer }}</strong>
            <p>{{ order.id }} · {{ order.channel }}</p>
          </div>
          <xy-tag :status="order.expired ? 'danger' : 'primary'" round>
            {{ order.expired ? "已释放" : "保留中" }}
          </xy-tag>
        </div>

        <div class="countdown-payment-board__main">
          <xy-statistic
            title="订单金额"
            :value="order.amount"
            prefix="¥"
            suffix="元"
            :precision="2"
          />

          <xy-countdown
            v-if="order.deadline"
            :value="order.deadline"
            title="剩余支付时间"
            format="mm:ss"
            @finish="markExpired(order.id)"
          />
        </div>
      </div>
    </div>
  </xy-card>
</template>

<style scoped>
.countdown-payment-board {
  max-width: 760px;
}

.countdown-payment-board__header,
.countdown-payment-board__meta,
.countdown-payment-board__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.countdown-payment-board__header p,
.countdown-payment-board__meta p {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.countdown-payment-board__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.countdown-payment-board__item {
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 80%, white);
  border-radius: 16px;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.98));
}

.countdown-payment-board__main {
  margin-top: 16px;
  align-items: end;
}

.countdown-payment-board__main :deep(.xy-statistic) {
  width: auto;
}

@media (max-width: 640px) {
  .countdown-payment-board__header,
  .countdown-payment-board__meta,
  .countdown-payment-board__main {
    flex-direction: column;
  }
}
</style>
