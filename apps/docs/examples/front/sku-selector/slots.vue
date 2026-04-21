<script setup lang="ts">
import { ref } from "vue";

const selectedSku = ref<Record<string, string>>({});

const dimensions = ref([
  {
    name: "颜色",
    type: "text" as const,
    options: [
      { value: "black", label: "黑色" },
      { value: "white", label: "白色" }
    ]
  }
]);
</script>

<template>
  <div class="demo-sku-selector-slots">
    <xy-sku-selector v-model="selectedSku" :dimensions="dimensions">
      <template #dimension-label="{ dimension }">
        <span class="custom-label">{{ dimension.name }}:</span>
      </template>

      <template #option="{ option, active, disabled }">
        <span :class="{ active, disabled }">
          {{ option.label }}
          <span v-if="active"> ✓</span>
        </span>
      </template>

      <template #stock="{ totalStock, available }">
        <span :class="['custom-stock', { 'is-unavailable': !available }]">
          <template v-if="available">
            库存充足 ({{ totalStock }})
          </template>
          <template v-else>
            暂时无货
          </template>
        </span>
      </template>
    </xy-sku-selector>
  </div>
</template>

<style scoped>
.demo-sku-selector-slots {
  max-width: 500px;
}

.custom-label {
  font-weight: bold;
  color: #333;
}

.custom-stock.is-unavailable {
  color: #999;
}
</style>
