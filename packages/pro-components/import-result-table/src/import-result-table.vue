<script setup lang="ts">
import { defineComponent, h, useSlots } from "vue";
import { XyTag } from "@xiaoye/components";
import { XyProTable } from "../../pro-table";
import type { ImportResultTableProps } from "./import-result-table";

defineOptions({
  name: "XyImportResultTable"
});

const props = withDefaults(defineProps<ImportResultTableProps<any>>(), {
  data: () => [],
  columns: () => [],
  summary: undefined,
  loading: false
});

const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const ProTableRenderer = defineComponent({
  name: "XyImportResultTableRenderer",
  setup() {
    return () =>
      h(
        XyProTable,
        {
          title: "导入结果",
          description: "导入结束后用统一表格承接成功、失败和原因信息。",
          data: props.data,
          columns: props.columns,
          loading: props.loading,
          pagination: false
        },
        slots
      );
  }
});
</script>

<template>
  <div class="xy-import-result-table">
    <div v-if="props.summary" class="xy-import-result-table__summary">
      <xy-tag status="primary">总数 {{ props.summary.total }}</xy-tag>
      <xy-tag status="success">成功 {{ props.summary.success }}</xy-tag>
      <xy-tag status="danger">失败 {{ props.summary.failed }}</xy-tag>
    </div>
    <pro-table-renderer />
  </div>
</template>
