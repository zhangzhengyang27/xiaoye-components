<script setup lang="ts">
const radarOption = {
  tooltip: {},
  legend: {
    bottom: 0
  },
  radar: {
    radius: "62%",
    splitNumber: 4,
    indicator: [
      { name: "质量", max: 100 },
      { name: "效率", max: 100 },
      { name: "留存", max: 100 },
      { name: "成本", max: 100 },
      { name: "响应", max: 100 }
    ]
  },
  series: [
    {
      type: "radar",
      areaStyle: {
        opacity: 0.18
      },
      data: [
        {
          name: "当前周期",
          value: [84, 76, 72, 61, 88]
        },
        {
          name: "目标值",
          value: [90, 82, 80, 58, 92]
        }
      ]
    }
  ]
};

const gaugeOption = {
  tooltip: {
    formatter: "{a}<br/>{b}: {c}%"
  },
  series: [
    {
      name: "履约率",
      type: "gauge",
      min: 0,
      max: 100,
      progress: {
        show: true,
        roundCap: true,
        width: 14
      },
      axisLine: {
        lineStyle: {
          width: 14
        }
      },
      pointer: {
        show: true,
        length: "56%"
      },
      detail: {
        valueAnimation: true,
        formatter: "{value}%",
        fontSize: 22,
        offsetCenter: [0, "62%"]
      },
      data: [
        {
          value: 86,
          name: "履约率"
        }
      ]
    }
  ]
};

const funnelOption = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: 0
  },
  series: [
    {
      name: "转化漏斗",
      type: "funnel",
      left: "10%",
      top: 16,
      bottom: 44,
      width: "80%",
      min: 0,
      max: 100,
      sort: "descending",
      gap: 4,
      label: {
        show: true,
        position: "inside"
      },
      data: [
        { value: 100, name: "访问" },
        { value: 74, name: "留资" },
        { value: 48, name: "跟进" },
        { value: 29, name: "报价" },
        { value: 16, name: "成交" }
      ]
    }
  ]
};
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-alert
      title="这些图表类型已经包含在 xy-charts 默认预注册集合中"
      type="info"
      description="不需要额外调用 useChartsModules(...)，直接传入 option 即可使用。"
      :closable="false"
    />

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      "
    >
      <xy-card header="能力雷达">
        <xy-charts :option="radarOption" :height="320" />
      </xy-card>

      <xy-card header="履约仪表盘">
        <xy-charts :option="gaugeOption" :height="320" />
      </xy-card>

      <xy-card header="线索转化漏斗">
        <xy-charts :option="funnelOption" :height="320" />
      </xy-card>
    </div>
  </div>
</template>
