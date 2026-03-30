<script setup lang="ts">
import { computed, ref } from "vue"

interface ProjectRow {
  id: number
  name: string
  owner: string
  status: "上线中" | "排期中" | "已归档"
  score: number
}

const rows: ProjectRow[] = [
  { id: 1, name: "订单中心", owner: "Xiaoye", status: "上线中", score: 96 },
  { id: 2, name: "线索看板", owner: "Alice", status: "排期中", score: 88 },
  { id: 3, name: "结算后台", owner: "Jason", status: "已归档", score: 74 },
  { id: 4, name: "权限平台", owner: "Xiaoye", status: "上线中", score: 91 }
]

const keyword = ref("")
const sortFeedback = ref("未排序")
const filterFeedback = ref("全部状态")

const filteredRows = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()

  return rows.filter((row) => {
    return (
      normalizedKeyword.length === 0 ||
      row.name.toLowerCase().includes(normalizedKeyword) ||
      row.owner.toLowerCase().includes(normalizedKeyword)
    )
  })
})

function handleSortChange(payload: { prop?: string; order?: "ascending" | "descending" | null }) {
  if (!payload.order || !payload.prop) {
    sortFeedback.value = "未排序"
    return
  }

  sortFeedback.value = `${payload.prop} ${payload.order === "ascending" ? "升序" : "降序"}`
}

function handleFilterChange(filters: Record<string, Array<string | number | boolean>>) {
  const values = filters.status ?? []
  filterFeedback.value = values.length > 0 ? values.join(" / ") : "全部状态"
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <xy-input v-model="keyword" placeholder="搜索项目名称或负责人" />

    <div class="xy-table-doc-toolbar">
      <div class="xy-table-doc-toolbar__group">
        <div class="xy-table-doc-toolbar__chip">
          <span>内置筛选</span>
          <strong>{{ filterFeedback }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>内置排序</span>
          <strong>{{ sortFeedback }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>关键字过滤</span>
          <strong>{{ keyword || "未输入" }}</strong>
        </div>
        <div class="xy-table-doc-toolbar__chip">
          <span>筛选提交</span>
          <strong>点击确定</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table :data="filteredRows" row-key="id" border @sort-change="handleSortChange"
        @filter-change="handleFilterChange">
        <xy-table-column prop="name" label="项目名称" min-width="170" sortable show-overflow-tooltip />
        <xy-table-column prop="owner" label="负责人" width="110" />
        <xy-table-column prop="status" label="状态" width="120" column-key="status" filter-multiple :filters="[
          { text: '上线中', value: '上线中' },
          { text: '排期中', value: '排期中' },
          { text: '已归档', value: '已归档' }
        ]">
          <template #default="{ value }">
            <xy-tag :status="value === '上线中' ? 'success' : value === '排期中' ? 'warning' : 'neutral'">
              {{ value }}
            </xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column prop="score" label="健康度" width="110" align="right" sortable />
      </xy-table>
    </div>
  </div>
</template>