<script setup lang="ts">
import { ref } from "vue";

const loading = ref(true);
const showEmpty = ref(false);
const rows = [
  { id: 1, name: "Billing Console", owner: "Xiaoye" },
  { id: 2, name: "Sales Admin", owner: "Alice" }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="loading = !loading">{{ loading ? "关闭加载态" : "开启加载态" }}</xy-button>
      <xy-button plain @click="showEmpty = !showEmpty">{{ showEmpty ? "恢复数据" : "查看空态" }}</xy-button>
    </xy-space>

    <xy-table
      :data="showEmpty ? [] : rows"
      :loading="loading"
      border
      loading-text="正在同步项目列表"
    >
      <xy-table-column prop="name" label="项目名称" />
      <xy-table-column prop="owner" label="负责人" />
      <template #loading>
        正在同步项目数据，请稍候...
      </template>
      <template #empty>
        <xy-empty title="暂无项目" description="当前筛选条件没有返回结果">
          <xy-button plain @click="showEmpty = false">恢复数据</xy-button>
        </xy-empty>
      </template>
    </xy-table>
  </div>
</template>
