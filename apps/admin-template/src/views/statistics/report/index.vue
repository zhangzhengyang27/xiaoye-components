<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { XyCard, XyStatistic, XyButton, XySelect, XyDatePicker, XyTable, XyTag } from 'xiaoye-components'

const stats = ref([
  { label: '今日访问', value: '2,845', change: '+12.5%' },
  { label: '新增用户', value: '156', change: '+8.3%' },
  { label: '文章阅读', value: '1,234', change: '+5.2%' },
  { label: '平均时长', value: '4.5分钟', change: '+2.1%' }
])

const tableColumns = [
  { title: '排名', key: 'rank', width: 80 },
  { title: '文章标题', key: 'title' },
  { title: '阅读量', key: 'views' },
  { title: '点赞', key: 'likes' },
  { title: '评论', key: 'comments' },
  { title: '状态', key: 'status', slot: 'status' }
]

const topArticles = ref([
  { rank: 1, title: 'Vue 3 入门指南', views: 12580, likes: 562, comments: 89, status: 'hot' },
  { rank: 2, title: 'TypeScript 最佳实践', views: 9845, likes: 432, comments: 67, status: 'hot' },
  { rank: 3, title: '前端性能优化', views: 8765, likes: 389, comments: 54, status: 'normal' },
  { rank: 4, title: 'React vs Vue', views: 7654, likes: 312, comments: 45, status: 'normal' },
  { rank: 5, title: 'Node.js 实战', views: 6543, likes: 278, comments: 38, status: 'normal' }
])

function getStatusTag(status: string) {
  const statusMap: Record<string, { text: string; color: string }> = {
    hot: { text: '热门', color: 'danger' },
    normal: { text: '正常', color: 'default' }
  }
  return statusMap[status] || { text: status, color: 'default' }
}

onMounted(() => {
  console.log('Report page mounted')
})
</script>

<template>
  <div class="report-page">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">统计报表</h2>
          <p class="page-desc">查看系统数据统计</p>
        </div>
        <div class="header-right">
          <XySelect placeholder="选择时间范围" class="select-input">
            <option value="today">今日</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="year">本年</option>
          </XySelect>
          <XyDatePicker type="daterange" placeholder="选择日期" />
          <XyButton type="primary">导出报表</XyButton>
        </div>
      </div>
    </XyCard>
    
    <div class="stats-grid">
      <XyCard
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
      >
        <XyStatistic
          :title="stat.label"
          :value="stat.value"
          :suffix="stat.change"
          :suffix-color="stat.change.startsWith('+') ? '#10b981' : '#ef4444'"
        />
      </XyCard>
    </div>
    
    <XyCard title="热门文章排行">
      <XyTable :columns="tableColumns" :data="topArticles" :pagination="false">
        <template #status="{ record }">
          <XyTag :type="getStatusTag(record.status).color">
            {{ getStatusTag(record.status).text }}
          </XyTag>
        </template>
      </XyTable>
    </XyCard>
  </div>
</template>

<style lang="scss" scoped>
.report-page {
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
        
        .select-input {
          width: 160px;
        }
      }
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
    
    .stat-card {
      .xy-statistic__value {
        font-size: 28px;
        font-weight: 700;
      }
    }
  }
}
</style>
