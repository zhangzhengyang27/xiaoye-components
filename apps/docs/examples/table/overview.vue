<script setup lang="ts">
interface OverviewRow {
  id: number;
  service: string;
  owner: string;
  status: "稳定" | "观察" | "风险";
  latency: string;
}

const rows: OverviewRow[] = [
  {
    id: 1,
    service: "结算工作台",
    owner: "Xiaoye",
    status: "稳定",
    latency: "124 ms"
  },
  {
    id: 2,
    service: "商家营销台",
    owner: "Alice",
    status: "观察",
    latency: "236 ms"
  },
  {
    id: 3,
    service: "风控审核台",
    owner: "Jason",
    status: "风险",
    latency: "418 ms"
  }
];
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-scene__hero">
      <div class="xy-table-doc-scene__intro">
        <div class="xy-table-doc-scene__eyebrow">Dashboard Overview</div>
        <div class="xy-table-doc-scene__title">控制台概览表格</div>
        <p class="xy-table-doc-scene__description">
          当表格用于 dashboard 首屏时，建议显式开启 <code>overview</code>，用更轻的节奏承接核心服务、状态和健康度摘要，而不是在页面层逐个覆盖 padding、空态和附加区样式。
        </p>
      </div>

      <div class="xy-table-doc-scene__meta">
        <div class="xy-table-doc-chip">
          <span>density</span>
          <strong>overview</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>scene</span>
          <strong>dashboard</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>rows</span>
          <strong>{{ rows.length }}</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        :data="rows"
        row-key="id"
        overview
        show-overflow-tooltip
        class="overview-table"
      >
        <xy-table-column prop="service" label="服务" min-width="180" />
        <xy-table-column prop="owner" label="负责人" width="120" />
        <xy-table-column prop="status" label="状态" width="100">
          <template #default="{ value }">
            <xy-tag :status="value === '稳定' ? 'success' : value === '观察' ? 'warning' : 'danger'">
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="latency" label="延迟" width="110" align="right" />

        <template #append>
          <div class="table-overview-append">
            <span class="table-overview-append__label">Overview Hint</span>
            <span class="table-overview-append__value">概览态会同步收紧空态、loading、append 和展开区节奏。</span>
          </div>
        </template>
      </xy-table>
    </div>
  </div>
</template>

<style scoped>
.overview-table {
  --xy-table-background: color-mix(in srgb, var(--xy-bg-color) 94%, var(--xy-bg-color-floating));
  --xy-table-surface-background: color-mix(
    in srgb,
    var(--xy-bg-color-floating) 92%,
    var(--xy-bg-color-subtle)
  );
  --xy-table-subtle-background: color-mix(
    in srgb,
    var(--xy-bg-color-subtle) 72%,
    var(--xy-table-surface-background)
  );
  --xy-table-overview-cell-padding-y: 7px;
  --xy-table-overview-cell-padding-x: 12px;
  --xy-table-overview-append-padding: 12px;
  --xy-table-overview-expanded-padding: 12px 12px 14px;
}

.table-overview-append {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--xy-text-color-secondary);
  font-size: var(--xy-font-size-sm);
}

.table-overview-append__label {
  font-weight: 600;
  color: var(--xy-text-color);
}

.table-overview-append__value {
  text-align: right;
}

@media (max-width: 767px) {
  .table-overview-append {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-overview-append__value {
    text-align: left;
  }
}
</style>
