<script setup lang="ts">
defineOptions({
  name: "XyAnchorLink"
});

import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { anchorContextKey } from "./context";
import type { AnchorLinkProps } from "./anchor-link";

const props = withDefaults(defineProps<AnchorLinkProps>(), {
  title: "",
  href: ""
});

const slots = useSlots();
const ns = useNamespace("anchor");
const linkRef = ref<HTMLAnchorElement | null>(null);
const anchorContext = inject(anchorContextKey, null);

const direction = computed(() => anchorContext?.direction.value ?? "vertical");
const hasChildren = computed(() => Boolean(slots.default));
const linkKls = computed(() => [
  `${ns.base.value}__link`,
  ns.is("active", anchorContext?.currentAnchor.value === props.href)
]);

function registerLink(href: string) {
  if (!href || !linkRef.value) {
    return;
  }

  anchorContext?.addLink({
    href,
    el: linkRef.value
  });
}

function unregisterLink(href: string) {
  if (!href) {
    return;
  }

  anchorContext?.removeLink(href);
}

function handleClick(event: MouseEvent) {
  anchorContext?.handleClick(event, props.href || undefined);
}

watch(
  () => props.href,
  (value, oldValue) => {
    void nextTick(() => {
      if (oldValue) {
        unregisterLink(oldValue);
      }

      if (value) {
        registerLink(value);
      }
    });
  }
);

onMounted(() => {
  if (props.href) {
    registerLink(props.href);
  }
});

onBeforeUnmount(() => {
  if (props.href) {
    unregisterLink(props.href);
  }
});
</script>

<template>
  <div
    :class="[
      `${ns.base.value}__item`,
      `${ns.base.value}__item--${direction}`,
      hasChildren ? 'has-children' : ''
    ]"
  >
    <a
      ref="linkRef"
      :class="linkKls"
      :href="props.href || undefined"
      :aria-current="anchorContext?.currentAnchor.value === props.href ? 'location' : undefined"
      @click.prevent="handleClick"
    >
      {{ props.title }}
    </a>

    <div
      v-if="hasChildren"
      :class="[
        `${ns.base.value}__list`,
        `${ns.base.value}__list--nested`,
        `${ns.base.value}__list--${direction}`
      ]"
    >
      <slot />
    </div>
  </div>
</template>
