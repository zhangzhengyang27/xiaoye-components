<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

// 根据消息类型显示对应的业务反馈
function showTypedMessage(type: "primary" | "success" | "info" | "warning" | "error") {
  const messageMap: Record<string, string> = {
    primary: "系统将在今晚 22:00 进行例行维护",
    success: "成员信息已更新成功",
    info: "当前已有 3 条待审核记录",
    warning: "存储空间使用率已超过 80%",
    error: "网络连接失败，请检查网络设置"
  };

  XyMessage[type]({
    message: messageMap[type],
    showClose: true
  });
}
</script>

<template>
  <!-- 消息类型：展示 5 种语义类型的全局提示（主要/成功/信息/警告/错误） -->
  <xy-space wrap>
    <xy-button type="primary" @click="showTypedMessage('primary')">系统通知</xy-button>
    <xy-button type="success" @click="showTypedMessage('success')">操作成功</xy-button>
    <xy-button plain @click="showTypedMessage('info')">信息提示</xy-button>
    <xy-button type="warning" @click="showTypedMessage('warning')">警告提醒</xy-button>
    <xy-button type="danger" @click="showTypedMessage('error')">错误提示</xy-button>
  </xy-space>
</template>
