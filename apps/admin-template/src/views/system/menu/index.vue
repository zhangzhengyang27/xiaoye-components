<script setup lang="ts">
import { ref } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { XyCard, XyButton, XyDialog, XyForm, XyFormItem, XyInput, XySelect, XyMessage, XyPopconfirm, XyTree } from 'xiaoye-components'

const menuStore = useMenuStore()

const showModal = ref(false)
const isEdit = ref(false)
const formData = ref({
  id: '',
  name: '',
  icon: '',
  path: '',
  parentId: ''
})

function openAddModal() {
  isEdit.value = false
  formData.value = {
    id: '',
    name: '',
    icon: '',
    path: '',
    parentId: ''
  }
  showModal.value = true
}

function handleSubmit() {
  if (!formData.value.id || !formData.value.name) {
    XyMessage.error('请填写菜单ID和名称')
    return
  }
  
  XyMessage.success(isEdit.value ? '更新成功' : '添加成功')
  showModal.value = false
}
</script>

<template>
  <div class="menu-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">菜单管理</h2>
          <p class="page-desc">管理系统菜单结构</p>
        </div>
        <div class="header-right">
          <XyButton type="primary" @click="openAddModal">
            添加菜单
          </XyButton>
        </div>
      </div>
    </XyCard>
    
    <XyCard>
      <XyTree :data="menuStore.menus" :render-icon="true">
        <template #icon="{ node }">
          <span class="tree-icon">{{ node.icon }}</span>
        </template>
        <template #title="{ node }">
          {{ node.name }}
        </template>
        <template #extra>
          <XyButton type="link" size="small">编辑</XyButton>
          <XyPopconfirm title="确定删除该菜单?" @confirm="() => {}">
            <XyButton type="link" size="small" danger>删除</XyButton>
          </XyPopconfirm>
        </template>
      </XyTree>
    </XyCard>
    
    <XyDialog
      v-model="showModal"
      :title="isEdit ? '编辑菜单' : '添加菜单'"
      @ok="handleSubmit"
    >
      <XyForm :model="formData" label-width="100px">
        <XyFormItem label="菜单ID" required>
          <XyInput v-model="formData.id" placeholder="请输入菜单ID" />
        </XyFormItem>
        <XyFormItem label="菜单名称" required>
          <XyInput v-model="formData.name" placeholder="请输入菜单名称" />
        </XyFormItem>
        <XyFormItem label="图标">
          <XyInput v-model="formData.icon" placeholder="如: mdi:home" />
        </XyFormItem>
        <XyFormItem label="路径">
          <XyInput v-model="formData.path" placeholder="请输入路由路径" />
        </XyFormItem>
        <XyFormItem label="父级菜单">
          <XySelect v-model="formData.parentId">
            <option value="">无</option>
          </XySelect>
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.menu-management {
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
  
  .tree-icon {
    font-size: 16px;
    margin-right: 8px;
  }
}
</style>
