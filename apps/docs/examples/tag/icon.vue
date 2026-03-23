<template>
  <div class="demo-tag-stack">
    <xy-tag icon="mdi:tag-outline">默认图标标签</xy-tag>
    <xy-tag status="primary" icon="mdi:lightning-bolt-outline">主状态标签</xy-tag>
    <xy-tag status="success" closable icon="mdi:check-circle-outline">可关闭成功标签</xy-tag>
    <xy-tag status="warning">
      <template #icon>
        <xy-icon icon="mdi:alert-circle-outline" :size="14" />
      </template>
      插槽图标标签
    </xy-tag>
  </div>
</template>

<style scoped>
.demo-tag-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
