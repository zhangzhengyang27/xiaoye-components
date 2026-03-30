<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, useSlots } from "vue";
import { XyAlert, XyButton, XyTag } from "@xiaoye/components";
import { XyProTable } from "../../pro-table";
import { XySearchForm } from "../../search-form";
import type { ProTableInstance } from "../../pro-table";
import { createProRequestContext, normalizeProRequestResult } from "../../request-utils";
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
  pageSize: 10
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
const rows = ref<Record<string, unknown>[]>(props.data);
const total = ref(props.data.length);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const selectedRows = ref<Record<string, unknown>[]>([]);
const visibleToolbarActions = computed(() =>
  props.toolbarActions.filter((action) => action.visible !== false)
);
const normalBatchActions = computed(() => props.batchActions.filter((action) => !action.danger));
const dangerBatchActions = computed(() => props.batchActions.filter((action) => action.danger));

async function load(action = "load") {
  if (!props.request) {
    rows.value = props.data as Record<string, unknown>[];
    total.value = props.data.length;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await props.request(
      { ...(props.searchModel ?? {}) },
      createProRequestContext(action, { ...(props.searchModel ?? {}) }, currentPage.value, props.pageSize)
    );
    const normalized = normalizeProRequestResult(result);
    rows.value = normalized.data as Record<string, unknown>[];
    total.value = normalized.total;
    emit("request-success", rows.value);
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : "请求失败";
    emit("request-error", requestError);
  } finally {
    loading.value = false;
  }
}

function clearSelection() {
  tableRef.value?.clearSelection();
  selectedRows.value = [];
  emit("selection-change", []);
}

function handleSelectionChange(selection: Record<string, unknown>[]) {
  selectedRows.value = selection;
  emit("selection-change", selection);
}

function handleSearch() {
  currentPage.value = 1;
  void load("search");
}

function handleReset() {
  currentPage.value = 1;
  clearSelection();
  void load("reset");
}

function handleCurrentPageChange(value: number) {
  currentPage.value = value;
  void load("page-change");
}

function resolveBatchActionType(action: ListPageBatchAction) {
  if (action.type) {
    return action.type;
  }

  return action.danger ? "danger" : "default";
}

const ProTableRenderer = defineComponent({
  name: "XyListPageTableRenderer",
  setup() {
    return () =>
      h(
        XyProTable,
        {
          ref: tableRef,
          title: props.title ? `${props.title}列表` : "列表数据",
          description: props.description,
          data: rows.value,
          columns: props.columns,
          pagination: Boolean(props.request),
          total: total.value,
          currentPage: currentPage.value,
          pageSize: props.pageSize,
          tableProps: { rowKey: "id" },
          onSelectionChange: handleSelectionChange,
          "onUpdate:currentPage": handleCurrentPageChange
        },
        slots
      );
  }
});

const empty = computed(() => !loading.value && rows.value.length === 0);

onMounted(() => {
  if (props.immediate) {
    void load("initial");
  }
});

defineExpose({
  reload: () => load("reload"),
  refresh: () => load("refresh"),
  reset: async () => {
    currentPage.value = 1;
    clearSelection();
    await load("reset");
  },
  clearSelection
});
</script>

<template>
  <div class="xy-list-page">
    <div class="xy-list-page__toolbar">
      <div class="xy-list-page__toolbar-main">
        <div>
          <h3 v-if="props.title" class="xy-list-page__toolbar-title">{{ props.title }}</h3>
          <p v-if="props.description" class="xy-list-page__toolbar-description">
            {{ props.description }}
          </p>
        </div>
        <div v-if="$slots['toolbar-meta']" class="xy-list-page__toolbar-meta">
          <slot name="toolbar-meta" />
        </div>
      </div>
      <div class="xy-list-page__toolbar-actions">
        <slot name="toolbar-actions">
          <xy-button
            v-for="action in visibleToolbarActions"
            :key="action.key"
            :type="action.type"
            :plain="action.plain"
            :text="action.text"
            :link="action.link"
            :disabled="action.disabled"
            :loading="action.loading"
            :icon="action.icon"
            @click="emit('toolbar-action', action)"
          >
            {{ action.label }}
          </xy-button>
        </slot>
      </div>
    </div>

    <xy-search-form
      v-if="props.searchFields.length > 0"
      :model="props.searchModel"
      :fields="props.searchFields"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template v-if="$slots['search-meta']" #meta>
        <slot name="search-meta" />
      </template>
    </xy-search-form>

    <div
      v-if="props.batchActions.length > 0 && selectedRows.length > 0"
      class="xy-list-page__batch-bar"
    >
      <xy-alert
        class="xy-list-page__batch-alert"
        type="info"
        effect="light"
        :closable="false"
        show-icon
      >
        <template #title>
          <div class="xy-list-page__batch-title">
            <span>已选</span>
            <xy-tag status="primary" size="sm">{{ selectedRows.length }} 项</xy-tag>
          </div>
        </template>

        <div v-if="$slots['batch-summary']" class="xy-list-page__batch-summary">
          <slot name="batch-summary" :count="selectedRows.length" />
        </div>

        <template #actions>
          <div class="xy-list-page__batch-actions">
            <div class="xy-list-page__batch-actions-main">
              <xy-button
                v-for="action in normalBatchActions"
                :key="action.key"
                :type="resolveBatchActionType(action)"
                :disabled="action.disabled"
                :loading="action.loading"
                :icon="action.icon"
                @click="emit('batch-action', action, selectedRows)"
              >
                {{ action.label }}
              </xy-button>
            </div>
            <div v-if="dangerBatchActions.length > 0" class="xy-list-page__batch-danger">
              <xy-button
                v-for="action in dangerBatchActions"
                :key="action.key"
                :type="resolveBatchActionType(action)"
                :disabled="action.disabled"
                :loading="action.loading"
                :icon="action.icon"
                @click="emit('batch-action', action, selectedRows)"
              >
                {{ action.label }}
              </xy-button>
            </div>
            <xy-button text @click="clearSelection">清空选择</xy-button>
          </div>
        </template>
      </xy-alert>
    </div>

    <xy-async-state-container
      :loading="loading"
      :error="error"
      :empty="empty"
      @retry="load('retry')"
    >
      <pro-table-renderer />
    </xy-async-state-container>
  </div>
</template>
