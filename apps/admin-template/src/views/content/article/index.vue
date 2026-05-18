<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTable, XyButton, XyInput, XyDialog, XyForm, XyFormItem, XySelect, XyTag, XyMessage, XyPopconfirm, XyEditor } from 'xiaoye-components'

const articles = ref([
  { id: 1, title: 'Vue 3 入门指南', category: '技术', status: 'published', author: '张三', createTime: '2024-01-15' },
  { id: 2, title: 'TypeScript 最佳实践', category: '技术', status: 'draft', author: '李四', createTime: '2024-01-14' },
  { id: 3, title: '前端性能优化', category: '技术', status: 'published', author: '张三', createTime: '2024-01-13' },
  { id: 4, title: 'React vs Vue', category: '技术', status: 'pending', author: '王五', createTime: '2024-01-12' },
  { id: 5, title: 'Node.js 实战', category: '技术', status: 'published', author: '赵六', createTime: '2024-01-11' }
])

const searchText = ref('')
const showModal = ref(false)
const formData = ref({
  title: '',
  category: '',
  content: ''
})

const tableColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '标题', key: 'title' },
  { title: '分类', key: 'category' },
  { title: '状态', key: 'status', slot: 'status' },
  { title: '作者', key: 'author' },
  { title: '创建时间', key: 'createTime' },
  { title: '操作', key: 'action', slot: 'action' }
]

function getStatusTag(status: string) {
  const statusMap: Record<string, { text: string; color: string }> = {
    published: { text: '已发布', color: 'success' },
    draft: { text: '草稿', color: 'warning' },
    pending: { text: '待审核', color: 'info' }
  }
  return statusMap[status] || { text: status, color: 'default' }
}

function openAddModal() {
  formData.value = { title: '', category: '', content: '' }
  showModal.value = true
}

function handleSubmit() {
  if (!formData.value.title) {
    XyMessage.error('请填写文章标题')
    return
  }
  XyMessage.success('保存成功')
  showModal.value = false
}

function handleDelete(id: number) {
  articles.value = articles.value.filter(a => a.id !== id)
  XyMessage.success('删除成功')
}
</script>

<template>
  <div class="article-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">文章管理</h2>
          <p class="page-desc">管理网站文章内容</p>
        </div>
        <div class="header-right">
          <XyInput
            v-model="searchText"
            placeholder="搜索文章"
            :prefix-icon="'mdi:search'"
            class="search-input"
          />
          <XyButton type="primary" @click="openAddModal">
            写文章
          </XyButton>
        </div>
      </div>
    </XyCard>
    
    <XyCard>
      <XyTable :columns="tableColumns" :data="articles">
        <template #status="{ record }">
          <XyTag :type="getStatusTag(record.status).color">
            {{ getStatusTag(record.status).text }}
          </XyTag>
        </template>
        <template #action="{ record }">
          <XyButton type="link">预览</XyButton>
          <XyButton type="link">编辑</XyButton>
          <XyPopconfirm title="确定删除该文章?" @confirm="handleDelete(record.id)">
            <XyButton type="link" danger>删除</XyButton>
          </XyPopconfirm>
        </template>
      </XyTable>
    </XyCard>
    
    <XyDialog
      v-model="showModal"
      title="写文章"
      width="800px"
      @ok="handleSubmit"
    >
      <XyForm :model="formData" label-width="100px">
        <XyFormItem label="标题" required>
          <XyInput v-model="formData.title" placeholder="请输入文章标题" />
        </XyFormItem>
        <XyFormItem label="分类">
          <XySelect v-model="formData.category">
            <option value="技术">技术</option>
            <option value="生活">生活</option>
            <option value="娱乐">娱乐</option>
          </XySelect>
        </XyFormItem>
        <XyFormItem label="内容">
          <XyEditor v-model="formData.content" :height="300" />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.article-management {
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
      
      .header-right {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .search-input {
          width: 280px;
        }
      }
    }
  }
}
</style>
