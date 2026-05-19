<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyForm, XyFormItem, XyInput, XyButton, XySwitch, XySelect, XyMessage } from 'xiaoye-components'

const formData = ref({
  siteName: 'Xiaoye Admin',
  siteUrl: 'https://admin.xiaoye.com',
  description: '专业的企业级后台管理系统',
  keywords: 'admin, vue, components',
  enableRegistration: true,
  defaultRole: 'user',
  timezone: 'Asia/Shanghai'
})

const defaultRoleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑' },
  { value: 'user', label: '普通用户' }
]

const timezoneOptions = [
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
  { value: 'UTC', label: 'UTC' }
]

function handleSave() {
  XyMessage.success('保存成功')
}
</script>

<template>
  <div class="settings-page">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">基础设置</h2>
          <p class="page-desc">配置系统基础信息</p>
        </div>
      </div>
    </XyCard>
    
    <XyCard title="网站信息">
      <XyForm :model="formData" label-width="120px">
        <XyFormItem label="网站名称" required>
          <XyInput v-model="formData.siteName" placeholder="请输入网站名称" />
        </XyFormItem>
        <XyFormItem label="网站域名" required>
          <XyInput v-model="formData.siteUrl" placeholder="请输入网站域名" />
        </XyFormItem>
        <XyFormItem label="网站描述">
          <XyInput v-model="formData.description" placeholder="请输入网站描述" />
        </XyFormItem>
        <XyFormItem label="关键词">
          <XyInput v-model="formData.keywords" placeholder="请输入关键词，用逗号分隔" />
        </XyFormItem>
      </XyForm>
    </XyCard>
    
    <XyCard title="用户设置">
      <XyForm :model="formData" label-width="120px">
        <XyFormItem label="允许注册">
          <XySwitch v-model="formData.enableRegistration" />
        </XyFormItem>
        <XyFormItem label="默认角色">
          <XySelect v-model="formData.defaultRole" :options="defaultRoleOptions" />
        </XyFormItem>
      </XyForm>
    </XyCard>
    
    <XyCard title="系统设置">
      <XyForm :model="formData" label-width="120px">
        <XyFormItem label="时区设置">
          <XySelect v-model="formData.timezone" :options="timezoneOptions" />
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
.settings-page {
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
