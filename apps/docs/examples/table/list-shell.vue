<script setup lang="ts">
interface ListRow {
  id: number;
  name: string;
  owner: string;
  status: "草稿" | "进行中" | "已上线";
  updatedAt: string;
}

const rows: ListRow[] = [
  {
    id: 1,
    name: "成员管理",
    owner: "Xiaoye",
    status: "进行中",
    updatedAt: "2026-05-22 19:30"
  },
  {
    id: 2,
    name: "角色权限",
    owner: "Alice",
    status: "已上线",
    updatedAt: "2026-05-22 16:10"
  },
  {
    id: 3,
    name: "审计日志",
    owner: "Jason",
    status: "草稿",
    updatedAt: "2026-05-22 11:45"
  }
];
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-scene__hero">
      <div class="xy-table-doc-scene__intro">
        <div class="xy-table-doc-scene__eyebrow">List Shell Tokens</div>
        <div class="xy-table-doc-scene__title">后台列表页表格壳层</div>
        <p class="xy-table-doc-scene__description">
          当页面只是想让普通列表页的表头、边框和单元格节奏贴近业务主题时，优先在 wrapper 上设置 table
          token，而不是继续 deep 到 <code>.xy-table__cell</code> 或 <code>.xy-table__header-cell</code>。
        </p>
      </div>

      <div class="xy-table-doc-scene__meta">
        <div class="xy-table-doc-chip">
          <span>scene</span>
          <strong>list page</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>token level</span>
          <strong>wrapper</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>rows</span>
          <strong>{{ rows.length }}</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface table-shell-demo">
      <xy-table :data="rows" row-key="id" show-overflow-tooltip>
        <xy-table-column prop="name" label="模块" min-width="160" />
        <xy-table-column prop="owner" label="负责人" width="110" />
        <xy-table-column prop="status" label="状态" width="110">
          <template #default="{ value }">
            <xy-tag
              :status="
                value === '已上线' ? 'success' : value === '进行中' ? 'warning' : 'info'
              "
            >
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="updatedAt" label="更新时间" width="170" />
      </xy-table>
    </div>
  </div>
</template>

<style scoped>
.table-shell-demo {
  --xy-table-background: color-mix(in srgb, var(--xy-bg-color) 96%, var(--xy-bg-color-floating));
  --xy-table-surface-background: color-mix(
    in srgb,
    var(--xy-bg-color-floating) 90%,
    var(--xy-bg-color-subtle)
  );
  --xy-table-subtle-background: color-mix(
    in srgb,
    var(--xy-bg-color-subtle) 78%,
    var(--xy-table-surface-background)
  );
  --xy-table-radius: 10px;
  --xy-table-header-background: var(--xy-table-subtle-background);
  --xy-table-header-color: var(--xy-text-color-secondary);
  --xy-table-header-font-size: 12.5px;
  --xy-table-header-text-transform: uppercase;
  --xy-table-header-letter-spacing: 0.04em;
  --xy-table-border-color: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 72%,
    var(--xy-border-color)
  );
  --xy-table-header-cell-padding-y: 12px;
  --xy-table-header-cell-padding-x: 14px;
  --xy-table-body-cell-padding-y: 13px;
  --xy-table-body-cell-padding-x: 14px;
}
</style>
