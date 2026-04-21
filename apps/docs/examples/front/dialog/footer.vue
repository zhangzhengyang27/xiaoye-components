<template>
  <xyu-button type="primary" @click="visible = true">打开对话框</xyu-button>
  <xyu-dialog v-model="visible" title="对话框">
    <p>这是对话框内容。</p>
    <template #footer>
      <xyu-button @click="visible = false">取消</xyu-button>
      <xyu-button type="primary" @click="visible = false">确定</xyu-button>
    </template>
  </xyu-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
