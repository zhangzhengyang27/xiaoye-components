<script setup lang="ts">
import { ref } from "vue";

const dimensions = ref<Array<string | number | boolean>>(["day"]);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-checkbox-group
      v-model="dimensions"
      type="button"
      fill="#1d4ed8"
      text-color="#f8fafc"
      :options="[
        { label: '按天', value: 'day' },
        { label: '按周', value: 'week' },
        { label: '按月', value: 'month', disabled: true }
      ]"
    />
    <xy-text size="sm">当前维度：{{ dimensions.join("，") || "未选择" }}</xy-text>
  </div>
</template>
