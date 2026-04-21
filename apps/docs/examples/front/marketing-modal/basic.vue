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
  <div class="demo-marketing-modal-basic">
    <xy-button type="primary" @click="open">打开营销弹层</xy-button>

    <xy-marketing-modal v-model="visible" title="限时优惠">
      <div class="modal-content">
        <p>全场商品 8 折优惠！</p>
        <p>活动时间：即日起至本周日</p>
      </div>
      <template #footer>
        <xy-button type="primary" @click="close">立即参与</xy-button>
        <xy-button @click="close">稍后再说</xy-button>
      </template>
    </xy-marketing-modal>
  </div>
</template>

<style scoped>
.demo-marketing-modal-basic {
  display: flex;
  gap: 12px;
}

.modal-content {
  text-align: center;
  padding: 20px;
}

.modal-content p {
  margin: 8px 0;
  font-size: 16px;
}
</style>
