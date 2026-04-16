<script setup lang="ts">
import { ref } from "vue";

const query = ref("");
const items = [
  { key: "hero", label: "Hero Header", description: "主标题、说明和 CTA 区域", group: "Landing" },
  { key: "pricing", label: "Pricing Capture", description: "输入 + CTA + Dropdown 的组合入口", group: "Pricing" },
  { key: "account", label: "Account Decision", description: "Select、Input 和结论区", group: "Account" }
];
</script>

<template>
  <xy-front-search-panel
    v-model:query="query"
    title="Search Panel"
    description="把 landing / pricing / account 里的内容查找先放进轻量搜索面板里看效果。"
    :items="items"
  >
    <template #empty="{ query: keyword }">
      <div class="frontline-search-panel-empty">
        <strong class="frontline-search-panel-empty__title">没有找到 “{{ keyword || '当前关键词' }}” 的匹配结果</strong>
        <p class="frontline-search-panel-empty__description">
          这一层现在优先承接页面模块查找，而不是直接升级成更重的命令系统。
        </p>
      </div>
    </template>
  </xy-front-search-panel>
</template>

<style scoped>
.frontline-search-panel-empty {
  display: grid;
  gap: 6px;
}

.frontline-search-panel-empty__title {
  color: var(--xy-frontline-neutral-1);
}

.frontline-search-panel-empty__description {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.6;
}
</style>
