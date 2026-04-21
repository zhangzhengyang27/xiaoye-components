<script setup lang="ts">
import { reactive } from "vue";
import type { ProTableColumn, ProTableProps } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  owner: string;
  status: "启用" | "停用";
}

const searchModel = reactive({
  keyword: "发票"
});

const filterModel = reactive({
  status: "enabled"
});

const columns: ProTableColumn<Row>[] = [
  {
    prop: "name",
    label: "工作台名称",
    minWidth: 220
  },
  {
    prop: "owner",
    label: "负责人",
    minWidth: 120
  },
  {
    prop: "status",
    label: "状态",
    slot: "status",
    minWidth: 120
  }
];

const request: NonNullable<ProTableProps<Row>["request"]> = {
  immediate: true,
  request: async (params) => {
    await new Promise((resolve) => window.setTimeout(resolve, 200));

    const rows = [
      {
        id: 1,
        name: "发票审批台",
        owner: "小叶",
        status: "启用"
      },
      {
        id: 2,
        name: "结算复核台",
        owner: "小星",
        status: "停用"
      }
    ] satisfies Row[];

    const filteredRows = rows.filter((row) => {
      const keyword = String(params.keyword ?? "").trim();
      const status = params.status;
      const hitKeyword = keyword ? row.name.includes(keyword) : true;
      const hitStatus = status === "enabled" ? row.status === "启用" : true;
      return hitKeyword && hitStatus;
    });

    return {
      data: filteredRows,
      total: filteredRows.length
    };
  }
};
</script>

<template>
  <xy-pro-table
    title="统一工作台"
    description="把请求编排、视图、搜索、筛选、列设置和导出入口统一收进一个增强表格。"
    :data="[]"
    :columns="columns"
    :request="request"
    :workbench="{
      refresh: true,
      density: true,
      columnSetting: true,
      filter: true,
      export: true,
      print: true
    }"
    :views="{
      searchModel,
      searchFields: [
        {
          prop: 'keyword',
          label: '关键词',
          component: 'input'
        }
      ],
      savedViews: [
        {
          key: 'all',
          label: '全部'
        },
        {
          key: 'enabled',
          label: '已启用'
        }
      ],
      filterModel,
      filterFields: [
        {
          prop: 'status',
          label: '状态',
          component: 'select',
          options: [
            { label: '启用', value: 'enabled' }
          ]
        }
      ]
    }"
    :export-options="{ filename: 'workspace-table' }"
    :print-options="{ title: '统一工作台打印预览' }"
    :table-props="{ rowKey: 'id' }"
  >
    <template #status="{ row }">
      <xy-tag :status="row.status === '启用' ? 'success' : 'warning'">
        {{ row.status }}
      </xy-tag>
    </template>
  </xy-pro-table>
</template>
