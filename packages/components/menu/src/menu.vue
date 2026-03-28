<script setup lang="ts">
defineOptions({
  name: "XyMenu"
});

import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  Text,
  watch
} from "vue";
import type { Component, PropType, VNode } from "vue";
import type { NavigationFailure, RouteLocationRaw, Router } from "vue-router";
import { bindClickOutside, warnOnce } from "@xiaoye/utils";
import { useFloatingPanel, useFloatingVisibility, useNamespace } from "@xiaoye/composables";
import XyIcon from "../../icon";
import MenuItemComponent from "./menu-item.vue";
import MenuItemGroupComponent from "./menu-item-group.vue";
import SubMenuComponent from "./sub-menu.vue";
import { menuEmits, DEFAULT_MENU_MORE_WIDTH, resolveMenuCssVars } from "./menu";
import type { MenuDataItem, MenuPermissionChecker, MenuProps } from "./menu";
import type { InternalMenuNode, MenuItemClicked } from "./types";
import { menuContextKey } from "./tokens";

type RouterResult = Promise<void | NavigationFailure>;
type RenderSurface = "root" | "popup";
type NormalizedMenuDataItem = Omit<MenuDataItem, "children" | "type"> & {
  type: NonNullable<MenuDataItem["type"]>;
  children: NormalizedMenuDataItem[];
};

const props = withDefaults(defineProps<MenuProps>(), {
  mode: "vertical",
  defaultActive: "",
  defaultOpeneds: () => [],
  activeIndex: undefined,
  openedMenus: undefined,
  uniqueOpened: false,
  router: false,
  menuTrigger: "hover",
  collapse: false,
  items: undefined,
  permissionChecker: undefined,
  backgroundColor: "",
  textColor: "",
  activeTextColor: "",
  closeOnClickOutside: false,
  collapseTransition: true,
  ellipsis: true,
  popperOffset: 6,
  ellipsisIcon: "mdi:dots-horizontal",
  popperEffect: "dark",
  popperClass: "",
  popperStyle: undefined,
  showTimeout: 300,
  hideTimeout: 300,
  persistent: true
});
const emit = defineEmits(menuEmits);
const slots = defineSlots<{
  default?: () => VNode[];
}>();
const ns = useNamespace("menu");
const menuRef = ref<HTMLUListElement | null>(null);
const moreTriggerRef = ref<HTMLElement | null>(null);
const morePopupRef = ref<HTMLElement | null>(null);
const sliceIndex = ref(-1);
const measuredItemWidths = ref<number[]>([]);
const items = shallowRef<Record<string, InternalMenuNode>>({});
const subMenus = shallowRef<Record<string, InternalMenuNode>>({});
const popupElements = new Set<HTMLElement>();
const instance = getCurrentInstanceSafe();
const router = instance?.appContext.config.globalProperties.$router as Router | undefined;
const hasActiveIndexProp = computed(
  () =>
    props.activeIndex !== undefined ||
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "activeIndex")
);
const hasOpenedMenusProp = computed(
  () =>
    props.openedMenus !== undefined ||
    Object.prototype.hasOwnProperty.call(instance?.vnode.props ?? {}, "openedMenus")
);
const hasItemsProp = computed(() => Array.isArray(props.items));
const activeIndexOverride = ref<string | null>(null);
const openedMenusOverride = ref<string[] | null>(null);
const innerActiveIndex = ref(props.activeIndex ?? props.defaultActive);
const innerOpenedMenus = ref(
  normalizeMenuKeys(props.openedMenus ?? (props.collapse ? [] : props.defaultOpeneds))
);

let resizeObserver: ResizeObserver | null = null;
let unbindClickOutside: (() => void) | null = null;

const isMenuPopup = computed(
  () => props.mode === "horizontal" || (props.mode === "vertical" && props.collapse)
);
const menuClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${props.mode}`,
  {
    "is-collapse": props.collapse,
    "is-ellipsis": props.mode === "horizontal" && props.ellipsis
  }
]);
const rootStyle = computed(() => resolveMenuCssVars(props));
const menuRole = computed(() => (props.mode === "horizontal" ? "menubar" : "menu"));
const activeIndex = computed(() =>
  hasActiveIndexProp.value
    ? activeIndexOverride.value ?? props.activeIndex ?? ""
    : innerActiveIndex.value
);
const openedMenus = computed(() =>
  hasOpenedMenusProp.value
    ? openedMenusOverride.value ?? normalizeMenuKeys(props.openedMenus)
    : innerOpenedMenus.value
);
const slotChildren = computed(() => normalizeSlotNodes(slots.default?.() ?? []));
const hasSlotChildren = computed(() => slotChildren.value.length > 0);
const normalizedItemData = computed(() =>
  normalizeMenuDataItems(props.items ?? [], props.permissionChecker)
);
const usingItems = computed(() => !hasSlotChildren.value && hasItemsProp.value);
const rootChildrenCount = computed(() =>
  usingItems.value ? normalizedItemData.value.length : slotChildren.value.length
);
const displayedItemData = computed(() =>
  shouldShowMore.value ? normalizedItemData.value.slice(0, sliceIndex.value) : normalizedItemData.value
);
const overflowItemData = computed(() =>
  shouldShowMore.value ? normalizedItemData.value.slice(sliceIndex.value) : []
);
const shouldShowMore = computed(
  () =>
    props.mode === "horizontal" &&
    props.ellipsis &&
    sliceIndex.value >= 0 &&
    sliceIndex.value < rootChildrenCount.value
);
const displayedChildren = computed(() =>
  usingItems.value
    ? buildMenuDataNodes(displayedItemData.value, {
        level: 0,
        surface: "root"
      })
    : shouldShowMore.value
      ? slotChildren.value.slice(0, sliceIndex.value)
      : slotChildren.value
);
const overflowChildren = computed(() =>
  usingItems.value
    ? buildMenuDataNodes(overflowItemData.value, {
        level: 0,
        surface: "popup"
      })
    : shouldShowMore.value
      ? slotChildren.value.slice(sliceIndex.value)
      : []
);

const MenuRenderNodes = defineComponent({
  name: "XyMenuRenderNodes",
  props: {
    nodes: {
      type: Array as PropType<VNode[]>,
      default: () => []
    }
  },
  setup(renderProps) {
    return () => renderProps.nodes.map((node) => cloneVNode(node));
  }
});

const {
  visible: moreVisible,
  rendered: moreRendered,
  open: openMoreFloating,
  close: closeMoreFloating,
  clearTimers: clearMoreTimers,
  handleAfterLeave: handleMoreAfterLeave
} = useFloatingVisibility({
  persistent: () => props.persistent
});
const {
  floatingStyle: moreFloatingStyle,
  updatePosition: updateMorePosition,
  startAutoUpdate: startMoreAutoUpdate,
  stopAutoUpdate: stopMoreAutoUpdate
} = useFloatingPanel(moreTriggerRef, morePopupRef, {
  placement: () => "bottom-start",
  strategy: "fixed",
  offset: () => props.popperOffset,
  zIndex: 2000
});
const morePopupClasses = computed(() => [
  `${ns.base.value}__popup`,
  `${ns.base.value}__popup--${props.popperEffect}`,
  `${ns.base.value}__more-popup`,
  props.popperClass
]);

function getCurrentInstanceSafe() {
  try {
    return getCurrentInstance();
  } catch {
    return null;
  }
}

function normalizeSlotNodes(children: VNode[]) {
  const result: VNode[] = [];

  children.forEach((child) => {
    if (child.type === Comment) {
      return;
    }

    if (child.type === Text) {
      if (typeof child.children === "string" && child.children.trim()) {
        result.push(child);
      }
      return;
    }

    if (child.type === Fragment) {
      result.push(...normalizeSlotNodes(child.children as VNode[]));
      return;
    }

    result.push(child);
  });

  return result;
}

function normalizeMenuKeys(value: string[] | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    )
  );
}

function areMenuKeysEqual(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((item, index) => item === second[index]);
}

function resolveMenuDataType(item: MenuDataItem, children: NormalizedMenuDataItem[]) {
  if (item.type === "group") {
    return "group";
  }

  if (item.type === "submenu") {
    return "submenu";
  }

  if (item.type === "item") {
    return "item";
  }

  return children.length > 0 ? "submenu" : "item";
}

function normalizeMenuDataItems(
  source: MenuDataItem[],
  permissionChecker?: MenuPermissionChecker
): NormalizedMenuDataItem[] {
  const normalized: NormalizedMenuDataItem[] = [];

  source.forEach((item) => {
    if (!item || item.hidden) {
      return;
    }

    if (permissionChecker && permissionChecker(item.permission, item) === false) {
      return;
    }

    const children = normalizeMenuDataItems(item.children ?? [], permissionChecker);
    const type = resolveMenuDataType(item, children);

    if ((type === "group" || type === "submenu") && children.length === 0) {
      return;
    }

    normalized.push({
      ...item,
      type,
      children
    });
  });

  return normalized;
}

function renderMenuDataIcon(icon: MenuDataItem["icon"]) {
  if (!icon) {
    return null;
  }

  if (typeof icon === "string") {
    return h(XyIcon, {
      icon,
      size: 18
    });
  }

  return h(icon as Component);
}

function shouldRenderExtraText(surface: RenderSurface, level: number) {
  return !(props.mode === "horizontal" && surface === "root" && level === 0);
}

function renderMenuDataTitleRow(
  item: NormalizedMenuDataItem,
  context: {
    level: number;
    surface: RenderSurface;
  }
) {
  const metaChildren: VNode[] = [];

  if (item.badge !== undefined && item.badge !== null && String(item.badge) !== "") {
    metaChildren.push(
      h("span", { class: `${ns.base.value}__item-badge` }, String(item.badge))
    );
  }

  if (shouldRenderExtraText(context.surface, context.level) && item.extraText) {
    metaChildren.push(
      h("span", { class: `${ns.base.value}__item-extra` }, item.extraText)
    );
  }

  return h("span", { class: `${ns.base.value}__item-row` }, [
    h("span", { class: `${ns.base.value}__item-main` }, [
      h("span", { class: `${ns.base.value}__item-label` }, item.label)
    ]),
    metaChildren.length
      ? h("span", { class: `${ns.base.value}__item-meta` }, metaChildren)
      : null
  ]);
}

function resolveChildSurface(surface: RenderSurface) {
  if (surface === "popup") {
    return "popup" as const;
  }

  return props.mode === "horizontal" || props.collapse ? "popup" : "root";
}

function buildMenuDataNodes(
  source: NormalizedMenuDataItem[],
  context: {
    level: number;
    surface: RenderSurface;
  }
): VNode[] {
  return source.map((item) => {
    if (item.type === "group") {
      return h(
        MenuItemGroupComponent,
        {
          key: item.index,
          title: item.label
        },
        {
          default: () =>
            buildMenuDataNodes(item.children, {
              level: context.level + 1,
              surface: resolveChildSurface(context.surface)
            })
        }
      );
    }

    if (item.type === "submenu") {
      return h(
        SubMenuComponent,
        {
          key: item.index,
          index: item.index,
          disabled: item.disabled
        },
        {
          title: () => [
            renderMenuDataIcon(item.icon),
            renderMenuDataTitleRow(item, context)
          ],
          default: () =>
            buildMenuDataNodes(item.children, {
              level: context.level + 1,
              surface: resolveChildSurface(context.surface)
            })
        }
      );
    }

    return h(
      MenuItemComponent,
      {
        key: item.index,
        index: item.index,
        route: item.route,
        disabled: item.disabled
      },
      {
        default: item.icon ? () => [renderMenuDataIcon(item.icon)] : undefined,
        title: () => renderMenuDataTitleRow(item, context)
      }
    );
  });
}

function syncControlledActiveFromProp() {
  if (hasActiveIndexProp.value) {
    innerActiveIndex.value = props.activeIndex ?? "";
    activeIndexOverride.value = null;
  }
}

function syncControlledOpenedMenusFromProp() {
  if (hasOpenedMenusProp.value) {
    innerOpenedMenus.value = normalizeMenuKeys(props.openedMenus);
    openedMenusOverride.value = null;
  }
}

function addMenuItem(item: InternalMenuNode) {
  items.value = {
    ...items.value,
    [item.index]: item
  };
}

function removeMenuItem(index: string) {
  const nextItems = { ...items.value };
  delete nextItems[index];
  items.value = nextItems;
}

function addSubMenu(item: InternalMenuNode) {
  subMenus.value = {
    ...subMenus.value,
    [item.index]: item
  };
}

function removeSubMenu(index: string) {
  const nextMenus = { ...subMenus.value };
  delete nextMenus[index];
  subMenus.value = nextMenus;
}

function registerPopupElement(element: HTMLElement) {
  popupElements.add(element);
}

function unregisterPopupElement(element: HTMLElement) {
  popupElements.delete(element);
}

function commitActiveIndex(nextIndex: string, emitUpdate = true) {
  const normalized = nextIndex ?? "";

  if (normalized === activeIndex.value) {
    return false;
  }

  innerActiveIndex.value = normalized;

  if (hasActiveIndexProp.value) {
    activeIndexOverride.value = normalized;
  }

  if (emitUpdate) {
    emit("update:activeIndex", normalized);
  }

  return true;
}

function commitOpenedMenus(nextOpened: string[], emitUpdate = true) {
  const normalized = normalizeMenuKeys(nextOpened);

  if (areMenuKeysEqual(normalized, openedMenus.value)) {
    return false;
  }

  innerOpenedMenus.value = normalized;

  if (hasOpenedMenusProp.value) {
    openedMenusOverride.value = normalized;
  }

  if (emitUpdate) {
    emit("update:openedMenus", normalized);
  }

  return true;
}

function closeAllMenus() {
  commitOpenedMenus([]);
  closeMore(true);
}

function syncOpenedMenusByActive(targetIndex: string, emitUpdate = false) {
  if (!targetIndex || props.mode === "horizontal" || props.collapse) {
    return;
  }

  const activeItem = items.value[targetIndex];

  if (!activeItem) {
    return;
  }

  const path = activeItem.indexPath.value.slice(0, -1).filter((index) => Boolean(subMenus.value[index]));
  const currentOpened = openedMenus.value;
  const nextOpened = props.uniqueOpened
    ? path
    : Array.from(new Set([...currentOpened, ...path]));

  commitOpenedMenus(nextOpened, emitUpdate);
}

function openMenu(index: string, indexPath: string[]) {
  const currentOpened = openedMenus.value;

  if (currentOpened.includes(index)) {
    return;
  }

  const nextOpened = props.uniqueOpened
    ? [...currentOpened.filter((menuIndex) => indexPath.includes(menuIndex)), index]
    : [...currentOpened, index];

  if (!commitOpenedMenus(nextOpened)) {
    return;
  }

  emit("open", index, indexPath);
}

function closeMenu(index: string, indexPath: string[]) {
  const nextOpened = openedMenus.value.filter((menuIndex) => menuIndex !== index);

  if (!commitOpenedMenus(nextOpened)) {
    return;
  }

  emit("close", index, indexPath);
}

function handleSubMenuClick(subMenu: MenuItemClicked) {
  if (openedMenus.value.includes(subMenu.index)) {
    closeMenu(subMenu.index, subMenu.indexPath);
    return;
  }

  openMenu(subMenu.index, subMenu.indexPath);
}

function handleMenuItemClick(item: MenuItemClicked) {
  if (props.mode === "horizontal" || props.collapse) {
    commitOpenedMenus([]);
  }

  closeMore(true);

  const { index, indexPath } = item;

  if (!index || !indexPath.length) {
    return;
  }

  if (props.router && router && typeof router.push === "function") {
    const route = item.route ?? (index as RouteLocationRaw);
    const routerResult = Promise.resolve(router.push(route)).then((result) => {
      if (!result) {
        commitActiveIndex(index);
        syncOpenedMenusByActive(index, true);
      }

      return result as void | NavigationFailure;
    }) as RouterResult;

    emit("select", index, indexPath, { index, indexPath, route }, routerResult);
    return;
  }

  commitActiveIndex(index);
  syncOpenedMenusByActive(index, true);
  emit("select", index, indexPath, { index, indexPath, route: item.route });
}

function updateActiveIndex(index: string) {
  commitActiveIndex(index);
  syncOpenedMenusByActive(index, true);
}

function calcMenuItemWidth(menuItem: HTMLElement) {
  const computedStyle = window.getComputedStyle(menuItem);
  const marginLeft = Number.parseInt(computedStyle.marginLeft || "0", 10);
  const marginRight = Number.parseInt(computedStyle.marginRight || "0", 10);
  return menuItem.offsetWidth + marginLeft + marginRight || 0;
}

function calcSliceIndex() {
  if (!menuRef.value || props.mode !== "horizontal" || !props.ellipsis) {
    sliceIndex.value = -1;
    measuredItemWidths.value = [];
    return;
  }

  const itemsToMeasure = Array.from(menuRef.value.children).filter(
    (item) => !(item as HTMLElement).classList.contains(`${ns.base.value}__more`)
  ) as HTMLElement[];
  const menuWidth = menuRef.value.clientWidth;

  if (!menuWidth || !itemsToMeasure.length) {
    sliceIndex.value = -1;
    return;
  }

  if (itemsToMeasure.length >= rootChildrenCount.value) {
    measuredItemWidths.value = itemsToMeasure.map((item) => calcMenuItemWidth(item));
  }

  const widths =
    measuredItemWidths.value.length >= rootChildrenCount.value
      ? measuredItemWidths.value.slice(0, rootChildrenCount.value)
      : itemsToMeasure.map((item) => calcMenuItemWidth(item));

  let usedWidth = 0;
  let nextSliceIndex = 0;

  widths.forEach((itemWidth, index) => {
    if (usedWidth + itemWidth <= menuWidth - DEFAULT_MENU_MORE_WIDTH) {
      usedWidth += itemWidth;
      nextSliceIndex = index + 1;
    }
  });

  sliceIndex.value = nextSliceIndex >= rootChildrenCount.value ? -1 : nextSliceIndex;
}

function handleResize() {
  void nextTick(() => {
    calcSliceIndex();

    if (moreVisible.value) {
      void updateMorePosition();
    }
  });
}

function openMore(immediate = props.menuTrigger !== "hover") {
  openMoreFloating({
    immediate
  });
}

function closeMore(immediate = props.menuTrigger !== "hover") {
  closeMoreFloating({
    immediate
  });
}

function handleMoreTriggerMouseenter() {
  if (props.menuTrigger !== "hover") {
    return;
  }

  openMore(false);
}

function handleMoreTriggerMouseleave() {
  if (props.menuTrigger !== "hover") {
    return;
  }

  closeMore(false);
}

function handleMoreTriggerClick() {
  if (props.menuTrigger !== "click") {
    return;
  }

  if (moreVisible.value) {
    closeMore(true);
    return;
  }

  openMore(true);
}

watch(
  () => props.items,
  () => {
    if (hasSlotChildren.value || !hasItemsProp.value) {
      return;
    }

    handleResize();
  },
  {
    deep: true
  }
);

watch(
  [hasSlotChildren, hasItemsProp],
  ([hasSlot, hasItems]) => {
    if (hasSlot && hasItems) {
      warnOnce("XyMenu", "items 与默认插槽不能同时使用，已优先渲染默认插槽。");
    }
  },
  {
    immediate: true
  }
);

watch(
  () => props.activeIndex,
  () => {
    syncControlledActiveFromProp();
  }
);

watch(
  () => props.openedMenus,
  () => {
    syncControlledOpenedMenusFromProp();
  },
  {
    deep: true
  }
);

watch(
  () => props.defaultActive,
  (value) => {
    if (hasActiveIndexProp.value) {
      return;
    }

    innerActiveIndex.value = value;
  },
  {
    immediate: true
  }
);

watch(
  () => props.defaultOpeneds,
  (value) => {
    if (hasOpenedMenusProp.value) {
      return;
    }

    innerOpenedMenus.value = normalizeMenuKeys(props.collapse ? [] : value);
  },
  {
    immediate: true,
    deep: true
  }
);

watch(
  [() => activeIndex.value, () => Object.keys(items.value).length, () => props.mode, () => props.collapse],
  ([value]) => {
    if (hasOpenedMenusProp.value) {
      return;
    }

    syncOpenedMenusByActive(value, false);
  },
  {
    immediate: true
  }
);

watch(
  () => props.collapse,
  (value) => {
    if (value) {
      commitOpenedMenus([]);
      closeMore(true);
      return;
    }

    if (!hasOpenedMenusProp.value) {
      syncOpenedMenusByActive(activeIndex.value, false);
    }
  }
);

watch(
  [moreVisible, overflowChildren],
  async ([visible]) => {
    clearMoreTimers();

    if (!visible) {
      if (morePopupRef.value) {
        unregisterPopupElement(morePopupRef.value);
      }

      stopMoreAutoUpdate();
      return;
    }

    await nextTick();

    if (morePopupRef.value) {
      registerPopupElement(morePopupRef.value);
    }

    await updateMorePosition();
    startMoreAutoUpdate();
  }
);

provide(menuContextKey, {
  openedMenus,
  items,
  subMenus,
  activeIndex,
  isMenuPopup,
  props,
  addMenuItem,
  removeMenuItem,
  addSubMenu,
  removeSubMenu,
  openMenu,
  closeMenu,
  handleMenuItemClick,
  handleSubMenuClick,
  registerPopupElement,
  unregisterPopupElement,
  closeAllMenus
});

onMounted(() => {
  syncControlledActiveFromProp();
  syncControlledOpenedMenusFromProp();
  handleResize();

  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => {
      handleResize();
    });
  }

  if (typeof ResizeObserver !== "undefined" && menuRef.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(menuRef.value);
  }

  if (props.closeOnClickOutside && menuRef.value) {
    unbindClickOutside = bindClickOutside(menuRef.value, (event) => {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      if (morePopupRef.value?.contains(target) || moreTriggerRef.value?.contains(target)) {
        return;
      }

      for (const element of Array.from(popupElements)) {
        if (element.contains(target)) {
          return;
        }
      }

      closeAllMenus();
    });
  }
});

watch(
  () => [rootChildrenCount.value, props.mode, props.ellipsis, props.collapse],
  () => {
    handleResize();
  }
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  unbindClickOutside?.();
  unbindClickOutside = null;
  stopMoreAutoUpdate();
});

defineExpose({
  open: (index: string) => {
    const target = subMenus.value[index];

    if (target) {
      openMenu(index, target.indexPath.value);
    }
  },
  close: (index: string) => {
    const target = subMenus.value[index];

    if (target) {
      closeMenu(index, target.indexPath.value);
    }
  },
  handleResize,
  updateActiveIndex
});
</script>

<template>
  <div :class="`${ns.base.value}__wrap`">
    <ul
      ref="menuRef"
      :class="menuClasses"
      :style="rootStyle"
      :role="menuRole"
    >
      <menu-render-nodes :nodes="displayedChildren" />

      <li
        v-if="shouldShowMore"
        ref="moreTriggerRef"
        :class="`${ns.base.value}__more`"
        role="none"
        @mouseenter="handleMoreTriggerMouseenter"
        @mouseleave="handleMoreTriggerMouseleave"
      >
        <button
          type="button"
          :class="`${ns.base.value}__more-button`"
          aria-label="更多菜单"
          @click="handleMoreTriggerClick"
        >
          <component
            :is="{
              render: () =>
                typeof props.ellipsisIcon === 'string'
                  ? h(XyIcon, { icon: props.ellipsisIcon, size: 18 })
                  : h(props.ellipsisIcon as Component)
            }"
          />
        </button>
      </li>
    </ul>

    <teleport to="body">
      <transition name="xy-fade" @after-leave="handleMoreAfterLeave">
        <ul
          v-if="moreRendered && shouldShowMore"
          v-show="moreVisible"
          ref="morePopupRef"
          :class="morePopupClasses"
          :style="[moreFloatingStyle, props.popperStyle]"
          role="menu"
          @mouseenter="handleMoreTriggerMouseenter"
          @mouseleave="handleMoreTriggerMouseleave"
        >
          <menu-render-nodes :nodes="overflowChildren" />
        </ul>
      </transition>
    </teleport>
  </div>
</template>
