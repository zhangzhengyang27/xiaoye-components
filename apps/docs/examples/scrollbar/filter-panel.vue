<script setup lang="ts">
import { ref } from "vue";

const keyword = ref("");
const selected = ref<string | number | null>("active");

const filterGroups = [
  {
    title: "业务线",
    hint: "每个分组都可以承载自己的说明、输入框和状态标签。",
    status: "primary"
  },
  {
    title: "区域",
    hint: "固定高度的筛选抽屉、侧边栏和高级筛选面板都很适合配合 Scrollbar。",
    status: "success"
  },
  {
    title: "负责人",
    hint: "如果筛选项很多，外层面板滚动会比让整个页面滚动更容易控制上下文。",
    status: "warning"
  },
  {
    title: "部署环境",
    hint: "这种模式也适合和 Form、Input、DatePicker 等组件组合成密集录入区。",
    status: "danger"
  }
];
</script>

<template>
  <xy-scrollbar height="260px" always>
    <div class="demo-filter-panel">
      <section v-for="group in filterGroups" :key="group.title" class="demo-filter-panel__group">
        <header class="demo-filter-panel__header">
          <xy-text tag="strong">{{ group.title }}</xy-text>
          <xy-tag :status="group.status" round>{{ group.title }}</xy-tag>
        </header>
        <xy-text type="info" size="sm">{{ group.hint }}</xy-text>
        <xy-space wrap>
          <xy-input v-model="keyword" placeholder="搜索关键词" clearable />
          <xy-select
            v-model="selected"
            :options="[
              { label: '全部状态', value: 'all' },
              { label: '已启用', value: 'active' },
              { label: '已停用', value: 'inactive' }
            ]"
            placeholder="状态筛选"
            clearable
          />
          <xy-button text bg>重置</xy-button>
        </xy-space>
      </section>
    </div>
  </xy-scrollbar>
</template>

<style scoped>
.demo-filter-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 8px;
}

.demo-filter-panel__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-md);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 90%, white),
    var(--xy-surface-raised)
  );
}

.demo-filter-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
