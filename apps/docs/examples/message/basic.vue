<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

// 显示操作结果反馈提示
function showOperationFeedback() {
  XyMessage("数据保存成功，已自动同步到服务器。");
}
</script>

<template>
  <!-- 消息提示基础用法：展示全局轻量级操作反馈，常用于保存/删除等操作的即时提示 -->
  <xy-button type="primary" @click="showOperationFeedback">保存数据</xy-button>
</template>
