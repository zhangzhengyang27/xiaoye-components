<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { XyCard, XyTable, XyTableColumn, XyTag, XyButton, XyInput, XyDialog, XyForm, XyFormItem, XySelect, XyMessage, XyPopconfirm } from 'xiaoye-components'
import type { User } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchText = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const formData = ref({
  name: '',
  email: '',
  phone: '',
  status: 'active' as 'active' | 'inactive',
  role: 'user' as string
})

const filteredUsers = computed(() => {
  if (!searchText.value) return userStore.users
  const keyword = searchText.value.toLowerCase()
  return userStore.users.filter((u: User) =>
    u.name.toLowerCase().includes(keyword) ||
    u.email.toLowerCase().includes(keyword) ||
    u.phone.includes(keyword)
  )
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

function openAddModal() {
  isEdit.value = false
  formData.value = {
    name: '',
    email: '',
    phone: '',
    status: 'active',
    role: 'user'
  }
  showModal.value = true
}

function openEditModal(user: User) {
  isEdit.value = true
  formData.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    role: user.role
  }
  showModal.value = true
}

function handleSubmit() {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    XyMessage.error('请填写完整信息')
    return
  }

  if (isEdit.value) {
    const user = userStore.users.find((u: User) => u.name === formData.value.name && u.email === formData.value.email)
    if (user) {
      userStore.updateUser(user.id, formData.value)
      XyMessage.success('更新成功')
    }
  } else {
    userStore.addUser({ ...formData.value, createTime: new Date().toISOString().split('T')[0] })
    XyMessage.success('添加成功')
  }

  showModal.value = false
}

function handleDelete(id: number) {
  userStore.deleteUser(id)
  XyMessage.success('删除成功')
}

function viewDetail(user: User) {
  router.push(`/system/user/${user.id}`)
}
</script>

<template>
  <div class="user-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">用户管理</h2>
          <p class="page-desc">管理系统用户账号</p>
        </div>
        <div class="header-right">
          <XyInput
            v-model="searchText"
            placeholder="搜索用户"
            :prefix-icon="'mdi:search'"
            class="search-input"
          />
          <XyButton type="primary" @click="openAddModal">
            <template #icon>
              <span class="btn-icon">+</span>
            </template>
            添加用户
          </XyButton>
        </div>
      </div>
    </XyCard>

    <XyCard class="table-card">
      <XyTable :data="filteredUsers" class="admin-table">
        <XyTableColumn prop="id" label="ID" width="80" />
        <XyTableColumn prop="name" label="姓名" />
        <XyTableColumn prop="email" label="邮箱" />
        <XyTableColumn prop="phone" label="手机号" />
        <XyTableColumn prop="status" label="状态">
          <template #default="{ row }">
            <XyTag :type="getStatusTag(row.status).color">
              {{ getStatusTag(row.status).text }}
            </XyTag>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="role" label="角色">
          <template #default="{ row }">
            <XyTag type="primary">{{ getRoleName(row.role) }}</XyTag>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="createTime" label="创建时间" />
        <XyTableColumn label="操作" width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <XyButton type="link" @click="viewDetail(row)">详情</XyButton>
              <XyButton type="link" @click="openEditModal(row)">编辑</XyButton>
              <XyPopconfirm title="确定删除该用户?" @confirm="handleDelete(row.id)">
                <XyButton type="link" danger>删除</XyButton>
              </XyPopconfirm>
            </div>
          </template>
        </XyTableColumn>
      </XyTable>
    </XyCard>

    <XyDialog
      v-model="showModal"
      :title="isEdit ? '编辑用户' : '添加用户'"
      @ok="handleSubmit"
    >
      <XyForm :model="formData" label-width="100px">
        <XyFormItem label="姓名" required>
          <XyInput v-model="formData.name" placeholder="请输入姓名" />
        </XyFormItem>
        <XyFormItem label="邮箱" required>
          <XyInput v-model="formData.email" placeholder="请输入邮箱" />
        </XyFormItem>
        <XyFormItem label="手机号" required>
          <XyInput v-model="formData.phone" placeholder="请输入手机号" />
        </XyFormItem>
        <XyFormItem label="状态">
          <XySelect v-model="formData.status">
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
          </XySelect>
        </XyFormItem>
        <XyFormItem label="角色">
          <XySelect v-model="formData.role">
            <option v-for="role in userStore.roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </XySelect>
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.user-management {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        .page-title {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 4px;
        }

        .page-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 12px;

        .search-input {
          width: 280px;
        }

        :deep(.xy-button--primary) {
          .btn-icon {
            font-size: 18px;
            line-height: 1;
          }
        }
      }
    }
  }

  .table-card {
    :deep(.xy-table) {
      --xy-table-header-background: rgba(15, 23, 42, 0.5);
      --xy-table-header-color: #64748b;
      --xy-table-row-hover-background: rgba(99, 102, 241, 0.06);
      --xy-table-border-color: rgba(255, 255, 255, 0.04);

      .xy-table__header-cell {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
      }

      .xy-table__cell {
        color: #cbd5e1;
        font-size: 14px;
      }

      .action-buttons {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
</style>
