<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>("vip");

const options = [
  {
    value: "standard",
    title: "标准工作台",
    description: "适合大多数常规中后台页面。"
  },
  {
    value: "vip",
    title: "高优先级工作台",
    description: "为高频团队保留更多协作上下文。"
  }
];

function handleExtra(option: { value: string | number }) {
  value.value = option.value;
}
</script>

<template>
  <div class="demo-check-card-slots">
    <xy-check-card-group v-model="value" :options="options" @extra="handleExtra">
      <template #avatar="{ option }">
        <xy-avatar shape="square">{{ String(option.value).slice(0, 1).toUpperCase() }}</xy-avatar>
      </template>

      <template #title-standard="{ option }">
        <span class="demo-check-card-slots__title">
          {{ option.title }}
          <xy-tag size="sm" round>通用</xy-tag>
        </span>
      </template>

      <template #title-vip="{ option }">
        <span class="demo-check-card-slots__title">
          {{ option.title }}
          <xy-tag size="sm" status="warning" round>优先</xy-tag>
        </span>
      </template>

      <template #extra="{ option }">切换到 {{ option.value }}</template>
    </xy-check-card-group>

    <xy-tag round>最近操作：{{ value }}</xy-tag>
  </div>
</template>

<style scoped>
.demo-check-card-slots {
  display: grid;
  gap: 16px;
}

.demo-check-card-slots__title {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
</style>
