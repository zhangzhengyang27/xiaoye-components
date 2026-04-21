<template>
  <xyu-button type="primary" @click="visible = true">打开对话框</xyu-button>
  <xyu-dialog v-model="visible" title="自定义对话框">
    <p>这是对话框的自定义内容区域。</p>
    <p>可以通过默认插槽添加任意内容。</p>
  </xyu-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
