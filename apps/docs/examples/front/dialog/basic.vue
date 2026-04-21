<template>
  <xyu-dialog v-model="visible" title="对话框标题">
    <p>这是对话框的内容区域</p>
    <p>可以包含任意内容</p>
  </xyu-dialog>
  <xyu-button @click="visible = true">打开对话框</xyu-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
</script>
