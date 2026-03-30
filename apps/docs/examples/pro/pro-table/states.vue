<script setup lang="ts">
import { ref } from "vue";
import type { ProTableColumn } from "@xiaoye/pro-components";

interface Row {
  id: number;
  name: string;
  status: "启用" | "停用";
}

const loading = ref(true);
const rows = ref<Row[]>([]);

const columns: ProTableColumn<Row>[] = [
  {
    prop: "name",
    label: "名称"
  },
  {
    prop: "status",
    label: "状态"
  }
];
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <xy-button-group>
      <xy-button :type="loading ? 'primary' : 'default'" @click="loading = true">显示 Loading</xy-button>
      <xy-button :type="!loading && rows.length === 0 ? 'primary' : 'default'" @click="(loading = false), (rows = [])">
        显示 Empty
      </xy-button>
      <xy-button
        :type="!loading && rows.length > 0 ? 'primary' : 'default'"
        @click="
          (loading = false),
            (rows = [{ id: 1, name: '账单中心', status: '启用' }])
        "
      >
        显示数据
      </xy-button>
    </xy-button-group>

    <xy-pro-table
      title="状态优先级"
      description="只要 loading=true，就优先显示 loading；loading 关闭后才会根据数据量决定是否显示 empty。"
      :data="rows"
      :columns="columns"
      :loading="loading"
      :table-props="{ rowKey: 'id' }"
    >
      <template #loading>
        <div class="pro-table-states__panel">当前为 loading 态</div>
      </template>
      <template #empty>
        <div class="pro-table-states__panel">当前为 empty 态</div>
      </template>
    </xy-pro-table>
  </div>
</template>

<style scoped>
.pro-table-states__panel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 0;
  color: var(--xy-text-color-secondary);
}
</style>
