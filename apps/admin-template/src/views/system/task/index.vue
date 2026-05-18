<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyTable, XyButton, XyTag, XyMessage, XyIcon, XySpace, XyInput, XySelect, XyDialog, XyForm, XyFormItem } from 'xiaoye-components'

interface Task {
  id: number
  name: string
  group: string
  cron: string
  target: string
  status: 'running' | 'stopped' | 'error'
  lastRunTime: string
  nextRunTime: string
  remark: string
}

const searchKeyword = ref('')
const statusFilter = ref('')
const showAddDialog = ref(false)

const tableColumns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '任务名称', key: 'name', width: 200 },
  { title: '任务分组', key: 'group', width: 150 },
  { title: 'CRON表达式', key: 'cron', width: 150 },
  { title: '调用目标', key: 'target', width: 250 },
  { title: '状态', key: 'status', slot: 'status', width: 120 },
  { title: '上次执行时间', key: 'lastRunTime', width: 180 },
  { title: '下次执行时间', key: 'nextRunTime', width: 180 },
  { title: '操作', key: 'action', slot: 'action', width: 250 }
]

const tasks = ref<Task[]>([
  {
    id: 1,
    name: '数据备份任务',
    group: '系统任务',
    cron: '0 0 2 * * ?',
    target: 'com.example.job.DataBackupJob',
    status: 'running',
    lastRunTime: '2026-05-18 02:00:00',
    nextRunTime: '2026-05-19 02:00:00',
    remark: '每日凌晨2点执行数据库备份'
  },
  {
    id: 2,
    name: '日志清理任务',
    group: '系统任务',
    cron: '0 0 0 * * ?',
    target: 'com.example.job.LogCleanJob',
    status: 'running',
    lastRunTime: '2026-05-17 00:00:00',
    nextRunTime: '2026-05-18 00:00:00',
    remark: '每日凌晨清理7天前的日志'
  },
  {
    id: 3,
    name: '用户同步任务',
    group: '业务任务',
    cron: '0 */30 * * * ?',
    target: 'com.example.job.UserSyncJob',
    status: 'running',
    lastRunTime: '2026-05-18 14:30:00',
    nextRunTime: '2026-05-18 15:00:00',
    remark: '每30分钟同步一次用户数据'
  },
  {
    id: 4,
    name: '报表生成任务',
    group: '业务任务',
    cron: '0 0 8 * * ?',
    target: 'com.example.job.ReportGenJob',
    status: 'stopped',
    lastRunTime: '2026-05-15 08:00:00',
    nextRunTime: '-',
    remark: '每日早8点生成统计报表'
  },
  {
    id: 5,
    name: '缓存预热任务',
    group: '性能优化',
    cron: '0 0 6 * * ?',
    target: 'com.example.job.CacheWarmJob',
    status: 'error',
    lastRunTime: '2026-05-18 06:00:00',
    nextRunTime: '-',
    remark: '每日早6点预热系统缓存'
  },
  {
    id: 6,
    name: '健康检查任务',
    group: '监控任务',
    cron: '0 */5 * * * ?',
    target: 'com.example.job.HealthCheckJob',
    status: 'running',
    lastRunTime: '2026-05-18 14:55:00',
    nextRunTime: '2026-05-18 15:00:00',
    remark: '每5分钟检查系统健康状态'
  }
])

const taskForm = ref({
  name: '',
  group: '',
  cron: '',
  target: '',
  remark: ''
})

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'running', label: '运行中' },
  { value: 'stopped', label: '已停止' },
  { value: 'error', label: '异常' }
]

const groupOptions = [
  { value: '系统任务', label: '系统任务' },
  { value: '业务任务', label: '业务任务' },
  { value: '性能优化', label: '性能优化' },
  { value: '监控任务', label: '监控任务' }
]

function getStatusInfo(status: string) {
  const info: Record<string, { text: string; color: string; icon: string }> = {
    running: { text: '运行中', color: 'success', icon: 'mdi:play' },
    stopped: { text: '已停止', color: 'info', icon: 'mdi:pause' },
    error: { text: '异常', color: 'danger', icon: 'mdi:alert-circle' }
  }
  return info[status] || { text: status, color: 'default', icon: 'mdi:help' }
}

function handleExecute(task: Task) {
  XyMessage.success(`执行任务: ${task.name}`)
}

function handleEdit(task: Task) {
  XyMessage.info(`编辑任务: ${task.name}`)
}

function handleDelete(task: Task) {
  XyMessage.success(`删除任务: ${task.name}`)
}

function handleToggleStatus(task: Task) {
  const action = task.status === 'running' ? '停止' : '启动'
  XyMessage.success(`${action}任务: ${task.name}`)
}

function handleAdd() {
  showAddDialog.value = true
}

function handleSubmit() {
  if (!taskForm.value.name || !taskForm.value.cron || !taskForm.value.target) {
    XyMessage.error('请填写必填信息')
    return
  }
  XyMessage.success('添加任务功能待实现')
  showAddDialog.value = false
}
</script>

<template>
  <div class="task-management">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">任务管理</h2>
          <p class="page-desc">管理系统定时任务调度</p>
        </div>
        <div class="header-right">
          <XyButton type="primary" @click="handleAdd">
            新增任务
          </XyButton>
        </div>
      </div>
    </XyCard>

    <XyCard class="filter-card">
      <div class="filter-form">
        <XySpace wrap>
          <XyInput
            v-model="searchKeyword"
            placeholder="搜索任务名称"
            :prefix-icon="'mdi:search'"
            style="width: 200px"
          />
          <XySelect
            v-model="statusFilter"
            placeholder="任务状态"
            style="width: 150px"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </XySelect>
          <XyButton type="primary">
            搜索
          </XyButton>
          <XyButton>
            重置
          </XyButton>
        </XySpace>
      </div>
    </XyCard>

    <XyCard>
      <XyTable :columns="tableColumns" :data="tasks">
        <template #status="{ record }">
          <div class="status-cell">
            <XyIcon :icon="getStatusInfo(record.status).icon" :size="16" />
            <XyTag :type="getStatusInfo(record.status).color" size="small">
              {{ getStatusInfo(record.status).text }}
            </XyTag>
          </div>
        </template>
        <template #action="{ record }">
          <XySpace>
            <XyButton type="link" size="small" @click="handleExecute(record)">
              执行
            </XyButton>
            <XyButton type="link" size="small" @click="handleToggleStatus(record)">
              {{ record.status === 'running' ? '停止' : '启动' }}
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
      v-model="showAddDialog"
      title="新增任务"
      width="600px"
      @ok="handleSubmit"
    >
      <XyForm :model="taskForm" label-width="120px">
        <XyFormItem label="任务名称" required>
          <XyInput v-model="taskForm.name" placeholder="请输入任务名称" />
        </XyFormItem>
        <XyFormItem label="任务分组" required>
          <XySelect v-model="taskForm.group" placeholder="请选择任务分组">
            <option v-for="opt in groupOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </XySelect>
        </XyFormItem>
        <XyFormItem label="CRON表达式" required>
          <XyInput v-model="taskForm.cron" placeholder="请输入CRON表达式, 如: 0 0 2 * * ?" />
        </XyFormItem>
        <XyFormItem label="调用目标" required>
          <XyInput v-model="taskForm.target" placeholder="请输入调用目标类和方法" />
        </XyFormItem>
        <XyFormItem label="任务描述">
          <XyInput v-model="taskForm.remark" type="textarea" :rows="3" placeholder="请输入任务描述" />
        </XyFormItem>
      </XyForm>
    </XyDialog>
  </div>
</template>

<style lang="scss" scoped>
.task-management {
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

  .filter-card {
    margin-top: 20px;
  }

  .status-cell {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
