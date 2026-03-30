<script setup lang="ts">
import { XyButton, XyDrawer } from "@xiaoye/components";
import { XyProForm } from "../../pro-form";
import type { TableFilterDrawerProps } from "./table-filter-drawer";

defineOptions({
  name: "XyTableFilterDrawer"
});

const props = withDefaults(defineProps<TableFilterDrawerProps>(), {
  open: false,
  title: "筛选条件",
  fields: () => [],
  drawerProps: () => ({})
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  apply: [payload: Record<string, unknown>];
  reset: [payload: Record<string, unknown>];
  closed: [];
}>();

function close() {
  emit("update:open", false);
}
</script>

<template>
  <xy-drawer
    v-bind="props.drawerProps"
    :model-value="props.open"
    :title="props.title"
    :size="props.drawerProps?.size ?? 420"
    class="xy-table-filter-drawer"
    @update:model-value="emit('update:open', $event)"
    @closed="emit('closed')"
  >
    <xy-pro-form
      :model="props.model"
      :schema="props.fields"
      :show-submit="false"
      :show-reset="false"
    />

    <template #footer>
      <div class="xy-table-filter-drawer__footer">
        <xy-button
          @click="
            () => {
              emit('reset', { ...props.model });
              close();
            }
          "
        >
          重置
        </xy-button>
        <xy-button
          type="primary"
          @click="
            () => {
              emit('apply', { ...props.model });
              close();
            }
          "
        >
          应用筛选
        </xy-button>
      </div>
    </template>
  </xy-drawer>
</template>
