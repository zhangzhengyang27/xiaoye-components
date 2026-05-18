<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyAvatar, XyButton, XyForm, XyFormItem, XyInput, XyMessage, XyTabs, XyTabPane, XyDescriptions, XyDescriptionsItem, XyTag } from 'xiaoye-components'

const activeTab = ref('info')

const userInfo = ref({
  name: 'Admin',
  email: 'admin@example.com',
  phone: '13800000000',
  role: '系统管理员',
  createTime: '2024-01-01',
  lastLoginTime: '2026-05-18 14:30:00'
})

const editForm = ref({
  name: 'Admin',
  email: 'admin@example.com',
  phone: '13800000000'
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function handleUpdateInfo() {
  XyMessage.success('个人信息更新成功')
}

function handleChangePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    XyMessage.error('两次输入的密码不一致')
    return
  }
  XyMessage.success('密码修改成功，请重新登录')
}
</script>

<template>
  <div class="profile">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">个人中心</h2>
          <p class="page-desc">个人信息管理</p>
        </div>
      </div>
    </XyCard>

    <div class="profile-content">
      <div class="profile-sidebar">
        <XyCard>
          <div class="user-profile">
            <XyAvatar :size="100">
              {{ userInfo.name.charAt(0).toUpperCase() }}
            </XyAvatar>
            <div class="user-details">
              <h3 class="user-name">{{ userInfo.name }}</h3>
              <p class="user-role">
                <XyTag type="primary">{{ userInfo.role }}</XyTag>
              </p>
              <p class="user-email">{{ userInfo.email }}</p>
            </div>
          </div>
        </XyCard>
      </div>

      <div class="profile-main">
        <XyCard>
          <XyTabs v-model="activeTab" type="card">
            <XyTabPane label="基本信息" name="info">
              <div class="tab-content">
                <XyDescriptions :column="1" border>
                  <XyDescriptionsItem label="用户名">
                    {{ userInfo.name }}
                  </XyDescriptionsItem>
                  <XyDescriptionsItem label="邮箱">
                    {{ userInfo.email }}
                  </XyDescriptionsItem>
                  <XyDescriptionsItem label="手机号">
                    {{ userInfo.phone }}
                  </XyDescriptionsItem>
                  <XyDescriptionsItem label="角色">
                    <XyTag type="primary">{{ userInfo.role }}</XyTag>
                  </XyDescriptionsItem>
                  <XyDescriptionsItem label="创建时间">
                    {{ userInfo.createTime }}
                  </XyDescriptionsItem>
                  <XyDescriptionsItem label="最后登录">
                    {{ userInfo.lastLoginTime }}
                  </XyDescriptionsItem>
                </XyDescriptions>
              </div>
            </XyTabPane>

            <XyTabPane label="编辑资料" name="edit">
              <div class="tab-content">
                <XyForm :model="editForm" label-width="100px" style="max-width: 500px;">
                  <XyFormItem label="用户名" required>
                    <XyInput v-model="editForm.name" />
                  </XyFormItem>
                  <XyFormItem label="邮箱" required>
                    <XyInput v-model="editForm.email" />
                  </XyFormItem>
                  <XyFormItem label="手机号">
                    <XyInput v-model="editForm.phone" />
                  </XyFormItem>
                  <XyFormItem>
                    <XyButton type="primary" @click="handleUpdateInfo">
                      保存修改
                    </XyButton>
                    <XyButton>取消</XyButton>
                  </XyFormItem>
                </XyForm>
              </div>
            </XyTabPane>

            <XyTabPane label="修改密码" name="password">
              <div class="tab-content">
                <XyForm :model="passwordForm" label-width="120px" style="max-width: 500px;">
                  <XyFormItem label="原密码" required>
                    <XyInput v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" />
                  </XyFormItem>
                  <XyFormItem label="新密码" required>
                    <XyInput v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
                  </XyFormItem>
                  <XyFormItem label="确认密码" required>
                    <XyInput v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
                  </XyFormItem>
                  <XyFormItem>
                    <XyButton type="primary" @click="handleChangePassword">
                      确认修改
                    </XyButton>
                    <XyButton>取消</XyButton>
                  </XyFormItem>
                </XyForm>
              </div>
            </XyTabPane>
          </XyTabs>
        </XyCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile {
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

  .profile-content {
    display: flex;
    gap: 20px;
    margin-top: 20px;

    .profile-sidebar {
      width: 300px;
      flex-shrink: 0;

      .user-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;

        .user-details {
          text-align: center;
          margin-top: 16px;

          .user-name {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px;
          }

          .user-role {
            margin: 0 0 8px;
          }

          .user-email {
            font-size: 14px;
            color: #64748b;
            margin: 0;
          }
        }
      }
    }

    .profile-main {
      flex: 1;
      min-width: 0;

      .tab-content {
        padding: 20px 0;
      }
    }
  }
}
</style>
