<script setup lang="ts">
import { ref } from "vue";

const activeNames = ref<Array<string | number>>(["intro"]);
</script>

<template>
  <!-- 折叠面板基础用法：展示可折叠的内容区块 -->
  <div class="demo-collapse-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-collapse-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>内容折叠</xy-tag>
        </div>
        <p class="demo-collapse-basic__description">
          折叠面板用于在有限空间内收纳长内容，支持手风琴和多面板展开模式。
        </p>
      </template>

      <xy-collapse v-model="activeNames">
        <xy-collapse-item name="intro" title="什么是小叶组件库？">
          小叶组件库面向中后台场景，强调表单录入、浮层交互、排期管理和文档示例闭环。
        </xy-collapse-item>

        <xy-collapse-item name="design" title="设计风格为什么更偏业务？">
          组件默认视觉会优先服务"清晰、可运营、可扩展"的后台页面，而不是追求单一展示感。
        </xy-collapse-item>

        <xy-collapse-item name="a11y" title="是否考虑键盘和语义？">
          Collapse 的标题区支持键盘触发，并为头部和内容区域建立了 `button / region` 语义关联。
        </xy-collapse-item>
      </xy-collapse>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-collapse-basic {
  max-width: 640px;
}

.demo-collapse-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-collapse-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
