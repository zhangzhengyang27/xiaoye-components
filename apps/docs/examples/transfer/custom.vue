<script setup lang="ts">
import { ref } from "vue";

const value = ref<Array<string | number>>([1]);
const data = [
  { key: 1, label: "小叶", description: "管理员" },
  { key: 2, label: "小陈", description: "成员" }
];
</script>

<template>
  <xy-transfer v-model="value" :data="data" :titles="['待选成员', '已选成员']">
    <template #option="{ option }">
      <div>
        <strong>{{ option.label }}</strong>
        <small style="display: block; color: var(--xy-text-color-secondary)">{{ option.description }}</small>
      </div>
    </template>
  </xy-transfer>
</template>
