<script setup lang="ts">
import { GraphicComponent } from "echarts/components";
import { useChartsModules } from "@xiaoye/components";

useChartsModules([GraphicComponent]);

const option = {
  tooltip: {
    trigger: "axis"
  },
  grid: {
    left: 40,
    right: 24,
    top: 64,
    bottom: 32
  },
  xAxis: {
    type: "category",
    data: ["第一周", "第二周", "第三周", "第四周"]
  },
  yAxis: {
    type: "value"
  },
  graphic: [
    {
      type: "group",
      right: 18,
      top: 14,
      children: [
        {
          type: "rect",
          shape: {
            width: 124,
            height: 36,
            r: 10
          },
          style: {
            fill: "#eff6ff",
            stroke: "#bfdbfe",
            lineWidth: 1
          }
        },
        {
          type: "text",
          left: 14,
          top: 10,
          style: {
            text: "graphic 已扩展注册",
            fill: "#1d4ed8",
            fontSize: 13,
            fontWeight: 600
          }
        }
      ]
    }
  ],
  series: [
    {
      type: "line",
      smooth: true,
      symbolSize: 8,
      lineStyle: {
        width: 3
      },
      areaStyle: {
        opacity: 0.18
      },
      data: [28, 36, 42, 51]
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="320" />
</template>
