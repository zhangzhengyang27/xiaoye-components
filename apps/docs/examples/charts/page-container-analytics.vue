<script setup lang="ts">
import { ref } from "vue";

const dateRange = ref("近 7 天");

const revenueOption = {
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: 28,
    right: 18,
    top: 28,
    bottom: 24
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "成交额",
      type: "line",
      smooth: true,
      areaStyle: {},
      data: [22, 26, 24, 31, 35, 39, 37]
    }
  ]
};

const sourceOption = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: 0
  },
  series: [
    {
      type: "pie",
      radius: ["46%", "72%"],
      center: ["50%", "44%"],
      label: {
        formatter: "{b}\n{d}%"
      },
      data: [
        { value: 44, name: "官网自助" },
        { value: 26, name: "销售录入" },
        { value: 18, name: "伙伴转介" },
        { value: 12, name: "活动投放" }
      ]
    }
  ]
};

const metaItems = [
  {
    label: "负责人",
    value: "小叶",
    icon: "mdi:account-circle"
  },
  {
    label: "数据窗口",
    value: dateRange,
    icon: "mdi:calendar-range"
  }
];
</script>

<template>
  <xy-page-container
    title="经营分析"
    description="PageContainer 负责页面头部、内容区和底部动作，Charts 负责承接具体图表。"
    :meta-items="metaItems"
    bordered
    shadow
  >
    <template #actions>
      <xy-button plain @click="dateRange = dateRange === '近 7 天' ? '近 30 天' : '近 7 天'">
        切换时间范围
      </xy-button>
      <xy-button type="primary">导出分析报告</xy-button>
    </template>

    <div class="xy-doc-combo-grid">
      <xy-card header="成交趋势">
        <xy-charts :option="revenueOption" :height="300" />
      </xy-card>

      <xy-card header="线索来源">
        <xy-charts :option="sourceOption" :height="300" />
      </xy-card>
    </div>

    <template #footer>
      <xy-space wrap>
        <xy-tag status="primary">本页结构由 `PageContainer + Charts` 组合完成</xy-tag>
        <xy-button>返回工作台</xy-button>
      </xy-space>
    </template>
  </xy-page-container>
</template>

<style scoped>
.xy-doc-combo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
</style>
