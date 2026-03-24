<script setup lang="ts">
import { computed } from "vue";
import type { PropType, StyleValue } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import { useConfig, useNamespace } from "@xiaoye/composables";
import XyEmpty from "../../empty";
import XyIcon from "../../icon";
import { cardShadows, cardVariants } from "./card";

const props = defineProps({
  size: {
    type: String as PropType<ComponentSize | undefined>,
    default: undefined
  },
  variant: {
    type: String as PropType<(typeof cardVariants)[number]>,
    default: "default"
  },
  bordered: {
    type: Boolean,
    default: true
  },
  header: {
    type: String,
    default: ""
  },
  footer: {
    type: String,
    default: ""
  },
  extra: {
    type: String,
    default: ""
  },
  bodyStyle: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: ""
  },
  headerClass: {
    type: String,
    default: ""
  },
  bodyClass: {
    type: String,
    default: ""
  },
  footerClass: {
    type: String,
    default: ""
  },
  headerDivider: {
    type: Boolean,
    default: true
  },
  footerDivider: {
    type: Boolean,
    default: true
  },
  shadow: {
    type: String as PropType<(typeof cardShadows)[number]>,
    default: "always"
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: "加载中"
  },
  empty: {
    type: Boolean,
    default: false
  },
  emptyTitle: {
    type: String,
    default: "暂无数据"
  },
  emptyDescription: {
    type: String,
    default: ""
  }
});

const slots = defineSlots<{
  default?: () => unknown;
  header?: () => unknown;
  footer?: () => unknown;
  extra?: () => unknown;
  loading?: () => unknown;
  empty?: () => unknown;
}>();

const ns = useNamespace("card");
const { size: globalSize } = useConfig();

const mergedSize = computed(() => props.size ?? globalSize.value);
const hasHeaderSlot = computed(() => Boolean(slots.header));
const hasExtra = computed(() => Boolean(slots.extra) || Boolean(props.extra));
const hasStructuredHeader = computed(() =>
  hasHeaderSlot.value ? true : Boolean(props.header) || hasExtra.value
);
const hasFooter = computed(() => Boolean(slots.footer) || Boolean(props.footer));

const cardClasses = computed(() => [
  ns.base.value,
  `${ns.base.value}--${mergedSize.value}`,
  `${ns.base.value}--${props.variant}`,
  ns.is("borderless", !props.bordered),
  ns.is("always-shadow", props.shadow === "always"),
  ns.is("hover-shadow", props.shadow === "hover")
]);

const headerClasses = computed(() => [
  `${ns.base.value}__header`,
  props.headerClass,
  ns.is("no-divider", !props.headerDivider)
]);

const bodyClasses = computed(() => [`${ns.base.value}__body`, props.bodyClass]);

const footerClasses = computed(() => [
  `${ns.base.value}__footer`,
  props.footerClass,
  ns.is("no-divider", !props.footerDivider)
]);
</script>

<template>
  <div :class="cardClasses">
    <div v-if="hasStructuredHeader" :class="headerClasses">
      <slot v-if="slots.header" name="header" />
      <div v-else class="xy-card__header-inner">
        <div v-if="props.header" class="xy-card__header-main">
          {{ props.header }}
        </div>
        <div v-if="hasExtra" class="xy-card__header-extra">
          <slot name="extra">{{ props.extra }}</slot>
        </div>
      </div>
    </div>

    <div :class="bodyClasses" :style="props.bodyStyle">
      <template v-if="props.loading">
        <slot name="loading">
          <div class="xy-card__state xy-card__loading">
            <XyIcon icon="mdi:loading" :size="18" spin />
            <span>{{ props.loadingText }}</span>
          </div>
        </slot>
      </template>
      <template v-else-if="props.empty">
        <slot name="empty">
          <div class="xy-card__state xy-card__empty">
            <XyEmpty :title="props.emptyTitle" :description="props.emptyDescription" />
          </div>
        </slot>
      </template>
      <template v-else>
        <slot />
      </template>
    </div>

    <div v-if="hasFooter" :class="footerClasses">
      <slot name="footer">{{ props.footer }}</slot>
    </div>
  </div>
</template>
