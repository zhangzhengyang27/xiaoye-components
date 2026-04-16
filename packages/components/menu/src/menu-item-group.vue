<script setup lang="ts">
defineOptions({
  name: "XyMenuItemGroup"
});

import { useNamespace } from "@xiaoye/composables";
import type { MenuItemGroupProps } from "./menu-item-group";

const props = withDefaults(defineProps<MenuItemGroupProps>(), {
  title: ""
});
const ns = useNamespace("menu-item-group");
</script>

<template>
  <li :class="ns.base.value" role="presentation">
    <div :class="[`${ns.base.value}__title`, 'xy-menu__group-title']">
      <slot name="title">
        {{ props.title }}
      </slot>
    </div>

    <ul :class="[`${ns.base.value}__list`, 'xy-menu__group-list']" role="group">
      <slot />
    </ul>
  </li>
</template>
