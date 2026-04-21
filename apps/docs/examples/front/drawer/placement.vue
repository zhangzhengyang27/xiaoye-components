<template>
  <xyu-button type="primary" @click="visible = true">打开抽屉</xyu-button>
  <xyu-drawer v-model="visible" title="右侧抽屉" placement="right">
    <p>抽屉内容区域。</p>
    <p>可以从不同方向滑出。</p>
  </xyu-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
