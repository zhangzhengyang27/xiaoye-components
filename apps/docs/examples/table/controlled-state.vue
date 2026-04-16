<script setup lang="ts">
import { computed, ref } from "vue";

interface ProjectRow {
  id: number;
  name: string;
  owner: string;
  status: "上线中" | "排期中" | "风险中";
  score: number;
  detail: string;
}

const rows: ProjectRow[] = [
  {
    id: 1,
    name: "会员中台",
    owner: "Xiaoye",
    status: "上线中",
    score: 96,
    detail: "承接等级权益、积分流水与活动触达，当前作为默认焦点行。"
  },
  {
    id: 2,
    name: "投放驾驶舱",
    owner: "Alice",
    status: "排期中",
    score: 88,
    detail: "等待归因口径冻结，适合作为展开行和筛选联动示例。"
  },
  {
    id: 3,
    name: "结算对账台",
    owner: "Jason",
    status: "风险中",
    score: 72,
    detail: "存在历史账单回补压力，适合演示受控筛选后的状态摘要。"
  },
  {
    id: 4,
    name: "权限审计台",
    owner: "Momo",
    status: "上线中",
    score: 91,
    detail: "审计日志与操作留痕稳定运行，作为当前已发布项目的第二条记录。"
  }
];

const currentRowKey = ref<number | null>(1);
const expandRowKeys = ref<number[]>([2]);
const sortProp = ref<string | undefined>("score");
const sortOrder = ref<"ascending" | "descending" | null>("descending");
const filterValues = ref<Record<string, Array<string | number | boolean>>>({
  status: ["上线中", "排期中"]
});

const currentRow = computed(
  () => rows.find((row) => row.id === currentRowKey.value) ?? null
);

const controlledSummary = computed(() => {
  const statuses = filterValues.value.status ?? [];
  return statuses.length > 0 ? statuses.join(" / ") : "全部状态";
});

function handleSortChange(payload: {
  prop?: string;
  order?: "ascending" | "descending" | null;
}) {
  sortProp.value = payload.prop;
  sortOrder.value = payload.order ?? null;
}

function handleFilterChange(nextValues: Record<string, Array<string | number | boolean>>) {
  filterValues.value = nextValues;
}

function focusRow(id: number) {
  currentRowKey.value = id;
}

function toggleExpand(id: number) {
  expandRowKeys.value = expandRowKeys.value.includes(id)
    ? expandRowKeys.value.filter((key) => key !== id)
    : [...expandRowKeys.value, id];
}

function showOnlineOnly() {
  filterValues.value = {
    status: ["上线中"]
  };
}

function resetControlledState() {
  currentRowKey.value = 1;
  expandRowKeys.value = [2];
  sortProp.value = "score";
  sortOrder.value = "descending";
  filterValues.value = {
    status: ["上线中", "排期中"]
  };
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>current</span>
          <strong>{{ currentRowKey ?? "none" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>expand</span>
          <strong>{{ expandRowKeys.length > 0 ? expandRowKeys.join(", ") : "none" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>sort</span>
          <strong>{{ sortProp ?? "none" }} / {{ sortOrder ?? "none" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>filter</span>
          <strong>{{ controlledSummary }}</strong>
        </div>
      </div>

      <xy-space wrap>
        <xy-button text size="sm" @click="focusRow(3)">聚焦风险行</xy-button>
        <xy-button text size="sm" @click="toggleExpand(2)">切换展开行</xy-button>
        <xy-button text size="sm" @click="showOnlineOnly">仅看上线中</xy-button>
        <xy-button text size="sm" @click="resetControlledState">重置受控状态</xy-button>
      </xy-space>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        v-model:current-row-key="currentRowKey"
        :data="rows"
        row-key="id"
        border
        highlight-current-row
        :expand-row-keys="expandRowKeys"
        :sort-prop="sortProp"
        :sort-order="sortOrder"
        :filter-values="filterValues"
        @update:expand-row-keys="expandRowKeys = $event as number[]"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
      >
        <xy-table-column type="expand" width="56">
          <template #default="{ row }">
            <div class="table-controlled-expand">
              <div class="table-controlled-expand__title">{{ row.name }}</div>
              <div class="table-controlled-expand__text">{{ row.detail }}</div>
            </div>
          </template>
        </xy-table-column>

        <xy-table-column prop="name" label="项目名称" min-width="180" sortable show-overflow-tooltip />
        <xy-table-column prop="owner" label="负责人" width="120" />
        <xy-table-column
          prop="status"
          label="状态"
          width="120"
          column-key="status"
          :filters="[
            { text: '上线中', value: '上线中' },
            { text: '排期中', value: '排期中' },
            { text: '风险中', value: '风险中' }
          ]"
        >
          <template #default="{ value }">
            <xy-tag
              :status="
                value === '上线中' ? 'success' : value === '排期中' ? 'warning' : 'danger'
              "
            >
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="score" label="健康度" width="120" align="right" sortable />
      </xy-table>
    </div>

    <div class="xy-table-doc-scene__footer">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Controlled State</div>
        <div class="xy-table-doc-scene__value">
          {{
            currentRow
              ? `${currentRow.name} / ${currentRow.owner} / ${currentRow.status}`
              : "当前没有焦点行"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-controlled-expand {
  display: grid;
  gap: 6px;
}

.table-controlled-expand__title {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.table-controlled-expand__text {
  color: #606266;
  font-size: 13px;
  line-height: 1.7;
}
</style>
