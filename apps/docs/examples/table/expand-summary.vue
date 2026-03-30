<script setup lang="ts">
interface ProjectRow {
  id: number;
  name: string;
  owner: string;
  budget: number;
  spend: number;
  stage: "开发中" | "验收中" | "已上线";
  note: string;
}

const rows: ProjectRow[] = [
  {
    id: 1,
    name: "结算中台",
    owner: "王见川",
    budget: 240,
    spend: 196,
    stage: "开发中",
    note: "接口联调进入最后一轮，等待财务规则确认"
  },
  {
    id: 2,
    name: "商家工作台",
    owner: "林星河",
    budget: 180,
    spend: 165,
    stage: "验收中",
    note: "体验走查已完成，等待灰度开关批准"
  },
  {
    id: 3,
    name: "订单分析台",
    owner: "沈知行",
    budget: 320,
    spend: 302,
    stage: "已上线",
    note: "上线后一周稳定，准备迁移旧报表"
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
    if (column.prop === "name") {
      return "总览";
    }

    if (column.prop === "budget") {
      return data.reduce((sum, item) => sum + item.budget, 0);
    }

    if (column.prop === "spend") {
      return data.reduce((sum, item) => sum + item.spend, 0);
    }

    return "";
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>expand</span>
          <strong>project note</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>summary</span>
          <strong>budget / spend</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>use case</span>
          <strong>经营看板</strong>
        </div>
      </div>
    </div>

    <xy-table :data="rows" row-key="id" border show-summary :summary-method="summaryMethod">
      <xy-table-column type="expand" width="56">
        <template #default="{ row }">
          <div class="table-expand-note">
            <div class="table-expand-note__eyebrow">负责人：{{ row.owner }}</div>
            <div class="table-expand-note__text">{{ row.note }}</div>
          </div>
        </template>
      </xy-table-column>
      <xy-table-column prop="name" label="项目名称" />
      <xy-table-column prop="owner" label="Owner" />
      <xy-table-column prop="budget" label="预算(万)" align="right" />
      <xy-table-column prop="spend" label="已消耗(万)" align="right" />
      <xy-table-column prop="stage" label="阶段">
        <template #default="{ value }">
          <xy-tag
            :status="value === '已上线' ? 'success' : value === '验收中' ? 'warning' : 'primary'"
          >
            {{ value }}
          </xy-tag>
        </template>
      </xy-table-column>
    </xy-table>
  </div>
</template>

<style scoped>
.table-expand-note {
  display: grid;
  gap: 6px;
}

.table-expand-note__eyebrow {
  color: #409eff;
  font-size: 12px;
  font-weight: 600;
}

.table-expand-note__text {
  color: #606266;
  font-size: 13px;
  line-height: 1.7;
}
</style>
