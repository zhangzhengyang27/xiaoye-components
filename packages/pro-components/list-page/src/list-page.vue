<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { XyProTable } from "../../pro-table";
import type { ProTableInstance } from "../../pro-table";
import type { ProPageAction } from "../../core";
import type { ListPageBatchAction, ListPageProps } from "./list-page";

defineOptions({
  name: "XyListPage"
});

const props = withDefaults(defineProps<ListPageProps<any>>(), {
  title: "",
  description: "",
  searchModel: () => ({}),
  searchFields: () => [],
  data: () => [],
  columns: () => [],
  request: undefined,
  toolbarActions: () => [],
  batchActions: () => [],
  immediate: true,
  pageSize: 10,
  workbench: () => ({}),
  editable: undefined,
  virtual: undefined
});

const emit = defineEmits<{
  "toolbar-action": [action: ProPageAction];
  "batch-action": [action: ListPageBatchAction, selection: Record<string, unknown>[]];
  "selection-change": [selection: Record<string, unknown>[]];
  "request-success": [payload: Record<string, unknown>[]];
  "request-error": [error: unknown];
}>();

const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const tableRef = ref<ProTableInstance<any> | null>(null);
const visibleToolbarActions = computed(() =>
  props.toolbarActions.filter((action) => action.visible !== false)
);

function handleBatchAction(action: ListPageBatchAction, selection: Record<string, unknown>[]) {
  emit("batch-action", action, selection);
}

defineExpose({
  reload: () => tableRef.value?.reload() ?? Promise.resolve(),
  refresh: () => tableRef.value?.refresh() ?? Promise.resolve(),
  reset: () => tableRef.value?.reset() ?? Promise.resolve(),
  clearSelection: () => tableRef.value?.clearSelection()
});
</script>

<template>
  <xy-pro-table
    ref="tableRef"
    :title="props.title"
    :description="props.description"
    :data="props.data"
    :columns="props.columns"
    :toolbar-actions="visibleToolbarActions"
    :batch-actions="props.batchActions"
    :workbench="props.workbench"
    :editable="props.editable"
    :virtual="props.virtual"
    :request="
      props.request
        ? {
            request: props.request,
            immediate: props.immediate
          }
        : undefined
    "
    :views="
      props.searchFields.length > 0
        ? {
            searchModel: props.searchModel,
            searchFields: props.searchFields
          }
        : undefined
    "
    :table-props="{ rowKey: 'id' }"
    :pagination="Boolean(props.request)"
    :page-size="props.pageSize"
    @toolbar-action="emit('toolbar-action', $event)"
    @batch-action="handleBatchAction"
    @selection-change="emit('selection-change', $event)"
    @request-success="emit('request-success', $event)"
    @request-error="emit('request-error', $event)"
  >
    <template v-if="$slots['toolbar-main']" #toolbar-main>
      <slot name="toolbar-main" />
    </template>
    <template v-if="$slots['toolbar-left']" #toolbar-left>
      <slot name="toolbar-left" />
    </template>
    <template #toolbar-right>
      <slot name="toolbar-meta" />
      <slot name="toolbar-right" />
    </template>
    <template v-if="$slots.search" #search>
      <slot name="search" />
    </template>
    <template v-if="$slots['footer-meta']" #footer-meta>
      <slot name="footer-meta" />
    </template>
    <template v-if="$slots.loading" #loading="slotProps">
      <slot name="loading" v-bind="slotProps" />
    </template>
    <template v-if="$slots.empty" #empty="slotProps">
      <slot name="empty" v-bind="slotProps" />
    </template>
    <template
      v-for="(_, name) in slots"
      #[name]="slotProps"
      :key="name"
    >
      <slot
        v-if="!['toolbar-main', 'toolbar-left', 'toolbar-right', 'toolbar-meta', 'search', 'footer-meta', 'loading', 'empty'].includes(String(name))"
        :name="name"
        v-bind="slotProps"
      />
    </template>
  </xy-pro-table>
</template>
