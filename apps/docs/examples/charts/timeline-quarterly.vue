<script setup lang="ts">
import { TimelineComponent } from "echarts/components";
import { useChartsModules } from "@xiaoye/components";

useChartsModules([TimelineComponent]);

const option = {
  baseOption: {
    timeline: {
      axisType: "category",
      autoPlay: false,
      bottom: 8,
      left: 20,
      right: 20,
      data: ["Q1", "Q2", "Q3", "Q4"]
    },
    tooltip: {
      trigger: "axis"
    },
    legend: {
      top: 0
    },
    grid: {
      left: 36,
      right: 24,
      top: 48,
      bottom: 72
    },
    xAxis: {
      type: "category",
      data: ["线索", "报价", "成交", "复购"]
    },
    yAxis: {
      type: "value"
    }
  },
  options: [
    {
      title: {
        text: "Q1 转化漏斗快照"
      },
      series: [
        {
          name: "2026",
          type: "bar",
          data: [320, 210, 134, 86]
        }
      ]
    },
    {
      title: {
        text: "Q2 转化漏斗快照"
      },
      series: [
        {
          name: "2026",
          type: "bar",
          data: [380, 256, 168, 103]
        }
      ]
    },
    {
      title: {
        text: "Q3 转化漏斗快照"
      },
      series: [
        {
          name: "2026",
          type: "bar",
          data: [428, 301, 204, 126]
        }
      ]
    },
    {
      title: {
        text: "Q4 转化漏斗快照"
      },
      series: [
        {
          name: "2026",
          type: "bar",
          data: [460, 338, 229, 148]
        }
      ]
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="360" />
</template>
