<script setup lang="ts">
import { addCollection } from "@iconify/vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  buildMdiCategoryEntries,
  createProjectIconCopyText,
  fetchMdiCollection,
  fetchMdiIconData,
  filterProjectIcons,
  flattenMdiIcons,
  MDI_CATEGORY_CHIP_LIMIT,
  getPageCount,
  MDI_PAGE_SIZE,
  paginateIcons,
  type MdiCategoryEntry,
  type MdiIconItem,
  type ProjectIconCopyMode
} from "./icon-gallery";

const search = ref("");
const selectedCategory = ref("全部");
const categoryExpanded = ref(false);
const copyMode = ref<ProjectIconCopyMode>("component");
const copiedIcon = ref("");
const loading = ref(true);
const loadingIcons = ref(false);
const errorMessage = ref("");
const totalCount = ref(0);
const currentPage = ref(1);
const catalog = ref<MdiIconItem[]>([]);
const chipWallRef = ref<HTMLElement | null>(null);
const chipWallOverflowing = ref(false);
const chipWallCanScrollUp = ref(false);
const chipWallCanScrollDown = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;
const loadedIcons = new Set<string>();
let iconLoadToken = 0;

const filteredIcons = computed(() =>
  filterProjectIcons(catalog.value, search.value, selectedCategory.value)
);
const pageCount = computed(() => getPageCount(filteredIcons.value.length, MDI_PAGE_SIZE));
const pagedIcons = computed(() =>
  paginateIcons(filteredIcons.value, currentPage.value, MDI_PAGE_SIZE)
);
const pageOptions = computed(() =>
  Array.from({ length: pageCount.value }, (_, index) => ({
    label: `第 ${index + 1} 页`,
    value: index + 1
  }))
);
const categoryEntries = computed<MdiCategoryEntry[]>(() =>
  buildMdiCategoryEntries(catalog.value, search.value)
);
const visibleCategoryEntries = computed(() => {
  if (categoryExpanded.value || categoryEntries.value.length <= MDI_CATEGORY_CHIP_LIMIT) {
    return categoryEntries.value;
  }

  const hotEntries = categoryEntries.value.slice(0, MDI_CATEGORY_CHIP_LIMIT);
  const selectedEntry = categoryEntries.value.find((item) => item.name === selectedCategory.value);

  if (!selectedEntry || hotEntries.some((item) => item.name === selectedEntry.name)) {
    return hotEntries;
  }

  return [...hotEntries, selectedEntry];
});
const hiddenCategoryCount = computed(() =>
  Math.max(0, categoryEntries.value.length - visibleCategoryEntries.value.length)
);
const activeModeLabel = computed(() =>
  copyMode.value === "component" ? "已复制 xy-icon 代码" : "已复制 icon 值"
);
const hasActiveFilters = computed(
  () => Boolean(search.value.trim()) || selectedCategory.value !== "全部" || categoryExpanded.value
);

async function loadCollection() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const collection = await fetchMdiCollection();
    const items = flattenMdiIcons(collection);

    catalog.value = items;
    totalCount.value = items.length;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "加载 mdi 图标集合失败";
  } finally {
    loading.value = false;
  }
}

async function loadVisibleIcons(icons: string[]) {
  const missingIcons = icons.filter((icon) => !loadedIcons.has(icon));

  if (missingIcons.length === 0) {
    return;
  }

  const token = ++iconLoadToken;
  loadingIcons.value = true;

  try {
    const data = await fetchMdiIconData(missingIcons);

    if (token !== iconLoadToken) {
      return;
    }

    addCollection(data);
    missingIcons.forEach((icon) => {
      loadedIcons.add(icon);
    });
    errorMessage.value = "";
  } catch (error) {
    if (token === iconLoadToken) {
      errorMessage.value = error instanceof Error ? error.message : "加载 mdi 图标数据失败";
    }
  } finally {
    if (token === iconLoadToken) {
      loadingIcons.value = false;
    }
  }
}

async function copyIcon(icon: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(createProjectIconCopyText(icon, copyMode.value));
  copiedIcon.value = icon;

  if (copiedTimer) {
    clearTimeout(copiedTimer);
  }

  copiedTimer = setTimeout(() => {
    copiedIcon.value = "";
  }, 1200);
}

function clearFilters() {
  search.value = "";
  selectedCategory.value = "全部";
  categoryExpanded.value = false;
}

async function scrollSelectedChipIntoView() {
  await nextTick();

  const container = chipWallRef.value;

  if (!container) {
    return;
  }

  const selectedChip = container.querySelector<HTMLElement>('[data-selected="true"]');

  if (!selectedChip) {
    return;
  }

  selectedChip.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center"
  });

  window.setTimeout(() => {
    updateChipWallScrollState();
  }, 220);
}

function updateChipWallScrollState() {
  const container = chipWallRef.value;

  if (!container) {
    chipWallOverflowing.value = false;
    chipWallCanScrollUp.value = false;
    chipWallCanScrollDown.value = false;
    return;
  }

  const overflowThreshold = 2;
  const maxScrollTop = container.scrollHeight - container.clientHeight;
  const hasOverflow = maxScrollTop > overflowThreshold;

  chipWallOverflowing.value = hasOverflow;
  chipWallCanScrollUp.value = hasOverflow && container.scrollTop > overflowThreshold;
  chipWallCanScrollDown.value =
    hasOverflow && container.scrollTop < maxScrollTop - overflowThreshold;
}

function handleChipWallScroll() {
  updateChipWallScrollState();
}

watch([search, selectedCategory], () => {
  currentPage.value = 1;
});

watch(search, () => {
  categoryExpanded.value = false;
});

watch(categoryEntries, (entries) => {
  if (entries.some((item) => item.name === selectedCategory.value)) {
    return;
  }

  selectedCategory.value = "全部";
});

watch(pageCount, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});

watch([visibleCategoryEntries, hiddenCategoryCount], async () => {
  await nextTick();
  updateChipWallScrollState();
});

watch(
  pagedIcons,
  (items) => {
    if (items.length === 0) {
      return;
    }

    void loadVisibleIcons(items.map((item) => item.icon));
  },
  { immediate: true }
);

watch([selectedCategory, categoryExpanded, visibleCategoryEntries], () => {
  void scrollSelectedChipIntoView();
});

onMounted(() => {
  void loadCollection();
  window.addEventListener("resize", updateChipWallScrollState);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateChipWallScrollState);
});
</script>

<template>
  <section class="xy-project-icon-gallery">
    <div class="xy-project-icon-gallery__tip">
      <strong>TIP</strong>
      <p>
        这里展示 Iconify `mdi` 图标集的全量图标。页面会先加载图标名称与分类，再按当前页批量加载 SVG
        数据。
      </p>
      <p>支持搜索、分类、分页和点击复制，可切换复制完整 `xy-icon` 代码或单独的 `icon` 值。</p>
    </div>

    <div v-if="loading" class="xy-project-icon-gallery__state">正在加载 mdi 图标集合...</div>

    <div
      v-else-if="errorMessage && catalog.length === 0"
      class="xy-project-icon-gallery__state xy-project-icon-gallery__state--error"
    >
      <span>{{ errorMessage }}</span>
      <button type="button" @click="loadCollection">重试</button>
    </div>

    <template v-else>
      <div class="xy-project-icon-gallery__toolbar">
        <label class="xy-project-icon-gallery__search">
          <xy-icon icon="mdi:magnify" :size="18" />
          <input v-model="search" type="text" placeholder="搜索全部 mdi 图标" />
        </label>

        <div class="xy-project-icon-gallery__switch" role="tablist" aria-label="复制内容类型">
          <button
            class="xy-project-icon-gallery__switch-btn"
            :class="{ 'is-active': copyMode === 'component' }"
            type="button"
            @click="copyMode = 'component'"
          >
            复制 xy-icon 代码
          </button>
          <button
            class="xy-project-icon-gallery__switch-btn"
            :class="{ 'is-active': copyMode === 'name' }"
            type="button"
            @click="copyMode = 'name'"
          >
            复制 icon 值
          </button>
        </div>
      </div>

      <section class="xy-project-icon-gallery__filters">
        <div class="xy-project-icon-gallery__filters-head">
          <div>
            <strong>分类标签筛选</strong>
            <p>
              保留方案 B
              的标签筛选，并把热门分类优先展示，长尾分类收进“更多”，适合在图标库里快速切换。
            </p>
          </div>

          <div class="xy-project-icon-gallery__filter-actions">
            <div class="xy-project-icon-gallery__active-category">
              <span>当前分类</span>
              <strong>{{ selectedCategory }}</strong>
            </div>

            <button
              v-if="hasActiveFilters"
              class="xy-project-icon-gallery__clear-btn"
              type="button"
              @click="clearFilters"
            >
              清空筛选
            </button>
          </div>
        </div>

        <div class="xy-project-icon-gallery__chip-shell">
          <div
            v-if="chipWallOverflowing && chipWallCanScrollUp"
            class="xy-project-icon-gallery__chip-fade xy-project-icon-gallery__chip-fade--top"
            aria-hidden="true"
          />

          <div
            ref="chipWallRef"
            class="xy-project-icon-gallery__chip-wall"
            role="tablist"
            aria-label="标签筛选"
            @scroll="handleChipWallScroll"
          >
            <button
              v-for="item in visibleCategoryEntries"
              :key="item.name"
              class="xy-project-icon-gallery__chip"
              :class="{ 'is-active': selectedCategory === item.name }"
              :data-selected="selectedCategory === item.name ? 'true' : undefined"
              :aria-pressed="selectedCategory === item.name"
              type="button"
              @click="selectedCategory = item.name"
            >
              <span>{{ item.name }}</span>
              <small>{{ item.count }}</small>
            </button>

            <button
              v-if="hiddenCategoryCount > 0"
              class="xy-project-icon-gallery__chip xy-project-icon-gallery__chip--ghost"
              type="button"
              @click="categoryExpanded = !categoryExpanded"
            >
              <span>{{ categoryExpanded ? "收起分类" : "更多分类" }}</span>
              <small>{{ categoryExpanded ? "" : `+${hiddenCategoryCount}` }}</small>
            </button>
          </div>

          <div
            v-if="chipWallOverflowing && chipWallCanScrollDown"
            class="xy-project-icon-gallery__chip-fade xy-project-icon-gallery__chip-fade--bottom"
            aria-hidden="true"
          />

          <p v-if="chipWallOverflowing" class="xy-project-icon-gallery__chip-hint">
            {{ chipWallCanScrollDown ? "继续向下滚动可查看更多分类" : "已到分类列表底部" }}
          </p>
        </div>
      </section>

      <div class="xy-project-icon-gallery__summary">
        <p class="xy-project-icon-gallery__meta">
          已收录 {{ totalCount }} 个 mdi 图标
          <span v-if="search.trim() || selectedCategory !== '全部'"
            >，当前匹配 {{ filteredIcons.length }} 个结果</span
          >
          <span>，每页 {{ MDI_PAGE_SIZE }} 个</span>
        </p>

        <div v-if="filteredIcons.length > 0" class="xy-project-icon-gallery__pager">
          <button type="button" :disabled="currentPage <= 1" @click="currentPage -= 1">
            上一页
          </button>
          <label>
            <span>页码</span>
            <select v-model.number="currentPage">
              <option v-for="option in pageOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <button type="button" :disabled="currentPage >= pageCount" @click="currentPage += 1">
            下一页
          </button>
        </div>
      </div>

      <p v-if="loadingIcons" class="xy-project-icon-gallery__hint">正在加载当前页图标数据...</p>
      <p
        v-if="errorMessage && catalog.length > 0"
        class="xy-project-icon-gallery__hint xy-project-icon-gallery__hint--error"
      >
        {{ errorMessage }}
      </p>

      <div v-if="filteredIcons.length > 0" class="xy-project-icon-gallery__grid">
        <button
          v-for="item in pagedIcons"
          :key="item.icon"
          class="xy-project-icon-gallery__item"
          type="button"
          :title="
            copyMode === 'component' ? `复制 ${item.icon} 的 xy-icon 代码` : `复制 ${item.icon}`
          "
          @click="copyIcon(item.icon)"
        >
          <xy-icon :icon="item.icon" :size="26" />
          <strong>{{ item.label }}</strong>
          <code>{{ item.icon }}</code>
          <small>{{ item.category }}</small>
          <span>{{ copiedIcon === item.icon ? activeModeLabel : "点击复制" }}</span>
        </button>
      </div>

      <p v-else class="xy-project-icon-gallery__empty">
        没有找到和 “{{ search.trim() }}” 匹配的图标。
      </p>
    </template>
  </section>
</template>

<style scoped>
.xy-project-icon-gallery {
  --xy-gallery-panel-border: var(--xy-border-color-subtle);
  --xy-gallery-panel-bg: color-mix(in srgb, var(--xy-bg-color-subtle) 84%, white);
  --xy-gallery-panel-bg-hover: color-mix(in srgb, var(--xy-color-primary-soft) 52%, white);
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
}

.xy-project-icon-gallery__tip {
  padding: 18px 20px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-color-primary-soft) 42%, white);
  box-shadow: var(--xy-shadow-xs);
}

.xy-project-icon-gallery__tip strong {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 16px;
}

.xy-project-icon-gallery__tip p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.75;
}

.xy-project-icon-gallery__toolbar {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.xy-project-icon-gallery__filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  position: sticky;
  top: calc(var(--vp-nav-height, 64px) + 16px);
  z-index: 3;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 20px;
  background: var(--xy-gallery-panel-bg);
  box-shadow: var(--xy-shadow-sm);
}

.xy-project-icon-gallery__filters-head {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
}

.xy-project-icon-gallery__filter-actions {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.xy-project-icon-gallery__filters-head strong {
  font-size: 18px;
  color: var(--xy-text-color-heading);
}

.xy-project-icon-gallery__filters-head p {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.xy-project-icon-gallery__active-category {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 94%, white);
  color: var(--xy-text-color-secondary);
}

.xy-project-icon-gallery__active-category strong {
  font-size: 14px;
  color: var(--xy-color-primary);
}

.xy-project-icon-gallery__clear-btn {
  padding: 10px 14px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 999px;
  background: var(--xy-surface-raised);
  color: var(--xy-text-color-secondary);
  font: inherit;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;
}

.xy-project-icon-gallery__clear-btn:hover {
  border-color: color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color));
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
}

.xy-project-icon-gallery__search {
  display: flex;
  flex: 1;
  min-width: 260px;
  gap: 10px;
  align-items: center;
  padding: 0 14px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 16px;
  background: var(--xy-surface-raised);
}

.xy-project-icon-gallery__search input {
  width: 100%;
  padding: 14px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--xy-text-color);
  font: inherit;
}

.xy-project-icon-gallery__pager label {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: var(--xy-text-color-secondary);
}

.xy-project-icon-gallery__pager select {
  min-width: 144px;
  padding: 10px 12px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 12px;
  background: var(--xy-surface-raised);
  color: var(--xy-text-color);
  font: inherit;
}

.xy-project-icon-gallery__chip-wall {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: flex-start;
  max-height: 220px;
  overflow: auto;
  padding-right: 4px;
  scroll-behavior: smooth;
}

.xy-project-icon-gallery__chip-shell {
  position: relative;
}

.xy-project-icon-gallery__chip-fade {
  position: absolute;
  left: 0;
  right: 4px;
  height: 28px;
  pointer-events: none;
  z-index: 1;
}

.xy-project-icon-gallery__chip-fade--top {
  top: 0;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-gallery-panel-bg) 98%, white),
    transparent
  );
}

.xy-project-icon-gallery__chip-fade--bottom {
  bottom: 26px;
  background: linear-gradient(
    0deg,
    color-mix(in srgb, var(--xy-gallery-panel-bg) 98%, white),
    transparent
  );
}

.xy-project-icon-gallery__chip-hint {
  margin: 10px 0 0;
  color: var(--xy-text-color-muted);
  font-size: 12px;
}

.xy-project-icon-gallery__chip {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 999px;
  background: var(--xy-surface-raised);
  color: var(--xy-text-color-secondary);
  font: inherit;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;
}

.xy-project-icon-gallery__chip small {
  color: inherit;
  font-size: 12px;
}

.xy-project-icon-gallery__chip--ghost {
  border-style: dashed;
}

.xy-project-icon-gallery__chip.is-active {
  border-color: color-mix(in srgb, var(--xy-color-primary) 18%, var(--xy-border-color));
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
}

.xy-project-icon-gallery__switch {
  display: inline-flex;
  padding: 4px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 94%, white);
}

.xy-project-icon-gallery__switch-btn {
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--xy-text-color-secondary);
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
  padding: 8px 14px;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.xy-project-icon-gallery__switch-btn.is-active {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
}

.xy-project-icon-gallery__meta,
.xy-project-icon-gallery__empty {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 14px;
}

.xy-project-icon-gallery__summary {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.xy-project-icon-gallery__pager {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

.xy-project-icon-gallery__pager button,
.xy-project-icon-gallery__state button {
  padding: 10px 14px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 12px;
  background: var(--xy-surface-raised);
  color: var(--xy-text-color);
  font: inherit;
  cursor: pointer;
}

.xy-project-icon-gallery__pager button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.xy-project-icon-gallery__state,
.xy-project-icon-gallery__hint {
  padding: 14px 16px;
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 90%, white);
  color: var(--xy-text-color-secondary);
}

.xy-project-icon-gallery__state {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.xy-project-icon-gallery__state--error,
.xy-project-icon-gallery__hint--error {
  border-color: color-mix(in srgb, var(--xy-color-danger) 18%, var(--xy-border-color-subtle));
  background: color-mix(in srgb, var(--xy-color-danger-soft) 82%, white);
  color: var(--xy-color-danger);
}

.xy-project-icon-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  border: 1px solid var(--xy-gallery-panel-border);
  border-radius: 20px;
  overflow: hidden;
  background: var(--xy-surface-raised);
}

.xy-project-icon-gallery__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  min-height: 164px;
  padding: 18px 14px;
  border: 0;
  border-right: 1px solid var(--xy-gallery-panel-border);
  border-bottom: 1px solid var(--xy-gallery-panel-border);
  background: transparent;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    transform 0.18s ease;
}

.xy-project-icon-gallery__item:hover {
  background: var(--xy-gallery-panel-bg-hover);
  transform: translateY(-1px);
}

.xy-project-icon-gallery__item strong {
  color: var(--xy-text-color-heading);
  font-size: 15px;
  text-align: center;
}

.xy-project-icon-gallery__item code {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.xy-project-icon-gallery__item small {
  color: var(--xy-text-color-muted);
  font-size: 12px;
}

.xy-project-icon-gallery__item span {
  color: var(--xy-text-color-muted);
  font-size: 12px;
}

@media (max-width: 640px) {
  .xy-project-icon-gallery__toolbar,
  .xy-project-icon-gallery__filters-head,
  .xy-project-icon-gallery__filter-actions,
  .xy-project-icon-gallery__summary,
  .xy-project-icon-gallery__pager,
  .xy-project-icon-gallery__pager label,
  .xy-project-icon-gallery__state {
    flex-direction: column;
    align-items: stretch;
  }

  .xy-project-icon-gallery__search {
    min-width: 0;
  }

  .xy-project-icon-gallery__filters {
    position: static;
  }

  .xy-project-icon-gallery__switch {
    justify-content: stretch;
  }

  .xy-project-icon-gallery__switch-btn {
    flex: 1;
  }

  .xy-project-icon-gallery__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
