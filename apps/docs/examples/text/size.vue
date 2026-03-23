<template>
  <div class="demo-text-column">
    <xy-text size="sm">Small 辅助说明文本</xy-text>
    <xy-text>Default 正文文本</xy-text>
    <xy-text size="lg" type="primary">Large 强调文本</xy-text>
  </div>
</template>

<style scoped>
.demo-text-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
