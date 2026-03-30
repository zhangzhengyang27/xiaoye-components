<script setup lang="ts">
const metaItems = [
  {
    label: "负责人",
    value: "小叶",
    icon: "mdi:account-circle"
  },
  {
    label: "统计窗口",
    value: "近 30 天",
    icon: "mdi:calendar-range"
  }
];

const trendOption = {
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: 24,
    right: 16,
    top: 28,
    bottom: 24
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["第 1 周", "第 2 周", "第 3 周", "第 4 周", "第 5 周", "第 6 周"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "支付金额",
      type: "line",
      smooth: true,
      areaStyle: {},
      data: [118, 146, 162, 188, 214, 239]
    }
  ]
};

const distributionOption = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: 0
  },
  series: [
    {
      type: "pie",
      radius: ["46%", "70%"],
      center: ["50%", "42%"],
      label: {
        formatter: "{b}\n{d}%"
      },
      data: [
        { value: 38, name: "官网自助" },
        { value: 24, name: "销售录入" },
        { value: 21, name: "伙伴转介绍" },
        { value: 17, name: "老客复购" }
      ]
    }
  ]
};
</script>

<template>
  <xy-page-container
    title="经营分析页"
    description="PageContainer 负责承接页面壳层，Charts 负责承接内部图表区块。"
    :meta-items="metaItems"
    shadow
  >
    <template #actions>
      <xy-button plain>导出报表</xy-button>
      <xy-button type="primary">刷新数据</xy-button>
    </template>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      "
    >
      <xy-card>
        <xy-statistic title="本月成交额" value="239 万" />
      </xy-card>
      <xy-card>
        <xy-statistic title="新增客户" value="1,286" />
      </xy-card>
      <xy-card>
        <xy-statistic title="退款工单" value="49" />
      </xy-card>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);
        gap: 16px;
      "
    >
      <xy-card header="支付趋势">
        <xy-charts :option="trendOption" :height="300" />
      </xy-card>

      <xy-card header="来源构成">
        <xy-charts :option="distributionOption" :height="300" />
      </xy-card>
    </div>

    <template #footer>
      <xy-space wrap>
        <xy-tag status="primary">数据更新时间：2026-03-30 20:40</xy-tag>
        <xy-tag status="success">当前看板无异常</xy-tag>
      </xy-space>
    </template>
  </xy-page-container>
</template>
