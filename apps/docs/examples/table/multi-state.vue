<script setup lang="ts">
import { computed, ref } from "vue";
import { defineTableColumns } from "xiaoye-components";

type ViewState = "ready" | "loading" | "empty" | "error";

interface ProjectRow {
  id: number;
  name: string;
  owner: string;
}

const state = ref<ViewState>("ready");
const rows: ProjectRow[] = [
  { id: 1, name: "账单核对", owner: "Xiaoye" },
  { id: 2, name: "客户旅程", owner: "Alice" }
];

const columns = defineTableColumns<ProjectRow>([
  { key: "name", title: "项目名称", dataIndex: "name" },
  { key: "owner", title: "负责人", dataIndex: "owner" }
]);

const visibleRows = computed(() => (state.value === "ready" ? rows : []));
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain :type="state === 'ready' ? 'primary' : 'default'" @click="state = 'ready'">
        正常数据
      </xy-button>
      <xy-button
        plain
        :type="state === 'loading' ? 'primary' : 'default'"
        @click="state = 'loading'"
      >
        加载中
      </xy-button>
      <xy-button plain :type="state === 'empty' ? 'primary' : 'default'" @click="state = 'empty'">
        空数据
      </xy-button>
      <xy-button plain :type="state === 'error' ? 'primary' : 'default'" @click="state = 'error'">
        错误态
      </xy-button>
    </xy-space>

    <xy-table
      :columns="columns"
      :data="visibleRows"
      :loading="state === 'loading'"
      loading-text="正在拉取最新列表"
    >
      <template #empty>
        <xy-empty
          :title="state === 'error' ? '加载失败' : '暂无结果'"
          :description="
            state === 'error' ? '请检查筛选条件或稍后重试。' : '当前筛选条件下没有匹配项目。'
          "
        >
          <xy-button plain @click="state = 'ready'">
            {{ state === "error" ? "重新加载" : "恢复数据" }}
          </xy-button>
        </xy-empty>
      </template>
    </xy-table>
  </div>
</template>
