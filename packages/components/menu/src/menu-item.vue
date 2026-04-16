<script setup lang="ts">
defineOptions({
  name: "XyMenuItem"
});

import { computed, onBeforeUnmount, onMounted } from "vue";
import { useSlots } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { menuItemEmits } from "./menu-item";
import type { MenuItemProps } from "./menu-item";
import { useMenu } from "./use-menu";
import XyTooltip from "../../tooltip";

const props = withDefaults(defineProps<MenuItemProps>(), {
  route: undefined,
  disabled: false
});
const emit = defineEmits(menuItemEmits);
const ns = useNamespace("menu-item");
const nsMenu = useNamespace("menu");
const slots = useSlots();
const { rootMenu, parentSubMenu, indexPath, level } = useMenu(() => props.index);

if (!rootMenu) {
  throw new Error("[XyMenuItem] menu-item 必须在 xy-menu 或 xy-sub-menu 内使用");
}

const menuRoot = rootMenu;
const active = computed(() => props.index === menuRoot.activeIndex.value);
const showCollapsedTitleTooltip = computed(
  () =>
    level.value === 0 &&
    menuRoot.props.mode === "vertical" &&
    menuRoot.props.collapse &&
    Boolean(slots.title)
);
const collapsedTitleTooltipClass = computed(() =>
  [
    menuRoot.props.popperClass,
    `${nsMenu.base.value}__collapsed-tooltip`,
    `${nsMenu.base.value}__collapsed-tooltip--${menuRoot.props.popperEffect}`
  ]
    .filter(Boolean)
    .join(" ")
);
const itemState = {
  index: props.index,
  indexPath,
  active,
  disabled: props.disabled
};

const itemClasses = computed(() => [
  ns.base.value,
  `${nsMenu.base.value}__item-surface`,
  {
    "is-active": active.value,
    "is-disabled": props.disabled
  }
]);

function handleClick() {
  if (props.disabled) {
    return;
  }

  menuRoot.handleMenuItemClick({
    index: props.index,
    indexPath: indexPath.value,
    route: props.route
  });

  emit("click", {
    index: props.index,
    indexPath: indexPath.value,
    active: active.value
  });
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  handleClick();
}

onMounted(() => {
  parentSubMenu?.addMenuItem(itemState);
  menuRoot.addMenuItem(itemState);
});

onBeforeUnmount(() => {
  parentSubMenu?.removeMenuItem(props.index);
  menuRoot.removeMenuItem(props.index);
});
</script>

<template>
  <li
    :class="itemClasses"
    role="menuitem"
    tabindex="-1"
    :data-index="props.index"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <xy-tooltip
      v-if="showCollapsedTitleTooltip"
      placement="right"
      :offset="menuRoot.props.popperOffset"
      :persistent="menuRoot.props.persistent"
      :popper-class="collapsedTitleTooltipClass"
      :popper-style="menuRoot.props.popperStyle"
    >
      <template #content>
        <slot name="title" />
      </template>

      <span :class="`${nsMenu.base.value}__tooltip-trigger`">
        <slot />
      </span>
    </xy-tooltip>

    <template v-else>
      <span :class="[`${ns.base.value}__content`, `${nsMenu.base.value}__item-content`]">
        <slot />
      </span>
      <span v-if="$slots.title" :class="`${ns.base.value}__title`">
        <slot name="title" />
      </span>
    </template>
  </li>
</template>
