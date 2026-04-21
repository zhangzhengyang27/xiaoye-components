<script setup lang="ts">
import { ref } from "vue";

const selectedSku = ref<Record<string, string>>({});

const dimensions = ref([
  {
    name: "颜色",
    type: "color" as const,
    options: [
      { value: "black", label: "黑色", color: "#000000" },
      { value: "white", label: "白色", color: "#FFFFFF" },
      { value: "red", label: "红色", color: "#E53935" },
      { value: "blue", label: "蓝色", color: "#1E88E5" },
      { value: "green", label: "绿色", color: "#43A047" }
    ]
  }
]);
</script>

<template>
  <div class="demo-sku-selector-color">
    <xy-sku-selector v-model="selectedSku" :dimensions="dimensions" />
    <p class="selected-result">已选：{{ JSON.stringify(selectedSku) }}</p>
  </div>
</template>

<style scoped>
.demo-sku-selector-color {
  max-width: 500px;
}

.selected-result {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}
</style>
