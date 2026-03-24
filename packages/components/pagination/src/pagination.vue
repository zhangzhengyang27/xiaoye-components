<script setup lang="ts">
import { computed, ref, watch, useSlots } from "vue";
import type { SelectOption } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XySelect from "../../select";
import {
  buildPagerItems,
  clampPage,
  normalizePagerCount
} from "./pagination";
import type { PaginationLayoutKey, PaginationProps } from "./pagination";

const props = withDefaults(defineProps<PaginationProps>(), {
  defaultCurrentPage: 1,
  defaultPageSize: 10,
  pagerCount: 7,
  layout: "prev, pager, next, jumper, ->, total",
  pageSizes: () => [10, 20, 30, 40, 50, 100],
  prevText: "",
  nextText: "",
  size: undefined,
  small: false,
  teleported: true,
  appendSizeTo: "body",
  popperClass: "",
  popperStyle: undefined,
  disabled: false,
  background: false,
  hideOnSinglePage: false
});

const emit = defineEmits<{
  "update:currentPage": [value: number];
  "update:pageSize": [value: number];
  "current-change": [value: number];
  "size-change": [value: number];
  "prev-click": [value: number];
  "next-click": [value: number];
  change: [page: number, pageSize: number];
}>();

const slots = useSlots();
const ns = useNamespace("pagination");
const { size: globalSize } = useConfig();
const innerCurrentPage = ref(props.defaultCurrentPage);
const innerPageSize = ref(props.defaultPageSize);
const mergedSize = computed(() => props.small ? "sm" : (props.size ?? globalSize.value));
const isCurrentPageControlled = computed(() => typeof props.currentPage === "number");
const isPageSizeControlled = computed(() => typeof props.pageSize === "number");
const layoutItems = computed(() =>
  props.layout
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as PaginationLayoutKey[]
);
const rightWrapperIndex = computed(() => layoutItems.value.indexOf("->"));
const leftLayoutItems = computed(() =>
  rightWrapperIndex.value >= 0
    ? layoutItems.value.slice(0, rightWrapperIndex.value)
    : layoutItems.value
);
const rightLayoutItems = computed(() =>
  rightWrapperIndex.value >= 0 ? layoutItems.value.slice(rightWrapperIndex.value + 1) : []
);
const currentPageBridge = computed(() => props.currentPage ?? innerCurrentPage.value);
const pageSizeBridge = computed(() => props.pageSize ?? innerPageSize.value);
const pageSizeOptions = computed<SelectOption<number>[]>(() =>
  props.pageSizes.map((size) => ({
    label: `${size} 条`,
    value: size
  }))
);
const pageCountBridge = computed(() => {
  if (typeof props.pageCount === "number") {
    return Math.max(1, props.pageCount);
  }

  if (typeof props.total === "number") {
    return Math.max(1, Math.ceil(props.total / pageSizeBridge.value));
  }

  return 1;
});
const normalizedPagerCount = computed(() => normalizePagerCount(props.pagerCount));
const pagerItems = computed(() =>
  buildPagerItems(currentPageBridge.value, pageCountBridge.value, normalizedPagerCount.value)
);
const showPagination = computed(() => {
  if (!layoutItems.value.length) {
    return false;
  }

  if (props.hideOnSinglePage && pageCountBridge.value <= 1) {
    return false;
  }

  return typeof props.total === "number" || typeof props.pageCount === "number";
});

function emitCurrentPage(nextPage: number) {
  if (nextPage === currentPageBridge.value) {
    return false;
  }

  if (!isCurrentPageControlled.value) {
    innerCurrentPage.value = nextPage;
  }

  emit("update:currentPage", nextPage);
  emit("current-change", nextPage);
  return true;
}

function emitPageSize(nextPageSize: number) {
  if (nextPageSize === pageSizeBridge.value) {
    return false;
  }

  if (!isPageSizeControlled.value) {
    innerPageSize.value = nextPageSize;
  }

  emit("update:pageSize", nextPageSize);
  emit("size-change", nextPageSize);
  return true;
}

function emitCombinedChange(page: number, pageSize: number) {
  emit("change", page, pageSize);
}

function updatePage(nextPage: number, source?: "prev" | "next") {
  if (props.disabled) {
    return;
  }

  const page = clampPage(nextPage, pageCountBridge.value);
  const changed = emitCurrentPage(page);

  if (!changed) {
    return;
  }

  if (source === "prev") {
    emit("prev-click", page);
  } else if (source === "next") {
    emit("next-click", page);
  }

  emitCombinedChange(page, pageSizeBridge.value);
}

function updatePageSize(value: number | null) {
  if (props.disabled) {
    return;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return;
  }

  const pageSizeChanged = emitPageSize(value);
  const nextPageCount =
    typeof props.total === "number" ? Math.max(1, Math.ceil(props.total / value)) : pageCountBridge.value;
  const nextPage = clampPage(currentPageBridge.value, nextPageCount);
  const currentChanged = emitCurrentPage(nextPage);

  if (!pageSizeChanged && !currentChanged) {
    return;
  }

  emitCombinedChange(nextPage, value);
}

function handleJumperChange(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);

  if (!Number.isFinite(value)) {
    return;
  }

  updatePage(value);
}

function handlePagerItemClick(item: number | "prev-more" | "next-more") {
  if (typeof item === "number") {
    updatePage(item);
    return;
  }

  const delta = normalizedPagerCount.value - 2;
  updatePage(
    item === "prev-more" ? currentPageBridge.value - delta : currentPageBridge.value + delta
  );
}

function isActivePage(item: number | "prev-more" | "next-more") {
  return typeof item === "number" && item === currentPageBridge.value;
}

function renderLayoutItem(item: PaginationLayoutKey) {
  return item;
}

watch(
  () => props.currentPage,
  (value) => {
    if (typeof value === "number") {
      innerCurrentPage.value = value;
    }
  }
);

watch(
  () => props.pageSize,
  (value) => {
    if (typeof value === "number") {
      innerPageSize.value = value;
    }
  }
);

watch(pageCountBridge, (value) => {
  if (currentPageBridge.value > value) {
    const nextPage = clampPage(currentPageBridge.value, value);

    if (!isCurrentPageControlled.value) {
      innerCurrentPage.value = nextPage;
    }
  }
});
</script>

<template>
  <div
    v-if="showPagination"
    :class="[
      ns.base.value,
      `${ns.base.value}--${mergedSize}`,
      props.background ? 'is-background' : '',
      props.disabled ? 'is-disabled' : ''
    ]"
  >
    <div class="xy-pagination__main">
      <template v-for="item in leftLayoutItems" :key="`left-${item}`">
        <button
          v-if="renderLayoutItem(item) === 'prev'"
          type="button"
          class="xy-pagination__button xy-pagination__button--prev"
          :disabled="props.disabled || currentPageBridge <= 1"
          :aria-label="props.prevText || '上一页'"
          @click="updatePage(currentPageBridge - 1, 'prev')"
        >
          <span>{{ props.prevText || "‹" }}</span>
        </button>

        <ul
          v-else-if="renderLayoutItem(item) === 'pager'"
          class="xy-pagination__pager"
          role="list"
          aria-label="分页页码"
        >
          <li v-for="pager in pagerItems" :key="String(pager)">
            <button
              type="button"
              :class="[
                'xy-pagination__pager-item',
                isActivePage(pager) ? 'is-active' : '',
                pager === 'prev-more' || pager === 'next-more' ? 'is-more' : ''
              ]"
              :disabled="props.disabled"
              :aria-current="isActivePage(pager) ? 'page' : undefined"
              @click="handlePagerItemClick(pager)"
            >
              <span v-if="pager === 'prev-more'">…</span>
              <span v-else-if="pager === 'next-more'">…</span>
              <span v-else>{{ pager }}</span>
            </button>
          </li>
        </ul>

        <button
          v-else-if="renderLayoutItem(item) === 'next'"
          type="button"
          class="xy-pagination__button xy-pagination__button--next"
          :disabled="props.disabled || currentPageBridge >= pageCountBridge"
          :aria-label="props.nextText || '下一页'"
          @click="updatePage(currentPageBridge + 1, 'next')"
        >
          <span>{{ props.nextText || "›" }}</span>
        </button>

        <label
          v-else-if="renderLayoutItem(item) === 'sizes'"
          class="xy-pagination__sizes"
        >
          <span>每页</span>
          <xy-select
            :model-value="pageSizeBridge"
            :options="pageSizeOptions"
            :disabled="props.disabled"
            :size="mergedSize"
            :teleported="props.teleported"
            :append-to="props.appendSizeTo"
            :popper-class="props.popperClass"
            :popper-style="props.popperStyle"
            :fit-trigger-width="false"
            dropdown-min-width="108px"
            @update:model-value="updatePageSize"
          />
        </label>

        <span v-else-if="renderLayoutItem(item) === 'total'" class="xy-pagination__total">
          共 {{ props.total ?? pageCountBridge * pageSizeBridge }} 条
        </span>

        <label
          v-else-if="renderLayoutItem(item) === 'jumper'"
          class="xy-pagination__jumper"
        >
          <span>前往</span>
          <input
            type="number"
            :min="1"
            :max="pageCountBridge"
            :value="currentPageBridge"
            :disabled="props.disabled"
            @change="handleJumperChange"
          >
          <span>页</span>
        </label>

        <div v-else-if="renderLayoutItem(item) === 'slot'" class="xy-pagination__slot">
          <slot />
        </div>
      </template>
    </div>

    <div v-if="rightLayoutItems.length" class="xy-pagination__right">
      <template v-for="item in rightLayoutItems" :key="`right-${item}`">
        <button
          v-if="renderLayoutItem(item) === 'prev'"
          type="button"
          class="xy-pagination__button xy-pagination__button--prev"
          :disabled="props.disabled || currentPageBridge <= 1"
          :aria-label="props.prevText || '上一页'"
          @click="updatePage(currentPageBridge - 1, 'prev')"
        >
          <span>{{ props.prevText || "‹" }}</span>
        </button>

        <ul
          v-else-if="renderLayoutItem(item) === 'pager'"
          class="xy-pagination__pager"
          role="list"
          aria-label="分页页码"
        >
          <li v-for="pager in pagerItems" :key="String(pager)">
            <button
              type="button"
              :class="[
                'xy-pagination__pager-item',
                isActivePage(pager) ? 'is-active' : '',
                pager === 'prev-more' || pager === 'next-more' ? 'is-more' : ''
              ]"
              :disabled="props.disabled"
              :aria-current="isActivePage(pager) ? 'page' : undefined"
              @click="handlePagerItemClick(pager)"
            >
              <span v-if="pager === 'prev-more'">…</span>
              <span v-else-if="pager === 'next-more'">…</span>
              <span v-else>{{ pager }}</span>
            </button>
          </li>
        </ul>

        <button
          v-else-if="renderLayoutItem(item) === 'next'"
          type="button"
          class="xy-pagination__button xy-pagination__button--next"
          :disabled="props.disabled || currentPageBridge >= pageCountBridge"
          :aria-label="props.nextText || '下一页'"
          @click="updatePage(currentPageBridge + 1, 'next')"
        >
          <span>{{ props.nextText || "›" }}</span>
        </button>

        <label
          v-else-if="renderLayoutItem(item) === 'sizes'"
          class="xy-pagination__sizes"
        >
          <span>每页</span>
          <xy-select
            :model-value="pageSizeBridge"
            :options="pageSizeOptions"
            :disabled="props.disabled"
            :size="mergedSize"
            :teleported="props.teleported"
            :append-to="props.appendSizeTo"
            :popper-class="props.popperClass"
            :popper-style="props.popperStyle"
            :fit-trigger-width="false"
            dropdown-min-width="108px"
            @update:model-value="updatePageSize"
          />
        </label>

        <span v-else-if="renderLayoutItem(item) === 'total'" class="xy-pagination__total">
          共 {{ props.total ?? pageCountBridge * pageSizeBridge }} 条
        </span>

        <label
          v-else-if="renderLayoutItem(item) === 'jumper'"
          class="xy-pagination__jumper"
        >
          <span>前往</span>
          <input
            type="number"
            :min="1"
            :max="pageCountBridge"
            :value="currentPageBridge"
            :disabled="props.disabled"
            @change="handleJumperChange"
          >
          <span>页</span>
        </label>

        <div v-else-if="renderLayoutItem(item) === 'slot'" class="xy-pagination__slot">
          <slot />
        </div>
      </template>
    </div>
  </div>
</template>
