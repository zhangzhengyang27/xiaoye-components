<script setup lang="ts">
const trendOption = {
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: 36,
    right: 24,
    top: 36,
    bottom: 28
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    boundaryGap: false
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
      data: [28, 32, 29, 35, 41, 44, 48]
    }
  ]
};

const categoryOption = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: 0
  },
  series: [
    {
      type: "pie",
      radius: ["42%", "68%"],
      center: ["50%", "44%"],
      label: {
        formatter: "{b}\n{d}%"
      },
      data: [
        { value: 36, name: "官网自助" },
        { value: 28, name: "销售录入" },
        { value: 20, name: "伙伴转介绍" },
        { value: 16, name: "活动投放" }
      ]
    }
  ]
};
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="经营概览工作台">
      <xy-space wrap>
        <xy-tag status="primary">今日更新 09:30</xy-tag>
        <xy-tag status="success">转化率稳定</xy-tag>
        <xy-button type="primary">导出周报</xy-button>
      </xy-space>
    </xy-card>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      "
    >
      <xy-statistic title="本周成交额" value="48.2 万" />
      <xy-statistic title="新增线索" value="268" />
      <xy-statistic title="有效跟进" value="193" />
      <xy-statistic title="转化率" value="18.6%" />
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
        gap: 16px;
      "
    >
      <xy-card header="近 7 日成交趋势">
        <xy-charts :option="trendOption" :height="320" />
      </xy-card>

      <xy-card header="线索来源分布">
        <xy-charts :option="categoryOption" :height="320" />
      </xy-card>
    </div>
  </div>
</template>
