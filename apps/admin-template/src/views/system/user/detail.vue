<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { XyCard, XyDescriptions, XyDescriptionsItem, XyTag, XyButton, XyAvatar, XyTimeline, XyTimelineItem } from 'xiaoye-components'
import type { User } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const user = ref<User | null>(null)

const userActivities = ref([
  { time: '2026-05-18 14:30:00', action: '登录系统', type: 'info' },
  { time: '2026-05-17 16:20:00', action: '修改个人信息', type: 'success' },
  { time: '2026-05-17 10:15:00', action: '查看用户列表', type: 'info' },
  { time: '2026-05-16 09:45:00', action: '创建新用户', type: 'success' },
  { time: '2026-05-15 15:30:00', action: '退出登录', type: 'warning' }
])

onMounted(() => {
  const userId = Number(route.params.id)
  user.value = userStore.users.find((u: User) => u.id === userId) || null
})

function getStatusTag(status: string) {
  const statusMap: Record<string, { text: string; color: string }> = {
    active: { text: '启用', color: 'success' },
    inactive: { text: '禁用', color: 'danger' }
  }
  return statusMap[status] || { text: status, color: 'default' }
}

function getRoleName(roleId: string) {
  const role = userStore.roles.find((r: { id: string }) => r.id === roleId)
  return role?.name || roleId
}

function goBack() {
  router.push('/system/user')
}

function editUser() {
  // 可以跳转到编辑页面或打开编辑弹窗
  goBack()
}
</script>

<template>
  <div class="user-detail">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <XyButton @click="goBack">
            返回
          </XyButton>
          <h2 class="page-title">用户详情</h2>
        </div>
        <div class="header-right">
          <XyButton @click="editUser">
            编辑
          </XyButton>
        </div>
      </div>
    </XyCard>

    <div v-if="user" class="detail-content">
      <XyCard class="basic-info">
        <div class="user-profile">
          <XyAvatar :size="80" :src="''">
            {{ user.name.charAt(0).toUpperCase() }}
          </XyAvatar>
          <div class="profile-info">
            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-email">{{ user.email }}</p>
            <div class="user-tags">
              <XyTag :type="getStatusTag(user.status).color">
                {{ getStatusTag(user.status).text }}
              </XyTag>
              <XyTag type="primary">
                {{ getRoleName(user.role) }}
              </XyTag>
            </div>
          </div>
        </div>
      </XyCard>

      <XyCard title="基本信息">
        <XyDescriptions :column="2" border>
          <XyDescriptionsItem label="ID">
            {{ user.id }}
          </XyDescriptionsItem>
          <XyDescriptionsItem label="姓名">
            {{ user.name }}
          </XyDescriptionsItem>
          <XyDescriptionsItem label="邮箱">
            {{ user.email }}
          </XyDescriptionsItem>
          <XyDescriptionsItem label="手机号">
            {{ user.phone }}
          </XyDescriptionsItem>
          <XyDescriptionsItem label="状态">
            <XyTag :type="getStatusTag(user.status).color">
              {{ getStatusTag(user.status).text }}
            </XyTag>
          </XyDescriptionsItem>
          <XyDescriptionsItem label="角色">
            <XyTag type="primary">
              {{ getRoleName(user.role) }}
            </XyTag>
          </XyDescriptionsItem>
          <XyDescriptionsItem label="创建时间">
            {{ user.createTime }}
          </XyDescriptionsItem>
          <XyDescriptionsItem label="最后登录">
            -
          </XyDescriptionsItem>
        </XyDescriptions>
      </XyCard>

      <XyCard title="操作日志">
        <XyTimeline>
          <XyTimelineItem
            v-for="(item, index) in userActivities"
            :key="index"
            :timestamp="item.time"
            :type="item.type"
          >
            {{ item.action }}
          </XyTimelineItem>
        </XyTimeline>
      </XyCard>
    </div>

    <div v-else class="not-found">
      <XyCard>
        <div class="not-found-content">
          <p>用户不存在</p>
          <XyButton type="primary" @click="goBack">
            返回用户列表
          </XyButton>
        </div>
      </XyCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-detail {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
      }
    }
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;

    .basic-info {
      .user-profile {
        display: flex;
        gap: 20px;
        align-items: center;

        .profile-info {
          .user-name {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px;
          }

          .user-email {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 12px;
          }

          .user-tags {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
  }

  .not-found {
    margin-top: 20px;

    .not-found-content {
      text-align: center;
      padding: 60px 0;

      p {
        font-size: 16px;
        color: #64748b;
        margin: 0 0 20px;
      }
    }
  }
}
</style>
