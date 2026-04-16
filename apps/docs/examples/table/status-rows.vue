<script setup lang="ts">
interface StatusRow {
  id: number;
  project: string;
  owner: string;
  status: "稳定" | "关注" | "风险";
  updatedAt: string;
}

interface StatusPalette {
  base: string;
  hover: string;
}

const rows: StatusRow[] = [
  {
    id: 1,
    project: "结算工作台",
    owner: "Xiaoye",
    status: "稳定",
    updatedAt: "2026-03-28 09:20"
  },
  {
    id: 2,
    project: "商家营销台",
    owner: "Alice",
    status: "关注",
    updatedAt: "2026-03-28 08:55"
  },
  {
    id: 3,
    project: "风控审核台",
    owner: "Jason",
    status: "风险",
    updatedAt: "2026-03-28 07:40"
  }
];

function resolvePalette(status: StatusRow["status"]): StatusPalette {
  if (status === "风险") {
    return {
      base: "color-mix(in srgb, var(--xy-color-danger) 10%, white)",
      hover: "color-mix(in srgb, var(--xy-color-danger) 14%, #f5f7fa)"
    };
  }

  if (status === "关注") {
    return {
      base: "color-mix(in srgb, var(--xy-color-warning) 10%, white)",
      hover: "color-mix(in srgb, var(--xy-color-warning) 14%, #f5f7fa)"
    };
  }

  return {
    base: "color-mix(in srgb, var(--xy-color-success) 8%, white)",
    hover: "color-mix(in srgb, var(--xy-color-success) 12%, #f5f7fa)"
  };
}

const rowStyle = ({ row }: { row: StatusRow }) => {
  const palette = resolvePalette(row.status);

  return {
    "--demo-table-status-row-background": palette.base,
    "--xy-table-row-hover-background": palette.hover
  };
};

const cellStyle = () => {
  return {
    background: "var(--demo-table-status-row-background)"
  };
};
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>row class</span>
          <strong>状态行</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>tooltip</span>
          <strong>enabled</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>scene</span>
          <strong>审批列表</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        :data="rows"
        row-key="id"
        border
        show-overflow-tooltip
        :row-style="rowStyle"
        :cell-style="cellStyle"
      >
        <xy-table-column prop="project" label="项目" min-width="150" />
        <xy-table-column prop="owner" label="负责人" width="100" />
        <xy-table-column prop="status" label="状态" width="100">
          <template #default="{ value }">
            <xy-tag :status="value === '稳定' ? 'success' : value === '关注' ? 'warning' : 'danger'">
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="updatedAt" label="最近更新" width="160" />
      </xy-table>
    </div>
  </div>
</template>
