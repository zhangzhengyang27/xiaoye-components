<script setup lang="ts">
import { reactive, ref } from "vue";

const model = reactive({
  username: "xiaoye",
  password: "",
  remember: false
});

const action = ref("尚未选择第三方入口");

function handleThirdPartyClick(item: { label: string }) {
  action.value = `点击了 ${item.label}`;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-login-form
      title="企业统一登录"
      description="账号密码和第三方入口可以共存，但真正的授权流程由应用层处理。"
      :model="model"
      :third-party-items="[
        { key: 'wechat', label: '微信登录', icon: 'mdi:wechat' },
        { key: 'github', label: 'GitHub 登录', icon: 'mdi:github' }
      ]"
      @third-party-click="handleThirdPartyClick"
    />

    <xy-tag status="warning">{{ action }}</xy-tag>
  </div>
</template>
