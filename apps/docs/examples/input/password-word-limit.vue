<script setup lang="ts">
import { ref } from "vue";

const password = ref("secret");
const summary = ref("这是一段用于演示字数统计的摘要文本。");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input v-model="password" type="password" show-password clearable placeholder="请输入密码" />
    <xy-input
      v-model="summary"
      type="textarea"
      show-word-limit
      maxlength="60"
      autosize
      placeholder="请输入摘要"
    />
  </div>
</template>
