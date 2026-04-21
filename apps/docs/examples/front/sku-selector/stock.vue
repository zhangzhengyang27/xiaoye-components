<script setup lang="ts">
import { ref } from "vue";

const selectedSku = ref<Record<string, string>>({});

const dimensions = ref([
  {
    name: "颜色",
    type: "text" as const,
    options: [
      { value: "black", label: "黑色" },
      { value: "white", label: "白色" },
      { value: "blue", label: "蓝色" }
    ]
  },
  {
    name: "尺码",
    type: "text" as const,
    options: [
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" }
    ]
  }
]);

const matrix = ref({
  "black;s": { stock: 10 },
  "black;m": { stock: 5 },
  "black;l": { stock: 0 },
  "white;s": { stock: 8 },
  "white;m": { stock: 0 },
  "white;l": { stock: 3 },
  "blue;s": { stock: 0 },
  "blue;m": { stock: 12 },
  "blue;l": { stock: 7 }
});
</script>

<template>
  <div class="demo-sku-selector-stock">
    <xy-sku-selector
      v-model="selectedSku"
      :dimensions="dimensions"
      :matrix="matrix"
    />
    <p class="selected-result">已选：{{ JSON.stringify(selectedSku) }}</p>
    <p class="hint">灰色选项表示库存不足</p>
  </div>
</template>

<style scoped>
.demo-sku-selector-stock {
  max-width: 500px;
}

.selected-result {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
