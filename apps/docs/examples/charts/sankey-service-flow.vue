<script setup lang="ts">
import { SankeyChart } from "echarts/charts";
import { useChartsModules } from "@xiaoye/components";

useChartsModules([SankeyChart]);

const option = {
  tooltip: {
    trigger: "item"
  },
  series: [
    {
      type: "sankey",
      left: 24,
      right: 24,
      top: 24,
      bottom: 24,
      emphasis: {
        focus: "adjacency"
      },
      lineStyle: {
        color: "source",
        curveness: 0.5
      },
      data: [
        { name: "新线索" },
        { name: "自动分配" },
        { name: "销售跟进" },
        { name: "方案确认" },
        { name: "成交" },
        { name: "流失" }
      ],
      links: [
        { source: "新线索", target: "自动分配", value: 320 },
        { source: "自动分配", target: "销售跟进", value: 280 },
        { source: "自动分配", target: "流失", value: 40 },
        { source: "销售跟进", target: "方案确认", value: 190 },
        { source: "销售跟进", target: "流失", value: 90 },
        { source: "方案确认", target: "成交", value: 128 },
        { source: "方案确认", target: "流失", value: 62 }
      ]
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="340" />
</template>
