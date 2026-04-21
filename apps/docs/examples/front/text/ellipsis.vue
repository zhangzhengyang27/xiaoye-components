<template>
  <xyu-space direction="vertical" style="max-width: 200px">
    <xyu-text ellipsis>这是一段很长的文本，会被截断显示省略号</xyu-text>
    <xyu-text :ellipsis="true" :ellipsis-line-clamp="2">这是一段很长的多行文本，会在第二行末尾显示省略号。这是一段很长的多行文本，会在第二行末尾显示省略号。</xyu-text>
  </xyu-space>
</template>
