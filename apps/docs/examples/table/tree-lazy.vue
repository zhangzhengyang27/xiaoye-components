<script setup lang="ts">
interface TreeRow {
  id: number;
  name: string;
  owner: string;
  score: number;
  hasChildren?: boolean;
  children?: TreeRow[];
}

const rows: TreeRow[] = [
  {
    id: 1,
    name: "基础平台",
    owner: "Xiaoye",
    score: 96,
    children: [
      {
        id: 11,
        name: "权限中心",
        owner: "Alice",
        score: 92
      }
    ]
  },
  {
    id: 2,
    name: "增长中台",
    owner: "Jason",
    score: 88,
    hasChildren: true
  }
];

function load(row: TreeRow, _treeNode: unknown, resolve: (rows: TreeRow[]) => void) {
  window.setTimeout(() => {
    resolve([
      {
        id: row.id * 10 + 1,
        name: `${row.name} / 懒加载子节点`,
        owner: "Momo",
        score: 84
      }
    ]);
  }, 320);
}

function spanMethod({
  row,
  rowIndex,
  columnIndex
}: {
  row: TreeRow;
  rowIndex: number;
  columnIndex: number;
}) {
  if (row.id === 11 && rowIndex === 1 && columnIndex === 0) {
    return [1, 2];
  }

  if (row.id === 11 && rowIndex === 1 && columnIndex === 1) {
    return [0, 0];
  }

  return [1, 1];
}
</script>

<template>
  <xy-table
    :data="rows"
    row-key="id"
    border
    default-expand-all
    lazy
    :load="load"
    :span-method="spanMethod"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <xy-table-column label="资源信息">
      <xy-table-column prop="name" label="模块名称" min-width="220" />
      <xy-table-column prop="owner" label="负责人" min-width="140" />
    </xy-table-column>
    <xy-table-column prop="score" label="健康度" align="right" min-width="120" />
  </xy-table>
</template>
