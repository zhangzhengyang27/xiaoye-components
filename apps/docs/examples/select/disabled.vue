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
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-select v-model="value" :options="options" disabled placeholder="禁用选择器" />
      <xy-select :options="options" placeholder="包含禁用项" />
    </xy-space>
    <xy-tag status="primary">当前值：{{ value ?? "未选择" }}</xy-tag>
  </div>
</template>
