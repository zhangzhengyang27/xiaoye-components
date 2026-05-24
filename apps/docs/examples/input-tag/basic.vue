<script setup lang="ts">
import { ref } from "vue";

const tags = ref(["Vue", "组件库"]);
</script>

<template>
  <!-- 标签输入框基础用法：展示输入标签的功能 -->
  <div class="demo-input-tag-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-input-tag-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>标签输入</xy-tag>
        </div>
        <p class="demo-input-tag-basic__description">
          标签输入框用于输入多个标签值，支持回车添加和清空操作。
        </p>
      </template>

      <xy-input-tag v-model="tags" placeholder="输入后按回车添加标签" clearable />

      <template #footer>
        <xy-space wrap>
          <xy-tag v-for="tag in tags" :key="tag" status="primary" round>{{ tag }}</xy-tag>
        </xy-space>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-input-tag-basic {
  max-width: 480px;
}

.demo-input-tag-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-input-tag-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
