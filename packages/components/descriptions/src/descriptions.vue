<script setup lang="ts">
import { computed, provide, ref, useSlots } from "vue";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyCollapseTransition from "../../collapse-transition";
import XyIcon from "../../icon";
import XyLink from "../../link";
import XyTag from "../../tag";
import DescriptionsItem from "./descriptions-item.vue";
import type { DescriptionsDataItem, DescriptionsProps } from "./descriptions";
import { descriptionsKey } from "./context";

const props = withDefaults(defineProps<DescriptionsProps>(), {
  column: 3,
  border: false,
  size: undefined,
  title: "",
  extra: "",
  labelWidth: undefined,
  direction: "horizontal",
  collapse: false,
  items: () => []
});

const ns = useNamespace("descriptions");
const { size: globalSize } = useConfig();
const slots = useSlots() as Record<string, ((payload?: unknown) => unknown) | undefined>;
const mergedSize = computed(() => props.size ?? globalSize.value);
const gridTemplateColumns = computed(() => `repeat(${Math.max(props.column, 1)}, minmax(0, 1fr))`);
const normalizedItems = computed(() => props.items ?? []);
const collapsed = ref(props.collapse);

function resolveTagText(item: DescriptionsDataItem) {
  if (typeof item.tag === "string") {
    return item.tag;
  }

  return item.tag?.text ?? String(item.value ?? "");
}

function resolveTagProps(item: DescriptionsDataItem) {
  if (!item.tag || typeof item.tag === "string") {
    return undefined;
  }

  return item.tag.props;
}

function toggleCollapse() {
  if (!props.collapse) {
    return;
  }

  collapsed.value = !collapsed.value;
}

provide(descriptionsKey, {
  border: computed(() => props.border),
  direction: computed(() => props.direction),
  labelWidth: computed(() => props.labelWidth),
  size: mergedSize
});
</script>

<template>
  <div
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      props.border ? 'is-bordered' : '',
      `is-${props.direction}`
    ]"
  >
    <div v-if="props.title || props.extra || $slots.title || $slots.extra" class="xy-descriptions__header">
      <div class="xy-descriptions__title">
        <slot name="title">
          <div class="xy-descriptions__title-main">
            <span>{{ props.title }}</span>
            <button
              v-if="props.collapse"
              type="button"
              class="xy-descriptions__toggle"
              @click="toggleCollapse"
            >
              <XyIcon
                icon="mdi:chevron-down"
                :class="['xy-descriptions__toggle-icon', collapsed ? 'is-collapsed' : '']"
                :size="14"
              />
            </button>
          </div>
        </slot>
      </div>
      <div class="xy-descriptions__extra">
        <slot name="extra">{{ props.extra }}</slot>
      </div>
    </div>
    <xy-collapse-transition>
      <div v-show="!collapsed" class="xy-descriptions__body" :style="{ gridTemplateColumns }">
        <slot v-if="normalizedItems.length === 0" />
        <descriptions-item
          v-for="item in normalizedItems"
          v-else
          :key="`${item.label}-${item.value ?? ''}`"
          :label="item.label"
          :span="item.span"
          :class-name="item.className"
          :label-class-name="item.labelClassName"
          :content-class-name="item.contentClassName"
        >
          <template #label>
            <slot v-if="item.labelSlot && slots[item.labelSlot]" :name="item.labelSlot" :item="item" />
            <span v-else class="xy-descriptions__item-label">
              <xy-icon v-if="item.icon" :icon="item.icon" :size="14" />
              {{ item.label }}
            </span>
          </template>
          <slot
            v-if="item.defaultSlot && slots[item.defaultSlot]"
            :name="item.defaultSlot"
            :item="item"
          />
          <xy-tag v-else-if="item.tag" v-bind="resolveTagProps(item)">
            {{ resolveTagText(item) }}
          </xy-tag>
          <xy-link v-else-if="item.link" v-bind="item.link">
            {{ item.value }}
          </xy-link>
          <template v-else>
            {{ item.value }}
          </template>
        </descriptions-item>
      </div>
    </xy-collapse-transition>
  </div>
</template>
