<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}
</script>

<template>
  <div class="demo-marketing-modal-countdown">
    <xy-button type="primary" @click="open">限时抢购</xy-button>

    <xy-marketing-modal
      v-model="visible"
      type="flash-sale"
      title="限时抢购"
      :countdown="10"
    >
      <div class="countdown-content">
        <div class="product-info">
          <p class="product-name">iPhone 15 Pro Max</p>
          <p class="original-price">原价: ¥10999</p>
          <p class="sale-price">秒杀价: ¥8999</p>
        </div>
      </div>
      <template #footer>
        <xy-button type="danger" block @click="close">立即抢购</xy-button>
      </template>
    </xy-marketing-modal>
  </div>
</template>

<style scoped>
.demo-marketing-modal-countdown {
  display: flex;
  gap: 12px;
}

.countdown-content {
  text-align: center;
  padding: 20px;
}

.product-info {
  padding: 20px;
  background: #fff5f5;
  border-radius: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  margin: 4px 0;
}

.sale-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4d4f;
  margin: 8px 0;
}
</style>
