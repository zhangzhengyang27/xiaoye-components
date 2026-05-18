<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { XyCard, XyTable, XyTableColumn, XyButton, XyDialog, XyForm, XyFormItem, XyInput, XyMessage, XyPopconfirm } from 'xiaoye-components'

const userStore = useUserStore()

const showModal = ref(false)
const isEdit = ref(false)
const formData = ref({
  id: '',
  name: '',
  description: ''
})

function openAddModal() {
  isEdit.value = false
  formData.value = {
    id: '',
    name: '',
    description: ''
  }
  showModal.value = true
}

function openEditModal(role: typeof userStore.roles[0]) {
  isEdit.value = true
  formData.value = {
    id: role.id,
    name: role.name,
    description: role.description
  }
  showModal.value = true
}

function handleSubmit() {
  if (!formData.value.id || !formData.value.name) {
    XyMessage.error('请填写角色ID和名称')
    return
  }
  
  if (isEdit.value) {
    const role = userStore.roles.find(r => r.id === formData.value.id)
    if (role) {
      role.name = formData.value.name
      role.description = formData.value.description
    }
    XyMessage.success('更新成功')
  } else {
    userStore.roles.push({ ...formData.value })
    XyMessage.success('添加成功')
  }
  
  showModal.value = false
}

function handleDelete(id: string) {
  userStore.roles = userStore.roles.filter(r => r.id !== id)
  XyMessage.success('删除成功')
}
</script>

<template>
  <div class="role-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">角色管理</h2>
          <p class="page-desc">管理系统角色权限</p>
        </div>
        <div class="header-right">
          <XyButton type="primary" @click="openAddModal">
            添加角色
          </XyButton>
        </div>
      </div>
    </XyCard>
    
    <XyCard>
      <XyTable :data="userStore.roles">
        <XyTableColumn prop="id" label="角色ID" width="80" />
        <XyTableColumn prop="name" label="角色名称" />
        <XyTableColumn prop="description" label="描述" />
        <XyTableColumn label="操作" width="200">
          <template #default="{ row }">
            <XyButton type="link" @click="openEditModal(row)">编辑</XyButton>
            <XyButton type="link" @click="openEditModal(row)">权限配置</XyButton>
            <XyPopconfirm title="确定删除该角色?" @confirm="handleDelete(row.id)">
              <XyButton type="link" danger>删除</XyButton>
            </XyPopconfirm>
          </template>
        </XyTableColumn>
      </XyTable>
    </XyCard>
    
    <XyDialog
      v-model="showModal"
      :title="isEdit ? '编辑角色' : '添加角色'"
      @ok="handleSubmit"
    >
      <XyForm :model="formData" label-width="100px">
        <XyFormItem label="角色ID" required>
          <XyInput v-model="formData.id" :disabled="isEdit" placeholder="请输入角色ID" />
        </XyFormItem>
        <XyFormItem label="角色名称" required>
          <XyInput v-model="formData.name" placeholder="请输入角色名称" />
        </XyFormItem>
        <XyFormItem label="描述">
          <XyInput v-model="formData.description" type="textarea" placeholder="请输入角色描述" />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.role-management {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
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
}
</style>
