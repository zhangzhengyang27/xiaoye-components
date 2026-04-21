<template>
  <xyu-drawer v-model="visible" title="抽屉标题">
    <p>这是抽屉的内容区域</p>
  </xyu-drawer>
  <xyu-button @click="visible = true">打开抽屉</xyu-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
</script>
