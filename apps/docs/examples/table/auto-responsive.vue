<script setup lang="ts">
import { computed, ref } from "vue";
import type { TableInstance } from "xiaoye-components";

interface AutoRow {
  id: number;
  module: string;
  owner: string;
  summary: string;
  score: number;
}

const tableRef = ref<TableInstance<AutoRow> | null>(null);
const compact = ref(false);
const nativeScrollbar = ref(true);

const baseRows: AutoRow[] = [
  {
    id: 1,
    module: "统一权限中心",
    owner: "Xiaoye",
    summary:
      "接入组织架构、菜单授权、角色继承和审计留痕，模块文案长度会随着视图模式变化而明显变化。",
    score: 96
  },
  {
    id: 2,
    module: "投放归因分析",
    owner: "Alice",
    summary:
      "自动汇总广告计划、转化漏斗和回收周期，适合观察 auto 布局在长文本列上的收敛效果。",
    score: 88
  },
  {
    id: 3,
    module: "结算对账控制台",
    owner: "Jason",
    summary:
      "包含账期、回款、异常工单和结算提醒，长文本与短文本混排时可以直接观察列宽优先级。",
    score: 81
  }
];

const rows = computed<AutoRow[]>(() =>
  baseRows.map((row) => ({
    ...row,
    summary: compact.value ? row.summary.slice(0, 22) : row.summary
  }))
);

function scrollToRight() {
  tableRef.value?.setScrollLeft(320);
}

function resetScroll() {
  tableRef.value?.setScrollLeft(0);
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
          <span>flexible</span>
          <strong>min-width: 0</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>scrollbar</span>
          <strong>{{ nativeScrollbar ? "native" : "custom" }}</strong>
        </div>
      </div>

      <xy-space wrap>
        <xy-button text size="sm" @click="compact = !compact">
          {{ compact ? "恢复长文本" : "切换短文本" }}
        </xy-button>
        <xy-button text size="sm" @click="nativeScrollbar = !nativeScrollbar">
          {{ nativeScrollbar ? "切换自定义滚动条" : "切换原生滚动条" }}
        </xy-button>
        <xy-button text size="sm" @click="scrollToRight">滚动到右侧</xy-button>
        <xy-button text size="sm" @click="resetScroll">重置滚动</xy-button>
      </xy-space>
    </div>

    <div class="table-auto-shell">
      <div class="xy-table-doc-scene__surface">
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          table-layout="auto"
          flexible
          border
          :native-scrollbar="nativeScrollbar"
          max-height="260"
          aria-label="自适应布局表格示例"
        >
          <xy-table-column prop="module" label="模块名称" min-width="180" />
          <xy-table-column prop="owner" label="负责人" width="120" />
          <xy-table-column prop="summary" label="摘要说明" min-width="320" show-overflow-tooltip />
          <xy-table-column prop="score" label="健康度" width="120" align="right" sortable />
        </xy-table>
      </div>
    </div>

    <div class="xy-table-doc-scene__footer">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Behavior</div>
        <div class="xy-table-doc-scene__value">
          auto 布局只补未显式设宽的列；长文本切换、滚动条方案切换和实例方法滚动都会触发同一套布局同步链路。
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-auto-shell {
  display: flex;
  min-width: 0;
}
</style>
