<script setup lang="ts">
import { reactive, ref } from "vue";

const loggedUser = ref("未登录");
const model = reactive({
  username: "xiaoye",
  password: "",
  remember: true
});

function handleSubmit() {
  loggedUser.value = model.username || "未填写用户名";
}
</script>

<template>
  <xy-page-container
    title="运营工作台认证"
    description="PageContainer 和 Card 可以一起承接更完整的后台认证页布局。"
    :meta-items="[
      { label: '环境', value: '预发环境', icon: 'mdi:server' },
      { label: '最近登录', value: loggedUser, icon: 'mdi:account-check-outline' }
    ]"
    shadow
  >
    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(360px, 460px);
        gap: 24px;
        align-items: stretch;
      "
    >
      <xy-card header="为什么需要统一认证组件">
        <xy-space direction="vertical" fill>
          <xy-text>统一登录主链路可以降低模板工程差异。</xy-text>
          <xy-text>第三方登录入口可以保持同一套样式和事件协议。</xy-text>
          <xy-text>与 PageContainer 组合后，文档和示例可以直接落回后台页面语境。</xy-text>
        </xy-space>
      </xy-card>

      <xy-login-form
        :model="model"
        title="欢迎回来"
        description="请输入账号密码进入运营后台。"
        :third-party-items="[
          { key: 'github', label: 'GitHub', icon: 'mdi:github' },
          { key: 'wecom', label: '企业微信', icon: 'mdi:wechat' }
        ]"
        @submit="handleSubmit"
      />
    </div>
  </xy-page-container>
</template>
