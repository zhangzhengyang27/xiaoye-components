<script setup lang="ts">
import { ref } from "vue";

const active = ref<string | number>("base");
</script>

<template>
  <!-- 折叠面板手风琴模式：展示互斥展开的折叠面板 -->
  <div class="demo-collapse-accordion">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-collapse-accordion__header">
          <strong>手风琴模式</strong>
          <xy-tag status="neutral" round>Accordion</xy-tag>
        </div>
        <p class="demo-collapse-accordion__description">
          手风琴模式下，同时只能展开一个面板，适合分步骤的配置场景。
        </p>
      </template>

      <xy-collapse v-model="active" accordion expand-icon-position="left">
        <xy-collapse-item name="base" title="基础设置">
          用于快速配置名称、负责人、状态和发布日期。
        </xy-collapse-item>

        <xy-collapse-item name="advanced" title="高级设置">
          用于配置灰度范围、回滚策略、通知对象和更细的权限策略。
        </xy-collapse-item>

        <xy-collapse-item name="audit" title="审计记录">
          用于查看最近一次配置变更、操作人和发布时间。
        </xy-collapse-item>
      </xy-collapse>

      <template #footer>
        <xy-tag status="primary" round>当前展开：{{ active }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-collapse-accordion {
  max-width: 640px;
}

.demo-collapse-accordion__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-collapse-accordion__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
