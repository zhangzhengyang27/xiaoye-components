<script setup lang="ts">
const content = ["小叶组件库", "Xiaoye Components"];
</script>

<template>
  <xy-watermark
    :content="content"
    :font="{
      color: 'rgba(15, 23, 42, 0.14)',
      fontSize: 15,
      fontGap: 6
    }"
  >
    <section class="xy-doc-watermark-panel">
      <h4>内部评审稿</h4>
      <p>多行模式适合把系统名、环境名和保密级别拆开表达，降低单行文字过长时的拥挤感。</p>
    </section>
  </xy-watermark>
</template>

<style scoped>
.xy-doc-watermark-panel {
  min-height: 220px;
  padding: 28px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.88)),
    radial-gradient(circle at top left, rgba(45, 212, 191, 0.12), transparent 36%);
  color: rgba(248, 250, 252, 0.92);
}

.xy-doc-watermark-panel h4 {
  margin: 0 0 12px;
  font-size: 24px;
}

.xy-doc-watermark-panel p {
  max-width: 520px;
  margin: 0;
  line-height: 1.7;
}
</style>
