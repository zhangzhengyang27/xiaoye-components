<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const mounts = ref(0);

function handleOpen() {
  mounts.value += 1;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-tag status="info">主体已挂载 {{ mounts }} 次</xy-tag>
    <xy-button type="primary" @click="open = true">打开按需销毁对话框</xy-button>

    <xy-dialog
      v-model="open"
      title="按需渲染"
      destroy-on-close
      @open="handleOpen"
    >
      <p>关闭后会销毁默认插槽内容，适合比较重的表单或图表场景。</p>
    </xy-dialog>
  </div>
</template>

