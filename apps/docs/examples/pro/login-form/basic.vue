<script setup lang="ts">
import { reactive, ref } from "vue";

const model = reactive({
  username: "",
  password: "",
  remember: true
});

const message = ref("尚未提交");

function handleSubmit() {
  message.value = `已提交账号 ${model.username || "未填写"} 的登录请求`;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-login-form
      title="欢迎回来"
      description="请输入账号信息后继续访问控制台。"
      :model="model"
      @submit="handleSubmit"
    />

    <xy-tag status="primary">{{ message }}</xy-tag>
  </div>
</template>
