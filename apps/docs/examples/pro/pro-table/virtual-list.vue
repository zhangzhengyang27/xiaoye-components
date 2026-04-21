<script setup lang="ts">
import type { ProTableColumn } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  score: number;
}

const rows: Row[] = Array.from({ length: 200 }, (_, index) => ({
  id: index + 1,
  name: `数据看板 ${index + 1}`,
  owner: index % 2 === 0 ? "小叶" : "小星",
  score: 80 + (index % 20)
}));

const columns: ProTableColumn<Row>[] = [
  {
    prop: "id",
    label: "#",
    width: 72
  },
  {
    prop: "name",
    label: "名称",
    minWidth: 220
  },
  {
    prop: "owner",
    label: "负责人",
    minWidth: 120
  },
  {
    prop: "score",
    label: "评分",
    minWidth: 120
  }
];
</script>

<template>
  <xy-pro-table
    title="虚拟列表"
    description="首版虚拟模式要求固定行高和显式 rowKey，用来承接大量后台列表。"
    :data="rows"
    :columns="columns"
    :virtual="{ enabled: true, itemSize: 48, height: 360 }"
    :table-props="{ rowKey: 'id' }"
    :pagination="false"
  />
</template>
