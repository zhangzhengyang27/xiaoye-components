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
const total = ref(allRows.length)
const keyword = ref("")
const appliedKeyword = ref("")
const sortProp = ref<string | undefined>("score")
const sortOrder = ref<"ascending" | "descending" | null>("ascending")
const statusFilters = ref<Array<string | number | boolean>>(["上线中", "排期中"])
let requestToken = 0

const visibleRange = computed(() => {
  if (!total.value) {
    return "0 - 0"
  }

  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, total.value)
  return `${start} - ${end}`
})
const sortSummary = computed(() => `${sortProp.value ?? "none"} / ${sortOrder.value ?? "none"}`)
const statusSummary = computed(() =>
  statusFilters.value.length > 0 ? statusFilters.value.join(" / ") : "全部状态"
)
const querySummary = computed(() => appliedKeyword.value || "未输入")

async function requestRows(page = currentPage.value, size = pageSize.value) {
  const token = ++requestToken
  loading.value = true

  await new Promise((resolve) => {
    window.setTimeout(resolve, 520)
  })

  const normalizedKeyword = appliedKeyword.value.trim().toLowerCase()
  const filteredRows = allRows.filter((row) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 ||
      row.name.toLowerCase().includes(normalizedKeyword) ||
      row.owner.toLowerCase().includes(normalizedKeyword)
    const matchesStatus =
      statusFilters.value.length === 0 || statusFilters.value.includes(row.status)

    return matchesKeyword && matchesStatus
  })

  const sortedRows = filteredRows.slice()

  if (sortProp.value === "score" && sortOrder.value) {
    sortedRows.sort((left, right) =>
      sortOrder.value === "ascending" ? left.score - right.score : right.score - left.score
    )
  }

  if (token !== requestToken) {
    return
  }

  const start = (page - 1) * size
  total.value = sortedRows.length
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

async function handleFilterChange(filters: Record<string, Array<string | number | boolean>>) {
  statusFilters.value = filters.status ?? []
  currentPage.value = 1
  await requestRows(1, pageSize.value)
}

async function applyKeywordSearch() {
  appliedKeyword.value = keyword.value.trim()
  currentPage.value = 1
  await requestRows(1, pageSize.value)
}

async function showOnlineOnly() {
  statusFilters.value = ["上线中"]
  currentPage.value = 1
  await requestRows(1, pageSize.value)
}

async function resetQueryState() {
  keyword.value = ""
  appliedKeyword.value = ""
  sortProp.value = "score"
  sortOrder.value = "ascending"
  statusFilters.value = ["上线中", "排期中"]
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
          <span>总数</span>
          <strong>{{ total }}</strong>
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

    <div class="xy-table-doc-search">
      <xy-input v-model="keyword" placeholder="搜索项目名称或负责人" @keyup.enter="applyKeywordSearch" />
      <xy-space wrap>
        <xy-button plain size="sm" :loading="loading" @click="applyKeywordSearch">查询</xy-button>
        <xy-button text size="sm" @click="showOnlineOnly">仅看上线中</xy-button>
        <xy-button text size="sm" @click="resetQueryState">重置查询状态</xy-button>
      </xy-space>
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
        <div class="xy-table-doc-toolbar__chip">
          <span>filter</span>
          <strong>{{ statusSummary }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>query</span>
          <strong>{{ querySummary }}</strong>
        </div>
      </div>

      <xy-button plain size="sm" :loading="loading" @click="refreshCurrentPage">刷新当前页</xy-button>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table
        :data="rows"
        :loading="loading"
        row-key="id"
        border
        :sort-prop="sortProp"
        :sort-order="sortOrder"
        loading-text="正在同步当前页数据"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
      >
        <xy-table-column prop="name" label="项目名称" min-width="170" show-overflow-tooltip />
        <xy-table-column prop="owner" label="负责人" width="110" />
        <xy-table-column
          prop="status"
          label="状态"
          width="120"
          column-key="status"
          :filtered-value="statusFilters"
          :filters="[
            { text: '上线中', value: '上线中' },
            { text: '排期中', value: '排期中' },
            { text: '已归档', value: '已归档' }
          ]"
        >
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
          第 {{ currentPage }} 页，展示 {{ visibleRange }} / {{ total }}，查询词为 {{ querySummary }}
        </div>
      </div>

      <xy-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        :disabled="loading" background size="sm" @change="handlePagerChange" />
    </div>
  </div>
</template>

<style scoped>
.xy-table-doc-search {
  display: grid;
  gap: 12px;
}
</style>
