<template>
  <xyu-button type="primary" @click="visible1 = true">小抽屉</xyu-button>
  <xyu-button type="primary" @click="visible2 = true">中抽屉（默认）</xyu-button>
  <xyu-button type="primary" @click="visible3 = true">大抽屉</xyu-button>
  <xyu-drawer v-model="visible1" title="小抽屉" size="sm">
    <p>宽度 320px。</p>
  </xyu-drawer>
  <xyu-drawer v-model="visible2" title="中抽屉" size="md">
    <p>宽度 480px。</p>
  </xyu-drawer>
  <xyu-drawer v-model="visible3" title="大抽屉" size="lg">
    <p>宽度 640px。</p>
  </xyu-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
</script>
