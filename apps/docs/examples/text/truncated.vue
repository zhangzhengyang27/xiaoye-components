<template>
  <div class="demo-text-limits">
    <xy-text truncated class="demo-text-limits__single">
      这是一段很长的单行文本，用于演示 truncated 开启之后会通过省略号截断，并在溢出时自动补 title。
    </xy-text>
  </div>
</template>

<style scoped>
.demo-text-limits__single {
  display: inline-block;
  max-width: 280px;
}
</style>
