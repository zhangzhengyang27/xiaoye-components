<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch, watchEffect } from "vue";
import { isDev, warnOnce } from "@xiaoye/utils";
import { XyFrontDialog } from "../../dialog";
import { XyFrontSearchPanel } from "../../search-panel";
import type { FrontCommandItem, FrontCommandProps } from "./command";

const props = withDefaults(defineProps<FrontCommandProps>(), {
  modelValue: false,
  placeholder: "搜索页面、命令或资源",
  title: "Command Search",
  description: "用一条入口把页面跳转、资源入口和轻命令收进同一个前台面板。",
  emptyText: "没有找到匹配结果",
  closeOnSelect: true,
  enableGlobalShortcut: true,
  shortcutLabel: "Cmd/Ctrl + K",
  shortcutKeys: () => ["Meta+K", "Ctrl+K"]
});
const slots = useSlots();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  openChange: [value: boolean];
  select: [item: FrontCommandItem];
  searchChange: [value: string];
  shortcut: [shortcut: string];
}>();

const open = ref(props.modelValue);
const query = ref("");
const activeKey = ref("");

if (isDev()) {
  watchEffect(() => {
    if (slots.content && (slots.search || slots.results || slots.empty)) {
      warnOnce(
        "XyFrontCommand",
        "`content` slot 与 `search` / `results` / `empty` slot 同时存在时，后者会被忽略。后续请统一用 `content` 作为总入口。"
      );
    }
  });
}

watch(
  () => props.modelValue,
  (value) => {
    open.value = value;
  }
);

const filteredItems = computed(() => {
  const keyword = query.value.trim().toLowerCase();

  if (!keyword) {
    return props.items;
  }

  return props.items.filter((item) => {
    const haystack = [item.label, item.description, item.group, ...(item.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(keyword);
  });
});

watch(
  filteredItems,
  (items) => {
    activeKey.value = items.find((item) => !item.disabled)?.key ?? "";
  },
  {
    immediate: true
  }
);

function move(step: 1 | -1) {
  const candidates = filteredItems.value.filter((item) => !item.disabled);

  if (!candidates.length) {
    return;
  }

  const currentIndex = candidates.findIndex((item) => item.key === activeKey.value);
  const nextIndex =
    currentIndex < 0
      ? 0
      : (currentIndex + step + candidates.length) % candidates.length;

  activeKey.value = candidates[nextIndex]?.key ?? candidates[0].key;
}

function updateOpen(value: boolean) {
  open.value = value;
  emit("update:modelValue", value);
  emit("openChange", value);

  if (!value) {
    query.value = "";
  }
}

function handleSearch(value: string) {
  query.value = value;
  emit("searchChange", value);
}

function handleSelect(item: FrontCommandItem) {
  emit("select", item);

  if (props.closeOnSelect) {
    updateOpen(false);
  }
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      move(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      move(-1);
      break;
    case "Enter": {
      event.preventDefault();
      const matched = filteredItems.value.find((item) => item.key === activeKey.value);
      if (matched) {
        handleSelect(matched);
      }
      break;
    }
    case "Escape":
      event.preventDefault();
      updateOpen(false);
      break;
    default:
      break;
  }
}

function handleGlobalShortcut(event: KeyboardEvent) {
  if (!props.enableGlobalShortcut) {
    return;
  }

  if (
    event.target instanceof HTMLElement &&
    (event.target.isContentEditable ||
      ["input", "textarea", "select"].includes(event.target.tagName.toLowerCase()))
  ) {
    return;
  }

  const matchedShortcut = props.shortcutKeys.find((shortcut) => {
    const normalized = shortcut.toLowerCase().replace(/\s+/g, "");
    const parts = normalized.split("+");
    const key = parts.at(-1);

    if (!key || event.key.toLowerCase() !== key) {
      return false;
    }

    const needsMeta = parts.includes("meta") || parts.includes("cmd");
    const needsCtrl = parts.includes("ctrl") || parts.includes("control");
    const needsShift = parts.includes("shift");
    const needsAlt = parts.includes("alt") || parts.includes("option");

    return (
      event.metaKey === needsMeta &&
      event.ctrlKey === needsCtrl &&
      event.shiftKey === needsShift &&
      event.altKey === needsAlt
    );
  });

  if (!matchedShortcut) {
    return;
  }

  event.preventDefault();
  emit("shortcut", matchedShortcut);
  updateOpen(true);
}

onMounted(() => {
  window.addEventListener("keydown", handleGlobalShortcut);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleGlobalShortcut);
});
</script>

<template>
  <div class="xy-frontline-command" :data-slot="'root'" :data-state="open ? 'open' : 'closed'">
    <XyFrontDialog
      :model-value="props.modelValue"
      size="lg"
      surface="floating"
      :title="props.title"
      :description="props.description"
      @update:model-value="updateOpen"
    >
      <template #header="{ close }">
        <slot name="header" :query="query" :items="filteredItems" :close="close">
          <div class="xy-frontline-command__header" data-slot="header">
            <div class="xy-frontline-command__headline">
              <div class="xy-frontline-command__eyebrow">Command</div>
              <h3 class="xy-frontline-command__title">{{ props.title }}</h3>
              <p class="xy-frontline-command__description">{{ props.description }}</p>
            </div>
            <kbd class="xy-frontline-command__shortcut">{{ props.shortcutLabel }}</kbd>
          </div>
        </slot>
      </template>

      <template #content>
        <div class="xy-frontline-command__body" data-slot="content" @keydown.capture="handleKeydown">
          <slot
            name="content"
            :query="query"
            :items="filteredItems"
            :active-key="activeKey"
            :close="() => updateOpen(false)"
            :update-query="handleSearch"
            :select="handleSelect"
          >
            <XyFrontSearchPanel
              :query="query"
              :active-key="activeKey"
              :items="filteredItems"
              :placeholder="props.placeholder"
              :empty-text="props.emptyText"
              title="Quick Search"
              description="搜索结果、命令和轻入口统一走这一层，不再散落在弹层模板里。"
              @update:query="handleSearch"
              @search-change="handleSearch"
              @select="handleSelect"
            >
              <template v-if="$slots.search" #search="slotProps">
                <slot
                  name="search"
                  v-bind="slotProps"
                  :close="() => updateOpen(false)"
                  :update-query="handleSearch"
                />
              </template>
              <template v-if="$slots.results" #results="slotProps">
                <slot
                  name="results"
                  v-bind="slotProps"
                  :close="() => updateOpen(false)"
                  :select="handleSelect"
                />
              </template>
              <template v-if="$slots.empty" #empty="slotProps">
                <slot name="empty" v-bind="slotProps" :close="() => updateOpen(false)" />
              </template>
            </XyFrontSearchPanel>
          </slot>
        </div>
      </template>
    </XyFrontDialog>
  </div>
</template>

<style scoped>
.xy-frontline-command__header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.xy-frontline-command__headline {
  display: grid;
  gap: 6px;
}

.xy-frontline-command__eyebrow {
  color: var(--xy-frontline-brand-1);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.xy-frontline-command__title {
  margin: 0;
  color: var(--xy-frontline-neutral-1);
  font-size: 28px;
  letter-spacing: -0.04em;
}

.xy-frontline-command__description {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.7;
}

.xy-frontline-command__shortcut {
  padding: 8px 12px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--xy-frontline-neutral-3);
  font: inherit;
}
</style>
