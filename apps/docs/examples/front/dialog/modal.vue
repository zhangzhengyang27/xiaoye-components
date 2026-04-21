<template>
  <xyu-button type="primary" @click="visible = true">打开对话框</xyu-button>
  <xyu-dialog v-model="visible" title="模态对话框" :close-on-click-modal="false">
    <p>点击遮罩层不会关闭对话框。</p>
    <p>需要点击关闭按钮或按 ESC 键关闭。</p>
  </xyu-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
