<script setup lang="ts">
import { ref } from "vue";

const address = ref({});
</script>

<template>
  <div class="demo-address-picker-basic">
    <xy-address-picker v-model="address" style="max-width: 300px;" />
    <p class="result">选中地址：{{ JSON.stringify(address) }}</p>
  </div>
</template>

<style scoped>
.demo-address-picker-basic {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}
</style>
