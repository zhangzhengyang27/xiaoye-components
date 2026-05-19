<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTable, XyTableColumn, XyButton, XyTag, XySwitch, XyMessage, XyIcon, XySpace, XyInput, XyDialog, XyForm, XyFormItem, XySelect } from 'xiaoye-components'

interface FileItem {
  id: number
  name: string
  type: string
  size: string
  uploader: string
  uploadTime: string
  url: string
}

const searchKeyword = ref('')
const showUploadDialog = ref(false)

const categoryOptions = [
  { value: 'doc', label: '文档资料' },
  { value: 'image', label: '图片素材' },
  { value: 'video', label: '视频资源' },
  { value: 'other', label: '其他文件' }
]

const files = ref<FileItem[]>([
  { id: 1, name: '产品介绍文档.pdf', type: 'pdf', size: '2.5MB', uploader: '张三', uploadTime: '2026-05-18 10:30:00', url: '#' },
  { id: 2, name: '项目需求文档.docx', type: 'doc', size: '1.8MB', uploader: '李四', uploadTime: '2026-05-17 15:20:00', url: '#' },
  { id: 3, name: 'logo设计图.png', type: 'image', size: '520KB', uploader: '王五', uploadTime: '2026-05-17 09:15:00', url: '#' },
  { id: 4, name: '数据报表.xlsx', type: 'excel', size: '3.2MB', uploader: '赵六', uploadTime: '2026-05-16 14:45:00', url: '#' },
  { id: 5, name: '视频教程.mp4', type: 'video', size: '45.6MB', uploader: '钱七', uploadTime: '2026-05-15 11:30:00', url: '#' },
  { id: 6, name: '压缩包.zip', type: 'archive', size: '15.8MB', uploader: '孙八', uploadTime: '2026-05-14 16:00:00', url: '#' }
])

function getTypeIcon(type: string) {
  const icons: Record<string, string> = {
    pdf: 'mdi:file-pdf-box',
    doc: 'mdi:file-word-box',
    image: 'mdi:file-image',
    excel: 'mdi:file-excel',
    video: 'mdi:file-video',
    archive: 'mdi:folder-zip'
  }
  return icons[type] || 'mdi:file'
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    pdf: 'danger',
    doc: 'primary',
    image: 'success',
    excel: 'info',
    video: 'warning',
    archive: 'default'
  }
  return colors[type] || 'default'
}

function handleDownload(file: FileItem) {
  XyMessage.success(`开始下载: ${file.name}`)
}

function handleDelete(file: FileItem) {
  XyMessage.success(`删除文件: ${file.name}`)
}

function handlePreview(file: FileItem) {
  XyMessage.info(`预览文件: ${file.name}`)
}

function handleUpload() {
  showUploadDialog.value = true
}

function handleUploadSubmit() {
  XyMessage.success('文件上传功能待实现')
  showUploadDialog.value = false
}
</script>

<template>
  <div class="file-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">文件管理</h2>
          <p class="page-desc">管理系统上传文件</p>
        </div>
        <div class="header-right">
          <XySpace>
            <XyInput
              v-model="searchKeyword"
              placeholder="搜索文件名"
              :prefix-icon="'mdi:search'"
              style="width: 250px"
            />
            <XyButton type="primary" @click="handleUpload">
              上传文件
            </XyButton>
          </XySpace>
        </div>
      </div>
    </XyCard>

    <XyCard>
      <XyTable :data="files">
        <XyTableColumn prop="id" label="ID" width="80" />
        <XyTableColumn prop="name" label="文件名">
          <template #default="{ row }">
            <div class="file-name-cell">
              <XyIcon :icon="getTypeIcon(row.type)" :size="20" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="type" label="类型" width="100">
          <template #default="{ row }">
            <XyTag :type="getTypeColor(row.type)" size="small">
              {{ row.type.toUpperCase() }}
            </XyTag>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="size" label="大小" width="120" />
        <XyTableColumn prop="uploader" label="上传者" width="120" />
        <XyTableColumn prop="uploadTime" label="上传时间" width="180" />
        <XyTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <XySwitch :model-value="row.id <= 4" />
          </template>
        </XyTableColumn>
        <XyTableColumn label="操作" width="200">
          <template #default="{ row }">
            <XySpace>
              <XyButton type="link" size="small" @click="handlePreview(row)">
                预览
              </XyButton>
              <XyButton type="link" size="small" @click="handleDownload(row)">
                下载
              </XyButton>
              <XyButton type="link" size="small" danger @click="handleDelete(row)">
                删除
              </XyButton>
            </XySpace>
          </template>
        </XyTableColumn>
      </XyTable>
    </XyCard>

    <XyDialog
      v-model="showUploadDialog"
      title="上传文件"
      width="500px"
      @ok="handleUploadSubmit"
    >
      <div class="upload-area">
        <XyIcon icon="mdi:cloud-upload" :size="64" />
        <p>将文件拖拽到此处，或 <a href="#">点击上传</a></p>
        <p class="upload-tip">支持 PDF、Word、Excel、图片、视频等文件，单个文件不超过 100MB</p>
      </div>
      <XyForm label-width="80px" style="margin-top: 20px;">
        <XyFormItem label="文件分类">
          <XySelect placeholder="请选择分类" :options="categoryOptions" />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.file-management {
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

  .file-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .upload-area {
    border: 2px dashed #e2e8f0;
    border-radius: 8px;
    padding: 60px 40px;
    text-align: center;
    color: #64748b;
    transition: all 0.3s;

    &:hover {
      border-color: #3b82f6;
      background: #f8fafc;
    }

    p {
      margin: 16px 0 0;
      font-size: 14px;

      a {
        color: #3b82f6;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .upload-tip {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 8px;
    }
  }
}
</style>
