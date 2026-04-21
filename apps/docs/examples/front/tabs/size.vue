<template>
  <xyu-tabs v-model="activeTab" size="sm">
    <xyu-tab-pane name="tab1" label="小尺寸">内容一</xyu-tab-pane>
    <xyu-tab-pane name="tab2" label="小尺寸">内容二</xyu-tab-pane>
  </xyu-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('tab1');
</script>
