<script setup lang="ts">import { ref } from 'vue';
import { XyCard, XyCharts, XyStatistic, XyTabs, XyTabPane } from 'xiaoye-components';
const chartData = ref({
 monthly: [
 { month: '1月', visits: 1200, users: 500 },
 { month: '2月', visits: 1500, users: 650 },
 { month: '3月', visits: 1800, users: 800 },
 { month: '4月', visits: 2200, users: 950 },
 { month: '5月', visits: 2500, users: 1100 },
 { month: '6月', visits: 2800, users: 1250 }
 ],
 categories: [
 { name: '技术', count: 450 },
 { name: '生活', count: 320 },
 { name: '娱乐', count: 280 },
 { name: '科技', count: 180 },
 { name: '教育', count: 150 }
 ],
 radar: [
 { name: '产品A', sales: 80, satisfaction: 90, quality: 85, service: 75 },
 { name: '产品B', sales: 70, satisfaction: 85, quality: 90, service: 80 },
 { name: '产品C', sales: 90, satisfaction: 80, quality: 75, service: 85 }
 ]
});
const summaryStats = ref([
 { label: '总访问量', value: '156,845', unit: '次' },
 { label: '独立访客', value: '45,234', unit: '人' },
 { label: '跳出率', value: '35.6', unit: '%' },
 { label: '转化率', value: '8.2', unit: '%' }
]);
</script>

<template>
  <div class="analysis-page">
    <XyCard class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">数据分析</h2>
          <p class="page-desc">深入分析数据趋势</p>
        </div>
      </div>
    </XyCard>
    
    <div class="stats-grid">
      <XyCard
        v-for="stat in summaryStats"
        :key="stat.label"
        class="stat-card"
      >
        <XyStatistic
          :title="stat.label"
          :value="stat.value"
          :suffix="stat.unit"
        />
      </XyCard>
    </div>
    
    <XyCard title="图表分析">
      <XyTabs type="card">
        <XyTabPane label="访问趋势" name="line">
          <XyCharts type="line" :data="chartData.monthly" :x-key="'month'" :y-keys="['visits', 'users']" :height="300" />
        </XyTabPane>
        <XyTabPane label="分类分布" name="pie">
          <XyCharts type="pie" :data="chartData.categories" :name-key="'name'" :value-key="'count'" :height="300" />
        </XyTabPane>
        <XyTabPane label="对比分析" name="bar">
          <XyCharts type="bar" :data="chartData.monthly" :x-key="'month'" :y-keys="['visits', 'users']" :height="300" />
        </XyTabPane>
        <XyTabPane label="综合评估" name="radar">
          <XyCharts type="radar" :data="chartData.radar" :name-key="'name'" :y-keys="['sales', 'satisfaction', 'quality', 'service']" :height="300" />
        </XyTabPane>
      </XyTabs>
    </XyCard>
  </div>
</template>

<style lang="scss" scoped>
.analysis-page {
  .page-header {
    .header-content {
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
