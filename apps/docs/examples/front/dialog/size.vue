<template>
  <xyu-space direction="vertical">
    <xyu-button type="primary" @click="visible1 = true">小尺寸</xyu-button>
    <xyu-button type="primary" @click="visible2 = true">中尺寸（默认）</xyu-button>
    <xyu-button type="primary" @click="visible3 = true">大尺寸</xyu-button>
    <xyu-button type="primary" @click="visible4 = true">全屏</xyu-button>
  </xyu-space>
  <xyu-dialog v-model="visible1" title="小尺寸对话框" size="sm">
    <p>对话框内容...</p>
  </xyu-dialog>
  <xyu-dialog v-model="visible2" title="中等尺寸对话框" size="md">
    <p>对话框内容...</p>
  </xyu-dialog>
  <xyu-dialog v-model="visible3" title="大尺寸对话框" size="lg">
    <p>对话框内容...</p>
  </xyu-dialog>
  <xyu-dialog v-model="visible4" title="全屏对话框" size="full">
    <p>对话框内容...</p>
  </xyu-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
</script>
