<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function openBasicMessage() {
  XyMessage("这是一条用于说明当前操作结果的基础提示。");
}
</script>

<template>
  <xy-button type="primary" @click="openBasicMessage">打开基础提示</xy-button>
</template>
