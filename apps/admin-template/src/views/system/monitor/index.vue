<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyProgress, XyTag, XyButton, XyTable, XyTableColumn, XyIcon } from 'xiaoye-components'

const systemStats = ref({
  cpu: 45,
  memory: 68,
  disk: 52,
  network: 23
})

const serverList = ref([
  {
    id: 1,
    name: 'Web服务器-01',
    ip: '192.168.1.100',
    port: 8080,
    status: 'online',
    cpu: 45,
    memory: 68,
    uptime: '15天 6小时'
  },
  {
    id: 2,
    name: 'Web服务器-02',
    ip: '192.168.1.101',
    port: 8080,
    status: 'online',
    cpu: 38,
    memory: 62,
    uptime: '15天 6小时'
  },
  {
    id: 3,
    name: '数据库服务器',
    ip: '192.168.1.102',
    port: 3306,
    status: 'online',
    cpu: 52,
    memory: 75,
    uptime: '30天 2小时'
  },
  {
    id: 4,
    name: '缓存服务器',
    ip: '192.168.1.103',
    port: 6379,
    status: 'online',
    cpu: 28,
    memory: 45,
    uptime: '30天 2小时'
  },
  {
    id: 5,
    name: '文件服务器',
    ip: '192.168.1.104',
    port: 21,
    status: 'offline',
    cpu: 0,
    memory: 0,
    uptime: '-'
  }
])

const onlineUsers = ref(156)
const totalRequests = ref(125893)
const avgResponseTime = ref(125)
const errorRate = ref(0.15)

const logs = ref([
  { time: '2026-05-18 15:30:45', level: 'info', message: '用户 admin 登录系统', source: 'Auth' },
  { time: '2026-05-18 15:28:30', level: 'success', message: '数据库连接池初始化成功', source: 'Database' },
  { time: '2026-05-18 15:25:10', level: 'warning', message: 'CPU 使用率超过 80%', source: 'Monitor' },
  { time: '2026-05-18 15:20:05', level: 'error', message: '接口 /api/users 响应超时', source: 'API' },
  { time: '2026-05-18 15:15:00', level: 'info', message: '系统备份任务开始执行', source: 'Backup' },
  { time: '2026-05-18 15:10:00', level: 'success', message: '缓存预热完成', source: 'Cache' }
])

function getStatusInfo(status: string) {
  const info: Record<string, { text: string; color: string }> = {
    online: { text: '在线', color: 'success' },
    offline: { text: '离线', color: 'danger' },
    warning: { text: '警告', color: 'warning' }
  }
  return info[status] || { text: status, color: 'default' }
}

function getLogLevelInfo(level: string) {
  const info: Record<string, { text: string; color: string; icon: string }> = {
    info: { text: '信息', color: 'info', icon: 'mdi:information' },
    success: { text: '成功', color: 'success', icon: 'mdi:check-circle' },
    warning: { text: '警告', color: 'warning', icon: 'mdi:alert' },
    error: { text: '错误', color: 'danger', icon: 'mdi:close-circle' }
  }
  return info[level] || { text: level, color: 'default', icon: 'mdi:help' }
}

function refreshStats() {
  // 模拟刷新数据
  systemStats.value = {
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    disk: Math.floor(Math.random() * 100),
    network: Math.floor(Math.random() * 100)
  }
}
</script>

<template>
  <div class="system-monitor">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">系统监控</h2>
          <p class="page-desc">实时监控系统运行状态</p>
        </div>
        <div class="header-right">
          <XyButton type="primary" @click="refreshStats">
            刷新数据
          </XyButton>
        </div>
      </div>
    </XyCard>

    <div class="stats-grid">
      <XyCard class="stat-card">
        <div class="stat-item">
          <XyIcon icon="mdi:account-group" :size="32" color="#3b82f6" />
          <div class="stat-info">
            <span class="stat-value">{{ onlineUsers }}</span>
            <span class="stat-label">在线用户</span>
          </div>
        </div>
      </XyCard>
      <XyCard class="stat-card">
        <div class="stat-item">
          <XyIcon icon="mdi:request" :size="32" color="#10b981" />
          <div class="stat-info">
            <span class="stat-value">{{ totalRequests.toLocaleString() }}</span>
            <span class="stat-label">总请求数</span>
          </div>
        </div>
      </XyCard>
      <XyCard class="stat-card">
        <div class="stat-item">
          <XyIcon icon="mdi:speedometer" :size="32" color="#f59e0b" />
          <div class="stat-info">
            <span class="stat-value">{{ avgResponseTime }}ms</span>
            <span class="stat-label">平均响应</span>
          </div>
        </div>
      </XyCard>
      <XyCard class="stat-card">
        <div class="stat-item">
          <XyIcon icon="mdi:alert-circle" :size="32" color="#ef4444" />
          <div class="stat-info">
            <span class="stat-value">{{ errorRate }}%</span>
            <span class="stat-label">错误率</span>
          </div>
        </div>
      </XyCard>
    </div>

    <div class="resource-section">
      <XyCard title="系统资源使用情况" class="resource-card">
        <div class="resource-list">
          <div class="resource-item">
            <div class="resource-header">
              <span class="resource-label">CPU 使用率</span>
              <span class="resource-value">{{ systemStats.cpu }}%</span>
            </div>
            <XyProgress :percent="systemStats.cpu" :stroke-width="8" />
          </div>
          <div class="resource-item">
            <div class="resource-header">
              <span class="resource-label">内存使用率</span>
              <span class="resource-value">{{ systemStats.memory }}%</span>
            </div>
            <XyProgress :percent="systemStats.memory" :stroke-width="8" />
          </div>
          <div class="resource-item">
            <div class="resource-header">
              <span class="resource-label">磁盘使用率</span>
              <span class="resource-value">{{ systemStats.disk }}%</span>
            </div>
            <XyProgress :percent="systemStats.disk" :stroke-width="8" />
          </div>
          <div class="resource-item">
            <div class="resource-header">
              <span class="resource-label">网络带宽</span>
              <span class="resource-value">{{ systemStats.network }}%</span>
            </div>
            <XyProgress :percent="systemStats.network" :stroke-width="8" />
          </div>
        </div>
      </XyCard>

      <XyCard title="服务器状态" class="server-card">
        <XyTable :data="serverList">
          <XyTableColumn prop="name" label="服务器名称" width="200" />
          <XyTableColumn prop="ip" label="IP地址" width="150" />
          <XyTableColumn prop="port" label="端口" width="100" />
          <XyTableColumn prop="status" label="状态" width="120">
            <template #default="{ row }">
              <XyTag :type="getStatusInfo(row.status).color">
                {{ getStatusInfo(row.status).text }}
              </XyTag>
            </template>
          </XyTableColumn>
          <XyTableColumn prop="cpu" label="CPU使用率" width="200">
            <template #default="{ row }">
              <div class="progress-cell">
                <XyProgress :percent="row.cpu" size="small" />
                <span>{{ row.cpu }}%</span>
              </div>
            </template>
          </XyTableColumn>
          <XyTableColumn prop="memory" label="内存使用率" width="200">
            <template #default="{ row }">
              <div class="progress-cell">
                <XyProgress :percent="row.memory" size="small" />
                <span>{{ row.memory }}%</span>
              </div>
            </template>
          </XyTableColumn>
          <XyTableColumn prop="uptime" label="运行时间" width="150" />
        </XyTable>
      </XyCard>
    </div>

    <XyCard title="实时日志">
      <div class="log-list">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="log-item"
        >
          <XyIcon :icon="getLogLevelInfo(log.level).icon" :size="18" />
          <span class="log-time">{{ log.time }}</span>
          <XyTag :type="getLogLevelInfo(log.level).color" size="small">
            {{ getLogLevelInfo(log.level).text }}
          </XyTag>
          <span class="log-source">[{{ log.source }}]</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </XyCard>
  </div>
</template>

<style lang="scss" scoped>
.system-monitor {
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

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 20px;

    .stat-card {
      .stat-item {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-info {
          display: flex;
          flex-direction: column;

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
          }

          .stat-label {
            font-size: 14px;
            color: #64748b;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .resource-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;

    .resource-card,
    .server-card {
      .resource-list {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .resource-item {
          .resource-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;

            .resource-label {
              font-weight: 500;
              color: #475569;
            }

            .resource-value {
              font-weight: 600;
              color: #1e293b;
            }
          }
        }
      }

      .progress-cell {
        display: flex;
        align-items: center;
        gap: 8px;

        span {
          min-width: 40px;
          text-align: right;
          font-weight: 500;
        }
      }
    }
  }

  .log-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;

    .log-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 6px;

      .log-time {
        font-family: monospace;
        color: #64748b;
        font-size: 13px;
      }

      .log-source {
        color: #3b82f6;
        font-weight: 500;
      }

      .log-message {
        flex: 1;
        color: #1e293b;
      }
    }
  }
}
</style>
