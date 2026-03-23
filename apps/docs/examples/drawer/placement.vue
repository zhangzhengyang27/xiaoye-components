<script setup lang="ts">
import { ref } from "vue";

const leftOpen = ref(false);
const rightOpen = ref(false);
</script>

<template>
  <xy-space wrap>
    <xy-button plain @click="leftOpen = true">左侧抽屉</xy-button>
    <xy-button plain @click="rightOpen = true">右侧抽屉</xy-button>

    <xy-drawer v-model="leftOpen" title="左侧导航抽屉" placement="left" size="360px">
      <p>适合侧边说明、目录树或保留上下文的导航面板。</p>
    </xy-drawer>

    <xy-drawer v-model="rightOpen" title="右侧编辑抽屉" placement="right" size="480px">
      <p>适合详情查看和大表单编辑。</p>
    </xy-drawer>
  </xy-space>
</template>
