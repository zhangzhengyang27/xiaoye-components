<script setup lang="ts">
import { computed, inject } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyCollapseTransition from "../../collapse-transition";
import { collapseContextKey } from "./context";
import type { CollapseItemProps } from "./collapse-item";

const props = withDefaults(defineProps<CollapseItemProps>(), {
  title: "",
  name: undefined,
  disabled: false
});

const ns = useNamespace("collapse");
const collapse = inject(collapseContextKey, null);
const generatedName = `xy-collapse-item-${Math.random().toString(36).slice(2, 10)}`;
const itemName = computed(() => props.name ?? generatedName);
const isActive = computed(() => collapse?.activeNames.value.includes(itemName.value) ?? false);
const iconPosition = computed(() => collapse?.expandIconPosition.value ?? "right");
const headerId = `${generatedName}-header`;
const contentId = `${generatedName}-content`;
const rootClasses = computed(() => [
  `${ns.base.value}__item`,
  isActive.value ? "is-active" : "",
  props.disabled ? "is-disabled" : ""
]);
const headerClasses = computed(() => [
  `${ns.base.value}__header`,
  `${ns.base.value}__header--${iconPosition.value}`,
  isActive.value ? "is-active" : "",
  props.disabled ? "is-disabled" : ""
]);

function toggle() {
  if (props.disabled) {
    return;
  }

  void collapse?.toggleItem(itemName.value);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  toggle();
}

defineExpose({
  isActive
});
</script>

<template>
  <section :class="rootClasses">
    <header
      :id="headerId"
      :class="headerClasses"
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="isActive"
      :aria-controls="contentId"
      :aria-disabled="props.disabled ? 'true' : undefined"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="xy-collapse__title">
        <slot name="title" :is-active="isActive">
          {{ props.title }}
        </slot>
      </span>
      <span class="xy-collapse__icon" aria-hidden="true" />
    </header>

    <xy-collapse-transition>
      <div
        v-show="isActive"
        :id="contentId"
        :class="['xy-collapse__wrap', isActive ? 'is-active' : '']"
        role="region"
        :aria-hidden="!isActive"
        :aria-labelledby="headerId"
      >
        <div class="xy-collapse__content">
          <slot />
        </div>
      </div>
    </xy-collapse-transition>
  </section>
</template>
