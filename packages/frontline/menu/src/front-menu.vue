<script setup lang="ts">
import { computed, useSlots, watchEffect } from "vue";
import { XyIcon } from "@xiaoye/components";
import { isDev, warnOnce } from "@xiaoye/utils";
import type { FrontMenuItem, FrontMenuProps } from "./menu";

const props = withDefaults(defineProps<FrontMenuProps>(), {
  activeKey: "",
  emptyText: "暂无结果"
});
const slots = useSlots();

const emit = defineEmits<{
  select: [item: FrontMenuItem];
}>();

const groupedItems = computed(() => {
  const groups = new Map<string, FrontMenuItem[]>();

  props.items.forEach((item) => {
    const group = item.group || "";
    const entries = groups.get(group) ?? [];
    entries.push(item);
    groups.set(group, entries);
  });

  return Array.from(groups.entries()).map(([group, items]) => ({
    group,
    items
  }));
});

if (isDev()) {
  watchEffect(() => {
    if (slots.item && slots.shortcut) {
      warnOnce("XyFrontMenu", "`item` slot 与 `shortcut` slot 同时存在时，`shortcut` slot 会被 `item` slot 覆盖。");
    }
  });
}

function handleSelect(item: FrontMenuItem) {
  if (item.disabled) {
    return;
  }

  emit("select", item);
}
</script>

<template>
  <div class="xy-frontline-menu" data-slot="root">
    <template v-if="props.items.length > 0">
      <section
        v-for="section in groupedItems"
        :key="section.group || '__default__'"
        class="xy-frontline-menu__section"
        data-slot="section"
      >
        <slot name="group" :group="section.group" :items="section.items">
          <div v-if="section.group" class="xy-frontline-menu__group" data-slot="group">
            {{ section.group }}
          </div>
        </slot>

        <template
          v-for="item in section.items"
          :key="item.key"
        >
          <slot
            name="item"
            :item="item"
            :group="section.group"
            :active="props.activeKey === item.key"
            :select="() => handleSelect(item)"
          >
            <button
              class="xy-frontline-menu__item"
              type="button"
              :disabled="item.disabled"
              :data-slot="'item'"
              :data-state="props.activeKey === item.key ? 'active' : 'inactive'"
              @click="handleSelect(item)"
            >
              <span v-if="item.icon" class="xy-frontline-menu__icon">
                <XyIcon :icon="item.icon" :size="18" />
              </span>
              <span class="xy-frontline-menu__copy">
                <strong>{{ item.label }}</strong>
                <small v-if="item.description">{{ item.description }}</small>
              </span>
              <slot name="shortcut" :item="item" :group="section.group" :active="props.activeKey === item.key">
                <kbd v-if="item.shortcut" class="xy-frontline-menu__shortcut">{{ item.shortcut }}</kbd>
              </slot>
            </button>
          </slot>
        </template>
      </section>
    </template>

    <slot name="empty" :empty-text="props.emptyText">
      <div v-if="props.items.length === 0" class="xy-frontline-menu__empty" data-slot="empty">
        {{ props.emptyText }}
      </div>
    </slot>
  </div>
</template>

<style scoped>
.xy-frontline-menu {
  display: grid;
  gap: 14px;
}

.xy-frontline-menu__section {
  display: grid;
  gap: 6px;
}

.xy-frontline-menu__group {
  padding: 0 6px;
  color: var(--xy-frontline-neutral-3);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.xy-frontline-menu__item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  border-radius: 20px;
  background: transparent;
  color: var(--xy-frontline-neutral-1);
  font: inherit;
  text-align: left;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.xy-frontline-menu__item[data-state="active"] {
  background: rgba(20, 99, 255, 0.1);
}

.xy-frontline-menu__item:hover:not(:disabled) {
  background: rgba(148, 163, 184, 0.08);
}

.xy-frontline-menu__copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.xy-frontline-menu__copy strong {
  font-weight: 700;
}

.xy-frontline-menu__copy small {
  color: var(--xy-frontline-neutral-3);
  line-height: 1.5;
}

.xy-frontline-menu__shortcut {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--xy-frontline-neutral-3);
  font-size: 12px;
}

.xy-frontline-menu__empty {
  padding: 26px 12px;
  text-align: center;
  color: var(--xy-frontline-neutral-3);
}
</style>
