<script setup lang="ts">
interface ReportRow {
  id: number;
  team: string;
  owner: string;
  active: number;
  risk: number;
}

const rows: ReportRow[] = [
  { id: 1, team: "商业化", owner: "王见川", active: 28, risk: 1 },
  { id: 2, team: "商业化", owner: "王见川", active: 31, risk: 0 },
  { id: 3, team: "基础平台", owner: "林星河", active: 22, risk: 2 },
  { id: 4, team: "基础平台", owner: "林星河", active: 26, risk: 1 }
];

function spanMethod({
  rowIndex,
  columnIndex
}: {
  rowIndex: number;
  columnIndex: number;
}) {
  if (columnIndex === 0 || columnIndex === 1) {
    return rowIndex % 2 === 0 ? [2, 1] : [0, 0];
  }

  return [1, 1];
}
</script>

<template>
  <xy-table :data="rows" row-key="id" border :span-method="spanMethod">
    <xy-table-column label="基础信息">
      <xy-table-column prop="team" label="团队" min-width="160" />
      <xy-table-column prop="owner" label="负责人" min-width="140" />
    </xy-table-column>
    <xy-table-column label="运营指标">
      <xy-table-column prop="active" label="活跃任务" align="right" />
      <xy-table-column prop="risk" label="风险项" align="right" />
    </xy-table-column>
  </xy-table>
</template>
