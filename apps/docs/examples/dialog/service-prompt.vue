<script setup lang="ts">
import { ref } from "vue";
import { XyDialogService } from "xiaoye-components";

const latest = ref("最近一次 prompt()：尚未调用");

async function handlePrompt() {
  const result = await XyDialogService.prompt({
    title: "输入发布口令",
    inputPlaceholder: "请输入口令",
    inputType: "password",
    inputValidator(value) {
      if (!value.trim()) {
        return "口令不能为空";
      }
    }
  });

  latest.value = result.confirmed
    ? `prompt() 已确认，value=${result.value}`
    : "prompt() 已取消或未通过校验";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="handlePrompt">打开 prompt()</xy-button>
    <xy-tag status="primary">{{ latest }}</xy-tag>
  </div>
</template>
