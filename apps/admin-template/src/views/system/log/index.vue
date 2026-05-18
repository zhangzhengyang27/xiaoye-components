<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTable, XyTableColumn, XyTag, XyButton, XyInput, XySelect, XyDatePicker, XySpace, XyPopconfirm, XyMessage } from 'xiaoye-components'

type OperationLogType = 'info' | 'success' | 'warning' | 'danger'

interface OperationLog {
  id: number
  operation: string
  operator: string
  method: string
  ip: string
  type: OperationLogType
  time: string
  status: 'success' | 'failed'
  duration: string
}

const searchForm = ref({
  keyword: '',
  type: '',
  status: '',
  startTime: '',
  endTime: ''
})

const operationLogs = ref<OperationLog[]>([
  { id: 1, type: 'info', operation: '查看用户列表', operator: 'admin', method: 'GET /api/users', ip: '192.168.1.100', duration: '520ms', status: 'success', time: '2026-05-18 15:30:45' },
  { id: 2, type: 'success', operation: '创建新用户', operator: 'admin', method: 'POST /api/users', ip: '192.168.1.100', duration: '1.2s', status: 'success', time: '2026-05-18 15:28:30' },
  { id: 3, type: 'warning', operation: '删除用户', operator: 'admin', method: 'DELETE /api/users/3', ip: '192.168.1.100', duration: '450ms', status: 'success', time: '2026-05-18 15:25:10' },
  { id: 4, type: 'danger', operation: '修改系统配置', operator: 'admin', method: 'PUT /api/config', ip: '192.168.1.100', duration: '800ms', status: 'failed', time: '2026-05-18 15:20:05' },
  { id: 5, type: 'info', operation: '登录系统', operator: '张三', method: 'POST /api/login', ip: '192.168.1.101', duration: '320ms', status: 'success', time: '2026-05-18 14:50:20' },
  { id: 6, type: 'success', operation: '上传文件', operator: '张三', method: 'POST /api/files', ip: '192.168.1.101', duration: '2.5s', status: 'success', time: '2026-05-18 14:45:30' },
  { id: 7, type: 'info', operation: '查看文章列表', operator: '李四', method: 'GET /api/articles', ip: '192.168.1.102', duration: '280ms', status: 'success', time: '2026-05-18 14:30:15' },
  { id: 8, type: 'warning', operation: '尝试访问受限资源', operator: '李四', method: 'GET /api/admin', ip: '192.168.1.102', duration: '150ms', status: 'failed', time: '2026-05-18 14:25:40' }
])

const typeOptions = [
  { value: '', label: '全部类型' },
  { value: 'info', label: '普通' },
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' }
]

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'success', label: '成功' },
  { value: 'failed', label: '失败' }
]

function getTypeTag(type: OperationLogType) {
  const typeMap: Record<OperationLogType, { text: string; color: string }> = {
    info: { text: '普通', color: 'info' },
    success: { text: '成功', color: 'success' },
    warning: { text: '警告', color: 'warning' },
    danger: { text: '危险', color: 'danger' }
  }
  return typeMap[type] || { text: type, color: 'info' }
}

function getStatusTag(status: string) {
  const statusMap: Record<string, { text: string; color: string }> = {
    success: { text: '成功', color: 'success' },
    failed: { text: '失败', color: 'danger' }
  }
  return statusMap[status] || { text: status, color: 'info' }
}

function handleSearch() {
  XyMessage.success('搜索功能待实现')
}

function handleReset() {
  searchForm.value = {
    keyword: '', type: '', status: '', startTime: '', endTime: '' }
  XyMessage.info('已重置')
}

function handleExport() {
  XyMessage.success('导出功能待实现')
}

function handleClear() {
  XyMessage.confirm('确定清空所有日志?').then(() => {
    XyMessage.success('清空功能待实现')
  })
}

function viewDetail(_log: OperationLog) {
  XyMessage.info('查看详情功能待实现')
}
</script>

<template>
  <div class="operation-log">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">操作日志</h2>
          <p class="page-desc">系统操作日志记录</p>
        </div>
        <div class="header-right">
          <XyButton @click="handleExport">
            导出日志
          </XyButton>
          <XyPopconfirm title="确定清空所有日志?" @confirm="handleClear">
            <XyButton type="danger">
              清空日志
            </XyButton>
          </XyPopconfirm>
        </div>
      </div>
    </XyCard>

    <XyCard class="search-card">
      <div class="search-form">
        <XySpace wrap>
          <XyInput
            v-model="searchForm.keyword"
            placeholder="搜索操作描述"
            style="width: 200px"
          />
          <XySelect
            v-model="searchForm.type"
            placeholder="操作类型"
            style="width: 150px"
          >
            <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </XySelect>
          <XySelect
            v-model="searchForm.status"
            placeholder="执行状态"
            style="width: 150px"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </XySelect>
          <XyDatePicker
            v-model="searchForm.startTime"
            type="date"
            placeholder="开始时间"
            style="width: 180px"
          />
          <XyDatePicker
            v-model="searchForm.endTime"
            type="date"
            placeholder="结束时间"
            style="width: 180px"
          />
          <XyButton type="primary" @click="handleSearch">
            搜索
          </XyButton>
          <XyButton @click="handleReset">
            重置
          </XyButton>
        </XySpace>
      </div>
    </XyCard>

    <XyCard>
      <XyTable :data="operationLogs">
        <XyTableColumn prop="id" label="ID" width="80" />
        <XyTableColumn prop="type" label="操作类型" width="120">
          <template #default="{ row }">
            <XyTag :type="getTypeTag(row.type).color">
              {{ getTypeTag(row.type).text }}
            </XyTag>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="operation" label="操作描述" />
        <XyTableColumn prop="operator" label="操作人" width="120" />
        <XyTableColumn prop="method" label="请求方法" width="150" />
        <XyTableColumn prop="ip" label="IP地址" width="140" />
        <XyTableColumn prop="duration" label="执行时间" width="120" />
        <XyTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <XyTag :type="getStatusTag(row.status).color">
              {{ getStatusTag(row.status).text }}
            </XyTag>
          </template>
        </XyTableColumn>
        <XyTableColumn prop="time" label="操作时间" width="180" />
        <XyTableColumn label="操作" width="120">
          <template #default="{ row }">
            <XyButton type="link" @click="viewDetail(row)">
              详情
            </XyButton>
          </template>
        </XyTableColumn>
      </XyTable>
    </XyCard>
  </div>
</template>

<style lang="scss" scoped>
.operation-log {
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

  .search-card {
    margin-top: 20px;

    .search-form {
      display: flex;
      align-items: center;
    }
  }
}
</style>
