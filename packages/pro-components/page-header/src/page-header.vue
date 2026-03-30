<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyIcon } from "@xiaoye/components";
import type { PageHeaderProps } from "./page-header";

defineOptions({
  name: "XyPageHeader"
});

const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: "",
  description: "",
  metaItems: () => [],
  divider: false,
  bordered: false
});

const ns = useNamespace("page-header");
const rootClasses = computed(() => [
  ns.base.value,
  props.bordered ? "is-bordered" : "",
  props.divider ? "is-divider" : ""
]);
</script>

<template>
  <header :class="rootClasses">
    <div class="xy-page-header__main">
      <div class="xy-page-header__heading">
        <slot name="title">
          <h2 v-if="props.title" class="xy-page-header__title">{{ props.title }}</h2>
        </slot>
        <p v-if="props.description" class="xy-page-header__description">{{ props.description }}</p>
      </div>

      <div v-if="$slots.actions" class="xy-page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="props.metaItems.length > 0 || $slots.meta" class="xy-page-header__meta">
      <slot name="meta">
        <div
          v-for="(item, index) in props.metaItems"
          :key="`${item.label ?? 'meta'}-${index}`"
          :class="['xy-page-header__meta-item', item.className]"
        >
          <span :class="['xy-page-header__meta-label', item.labelClassName]">
            <xy-icon v-if="item.icon" :icon="item.icon" :size="14" />
            {{ item.label }}
          </span>
          <strong :class="['xy-page-header__meta-value', item.valueClassName]">
            {{ item.value }}
          </strong>
        </div>
      </slot>
    </div>
  </header>
</template>
