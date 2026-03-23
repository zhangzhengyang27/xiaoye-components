<template>
  <div class="demo-link-stack">
    <xy-link href="https://github.com/xiaoye/xiaoye-components" target="_blank">
      打开 GitHub 仓库
    </xy-link>
    <xy-link disabled href="https://github.com/xiaoye/xiaoye-components" target="_blank">
      禁用后不会跳转
    </xy-link>
    <xy-link @click="count += 1"> 没有 href 时也能作为轻操作（已触发 {{ count }} 次） </xy-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<style scoped>
.demo-link-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
