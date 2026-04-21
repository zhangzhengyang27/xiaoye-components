<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const currentType = ref("coupon");

const types = [
  { value: "coupon", label: "优惠券" },
  { value: "flash-sale", label: "限时抢购" },
  { value: "promotion", label: "满减活动" },
  { value: "custom", label: "自定义" }
];

function openType(type: string) {
  currentType.value = type;
  visible.value = true;
}

function close() {
  visible.value = false;
}
</script>

<template>
  <div class="demo-marketing-modal-types">
    <div class="type-buttons">
      <xy-button
        v-for="type in types"
        :key="type.value"
        @click="openType(type.value)"
      >
        {{ type.label }}
      </xy-button>
    </div>

    <xy-marketing-modal
      v-model="visible"
      :type="currentType"
      :title="types.find(t => t.value === currentType)?.label"
    >
      <div class="modal-content">
        <template v-if="currentType === 'coupon'">
          <div class="coupon-content">
            <span class="coupon-amount">¥100</span>
            <span class="coupon-desc">满500可用</span>
          </div>
        </template>
        <template v-else-if="currentType === 'flash-sale'">
          <div class="flash-sale-content">
            <p>原价 ¥299</p>
            <p class="sale-price">秒杀价 ¥99</p>
          </div>
        </template>
        <template v-else-if="currentType === 'promotion'">
          <div class="promotion-content">
            <p>全场满 300 减 50</p>
            <p>满 500 减 100</p>
          </div>
        </template>
        <template v-else>
          <p>自定义营销内容</p>
        </template>
      </div>
      <template #footer>
        <xy-button type="primary" @click="close">领取</xy-button>
      </template>
    </xy-marketing-modal>
  </div>
</template>

<style scoped>
.demo-marketing-modal-types {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.modal-content {
  text-align: center;
  padding: 20px;
}

.coupon-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.coupon-amount {
  font-size: 48px;
  font-weight: bold;
  color: #ff4d4f;
}

.coupon-desc {
  font-size: 14px;
  color: #999;
}

.flash-sale-content p {
  margin: 8px 0;
}

.sale-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4d4f;
}
</style>
