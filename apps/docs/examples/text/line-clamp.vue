<template>
  <xy-text line-clamp="2" tag="p" class="demo-text-clamp">
    这是一段多行文本示例，适合卡片摘要、表格扩展描述和二级说明。开启 line-clamp
    后，组件会按指定行数截断，并在真正溢出时自动回填 title，避免用户在密集布局里丢失完整上下文。
  </xy-text>
</template>

<style scoped>
.demo-text-clamp {
  max-width: 360px;
  margin: 0;
}
</style>
