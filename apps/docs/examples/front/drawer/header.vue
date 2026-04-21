<template>
  <xyu-button type="primary" @click="visible = true">打开抽屉</xyu-button>
  <xyu-drawer v-model="visible" :with-header="false">
    <p>不显示头部区域。</p>
    <p>可完全自定义抽屉内容。</p>
  </xyu-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
