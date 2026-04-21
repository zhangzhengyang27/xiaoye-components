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
  <div class="demo-marketing-modal-auto-close">
    <xy-button type="primary" @click="open">自动关闭弹层</xy-button>

    <xy-marketing-modal
      v-model="visible"
      type="promotion"
      title="限时优惠"
      :auto-close="5"
      :show-close="false"
    >
      <div class="auto-close-content">
        <p>恭喜获得优惠券！</p>
        <p>5秒后自动关闭</p>
      </div>
    </xy-marketing-modal>
  </div>
</template>

<style scoped>
.demo-marketing-modal-auto-close {
  display: flex;
  gap: 12px;
}

.auto-close-content {
  text-align: center;
  padding: 30px;
}

.auto-close-content p {
  margin: 8px 0;
  font-size: 16px;
}
</style>
