<script setup lang="ts">
import { ref } from "vue";

const selectedSku = ref<Record<string, string>>({});

const dimensions = ref([
  {
    name: "颜色",
    type: "image" as const,
    options: [
      {
        value: "iphone15-black",
        label: "深空黑",
        image: "https://picsum.photos/80/80?random=200"
      },
      {
        value: "iphone15-white",
        label: "银色",
        image: "https://picsum.photos/80/80?random=201"
      },
      {
        value: "iphone15-blue",
        label: "蓝色",
        image: "https://picsum.photos/80/80?random=202"
      }
    ]
  }
]);
</script>

<template>
  <div class="demo-sku-selector-image">
    <xy-sku-selector v-model="selectedSku" :dimensions="dimensions" />
    <p class="selected-result">已选：{{ JSON.stringify(selectedSku) }}</p>
  </div>
</template>

<style scoped>
.demo-sku-selector-image {
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
