<script setup lang="ts">
import { XyTabs } from "@xiaoye/components";
import type { SavedViewTabItem, SavedViewTabsProps } from "./saved-view-tabs";

defineOptions({
  name: "XySavedViewTabs"
});

const props = withDefaults(defineProps<SavedViewTabsProps>(), {
  items: () => [],
  activeKey: "",
  addable: false
});

const emit = defineEmits<{
  "update:activeKey": [value: string];
  select: [item: SavedViewTabItem];
  remove: [item: SavedViewTabItem];
  create: [];
}>();

function handleChange(nextKey: string) {
  const target = props.items.find((item) => item.key === nextKey);

  if (!target) {
    return;
  }

  emit("update:activeKey", nextKey);
  emit("select", target);
}
</script>

<template>
  <xy-tabs
    :model-value="props.activeKey"
    :items="
      props.items.map((item) => ({
        key: item.key,
        label: item.count !== undefined ? `${item.label} (${item.count})` : item.label,
        closable: item.closable
      }))
    "
    editable
    @change="handleChange"
    @tab-remove="
      (key) => {
        const target = props.items.find((item) => item.key === key);
        if (target) emit('remove', target);
      }
    "
    @tab-add="emit('create')"
  >
    <template #default>
      <slot />
    </template>
  </xy-tabs>
</template>
