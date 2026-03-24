<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ComponentPublicInstance } from "vue";
import { useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import type { TabItem, TabsProps } from "./tabs";

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  type: "",
  tabPosition: "top",
  closable: false,
  addable: false,
  editable: false,
  stretch: false,
  beforeLeave: undefined,
  tabindex: 0
});
const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  tabClick: [key: string, event: MouseEvent | KeyboardEvent];
  edit: [key: string | undefined, action: "remove" | "add"];
  tabRemove: [key: string];
  tabAdd: [];
}>();

const ns = useNamespace("tabs");
const tabsId = `xy-tabs-${Math.random().toString(36).slice(2, 10)}`;
const tabRefs = ref<Array<HTMLButtonElement | null>>([]);
const navRef = ref<HTMLDivElement | null>(null);
const navScrollRef = ref<HTMLDivElement | null>(null);
const current = ref("");
const activeBarStyle = ref<Record<string, string>>({});
const navStyle = ref<Record<string, string>>({});
const navOffset = ref(0);
const scrollable = ref({
  prev: false,
  next: false
});

const firstEnabledKey = computed(() => props.items.find((item) => !item.disabled)?.key ?? "");
const activeItem = computed(() => props.items.find((item) => item.key === current.value));
const activeIndex = computed(() => props.items.findIndex((item) => item.key === current.value));
const isVertical = computed(() => ["left", "right"].includes(props.tabPosition));
const isReverse = computed(() => ["bottom", "right"].includes(props.tabPosition));
const canAdd = computed(() => props.addable || props.editable);
const isScrollable = computed(() => scrollable.value.prev || scrollable.value.next);

let resizeObserver: ResizeObserver | null = null;

function resolveFallbackValue() {
  return props.modelValue ?? props.defaultValue ?? current.value;
}

function syncCurrent(value?: string) {
  const nextValue = value ?? resolveFallbackValue();
  const matched = props.items.some((item) => item.key === nextValue && !item.disabled);

  current.value = matched ? nextValue : firstEnabledKey.value;
}

watch(
  () => props.modelValue,
  (value) => {
    syncCurrent(value);
  },
  {
    immediate: true
  }
);

watch(
  () => props.items,
  () => {
    syncCurrent(props.modelValue ?? current.value);
  },
  {
    deep: true
  }
);

async function canLeave(nextKey: string) {
  if (!props.beforeLeave || nextKey === current.value) {
    return true;
  }

  const result = props.beforeLeave(nextKey, current.value);

  if (typeof result === "boolean" || result === undefined) {
    return result !== false;
  }

  try {
    const resolved = await result;
    return resolved !== false;
  } catch {
    return false;
  }
}

async function updateActiveBar() {
  await nextTick();

  const activeTab = tabRefs.value[activeIndex.value];
  const nav = navRef.value;

  if (!activeTab || !nav) {
    activeBarStyle.value = {};
    return;
  }

  if (isVertical.value) {
    const direction = props.tabPosition === "right" ? 1 : 0;
    const indicatorSize = 14;
    const offset = activeTab.offsetTop + Math.max((activeTab.offsetHeight - indicatorSize) / 2, 0);
    activeBarStyle.value = {
      height: `${indicatorSize}px`,
      transform: `translateY(${offset}px)`,
      right: direction ? "0" : "auto",
      left: direction ? "auto" : "0"
    };
    return;
  }

  const direction = props.tabPosition === "bottom" ? 1 : 0;
  activeBarStyle.value = {
    width: `${activeTab.offsetWidth}px`,
    transform: `translateX(${activeTab.offsetLeft}px)`,
    top: direction ? "0" : "auto",
    bottom: direction ? "auto" : "0"
  };
}

function updateNavTransform() {
  const axis = isVertical.value ? "Y" : "X";
  navStyle.value = {
    transform: `translate${axis}(-${navOffset.value}px)`
  };
}

function getContainerSize() {
  const element = navScrollRef.value;

  if (!element) {
    return 0;
  }

  return isVertical.value
    ? element.clientHeight || element.offsetHeight
    : element.clientWidth || element.offsetWidth;
}

function getNavSize() {
  const element = navRef.value;

  if (!element) {
    return 0;
  }

  return isVertical.value
    ? element.scrollHeight || element.offsetHeight
    : element.scrollWidth || element.offsetWidth;
}

function updateScrollable() {
  const containerSize = getContainerSize();
  const navSize = getNavSize();

  if (!containerSize || navSize <= containerSize) {
    navOffset.value = 0;
    scrollable.value = {
      prev: false,
      next: false
    };
    updateNavTransform();
    return;
  }

  const maxOffset = Math.max(navSize - containerSize, 0);

  if (navOffset.value > maxOffset) {
    navOffset.value = maxOffset;
  }

  scrollable.value = {
    prev: navOffset.value > 0,
    next: navOffset.value < maxOffset
  };

  updateNavTransform();
}

async function scrollToActiveTab() {
  await nextTick();

  if (!isScrollable.value) {
    return;
  }

  const activeTab = tabRefs.value[activeIndex.value];

  if (!activeTab) {
    return;
  }

  const containerSize = getContainerSize();
  const start = isVertical.value ? activeTab.offsetTop : activeTab.offsetLeft;
  const size = isVertical.value ? activeTab.offsetHeight : activeTab.offsetWidth;
  const end = start + size;

  if (start < navOffset.value) {
    navOffset.value = start;
  } else if (end > navOffset.value + containerSize) {
    navOffset.value = end - containerSize;
  }

  updateScrollable();
}

function scrollPrev() {
  const containerSize = getContainerSize();

  if (!containerSize || !scrollable.value.prev) {
    return;
  }

  navOffset.value = Math.max(navOffset.value - containerSize, 0);
  updateScrollable();
}

function scrollNext() {
  const containerSize = getContainerSize();
  const navSize = getNavSize();
  const maxOffset = Math.max(navSize - containerSize, 0);

  if (!containerSize || !scrollable.value.next) {
    return;
  }

  navOffset.value = Math.min(navOffset.value + containerSize, maxOffset);
  updateScrollable();
}

function handleWheel(event: WheelEvent) {
  if (!isScrollable.value) {
    return;
  }

  const delta = isVertical.value
    ? event.deltaY
    : Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

  if (!delta) {
    return;
  }

  event.preventDefault();

  const containerSize = getContainerSize();
  const navSize = getNavSize();
  const maxOffset = Math.max(navSize - containerSize, 0);

  navOffset.value = Math.min(Math.max(navOffset.value + delta, 0), maxOffset);
  updateScrollable();
}

function reconnectResizeObserver() {
  resizeObserver?.disconnect();

  if (typeof ResizeObserver === "undefined") {
    resizeObserver = null;
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    updateScrollable();
    void updateActiveBar();
  });

  if (navRef.value) {
    resizeObserver.observe(navRef.value);
  }

  if (navScrollRef.value) {
    resizeObserver.observe(navScrollRef.value);
  }
}

async function activate(item: TabItem) {
  if (item.disabled || item.key === current.value) {
    return;
  }

  const allowed = await canLeave(item.key);

  if (!allowed) {
    return;
  }

  current.value = item.key;
  emit("update:modelValue", item.key);
  emit("change", item.key);
  await updateActiveBar();
  await scrollToActiveTab();
}

function isClosable(item: TabItem) {
  if (item.disabled) {
    return false;
  }

  if (item.closable === false) {
    return false;
  }

  if (item.closable === true) {
    return true;
  }

  return props.closable || props.editable;
}

function setTabRef(element: Element | ComponentPublicInstance | null, index: number) {
  tabRefs.value[index] = element as HTMLButtonElement | null;
}

function findEnabledIndex(startIndex: number, step: 1 | -1) {
  const total = props.items.length;

  if (!total) {
    return -1;
  }

  let index = startIndex;

  for (let count = 0; count < total; count += 1) {
    if (index < 0) {
      index = total - 1;
    } else if (index >= total) {
      index = 0;
    }

    if (!props.items[index]?.disabled) {
      return index;
    }

    index += step;
  }

  return -1;
}

function focusTab(index: number) {
  tabRefs.value[index]?.focus();
}

async function activateByIndex(index: number) {
  const item = props.items[index];

  if (!item || item.disabled) {
    return;
  }

  await activate(item);
  focusTab(index);
}

async function handleKeydown(event: KeyboardEvent, index: number) {
  let targetIndex = -1;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      event.preventDefault();
      targetIndex = findEnabledIndex(index + 1, 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      event.preventDefault();
      targetIndex = findEnabledIndex(index - 1, -1);
      break;
    case "Home":
      event.preventDefault();
      targetIndex = findEnabledIndex(0, 1);
      break;
    case "End":
      event.preventDefault();
      targetIndex = findEnabledIndex(props.items.length - 1, -1);
      break;
    default:
      return;
  }

  if (targetIndex >= 0) {
    await activateByIndex(targetIndex);
  }
}

async function handleTabClick(item: TabItem, event: MouseEvent | KeyboardEvent) {
  emit("tabClick", item.key, event);
  await activate(item);
}

function handleTabRemove(item: TabItem, event: MouseEvent) {
  event.stopPropagation();

  if (!isClosable(item)) {
    return;
  }

  emit("edit", item.key, "remove");
  emit("tabRemove", item.key);
}

function handleTabAdd() {
  emit("edit", undefined, "add");
  emit("tabAdd");
}

function handleAddKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" && event.code !== "NumpadEnter" && event.code !== "Space") {
    return;
  }

  event.preventDefault();
  handleTabAdd();
}

watch(
  () => [current.value, props.tabPosition, props.type, props.stretch, props.items.length] as const,
  () => {
    updateScrollable();
    void updateActiveBar();
    void scrollToActiveTab();
  }
);

onMounted(() => {
  reconnectResizeObserver();
  window.addEventListener("resize", updateScrollable);
  updateScrollable();
  void updateActiveBar();
  void scrollToActiveTab();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener("resize", updateScrollable);
});

defineExpose({
  currentName: current,
  scrollToActiveTab
});
</script>

<template>
  <div
    :class="[
      ns.base.value,
      `${ns.base.value}--${props.tabPosition}`,
      props.type ? `${ns.base.value}--${props.type}` : '',
      props.stretch ? 'is-stretch' : ''
    ]"
  >
    <div class="xy-tabs__header">
      <button
        v-if="isScrollable"
        class="xy-tabs__nav-prev"
        :class="{ 'is-disabled': !scrollable.prev, 'is-vertical': isVertical }"
        type="button"
        :aria-label="isVertical ? '向上滚动页签' : '向前滚动页签'"
        @click="scrollPrev"
      >
        <XyIcon :icon="isVertical ? 'mdi:chevron-up' : 'mdi:chevron-left'" :size="14" />
      </button>

      <div
        class="xy-tabs__nav-wrap"
        :class="[
          isVertical ? 'is-vertical' : '',
          isScrollable ? 'is-scrollable' : '',
          isReverse ? 'is-reverse' : ''
        ]"
      >
        <div ref="navScrollRef" class="xy-tabs__nav-scroll" @wheel="handleWheel">
          <div
            ref="navRef"
            class="xy-tabs__nav"
            :class="[
              isVertical ? 'is-vertical' : '',
              props.stretch ? 'is-stretch' : '',
              isReverse ? 'is-reverse' : ''
            ]"
            role="tablist"
            :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
            :style="navStyle"
          >
            <span class="xy-tabs__active-bar" :style="activeBarStyle" />
            <button
              v-for="(item, index) in props.items"
              :id="`${tabsId}-tab-${item.key}`"
              :key="item.key"
              :ref="(element) => setTabRef(element, index)"
              type="button"
              role="tab"
              :disabled="item.disabled"
              :tabindex="item.key === current ? Number(props.tabindex) : -1"
              :aria-selected="item.key === current"
              :aria-controls="`${tabsId}-panel-${item.key}`"
              :class="[
                'xy-tabs__tab',
                item.key === current ? 'is-active' : '',
                item.disabled ? 'is-disabled' : '',
                isClosable(item) ? 'is-closable' : ''
              ]"
              @click="void handleTabClick(item, $event)"
              @keydown="void handleKeydown($event, index)"
            >
              <span class="xy-tabs__tab-label">{{ item.label }}</span>
              <span
                v-if="isClosable(item)"
                class="xy-tabs__tab-close"
                role="button"
                aria-label="关闭页签"
                tabindex="-1"
                @click="handleTabRemove(item, $event)"
              >
                <XyIcon icon="mdi:close" :size="12" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="canAdd"
        class="xy-tabs__add"
        type="button"
        aria-label="新增页签"
        :tabindex="Number(props.tabindex)"
        @click="handleTabAdd"
        @keydown="handleAddKeydown"
      >
        <slot name="add-icon">
          <XyIcon icon="mdi:plus" :size="14" />
        </slot>
      </button>

      <button
        v-if="isScrollable"
        class="xy-tabs__nav-next"
        :class="{ 'is-disabled': !scrollable.next, 'is-vertical': isVertical }"
        type="button"
        :aria-label="isVertical ? '向下滚动页签' : '向后滚动页签'"
        @click="scrollNext"
      >
        <XyIcon :icon="isVertical ? 'mdi:chevron-down' : 'mdi:chevron-right'" :size="14" />
      </button>
    </div>
    <div
      :id="`${tabsId}-panel-${activeItem?.key ?? 'empty'}`"
      role="tabpanel"
      class="xy-tabs__panel"
      :aria-labelledby="activeItem ? `${tabsId}-tab-${activeItem.key}` : undefined"
      tabindex="0"
    >
      <slot :active-key="current" :active-item="activeItem">
        {{ activeItem?.label }}
      </slot>
    </div>
  </div>
</template>
