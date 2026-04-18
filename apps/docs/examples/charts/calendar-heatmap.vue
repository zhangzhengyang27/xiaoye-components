<script setup lang="ts">
import { HeatmapChart } from "echarts/charts";
import { CalendarComponent, VisualMapContinuousComponent } from "echarts/components";
import { useChartsModules } from "@xiaoye/components";

useChartsModules([CalendarComponent, VisualMapContinuousComponent, HeatmapChart]);

const calendarData = [
  ["2026-04-01", 35],
  ["2026-04-02", 48],
  ["2026-04-03", 56],
  ["2026-04-04", 42],
  ["2026-04-05", 38],
  ["2026-04-06", 66],
  ["2026-04-07", 72],
  ["2026-04-08", 81],
  ["2026-04-09", 64],
  ["2026-04-10", 58],
  ["2026-04-11", 44],
  ["2026-04-12", 39],
  ["2026-04-13", 77],
  ["2026-04-14", 83]
];

const option = {
  tooltip: {
    position: "top"
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: "horizontal",
    left: "center",
    top: 18,
    inRange: {
      color: ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb"]
    }
  },
  calendar: {
    top: 76,
    left: 28,
    right: 28,
    cellSize: ["auto", 34],
    range: "2026-04",
    yearLabel: {
      show: false
    },
    splitLine: {
      show: false
    },
    itemStyle: {
      borderWidth: 0.5,
      borderColor: "#e5e7eb"
    },
    dayLabel: {
      firstDay: 1,
      nameMap: "cn"
    },
    monthLabel: {
      color: "#6b7280"
    }
  },
  series: [
    {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: calendarData
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="340" />
</template>
