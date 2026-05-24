<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  keyword: "",
  role: 1
});

const options = [
  { label: "管理员", value: 1 },
  { label: "成员", value: 2 }
];
</script>

<template>
  <!-- 表单行内布局：展示行内排列的表单布局 -->
  <div class="demo-form-inline">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-form-inline__header">
          <strong>行内布局</strong>
          <xy-tag status="neutral" round>Inline</xy-tag>
        </div>
        <p class="demo-form-inline__description">
          行内表单将表单项紧凑排列，适合工具栏内的筛选条件。
        </p>
      </template>

      <xy-form :model="form" inline>
        <xy-form-item label="关键词" prop="keyword">
          <xy-input v-model="form.keyword" placeholder="请输入关键词" />
        </xy-form-item>
        <xy-form-item label="角色" prop="role">
          <xy-select v-model="form.role" :options="options" />
        </xy-form-item>
      </xy-form>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-form-inline {
  max-width: 640px;
}

.demo-form-inline__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-form-inline__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
