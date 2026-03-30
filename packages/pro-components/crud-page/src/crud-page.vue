<script setup lang="ts">
import { computed, defineComponent, h, ref, useSlots, type VNodeChild } from "vue";
import { XyButton } from "@xiaoye/components";
import { XyDetailPanel } from "../../detail-panel";
import { XyListPage } from "../../list-page";
import { XyOverlayForm } from "../../overlay-form";
import type { ListPageBatchAction } from "../../list-page";
import type { ProPageAction } from "../../core";
import type { CrudPageProps } from "./crud-page";

defineOptions({
  name: "XyCrudPage"
});

const props = withDefaults(defineProps<CrudPageProps<any>>(), {
  title: "",
  description: "",
  searchModel: () => ({}),
  searchFields: () => [],
  data: () => [],
  columns: () => [],
  toolbarActions: () => [],
  batchActions: () => [],
  formSchema: () => [],
  formRules: () => ({}),
  formType: "drawer",
  detailType: "drawer"
});

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>];
  "open-create": [];
  "open-edit": [row: Record<string, unknown>];
  "open-detail": [row: Record<string, unknown>];
  "toolbar-action": [action: ProPageAction];
  "batch-action": [action: ListPageBatchAction, selection: Record<string, unknown>[]];
  "selection-change": [selection: Record<string, unknown>[]];
  "request-success": [payload: Record<string, unknown>[]];
  "request-error": [error: unknown];
}>();

const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const formModel = props.formModel as Record<string, unknown>;
const formOpen = ref(false);
const detailOpen = ref(false);
const currentRow = ref<Record<string, unknown> | null>(null);
const listPageSlots = computed(() => ({
  ...slots,
  actions: ({ row }: { row: Record<string, unknown> }) => {
    const children: VNodeChild[] = [];

    if (props.detailType !== "none") {
      children.push(
        h(
          XyButton,
          {
            text: true,
            onClick: () => openDetail(row)
          },
          () => "查看"
        )
      );
    }

    children.push(
      h(
        XyButton,
        {
          text: true,
          onClick: () => openEdit(row)
        },
        () => "编辑"
      )
    );

    const customActions = slots.actions?.({ row });

    if (customActions !== undefined) {
      children.push(customActions as VNodeChild);
    }

    return h("div", { class: "xy-crud-page__actions" }, children);
  }
}));

function openCreate() {
  currentRow.value = null;
  formOpen.value = true;
  emit("open-create");
}

function openEdit(row: Record<string, unknown>) {
  currentRow.value = row;
  Object.assign(formModel, row);
  formOpen.value = true;
  emit("open-edit", row);
}

function openDetail(row: Record<string, unknown>) {
  currentRow.value = row;
  detailOpen.value = true;
  emit("open-detail", row);
}

function handleToolbarAction(action: ProPageAction) {
  if (action.key === "create") {
    openCreate();
    return;
  }

  emit("toolbar-action", action);
}

function handleBatchAction(
  action: ListPageBatchAction,
  selection: Record<string, unknown>[]
) {
  emit("batch-action", action, selection);
}

const ListPageRenderer = defineComponent({
  name: "XyCrudPageListRenderer",
  setup() {
    return () =>
      h(
        XyListPage,
        {
          title: props.title,
          description: props.description,
          searchModel: props.searchModel,
          searchFields: props.searchFields,
          data: props.data,
          columns: props.columns,
          toolbarActions: [{ key: "create", label: "新建", type: "primary" }, ...props.toolbarActions],
          batchActions: props.batchActions,
          onToolbarAction: handleToolbarAction,
          onBatchAction: handleBatchAction,
          onSelectionChange: (selection: Record<string, unknown>[]) =>
            emit("selection-change", selection),
          onRequestSuccess: (payload: Record<string, unknown>[]) =>
            emit("request-success", payload),
          onRequestError: (error: unknown) => emit("request-error", error)
        },
        listPageSlots.value
      );
  }
});
</script>

<template>
  <div class="xy-crud-page">
    <list-page-renderer />

    <xy-overlay-form
      v-model:open="formOpen"
      :container="props.formType === 'drawer' ? 'drawer' : 'modal'"
      :mode="currentRow ? 'edit' : 'create'"
      title="编辑内容"
      :model="formModel"
      :schema="props.formSchema"
      :rules="props.formRules"
      @submit="emit('submit', $event.model)"
    >
      <slot name="form" :row="currentRow" :model="formModel" />
    </xy-overlay-form>

    <xy-detail-panel
      v-if="props.detailType !== 'none'"
      v-model:open="detailOpen"
      :container="props.detailType === 'dialog' ? 'dialog' : 'drawer'"
      :title="String(currentRow?.name ?? '详情信息')"
    >
      <slot name="detail" :row="currentRow" />
    </xy-detail-panel>
  </div>
</template>
