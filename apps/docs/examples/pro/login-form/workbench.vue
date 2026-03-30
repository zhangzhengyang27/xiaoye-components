<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  username: "",
  password: "",
  remember: true
});
</script>

<template>
  <xy-page-container
    title="认证中心"
    description="PageContainer 承接认证页壳层，LoginForm 负责登录主链路。"
    :meta-items="[
      { label: '环境', value: '生产控制台', icon: 'mdi:shield-lock-outline' },
      { label: '访问入口', value: '后台工作台', icon: 'mdi:view-dashboard-outline' }
    ]"
    shadow
  >
    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(320px, 420px);
        gap: 16px;
      "
    >
      <xy-card header="登录说明">
        <xy-space direction="vertical" size="sm" fill>
          <xy-text>
            登录组件适合放在认证页、后台控制台入口页或内部门户页中，只处理登录主链路。
          </xy-text>
          <xy-tag status="primary">建议接入应用自己的鉴权请求层</xy-tag>
          <xy-tag status="warning">注册、验证码、OAuth 流程不在当前首版范围</xy-tag>
        </xy-space>
      </xy-card>

      <xy-login-form
        title="控制台登录"
        description="请输入你的工作账号和密码。"
        :model="model"
        :third-party-items="[
          { key: 'wechat', label: '微信登录', icon: 'mdi:wechat' }
        ]"
      />
    </div>
  </xy-page-container>
</template>
