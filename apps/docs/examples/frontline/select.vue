<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>("pro");
const options = [
  { label: "Brand Site", value: "brand" },
  { label: "Pro Product", value: "pro" },
  { label: "Docs Experience", value: "docs" }
];
</script>

<template>
  <div class="frontline-select-demo">
    <xy-front-select
      v-model="value"
      :options="options"
      searchable
      clearable
      variant="soft"
      placeholder="选择这条实验线先服务哪类前台页面"
    />
  </div>
</template>

<style scoped>
.frontline-select-demo {
  max-width: 360px;
}
</style>
