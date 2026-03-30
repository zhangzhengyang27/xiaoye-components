<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

interface ProjectRow {
  id: number
  name: string
  owner: string
  status: "上线中" | "排期中" | "已归档"
  score: number
}

const allRows: ProjectRow[] = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${String(index + 1).padStart(2, "0")}`,
  owner: ["Xiaoye", "Alice", "Jason"][index % 3] as ProjectRow["owner"],
  status: ["上线中", "排期中", "已归档"][index % 3] as ProjectRow["status"],
  score: 100 - index
}))

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)
const rows = ref<ProjectRow[]>([])
const sortProp = ref<string | undefined>("score")
const sortOrder = ref<"ascending" | "descending" | null>("ascending")
const visibleRange = computed(() => {
  if (!allRows.length) {
    return "0 - 0"
  }

  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, allRows.length)
  return `${start} - ${end}`
})
const sortSummary = computed(() => `${sortProp.value ?? "none"} / ${sortOrder.value ?? "none"}`)

async function requestRows(page = currentPage.value, size = pageSize.value) {
  loading.value = true

  await new Promise((resolve) => {
    window.setTimeout(resolve, 520)
  })

  const sortedRows = allRows.slice()

  if (sortProp.value === "score" && sortOrder.value) {
    sortedRows.sort((left, right) =>
      sortOrder.value === "ascending" ? left.score - right.score : right.score - left.score
    )
  }

  const start = (page - 1) * size
  rows.value = sortedRows.slice(start, start + size)
  loading.value = false
}

async function handlePagerChange(page: number, size: number) {
  currentPage.value = page
  pageSize.value = size
  await requestRows(page, size)
}

async function handleSortChange(payload: {
  prop?: string
  order?: "ascending" | "descending" | null
}) {
  sortProp.value = payload.prop
  sortOrder.value = payload.order ?? null
  currentPage.value = 1
  await requestRows(1, pageSize.value)
}

function refreshCurrentPage() {
  void requestRows()
}

onMounted(() => {
  void requestRows()
})
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-scene__hero">
      <div class="xy-table-doc-scene__intro">
        <div class="xy-table-doc-scene__eyebrow">Remote Data</div>
        <div class="xy-table-doc-scene__title">服务端分页列表</div>
        <p class="xy-table-doc-scene__description">
          让请求状态、当前排序和分页脚手架形成完整的列表版式，而不是单个 tag 加一张表。
        </p>
      </div>

      <div class="xy-table-doc-scene__meta">
        <div class="xy-table-doc-chip">
          <span>当前页</span>
          <strong>{{ currentPage }}</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>可见范围</span>
          <strong>{{ visibleRange }}</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>排序</span>
          <strong>{{ sortSummary }}</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>page</span>
          <strong>{{ currentPage }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>page size</span>
          <strong>{{ pageSize }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>sort</span>
          <strong>{{ sortProp ?? "none" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>order</span>
          <strong>{{ sortOrder ?? "none" }}</strong>
        </div>
      </div>

      <xy-button plain size="sm" :loading="loading" @click="refreshCurrentPage">刷新当前页</xy-button>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table :data="rows" :loading="loading" row-key="id" border
        :default-sort="{ prop: 'score', order: 'ascending' }" loading-text="正在同步当前页数据" @sort-change="handleSortChange">
        <xy-table-column prop="name" label="项目名称" min-width="170" show-overflow-tooltip />
        <xy-table-column prop="owner" label="负责人" width="110" />
        <xy-table-column prop="status" label="状态" width="120">
          <template #default="{ value }">
            <xy-tag :status="value === '上线中' ? 'success' : value === '排期中' ? 'warning' : 'neutral'">
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="score" label="健康度" width="110" align="right" sortable="custom" />
      </xy-table>
    </div>

    <div class="xy-table-doc-pager">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Remote State</div>
        <div class="xy-table-doc-scene__value">
          第 {{ currentPage }} 页，展示 {{ visibleRange }} / {{ allRows.length }}
        </div>
      </div>

      <xy-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="allRows.length"
        :disabled="loading" background size="sm" @change="handlePagerChange" />
    </div>
  </div>
</template>