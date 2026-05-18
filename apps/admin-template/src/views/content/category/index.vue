<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyButton, XyDialog, XyForm, XyFormItem, XyInput, XyMessage, XyPopconfirm } from 'xiaoye-components'

const categories = ref([
  { id: 1, name: '技术', count: 120, status: 'active' },
  { id: 2, name: '生活', count: 85, status: 'active' },
  { id: 3, name: '娱乐', count: 60, status: 'active' },
  { id: 4, name: '科技', count: 45, status: 'inactive' },
  { id: 5, name: '教育', count: 30, status: 'active' }
])

const showModal = ref(false)
const formData = ref({ name: '' })

function openAddModal() {
  formData.value = { name: '' }
  showModal.value = true
}

function handleSubmit() {
  if (!formData.value.name) {
    XyMessage.error('请填写分类名称')
    return
  }
  XyMessage.success('添加成功')
  showModal.value = false
}

function handleDelete(id: number) {
  categories.value = categories.value.filter((c: { id: number }) => c.id !== id)
  XyMessage.success('删除成功')
}
</script>

<template>
  <div class="category-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">分类管理</h2>
          <p class="page-desc">管理文章分类</p>
        </div>
        <div class="header-right">
          <XyButton type="primary" @click="openAddModal">
            添加分类
          </XyButton>
        </div>
      </div>
    </XyCard>
    
    <XyCard>
      <div class="category-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          :class="{ inactive: category.status === 'inactive' }"
        >
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <span class="category-count">{{ category.count }} 篇文章</span>
          </div>
          <div class="category-actions">
            <XyButton type="link" size="small">编辑</XyButton>
            <XyPopconfirm title="确定删除该分类?" @confirm="handleDelete(category.id)">
              <XyButton type="link" size="small" danger>删除</XyButton>
            </XyPopconfirm>
          </div>
        </div>
      </div>
    </XyCard>
    
    <XyDialog
      v-model="showModal"
      title="添加分类"
      @ok="handleSubmit"
    >
      <XyForm :model="formData" label-width="100px">
        <XyFormItem label="分类名称" required>
          <XyInput v-model="formData.name" placeholder="请输入分类名称" />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.category-management {
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
  
  .category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    
    .category-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
      
      &:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
      }
      
      &.inactive {
        opacity: 0.6;
      }
      
      .category-info {
        .category-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px;
        }
        
        .category-count {
          font-size: 13px;
          color: #64748b;
        }
      }
      
      .category-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
