<script setup lang="ts">
import { ref } from "vue";

const expanded = ref(false);
</script>

<template>
  <xy-card shadow="never" class="demo-collapse-transition-panel">
    <template #header>
      <div class="demo-collapse-transition-panel__header">
        <div>
          <xy-text tag="strong">高级筛选</xy-text>
          <xy-text size="sm" type="info">按需展开不常用的过滤项。</xy-text>
        </div>
        <xy-button text @click="expanded = !expanded">
          {{ expanded ? "收起" : "展开" }}
        </xy-button>
      </div>
    </template>

    <xy-collapse-transition>
      <div v-if="expanded" class="demo-collapse-transition-panel__content">
        <xy-space wrap>
          <xy-tag>审批中</xy-tag>
          <xy-tag status="success">已通过</xy-tag>
          <xy-tag status="warning">待补充</xy-tag>
        </xy-space>
        <xy-text size="sm" type="info">
          这里可以继续放表单项、说明文字或操作按钮，过渡会根据实际高度自动计算。
        </xy-text>
      </div>
    </xy-collapse-transition>
  </xy-card>
</template>

<style scoped>
.demo-collapse-transition-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.demo-collapse-transition-panel__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}
</style>
