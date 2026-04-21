<template>
  <xyu-tabs v-model="activeTab">
    <xyu-tab-pane name="tab1" label="标签一">内容一</xyu-tab-pane>
    <xyu-tab-pane name="tab2" label="标签二">内容二</xyu-tab-pane>
    <xyu-tab-pane name="tab3" label="标签三">内容三</xyu-tab-pane>
  </xyu-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('tab1');
</script>
