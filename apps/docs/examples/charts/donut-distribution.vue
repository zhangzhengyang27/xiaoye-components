<script setup lang="ts">
const option = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    bottom: 0
  },
  series: [
    {
      name: "渠道分布",
      type: "pie",
      radius: ["46%", "72%"],
      center: ["50%", "46%"],
      avoidLabelOverlap: false,
      label: {
        formatter: "{b}\n{d}%"
      },
      data: [
        { value: 42, name: "官网自助" },
        { value: 28, name: "销售录入" },
        { value: 18, name: "伙伴推荐" },
        { value: 12, name: "旧客复购" }
      ]
    }
  ]
};
</script>

<template>
  <xy-charts :option="option" :height="340" />
</template>
