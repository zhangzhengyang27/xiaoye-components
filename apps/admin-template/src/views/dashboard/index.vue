<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { XyCard, XyProgress, XyTable, XyTableColumn, XyTag, XyButton, XyIcon, XyTimeline, XyTimelineItem } from 'xiaoye-components';
const stats = ref([
 { title: '总用户数', value: '12,845', icon: 'mdi:users', color: '#3b82f6', trend: '+12.5%' },
 { title: '活跃用户', value: '8,234', icon: 'mdi:user-active', color: '#10b981', trend: '+8.3%' },
 { title: '文章总数', value: '3,421', icon: 'mdi:file-text', color: '#f59e0b', trend: '+5.2%' },
 { title: '数据流量', value: '1.2GB', icon: 'mdi:gauge', color: '#ef4444', trend: '+15.8%' }
]);
const recentOrders = ref([
 { id: 'ORD001', customer: '张三', amount: 299.00, status: 'completed', time: '2024-01-15 14:30' },
 { id: 'ORD002', customer: '李四', amount: 599.00, status: 'pending', time: '2024-01-15 14:25' },
 { id: 'ORD003', customer: '王五', amount: 199.00, status: 'completed', time: '2024-01-15 14:20' },
 { id: 'ORD004', customer: '赵六', amount: 899.00, status: 'cancelled', time: '2024-01-15 14:15' },
 { id: 'ORD005', customer: '钱七', amount: 399.00, status: 'pending', time: '2024-01-15 14:10' }
]);
const progressData = ref([
 { label: '任务完成率', value: 75, color: '#6366f1' },
 { label: '数据同步', value: 45, color: '#10b981' },
 { label: '系统健康度', value: 92, color: '#f59e0b' }
]);
const activities = ref([
 { title: '用户张三登录系统', time: '5分钟前', type: 'login' },
 { title: '文章《Vue 3 入门指南》已发布', time: '15分钟前', type: 'publish' },
 { title: '订单 ORD001 已完成支付', time: '30分钟前', type: 'order' },
 { title: '系统备份任务已完成', time: '1小时前', type: 'system' },
 { title: '管理员更新了系统配置', time: '2小时前', type: 'config' }
]);
function getStatusTag(status: string) {
 const statusMap: Record<string, {
 text: string;
 color: string;
 }> = {
 completed: { text: '已完成', color: 'success' },
 pending: { text: '待处理', color: 'warning' },
 cancelled: { text: '已取消', color: 'danger' }
 };
 return statusMap[status] || { text: status, color: 'default' };
}
function getActivityIcon(type: string) {
 const iconMap: Record<string, string> = {
 login: 'mdi:login',
 publish: 'mdi:file-upload',
 order: 'mdi:shopping-cart',
 system: 'mdi:server',
 config: 'mdi:settings'
 };
 return iconMap[type] || 'mdi:circle';
}
onMounted(() => {
 console.log('Dashboard mounted');
});
</script>

<template>
  <div class="dashboard">
    <div class="stats-grid">
      <XyCard
        v-for="stat in stats"
        :key="stat.title"
        class="stat-card"
        hoverable
      >
        <div class="stat-content">
          <div class="stat-icon" :style="{ background: `${stat.color}15`, color: stat.color }">
            <XyIcon :icon="stat.icon" :size="24" />
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-label">{{ stat.title }}</p>
          </div>
          <span class="stat-trend positive">{{ stat.trend }}</span>
        </div>
      </XyCard>
    </div>

    <div class="dashboard-row">
      <XyCard title="最近订单" class="order-card">
        <XyTable :data="recentOrders" :pagination="false">
          <XyTableColumn prop="id" label="订单号" />
          <XyTableColumn prop="customer" label="客户" />
          <XyTableColumn prop="amount" label="金额" />
          <XyTableColumn prop="status" label="状态">
            <template #default="{ row }">
              <XyTag :type="getStatusTag(row.status).color">
                {{ getStatusTag(row.status).text }}
              </XyTag>
            </template>
          </XyTableColumn>
          <XyTableColumn prop="time" label="时间" />
        </XyTable>
        <div class="card-footer">
          <XyButton type="link">查看全部订单</XyButton>
        </div>
      </XyCard>

      <XyCard title="系统状态" class="status-card">
        <div class="progress-list">
          <div v-for="item in progressData" :key="item.label" class="progress-item">
            <div class="progress-header">
              <span class="progress-label">{{ item.label }}</span>
              <span class="progress-value">{{ item.value }}%</span>
            </div>
            <XyProgress :percentage="item.value" :stroke-color="item.color" :show-info="false" />
          </div>
        </div>
      </XyCard>
    </div>

    <XyCard title="最近动态" class="activity-card">
      <XyTimeline>
        <XyTimelineItem
          v-for="(activity, index) in activities"
          :key="index"
          :icon="getActivityIcon(activity.type)"
        >
          <div class="activity-content">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </XyTimelineItem>
      </XyTimeline>
    </XyCard>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid currentColor;
          border-opacity: 0.15;
        }

        .stat-info {
          flex: 1;
          min-width: 0;

          .stat-value {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #f1f5f9;
            margin: 0 0 4px;
            line-height: 1.2;
          }

          .stat-label {
            font-size: 13px;
            color: #64748b;
            margin: 0;
          }
        }

        .stat-trend {
          font-size: 13px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          padding: 4px 10px;
          border-radius: 8px;

          &.positive {
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
          }

          &.negative {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
          }
        }
      }
    }
  }

  .dashboard-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  .order-card {
    :deep(.xy-table) {
      --xy-table-header-background: rgba(15, 23, 42, 0.4);
      --xy-table-header-color: #64748b;
      --xy-table-row-hover-background: rgba(99, 102, 241, 0.06);
      --xy-table-border-color: rgba(255, 255, 255, 0.05);

      .xy-table__header-cell {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .xy-table__cell {
        color: #cbd5e1;
        font-size: 14px;
      }
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
      margin-top: 4px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  .status-card {
    .progress-list {
      .progress-item {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;

          .progress-label {
            font-size: 14px;
            color: #94a3b8;
          }

          .progress-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            color: #f1f5f9;
          }
        }
      }
    }
  }

  .activity-card {
    :deep(.xy-timeline) {
      .xy-timeline-item {
        .xy-timeline-item__dot {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.15);

          .xy-icon {
            color: #818cf8;
          }
        }

        .xy-timeline-item__content {
          color: #cbd5e1;
        }
      }
    }

    .activity-content {
      .activity-title {
        font-size: 14px;
        color: #e2e8f0;
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
      }

      .activity-time {
        font-size: 12px;
        color: #64748b;
        font-family: 'JetBrains Mono', monospace;
      }
    }
  }
}
</style>
