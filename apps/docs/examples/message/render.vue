<script setup lang="ts">
import { h } from "vue";
import { XyMessage } from "xiaoye-components";

function openRenderMessage() {
  XyMessage({
    groupKey: "release-sync",
    grouping: true,
    type: "success",
    showClose: true,
    render: () =>
      h("div", { class: "xy-doc-stack" }, [
        h("strong", "发布完成"),
        h("span", "构建产物已经同步到预发环境，点击重复触发会合并计数。")
      ])
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openRenderMessage">render 富内容</xy-button>
    <xy-tag status="primary">同 groupKey 会合并为一条消息</xy-tag>
  </xy-space>
</template>
