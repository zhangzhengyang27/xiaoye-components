<script setup lang="ts">
import { ref } from "vue";

const value = ref<Array<string | number> | null>([1, 11]);
const options = [
  {
    value: 1,
    label: "工作台",
    children: [{ value: 11, label: "账单中心" }]
  },
  {
    value: 2,
    label: "配置中心"
  }
];
</script>

<template>
  <!-- 级联选择器基础用法：展示多级联动选择 -->
  <div class="demo-cascader-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-cascader-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>多级联动</xy-tag>
        </div>
        <p class="demo-cascader-basic__description">
          级联选择器用于多级数据的联动选择，适合组织结构、地区选择等场景。
        </p>
      </template>

      <xy-cascader v-model="value" :options="options" clearable />
    </xy-card>
  </div>
</template>

<style scoped>
.demo-cascader-basic {
  max-width: 400px;
}

.demo-cascader-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-cascader-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
