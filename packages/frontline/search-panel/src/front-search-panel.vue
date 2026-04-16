<script setup lang="ts">
import { computed, useSlots, watchEffect } from "vue";
import { isDev, warnOnce } from "@xiaoye/utils";
import { XyFrontInput } from "../../input";
import { XyFrontMenu } from "../../menu";
import type { FrontSearchPanelItem, FrontSearchPanelProps } from "./search-panel";

const props = withDefaults(defineProps<FrontSearchPanelProps>(), {
  query: "",
  activeKey: "",
  title: "Search Panel",
  description: "先用轻量搜索面板承接 landing / docs / account 这类前台页面里的内容查找。",
  placeholder: "搜索页面模块、文档区块或功能说明",
  items: () => [],
  emptyText: "没有匹配结果"
});
const slots = useSlots();

const emit = defineEmits<{
  "update:query": [value: string];
  searchChange: [value: string];
  select: [item: FrontSearchPanelItem];
}>();

const hasItems = computed(() => props.items.length > 0);

if (isDev()) {
  watchEffect(() => {
    if (slots.content && (slots.results || slots.empty)) {
      warnOnce(
        "XyFrontSearchPanel",
        "`content` slot 与 `results` / `empty` slot 同时存在时，后两者会被忽略。后续请统一使用一层结构入口。"
      );
    }

    if (slots.results && slots.empty) {
      warnOnce("XyFrontSearchPanel", "`results` slot 与 `empty` slot 同时存在时，`empty` slot 会被 `results` slot 覆盖。");
    }
  });
}

function updateQuery(value: string | number) {
  const next = String(value);
  emit("update:query", next);
  emit("searchChange", next);
}
</script>

<template>
  <div class="xy-frontline-search-panel" data-slot="root">
    <slot name="header" :query="props.query" :items="props.items">
      <div class="xy-frontline-search-panel__header" data-slot="header">
        <strong>{{ props.title }}</strong>
        <p>{{ props.description }}</p>
      </div>
    </slot>

    <div class="xy-frontline-search-panel__search" data-slot="search">
      <slot name="search" :query="props.query" :update-query="updateQuery">
        <XyFrontInput
          :model-value="props.query"
          variant="soft"
          leading-icon="mdi:magnify"
          :placeholder="props.placeholder"
          @update:model-value="updateQuery"
        />
      </slot>
    </div>

    <div class="xy-frontline-search-panel__content" data-slot="content">
      <slot
        name="content"
        :query="props.query"
        :items="props.items"
        :active-key="props.activeKey"
        :empty-text="props.emptyText"
      >
        <div class="xy-frontline-search-panel__results" data-slot="results">
          <slot
            name="results"
            :query="props.query"
            :items="props.items"
            :active-key="props.activeKey"
            :empty-text="props.emptyText"
          >
            <template v-if="hasItems">
              <XyFrontMenu
                :items="props.items"
                :active-key="props.activeKey"
                :empty-text="props.emptyText"
                @select="emit('select', $event)"
              />
            </template>
            <div v-else class="xy-frontline-search-panel__empty" data-slot="empty">
              <slot name="empty" :query="props.query" :empty-text="props.emptyText">
                {{ props.emptyText }}
              </slot>
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.xy-frontline-search-panel {
  display: grid;
  gap: 16px;
}

.xy-frontline-search-panel__header {
  display: grid;
  gap: 6px;
}

.xy-frontline-search-panel__header strong {
  color: var(--xy-frontline-neutral-1);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.xy-frontline-search-panel__header p {
  margin: 0;
  color: var(--xy-frontline-neutral-3);
  line-height: 1.65;
}

.xy-frontline-search-panel__results {
  max-height: 420px;
  overflow: auto;
}

.xy-frontline-search-panel__content {
  display: grid;
}

.xy-frontline-search-panel__empty {
  padding: 26px 12px;
  text-align: center;
  color: var(--xy-frontline-neutral-3);
  border-radius: 22px;
  background: rgba(248, 250, 252, 0.92);
}
</style>
