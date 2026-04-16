<script setup lang="ts">
interface ProjectRow {
  id: number;
  project: string;
  owner: string;
  channel: string;
  region: string;
  exposure: number;
  clicks: number;
  conversion: number;
  revenue: number;
  note: string;
}

const rows: ProjectRow[] = [
  {
    id: 1,
    project: "会员增长季 Campaign A",
    owner: "Xiaoye",
    channel: "信息流广告",
    region: "华东",
    exposure: 180000,
    clicks: 13200,
    conversion: 4.2,
    revenue: 86,
    note: "核心卖点集中在新客首单和会员权益，适合观察 auto 布局在长文案列上的稳定性。"
  },
  {
    id: 2,
    project: "商家激活计划 2026Q2",
    owner: "Alice",
    channel: "站内 Push + 短信",
    region: "华南",
    exposure: 92000,
    clicks: 7400,
    conversion: 5.1,
    revenue: 62,
    note: "站内和短信双通道同时投放，项目名和备注列长度差异较大。"
  },
  {
    id: 3,
    project: "订单回流专项 / 经营版",
    owner: "Jason",
    channel: "搜索广告",
    region: "全国",
    exposure: 210000,
    clicks: 15800,
    conversion: 3.8,
    revenue: 94,
    note: "预算集中在月末回流期，固定列和 summary 适合直接做经营复盘视图。"
  }
];

function summaryMethod({
  columns,
  data
}: {
  columns: Array<{ prop?: string }>;
  data: ProjectRow[];
}) {
  return columns.map((column) => {
    if (column.prop === "project") {
      return "总览";
    }

    if (column.prop === "exposure") {
      return data.reduce((sum, item) => sum + item.exposure, 0).toLocaleString();
    }

    if (column.prop === "clicks") {
      return data.reduce((sum, item) => sum + item.clicks, 0).toLocaleString();
    }

    if (column.prop === "revenue") {
      return `${data.reduce((sum, item) => sum + item.revenue, 0)} 万`;
    }

    return "";
  });
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>layout</span>
          <strong>auto</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>fixed</span>
          <strong>left + right</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>header</span>
          <strong>grouped</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>summary</span>
          <strong>ops dashboard</strong>
        </div>
      </div>
    </div>

    <div class="table-auto-fixed-shell">
      <div class="xy-table-doc-scene__surface">
        <xy-table
          :data="rows"
          row-key="id"
          table-layout="auto"
          flexible
          border
          show-summary
          max-height="280"
          :summary-method="summaryMethod"
        >
          <xy-table-column label="项目档案">
            <xy-table-column
              fixed="left"
              prop="project"
              label="项目名称"
              min-width="230"
              show-overflow-tooltip
            />
            <xy-table-column prop="owner" label="负责人" width="96" />
          </xy-table-column>

          <xy-table-column label="投放信息">
            <xy-table-column prop="channel" label="渠道" min-width="160" show-overflow-tooltip />
            <xy-table-column prop="region" label="区域" width="100" />
            <xy-table-column prop="note" label="备注" min-width="260" show-overflow-tooltip />
          </xy-table-column>

          <xy-table-column label="经营指标">
            <xy-table-column prop="exposure" label="曝光" width="140" align="right" />
            <xy-table-column prop="clicks" label="点击" width="120" align="right" />
            <xy-table-column prop="conversion" label="转化率" width="120" align="right">
              <template #default="{ value }">{{ value }}%</template>
            </xy-table-column>
            <xy-table-column fixed="right" prop="revenue" label="营收" width="120" align="right">
              <template #default="{ value }">{{ value }} 万</template>
            </xy-table-column>
          </xy-table-column>
        </xy-table>
      </div>
    </div>

    <div class="xy-table-doc-scene__footer">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Layout Notes</div>
        <div class="xy-table-doc-scene__value">
          auto 负责收敛长文案列宽，固定列保持左右锚点，多级表头和 summary 共用同一套宽度同步结果。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-auto-fixed-shell {
  display: flex;
  min-width: 0;
}
</style>
