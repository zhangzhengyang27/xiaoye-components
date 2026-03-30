<template>
  <xy-text line-clamp="2" expandable class="demo-text-expandable">
    这是一段较长的说明文字，用于演示 expandable 与 line-clamp 的组合行为。默认只展示两行内容，
    当文本真实溢出时，会在末尾提供展开按钮，点击后显示完整内容，适合卡片详情、审核摘要和列表补充说明。
  </xy-text>
</template>

<style scoped>
.demo-text-expandable {
  max-width: 360px;
}
</style>
