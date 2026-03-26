<script setup lang="ts">
import { XyMessage } from "xiaoye-components";

function openHtmlMessage() {
  XyMessage({
    message: "<strong>发布成功</strong>，已把最新配置同步到预发环境。",
    dangerouslyUseHTMLString: true,
    type: "success",
    showClose: true
  });
}
</script>

<template>
  <xy-button type="primary" @click="openHtmlMessage"> 使用 HTML 内容 </xy-button>
</template>
