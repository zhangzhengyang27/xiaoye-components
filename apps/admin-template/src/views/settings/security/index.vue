<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyForm, XyFormItem, XyButton, XySwitch, XyMessage, XyInputNumber } from 'xiaoye-components'

const formData = ref({
  loginAttempts: 5,
  lockoutDuration: 15,
  sessionTimeout: 30,
  enableTwoFactor: false,
  enableCaptcha: true,
  passwordMinLength: 8,
  requireSpecialChar: true
})

function handleSave() {
  XyMessage.success('保存成功')
}
</script>

<template>
  <div class="security-page">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">安全设置</h2>
          <p class="page-desc">配置系统安全相关选项</p>
        </div>
      </div>
    </XyCard>
    
    <XyCard title="登录安全">
      <XyForm :model="formData" label-width="160px">
        <XyFormItem label="最大登录尝试次数">
          <XyInputNumber v-model="formData.loginAttempts" :min="1" :max="10" />
        </XyFormItem>
        <XyFormItem label="账号锁定时长(分钟)">
          <XyInputNumber v-model="formData.lockoutDuration" :min="1" :max="60" />
        </XyFormItem>
        <XyFormItem label="会话超时时间(分钟)">
          <XyInputNumber v-model="formData.sessionTimeout" :min="5" :max="120" />
        </XyFormItem>
        <XyFormItem label="启用双因素认证">
          <XySwitch v-model="formData.enableTwoFactor" />
        </XyFormItem>
        <XyFormItem label="启用验证码">
          <XySwitch v-model="formData.enableCaptcha" />
        </XyFormItem>
      </XyForm>
    </XyCard>
    
    <XyCard title="密码策略">
      <XyForm :model="formData" label-width="160px">
        <XyFormItem label="最小密码长度">
          <XyInputNumber v-model="formData.passwordMinLength" :min="6" :max="32" />
        </XyFormItem>
        <XyFormItem label="要求特殊字符">
          <XySwitch v-model="formData.requireSpecialChar" />
        </XyFormItem>
      </XyForm>
    </XyCard>
    
    <div class="form-actions">
      <XyButton type="primary" @click="handleSave">保存设置</XyButton>
      <XyButton>重置</XyButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.security-page {
  .page-header {
    .header-content {
      .header-left {
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px;
        }
        
        .page-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }
}
</style>
