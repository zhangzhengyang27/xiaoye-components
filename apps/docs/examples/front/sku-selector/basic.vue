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
      { value: "l", label: "L" },
      { value: "xl", label: "XL" }
    ]
  }
]);
</script>

<template>
  <div class="demo-sku-selector-basic">
    <xy-sku-selector
      v-model="selectedSku"
      :dimensions="dimensions"
      @change="(val) => console.log('Selected:', val)"
    />
    <p class="selected-result">已选：{{ JSON.stringify(selectedSku) }}</p>
  </div>
</template>

<style scoped>
.demo-sku-selector-basic {
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
