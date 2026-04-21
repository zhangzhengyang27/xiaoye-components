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
  <div class="demo-marketing-modal-custom">
    <xy-button type="primary" @click="open">自定义内容</xy-button>

    <xy-marketing-modal
      v-model="visible"
      type="custom"
      :show-close="true"
    >
      <template #header>
        <div class="custom-header">
          <xy-icon icon="mdi:gift" :size="24" />
          <span>新人专享礼</span>
        </div>
      </template>

      <div class="custom-content">
        <div class="gift-list">
          <div class="gift-item">
            <xy-icon icon="mdi:tag" :size="40" />
            <span>满100减20</span>
          </div>
          <div class="gift-item">
            <xy-icon icon="mdi:truck" :size="40" />
            <span>免运费</span>
          </div>
          <div class="gift-item">
            <xy-icon icon="mdi:gift" :size="40" />
            <span>新人礼包</span>
          </div>
        </div>
      </div>

      <template #footer>
        <xy-button type="primary" block @click="close">领取福利</xy-button>
      </template>
    </xy-marketing-modal>
  </div>
</template>

<style scoped>
.demo-marketing-modal-custom {
  display: flex;
  gap: 12px;
}

.custom-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4d4f;
}

.custom-content {
  padding: 20px;
}

.gift-list {
  display: flex;
  justify-content: space-around;
}

.gift-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
}

.gift-item:hover {
  color: #ff4d4f;
}
</style>
