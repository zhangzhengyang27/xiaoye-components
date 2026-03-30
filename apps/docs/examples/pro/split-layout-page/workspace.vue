<script setup lang="ts">
import { reactive } from "vue";
import type { ProTableColumn, SearchFormField } from "@xiaoye/pro-components";

interface RuleRow {
  id: number;
  name: string;
  owner: string;
}

const searchModel = reactive({
  keyword: ""
});

const searchFields: SearchFormField[] = [
  { prop: "keyword", label: "关键词", component: "input", span: 2 }
];

const rows: RuleRow[] = [
  { id: 1, name: "权限模板", owner: "小叶" },
  { id: 2, name: "审批规则", owner: "小星" }
];

const columns: ProTableColumn<RuleRow>[] = [
  { prop: "name", label: "名称", minWidth: 180 },
  { prop: "owner", label: "负责人", minWidth: 120 }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="收口后的理解方式">
      <p>
        当前文档不再把“主从页”和“侧栏页”当成两套并列能力，而是统一理解为后台分栏工作区。
      </p>
      <p>
        左侧可以是列表、树、筛选或导航，右侧则承接详情、表格、图表或编辑区域。
      </p>
    </xy-card>

    <xy-split-layout-page
      layout="master-detail"
      title="分栏工作区：主从详情"
      description="左侧记录集合，右侧详情查看。"
    >
      <template #master>
        <xy-card header="工单列表">这里承接记录集合、树或待办池。</xy-card>
      </template>
      <template #detail>
        <xy-card header="当前工单详情">
          <xy-descriptions :column="2" border>
            <xy-descriptions-item label="负责人">小叶</xy-descriptions-item>
            <xy-descriptions-item label="状态">处理中</xy-descriptions-item>
          </xy-descriptions>
        </xy-card>
      </template>
    </xy-split-layout-page>

    <xy-split-layout-page
      layout="aside-main"
      title="分栏工作区：筛选与主内容"
      description="左侧筛选或导航，右侧主结果区。"
    >
      <template #aside>
        <xy-filter-panel title="筛选条件">
          <xy-search-form :model="searchModel" :fields="searchFields" />
        </xy-filter-panel>
      </template>
      <template #main>
        <xy-pro-table
          title="规则列表"
          description="这里承接主表格、看板或图表。"
          :data="rows"
          :columns="columns"
          :pagination="false"
        />
      </template>
    </xy-split-layout-page>
  </div>
</template>
