<script setup lang="ts">
import { ref } from "vue";

const leftOpen = ref(false);
const rightOpen = ref(false);
const topOpen = ref(false);
const bottomOpen = ref(false);
</script>

<template>
  <xy-space wrap>
    <xy-button plain @click="leftOpen = true">左侧抽屉</xy-button>
    <xy-button plain @click="rightOpen = true">右侧抽屉</xy-button>
    <xy-button plain @click="topOpen = true">顶部抽屉</xy-button>
    <xy-button plain @click="bottomOpen = true">底部抽屉</xy-button>

    <xy-drawer v-model="leftOpen" title="左侧导航抽屉" placement="left" size="360px">
      <p>适合侧边说明、目录树或保留上下文的导航面板。</p>
    </xy-drawer>

    <xy-drawer v-model="rightOpen" title="右侧编辑抽屉" placement="right" size="480px">
      <p>适合详情查看和大表单编辑。</p>
    </xy-drawer>

    <xy-drawer v-model="topOpen" title="顶部筛选抽屉" placement="top" size="260px">
      <p>适合顶部筛选、批量筛查和轻量说明层。</p>
    </xy-drawer>

    <xy-drawer v-model="bottomOpen" title="底部说明抽屉" placement="bottom" size="300px">
      <p>适合批处理确认、底部说明和移动端更顺手的弹出方式。</p>
    </xy-drawer>
  </xy-space>
</template>
