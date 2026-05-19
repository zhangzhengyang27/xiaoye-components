<script setup lang="ts">
import { ref } from 'vue'
import { XyCard, XyCharts, XySelect, XyRow, XyCol } from 'xiaoye-components'

const timeRange = ref('week')

const timeRangeOptions = [
  { value: 'week', label: '最近7天' },
  { value: 'month', label: '最近30天' },
  { value: 'quarter', label: '最近90天' },
  { value: 'year', label: '最近一年' }
]

const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 销售趋势：多系列折线图，data 为对象数组，每条线一个 key
const salesData = ref({
  type: 'line',
  data: [
    { weekday: '周一', iPhone: 820, Mac: 620, iPad: 420, Watch: 320 },
    { weekday: '周二', iPhone: 932, Mac: 732, iPad: 532, Watch: 432 },
    { weekday: '周三', iPhone: 901, Mac: 701, iPad: 501, Watch: 401 },
    { weekday: '周四', iPhone: 1234, Mac: 834, iPad: 634, Watch: 534 },
    { weekday: '周五', iPhone: 1290, Mac: 890, iPad: 690, Watch: 590 },
    { weekday: '周六', iPhone: 1330, Mac: 930, iPad: 730, Watch: 630 },
    { weekday: '周日', iPhone: 1520, Mac: 1020, iPad: 820, Watch: 720 }
  ],
  xKey: 'weekday',
  yKeys: ['iPhone', 'Mac', 'iPad', 'Watch']
})

// 商品分类饼图
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
  nameKey: 'name',
  valueKey: 'value'
})

// 月度销售额柱状图
const revenueData = ref({
  type: 'bar',
  data: [
    { month: '1月', 销售额: 4100 },
    { month: '2月', 销售额: 5200 },
    { month: '3月', 销售额: 4800 },
    { month: '4月', 销售额: 6100 },
    { month: '5月', 销售额: 5500 },
    { month: '6月', 销售额: 7200 },
    { month: '7月', 销售额: 6800 },
    { month: '8月', 销售额: 8500 },
    { month: '9月', 销售额: 7900 },
    { month: '10月', 销售额: 9200 },
    { month: '11月', 销售额: 8800 },
    { month: '12月', 销售额: 10500 }
  ],
  xKey: 'month',
  yKeys: ['销售额']
})

// 用户增长面积图
const userGrowthData = ref({
  type: 'area',
  data: [
    { month: '1月', 新用户: 320, 活跃用户: 120 },
    { month: '2月', 新用户: 402, 活跃用户: 202 },
    { month: '3月', 新用户: 531, 活跃用户: 331 },
    { month: '4月', 新用户: 684, 活跃用户: 484 },
    { month: '5月', 新用户: 890, 活跃用户: 590 },
    { month: '6月', 新用户: 1023, 活跃用户: 723 },
    { month: '7月', 新用户: 1234, 活跃用户: 834 },
    { month: '8月', 新用户: 1456, 活跃用户: 956 },
    { month: '9月', 新用户: 1678, 活跃用户: 1078 },
    { month: '10月', 新用户: 1890, 活跃用户: 1290 },
    { month: '11月', 新用户: 2134, 活跃用户: 1434 },
    { month: '12月', 新用户: 2456, 活跃用户: 1656 }
  ],
  xKey: 'month',
  yKeys: ['新用户', '活跃用户']
})

// 订单状态环形图
const orderStatusData = ref({
  type: 'pie',
  data: [
    { name: '已完成', value: 8567 },
    { name: '处理中', value: 2345 },
    { name: '待支付', value: 1234 },
    { name: '已取消', value: 567 },
    { name: '退款中', value: 123 }
  ],
  nameKey: 'name',
  valueKey: 'value'
})

// 转化漏斗：使用 option prop 传入完整 ECharts 配置（funnel 不是 XyCharts 简化 API 支持的类型）
const conversionData = ref({
  option: {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'funnel',
      left: '10%',
      top: 20,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 100000,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside' },
      labelLine: { show: false },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
      emphasis: { label: { fontSize: 14 } },
      data: [
        { value: 100000, name: '访问量' },
        { value: 60000, name: '浏览量' },
        { value: 30000, name: '加购量' },
        { value: 15000, name: '下单量' },
        { value: 8567, name: '支付量' }
      ]
    }]
  }
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
  .chart-card {
    margin-bottom: 20px;
  }

  .chart-container {
    width: 100%;
  }
}
</style>
