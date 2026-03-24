<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>("finance");

const options = [
  { label: "财务", value: "finance" },
  { label: "运营", value: "ops" },
  { label: "访客", value: "guest", disabled: true, description: "当前不可选择" }
];
</script>

<template>
  <div class="demo-select-grid xy-doc-field xy-doc-field--wide">
    <xy-select
      v-model="value"
      :options="options"
      disabled
      placeholder="禁用选择器"
    />
    <xy-select :options="options" placeholder="包含禁用项" />
  </div>
</template>

<style scoped>
.demo-select-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 680px) {
  .demo-select-grid {
    grid-template-columns: 1fr;
  }
}
</style>
