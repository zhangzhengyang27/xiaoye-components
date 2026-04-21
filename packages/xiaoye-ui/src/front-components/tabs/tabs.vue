<script setup lang="ts">
import { computed, provide, ref } from "vue";
import type { TabsProps } from "./tabs";

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: "",
  type: "line",
  size: "md",
  trigger: "click",
  stretch: false
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

const ns = "xyu-tabs";
const activeName = ref(props.modelValue);

const tabs = ref<{ name: string; label: string; disabled?: boolean; closable?: boolean }[]>([]);

function addTab(tab: { name: string; label: string; disabled?: boolean; closable?: boolean }) {
  if (!tabs.value.find((t) => t.name === tab.name)) {
    tabs.value.push(tab);
  }
}

function removeTab(name: string) {
  const idx = tabs.value.findIndex((t) => t.name === name);
  if (idx > -1) {
    tabs.value.splice(idx, 1);
  }
}

provide("xyuTabs", {
  activeName,
  type: computed(() => props.type),
  size: computed(() => props.size),
  trigger: computed(() => props.trigger),
  addTab,
  removeTab
});

function activate(name: string) {
  const tab = tabs.value.find((t) => t.name === name);
  if (tab?.disabled) return;
  activeName.value = name;
  emit("update:modelValue", name);
  emit("change", name);
}
</script>

<template>
  <div :class="[ns, `${ns}--${props.type}`, `${ns}--${props.size}`]">
    <div :class="`${ns}__header`">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        :class="[
          `${ns}__tab`,
          activeName === tab.name ? 'is-active' : '',
          tab.disabled ? 'is-disabled' : ''
        ]"
        :role="'tab'"
        :aria-selected="activeName === tab.name"
        :tabindex="tab.disabled ? -1 : 0"
        @click="activate(tab.name)"
      >
        {{ tab.label }}
        <button
          v-if="tab.closable"
          :class="`${ns}__close`"
          @click.stop="removeTab(tab.name)"
          aria-label="关闭"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
    <div :class="`${ns}__body`">
      <slot />
    </div>
  </div>
</template>
