<script setup lang="ts">
const option = {
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      type: "line",
      smooth: true,
      data: [12, 18, 24, 21, 30]
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="320" />
</template>
