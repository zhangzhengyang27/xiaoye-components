<script setup lang="ts">
const option = {
  tooltip: {
    trigger: "axis"
  },
  legend: {
    top: 0
  },
  grid: {
    left: 40,
    right: 40,
    top: 48,
    bottom: 24
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  yAxis: [
    {
      type: "value",
      name: "访问量"
    },
    {
      type: "value",
      name: "转化率",
      axisLabel: {
        formatter: "{value}%"
      }
    }
  ],
  series: [
    {
      name: "访问量",
      type: "bar",
      barWidth: 24,
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: "转化率",
      type: "line",
      smooth: true,
      yAxisIndex: 1,
      data: [12, 15, 14, 18, 22, 25, 23]
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="360" />
</template>
