<template>
  <div class="demo-link-stack">
    <xy-link underline="hover">悬停时显示下划线</xy-link>
    <xy-link underline="always">始终显示下划线</xy-link>
    <xy-link underline="never">永不显示下划线</xy-link>
    <xy-link :underline="true">布尔值 true 等同于 hover</xy-link>
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
