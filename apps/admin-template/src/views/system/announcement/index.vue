<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTable, XyButton, XyTag, XyMessage, XyIcon, XySpace, XyInput, XyDialog, XyForm, XyFormItem, XySelect, XyDatePicker } from 'xiaoye-components'

interface Announcement {
  id: number
  title: string
  content: string
  type: 'notice' | 'news' | 'activity'
  author: string
  publishTime: string
  status: boolean
  views: number
}

const searchKeyword = ref('')
const showPublishDialog = ref(false)

const tableColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '标题', key: 'title' },
  { title: '类型', key: 'type', slot: 'type', width: 120 },
  { title: '发布人', key: 'author', width: 120 },
  { title: '发布时间', key: 'publishTime', width: 180 },
  { title: '浏览量', key: 'views', width: 100 },
  { title: '状态', key: 'status', slot: 'status', width: 100 },
  { title: '操作', key: 'action', slot: 'action', width: 200 }
]

const announcements = ref<Announcement[]>([
  { 
    id: 1, 
    title: '系统升级通知', 
    content: '系统将于本周日凌晨2:00-6:00进行升级维护...', 
    type: 'notice', 
    author: '管理员', 
    publishTime: '2026-05-18 10:00:00', 
    status: true, 
    views: 1256 
  },
  { 
    id: 2, 
    title: '新功能上线公告', 
    content: '全新数据可视化模块正式上线，欢迎体验...', 
    type: 'news', 
    author: '产品部', 
    publishTime: '2026-05-17 15:30:00', 
    status: true, 
    views: 890 
  },
  { 
    id: 3, 
    title: '端午节活动通知', 
    content: '端午节期间平台将举办线上活动...', 
    type: 'activity', 
    author: '运营部', 
    publishTime: '2026-05-16 09:00:00', 
    status: true, 
    views: 2341 
  },
  { 
    id: 4, 
    title: '安全漏洞修复公告', 
    content: '已修复已知安全漏洞，建议用户更新密码...', 
    type: 'notice', 
    author: '安全组', 
    publishTime: '2026-05-15 14:20:00', 
    status: false, 
    views: 567 
  },
  { 
    id: 5, 
    title: '春季版本更新说明', 
    content: '本次更新包含多项功能优化和Bug修复...', 
    type: 'news', 
    author: '技术部', 
    publishTime: '2026-05-14 11:00:00', 
    status: true, 
    views: 1823 
  }
])

const publishForm = ref({
  title: '',
  content: '',
  type: 'notice',
  publishTime: ''
})

function getTypeInfo(type: string) {
  const info: Record<string, { text: string; color: string; icon: string }> = {
    notice: { text: '系统通知', color: 'warning', icon: 'mdi:bell' },
    news: { text: '新闻动态', color: 'info', icon: 'mdi:newspaper' },
    activity: { text: '活动公告', color: 'success', icon: 'mdi:party-popper' }
  }
  return info[type] || { text: type, color: 'default', icon: 'mdi:bell' }
}

function handleView(announcement: Announcement) {
  XyMessage.info(`浏览量: ${announcement.views}`)
}

function handleEdit(announcement: Announcement) {
  XyMessage.info(`编辑: ${announcement.title}`)
}

function handleDelete(announcement: Announcement) {
  XyMessage.success(`删除: ${announcement.title}`)
}

function handlePublish() {
  showPublishDialog.value = true
}

function handleSubmit() {
  if (!publishForm.value.title || !publishForm.value.content) {
    XyMessage.error('请填写完整信息')
    return
  }
  XyMessage.success('发布公告功能待实现')
  showPublishDialog.value = false
}
</script>

<template>
  <div class="announcement-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">通知公告</h2>
          <p class="page-desc">管理系统通知和公告</p>
        </div>
        <div class="header-right">
          <XySpace>
            <XyInput
              v-model="searchKeyword"
              placeholder="搜索公告标题"
              :prefix-icon="'mdi:search'"
              style="width: 250px"
            />
            <XyButton type="primary" @click="handlePublish">
              发布公告
            </XyButton>
          </XySpace>
        </div>
      </div>
    </XyCard>

    <XyCard>
      <XyTable :columns="tableColumns" :data="announcements">
        <template #title="{ record }">
          <div class="title-cell">
            <XyIcon :icon="getTypeInfo(record.type).icon" :size="18" />
            <span>{{ record.title }}</span>
          </div>
        </template>
        <template #type="{ record }">
          <XyTag :type="getTypeInfo(record.type).color">
            {{ getTypeInfo(record.type).text }}
          </XyTag>
        </template>
        <template #status="{ record }">
          <XyTag :type="record.status ? 'success' : 'info'">
            {{ record.status ? '已发布' : '草稿' }}
          </XyTag>
        </template>
        <template #action="{ record }">
          <XySpace>
            <XyButton type="link" size="small" @click="handleView(record)">
              查看
            </XyButton>
            <XyButton type="link" size="small" @click="handleEdit(record)">
              编辑
            </XyButton>
            <XyButton type="link" size="small" danger @click="handleDelete(record)">
              删除
            </XyButton>
          </XySpace>
        </template>
      </XyTable>
    </XyCard>

    <XyDialog
      v-model="showPublishDialog"
      title="发布公告"
      width="600px"
      @ok="handleSubmit"
    >
      <XyForm :model="publishForm" label-width="100px">
        <XyFormItem label="公告标题" required>
          <XyInput v-model="publishForm.title" placeholder="请输入公告标题" />
        </XyFormItem>
        <XyFormItem label="公告类型" required>
          <XySelect v-model="publishForm.type">
            <option value="notice">系统通知</option>
            <option value="news">新闻动态</option>
            <option value="activity">活动公告</option>
          </XySelect>
        </XyFormItem>
        <XyFormItem label="发布时间" required>
          <XyDatePicker
            v-model="publishForm.publishTime"
            type="datetime"
            placeholder="选择发布时间"
          />
        </XyFormItem>
        <XyFormItem label="公告内容" required>
          <XyInput
            v-model="publishForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入公告内容"
          />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.announcement-management {
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

  .title-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e293b;
  }
}
</style>
