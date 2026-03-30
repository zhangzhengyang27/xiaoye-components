<script setup lang="ts">
import { computed, ref } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyButton, XyCard } from "@xiaoye/components";
import type { FilterPanelProps } from "./filter-panel";

defineOptions({
  name: "XyFilterPanel"
});

const props = withDefaults(defineProps<FilterPanelProps>(), {
  title: "",
  description: "",
  collapsed: undefined,
  defaultCollapsed: false,
  collapsible: true
});

const emit = defineEmits<{
  "update:collapsed": [value: boolean];
  toggle: [value: boolean];
}>();

const ns = useNamespace("filter-panel");
const innerCollapsed = ref(props.defaultCollapsed);
const collapsedBridge = computed(() => props.collapsed ?? innerCollapsed.value);

function toggleCollapse() {
  const nextValue = !collapsedBridge.value;

  if (props.collapsed === undefined) {
    innerCollapsed.value = nextValue;
  }

  emit("update:collapsed", nextValue);
  emit("toggle", nextValue);
}
</script>

<template>
  <xy-card :class="ns.base.value">
    <template #header>
      <div class="xy-filter-panel__header">
        <div class="xy-filter-panel__heading">
          <div v-if="props.title" class="xy-filter-panel__title">{{ props.title }}</div>
          <p v-if="props.description" class="xy-filter-panel__description">{{ props.description }}</p>
        </div>
        <div class="xy-filter-panel__meta">
          <slot name="meta" />
          <xy-button v-if="props.collapsible" text @click="toggleCollapse">
            {{ collapsedBridge ? "展开筛选" : "收起筛选" }}
          </xy-button>
        </div>
      </div>
    </template>

    <div v-show="!collapsedBridge" class="xy-filter-panel__body">
      <slot />
    </div>

    <div v-if="$slots.actions" class="xy-filter-panel__footer">
      <slot name="actions" />
    </div>
  </xy-card>
</template>
