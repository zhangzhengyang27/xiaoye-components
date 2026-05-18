<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyCharts, XySelect, XyRow, XyCol } from 'xiaoye-components'

const timeRange = ref('week')

const timeRangeOptions = [
  { label: '最近7天', value: 'week' },
  { label: '最近30天', value: 'month' },
  { label: '最近90天', value: 'quarter' },
  { label: '最近一年', value: 'year' }
]

const salesData = ref({
  type: 'line',
  data: [
    { name: 'iPhone', value: [820, 932, 901, 1234, 1290, 1330, 1520] },
    { name: 'Mac', value: [620, 732, 701, 834, 890, 930, 1020] },
    { name: 'iPad', value: [420, 532, 501, 634, 690, 730, 820] },
    { name: 'Watch', value: [320, 432, 401, 534, 590, 630, 720] }
  ],
  xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  smooth: true,
  legend: { show: true, position: 'top' },
  grid: { left: 50, right: 20, top: 60, bottom: 30 }
})

const categoryData = ref({
  type: 'pie',
  data: [
    { name: '手机数码', value: 4356 },
    { name: '电脑办公', value: 3218 },
    { name: '平板设备', value: 2456 },
    { name: '穿戴设备', value: 1892 },
    { name: '音频设备', value: 1567 },
    { name: '配件周边', value: 892 }
  ],
  legend: { show: true, position: 'right' },
  radius: ['40%', '70%']
})

const revenueData = ref({
  type: 'bar',
  data: [
    { name: '销售额', value: [4100, 5200, 4800, 6100, 5500, 7200, 6800, 8500, 7900, 9200, 8800, 10500] }
  ],
  xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  legend: { show: true, position: 'top' },
  grid: { left: 50, right: 20, top: 40, bottom: 30 }
})

const userGrowthData = ref({
  type: 'area',
  data: [
    { name: '新用户', value: [320, 402, 531, 684, 890, 1023, 1234, 1456, 1678, 1890, 2134, 2456] },
    { name: '活跃用户', value: [120, 202, 331, 484, 590, 723, 834, 956, 1078, 1290, 1434, 1656] }
  ],
  xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  smooth: true,
  legend: { show: true, position: 'top' },
  grid: { left: 50, right: 20, top: 60, bottom: 30 }
})

const orderStatusData = ref({
  type: 'ring',
  data: [
    { name: '已完成', value: 8567 },
    { name: '处理中', value: 2345 },
    { name: '待支付', value: 1234 },
    { name: '已取消', value: 567 },
    { name: '退款中', value: 123 }
  ],
  legend: { show: true, position: 'right' },
  radius: ['50%', '75%']
})

const conversionData = ref({
  type: 'funnel',
  data: [
    { name: '访问量', value: 100000 },
    { name: '浏览量', value: 60000 },
    { name: '加购量', value: 30000 },
    { name: '下单量', value: 15000 },
    { name: '支付量', value: 8567 }
  ],
  legend: { show: true, position: 'right' }
})
</script>

<template>
  <div class="charts-dashboard">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">数据统计</h2>
          <p class="page-desc">全面的数据可视化分析，实时掌握业务状况</p>
        </div>
        <div class="header-right">
          <XySelect v-model="timeRange" :options="timeRangeOptions" style="width: 140px" />
        </div>
      </div>
    </XyCard>
    
    <XyRow :gutter="20">
      <XyCol :span="24">
        <XyCard title="销售趋势" class="chart-card">
          <template #extra>
            <div class="chart-legend">
              <span class="legend-item"><span class="dot" style="background: #3b82f6;"></span>iPhone</span>
              <span class="legend-item"><span class="dot" style="background: #10b981;"></span>Mac</span>
              <span class="legend-item"><span class="dot" style="background: #f59e0b;"></span>iPad</span>
              <span class="legend-item"><span class="dot" style="background: #ef4444;"></span>Watch</span>
            </div>
          </template>
          <div class="chart-container">
            <XyCharts v-bind="salesData" height="350px" />
          </div>
        </XyCard>
      </XyCol>
    </XyRow>
    
    <XyRow :gutter="20">
      <XyCol :span="12">
        <XyCard title="销售额月度统计" class="chart-card">
          <div class="chart-container">
            <XyCharts v-bind="revenueData" height="300px" />
          </div>
        </XyCard>
      </XyCol>
      <XyCol :span="12">
        <XyCard title="商品分类销售占比" class="chart-card">
          <div class="chart-container">
            <XyCharts v-bind="categoryData" height="300px" />
          </div>
        </XyCard>
      </XyCol>
    </XyRow>
    
    <XyRow :gutter="20">
      <XyCol :span="12">
        <XyCard title="用户增长趋势" class="chart-card">
          <template #extra>
            <div class="chart-legend">
              <span class="legend-item"><span class="dot" style="background: #3b82f6;"></span>新用户</span>
              <span class="legend-item"><span class="dot" style="background: #10b981;"></span>活跃用户</span>
            </div>
          </template>
          <div class="chart-container">
            <XyCharts v-bind="userGrowthData" height="300px" />
          </div>
        </XyCard>
      </XyCol>
      <XyCol :span="12">
        <XyCard title="订单状态分布" class="chart-card">
          <div class="chart-container">
            <XyCharts v-bind="orderStatusData" height="300px" />
          </div>
        </XyCard>
      </XyCol>
    </XyRow>
    
    <XyRow :gutter="20">
      <XyCol :span="24">
        <XyCard title="转化漏斗分析" class="chart-card">
          <div class="chart-container">
            <XyCharts v-bind="conversionData" height="300px" />
          </div>
        </XyCard>
      </XyCol>
    </XyRow>
  </div>
</template>

<style lang="scss" scoped>
.charts-dashboard {
  .page-header {
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
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
  
  .chart-card {
    margin-bottom: 20px;
    
    .chart-legend {
      display: flex;
      gap: 16px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #64748b;
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      }
    }
    
    .chart-container {
      width: 100%;
    }
  }
}
</style>
