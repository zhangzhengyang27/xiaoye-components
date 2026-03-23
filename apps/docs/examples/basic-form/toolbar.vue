<script setup lang="ts">
import { ref } from "vue";

const keyword = ref("");
const status = ref<string | number | null>("active");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input v-model="keyword" clearable placeholder="搜索成员 / 项目" />
      <xy-select
        v-model="status"
        :options="[
          { label: '全部状态', value: 'all' },
          { label: '已启用', value: 'active' },
          { label: '已停用', value: 'inactive' }
        ]"
        searchable
        clearable
        placeholder="状态筛选"
      />
      <xy-button type="primary">新建成员</xy-button>
      <xy-button plain>导出数据</xy-button>
    </xy-space>
    <xy-tag status="primary">关键字：{{ keyword || "空" }} / 状态：{{ status ?? "未选择" }}</xy-tag>
  </div>
</template>
