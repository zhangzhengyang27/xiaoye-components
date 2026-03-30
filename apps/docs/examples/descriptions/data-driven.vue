<script setup lang="ts">
const items = [
  {
    label: "审核状态",
    value: "已通过",
    icon: "mdi:check-decagram-outline",
    tag: {
      text: "已通过",
      props: {
        status: "success"
      }
    }
  },
  {
    label: "详情页",
    value: "查看详情",
    link: {
      href: "https://example.com/detail",
      target: "_blank"
    }
  },
  {
    label: "备注",
    value: "该条目通过 items 驱动渲染，适合接口回显场景。",
    span: 2
  }
];
</script>

<template>
  <xy-descriptions title="审核详情" :column="2" collapse :items="items" border />
</template>
