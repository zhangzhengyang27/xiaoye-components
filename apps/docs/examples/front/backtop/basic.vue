<template>
  <xyu-space direction="vertical">
    <xyu-button type="primary" @click="scrollToTop">回到顶部</xyu-button>
    <div style="height: 2000px; background: linear-gradient(to bottom, #fff, #000);">
      向下滚动查看效果
    </div>
    <xyu-backtop :visibility-height="100" />
  </xyu-space>
</template>

<script setup lang="ts">
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
