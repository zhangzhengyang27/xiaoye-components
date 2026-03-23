<template>
  <div class="demo-link-stack">
    <xy-link icon="mdi:file-document-outline">查看方案文档</xy-link>
    <xy-link type="primary" href="https://vitejs.dev" target="_blank" icon="mdi:open-in-new">
      打开外部站点
      <template #icon>
        <xy-icon icon="mdi:arrow-top-right" :size="14" />
      </template>
    </xy-link>
    <xy-link type="info" icon="mdi:information-outline" aria-label="查看补充说明" />
  </div>
</template>

<style scoped>
.demo-link-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
