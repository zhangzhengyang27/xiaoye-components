<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTable, XyButton, XyTag, XySwitch, XyMessage, XyIcon, XySpace, XyInput, XyDialog, XyForm, XyFormItem, XySelect } from 'xiaoye-components'

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

const tableColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '文件名', key: 'name' },
  { title: '类型', key: 'type', slot: 'type', width: 100 },
  { title: '大小', key: 'size', width: 120 },
  { title: '上传者', key: 'uploader', width: 120 },
  { title: '上传时间', key: 'uploadTime', width: 180 },
  { title: '状态', key: 'status', slot: 'status', width: 100 },
  { title: '操作', key: 'action', slot: 'action', width: 200 }
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
      <XyTable :columns="tableColumns" :data="files">
        <template #name="{ record }">
          <div class="file-name-cell">
            <XyIcon :icon="getTypeIcon(record.type)" :size="20" />
            <span>{{ record.name }}</span>
          </div>
        </template>
        <template #type="{ record }">
          <XyTag :type="getTypeColor(record.type)" size="small">
            {{ record.type.toUpperCase() }}
          </XyTag>
        </template>
        <template #status="{ record }">
          <XySwitch :model-value="record.id <= 4" />
        </template>
        <template #action="{ record }">
          <XySpace>
            <XyButton type="link" size="small" @click="handlePreview(record)">
              预览
            </XyButton>
            <XyButton type="link" size="small" @click="handleDownload(record)">
              下载
            </XyButton>
            <XyButton type="link" size="small" danger @click="handleDelete(record)">
              删除
            </XyButton>
          </XySpace>
        </template>
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
          <XySelect placeholder="请选择分类">
            <option value="doc">文档资料</option>
            <option value="image">图片素材</option>
            <option value="video">视频资源</option>
            <option value="other">其他文件</option>
          </XySelect>
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
