<script setup lang="ts">
import { ref } from "vue";

const address = ref({
  province: "广东省",
  city: "深圳市",
  district: "南山区"
});
</script>

<template>
  <div class="demo-address-picker-full">
    <xy-address-picker
      v-model="address"
      display-format="full"
      :show-street="true"
      style="max-width: 400px;"
    />
    <p class="result">选中地址：{{ JSON.stringify(address) }}</p>
  </div>
</template>

<style scoped>
.demo-address-picker-full {
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
