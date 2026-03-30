<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyButton from "../../button";
import XyCheckbox from "../../checkbox";
import XyInput from "../../input";
import XyEmpty from "../../empty";
import type { TransferItem, TransferKey, TransferProps } from "./transfer";

const props = withDefaults(defineProps<TransferProps>(), {
  modelValue: () => [],
  data: () => [],
  titles: () => ["源列表", "目标列表"],
  disabled: false,
  filterable: false,
  filterPlaceholder: "搜索条目",
  size: undefined
});

const emit = defineEmits<{
  "update:modelValue": [value: TransferKey[]];
  change: [value: TransferKey[]];
}>();

const ns = useNamespace("transfer");
const { size: globalSize } = useConfig();
const mergedSize = computed(() => props.size ?? globalSize.value);
const sourceKeyword = ref("");
const targetKeyword = ref("");
const leftChecked = ref<TransferKey[]>([]);
const rightChecked = ref<TransferKey[]>([]);

const targetKeySet = computed(() => new Set(props.modelValue));

const sourceItems = computed(() =>
  props.data.filter((item) => !targetKeySet.value.has(item.key))
);

const targetItems = computed(() =>
  props.data.filter((item) => targetKeySet.value.has(item.key))
);

function filterItems(items: TransferItem[], keyword: string) {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) =>
    `${item.label} ${item.description ?? ""}`.toLowerCase().includes(normalized)
  );
}

const visibleSourceItems = computed(() => filterItems(sourceItems.value, sourceKeyword.value));
const visibleTargetItems = computed(() => filterItems(targetItems.value, targetKeyword.value));

const enabledLeftChecked = computed(() =>
  leftChecked.value.filter((key) => sourceItems.value.some((item) => item.key === key && !item.disabled))
);
const enabledRightChecked = computed(() =>
  rightChecked.value.filter((key) => targetItems.value.some((item) => item.key === key && !item.disabled))
);

function isChecked(side: "left" | "right", key: TransferKey) {
  return (side === "left" ? leftChecked.value : rightChecked.value).includes(key);
}

function toggleChecked(side: "left" | "right", key: TransferKey, checked: boolean) {
  const target = side === "left" ? leftChecked : rightChecked;

  if (checked) {
    if (!target.value.includes(key)) {
      target.value = target.value.concat(key);
    }
    return;
  }

  target.value = target.value.filter((item) => item !== key);
}

function moveToRight() {
  if (props.disabled || !enabledLeftChecked.value.length) {
    return;
  }

  const nextValue = Array.from(new Set([...props.modelValue, ...enabledLeftChecked.value]));
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
  leftChecked.value = [];
}

function moveToLeft() {
  if (props.disabled || !enabledRightChecked.value.length) {
    return;
  }

  const removedKeys = new Set(enabledRightChecked.value);
  const nextValue = props.modelValue.filter((key) => !removedKeys.has(key));
  emit("update:modelValue", nextValue);
  emit("change", nextValue);
  rightChecked.value = [];
}

watch(
  () => props.modelValue,
  () => {
    leftChecked.value = leftChecked.value.filter((key) =>
      sourceItems.value.some((item) => item.key === key)
    );
    rightChecked.value = rightChecked.value.filter((key) =>
      targetItems.value.some((item) => item.key === key)
    );
  }
);
</script>

<template>
  <div :class="[ns.base.value, `${ns.base.value}--${mergedSize}`, props.disabled ? 'is-disabled' : '']">
    <section class="xy-transfer__panel">
      <header class="xy-transfer__panel-header">
        <strong>{{ props.titles[0] }}</strong>
        <span>{{ sourceItems.length }}</span>
      </header>
      <div v-if="props.filterable" class="xy-transfer__panel-filter">
        <xy-input
          :model-value="sourceKeyword"
          :placeholder="props.filterPlaceholder"
          clearable
          :disabled="props.disabled"
          :validate-event="false"
          @update:model-value="sourceKeyword = String($event ?? '')"
        />
      </div>
      <div class="xy-transfer__panel-body">
        <template v-if="visibleSourceItems.length">
          <label
            v-for="item in visibleSourceItems"
            :key="String(item.key)"
            class="xy-transfer__item"
            :class="item.disabled ? 'is-disabled' : ''"
          >
            <xy-checkbox
              :model-value="isChecked('left', item.key)"
              :disabled="props.disabled || item.disabled"
              :validate-event="false"
              @update:model-value="toggleChecked('left', item.key, Boolean($event))"
            />
            <div class="xy-transfer__item-content">
              <slot name="default" :item="item" :checked="isChecked('left', item.key)" :side="'left'">
                <span class="xy-transfer__item-label">{{ item.label }}</span>
                <small v-if="item.description" class="xy-transfer__item-description">
                  {{ item.description }}
                </small>
              </slot>
            </div>
          </label>
        </template>
        <xy-empty v-else title="暂无条目" description="左侧列表没有可展示内容" />
      </div>
    </section>

    <div class="xy-transfer__actions">
      <xy-button :disabled="props.disabled || !enabledLeftChecked.length" @click="moveToRight">
        &gt;
      </xy-button>
      <xy-button :disabled="props.disabled || !enabledRightChecked.length" @click="moveToLeft">
        &lt;
      </xy-button>
    </div>

    <section class="xy-transfer__panel">
      <header class="xy-transfer__panel-header">
        <strong>{{ props.titles[1] }}</strong>
        <span>{{ targetItems.length }}</span>
      </header>
      <div v-if="props.filterable" class="xy-transfer__panel-filter">
        <xy-input
          :model-value="targetKeyword"
          :placeholder="props.filterPlaceholder"
          clearable
          :disabled="props.disabled"
          :validate-event="false"
          @update:model-value="targetKeyword = String($event ?? '')"
        />
      </div>
      <div class="xy-transfer__panel-body">
        <template v-if="visibleTargetItems.length">
          <label
            v-for="item in visibleTargetItems"
            :key="String(item.key)"
            class="xy-transfer__item"
            :class="item.disabled ? 'is-disabled' : ''"
          >
            <xy-checkbox
              :model-value="isChecked('right', item.key)"
              :disabled="props.disabled || item.disabled"
              :validate-event="false"
              @update:model-value="toggleChecked('right', item.key, Boolean($event))"
            />
            <div class="xy-transfer__item-content">
              <slot name="default" :item="item" :checked="isChecked('right', item.key)" :side="'right'">
                <span class="xy-transfer__item-label">{{ item.label }}</span>
                <small v-if="item.description" class="xy-transfer__item-description">
                  {{ item.description }}
                </small>
              </slot>
            </div>
          </label>
        </template>
        <xy-empty v-else title="暂无条目" description="右侧列表没有可展示内容" />
      </div>
    </section>
  </div>
</template>
