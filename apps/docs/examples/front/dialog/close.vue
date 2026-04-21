<template>
  <xyu-button type="primary" @click="visible = true">打开对话框</xyu-button>
  <xyu-dialog v-model="visible" title="对话框" :show-close="false">
    <p>关闭按钮已被隐藏。</p>
  </xyu-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
