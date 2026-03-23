<script setup lang="ts">
import { computed, useAttrs, watchEffect } from "vue"
import { useNamespace } from "@xiaoye/composables"
import { isDev, warnOnce } from "@xiaoye/utils"
import XyIcon from "../../icon"
import { DEFAULT_LOADING_ICON } from "./button"
import type { ButtonProps } from "./button"
import { useButton } from "./use-button"

const props = withDefaults(defineProps<ButtonProps>(), {
  nativeType: "button",
  loading: false,
  disabled: false,
  loadingIcon: DEFAULT_LOADING_ICON,
  plain: false,
  text: false,
  link: false,
  bg: false,
  autofocus: false,
  round: false,
  circle: false,
  block: false,
  tag: "button"
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = defineSlots<{
  default?: () => unknown
  icon?: () => unknown
  loading?: () => unknown
  prefix?: () => unknown
  suffix?: () => unknown
}>()
const attrs = useAttrs()
const ns = useNamespace("button")
const {
  buttonRef,
  buttonAttrs,
  handleClick,
  handleKeydown,
  hasBg,
  isLink,
  isPlain,
  isText,
  isDisabled,
  resolvedSize,
  resolvedType
} = useButton(props, attrs, (event, payload) => emit(event, payload))

const iconSizeMap = {
  sm: 14,
  md: 16,
  lg: 18
} as const

const hasDefaultSlot = computed(() => Boolean(slots.default))
const hasSuffixSlot = computed(() => Boolean(slots.suffix))
const hasCustomLoadingSlot = computed(() => Boolean(slots.loading))
const iconSize = computed(() => iconSizeMap[resolvedSize.value])
const isIconOnly = computed(
  () => !hasDefaultSlot.value && !hasSuffixSlot.value && (!props.loading || !hasCustomLoadingSlot.value)
)
const isCircle = computed(() => props.circle && isIconOnly.value)
const buttonKls = computed(() => [
  ns.base.value,
  `${ns.base.value}--${resolvedType.value}`,
  `${ns.base.value}--${resolvedSize.value}`,
  ns.is("disabled", isDisabled.value),
  ns.is("loading", props.loading),
  ns.is("plain", isPlain.value),
  ns.is("text", isText.value),
  ns.is("link", isLink.value),
  ns.is("round", props.round),
  ns.is("circle", isCircle.value),
  ns.is("block", props.block),
  ns.is("has-bg", hasBg.value),
  ns.is("icon-only", isIconOnly.value)
])
const showLeadingIcon = computed<boolean>(
  () => !props.loading && (Boolean(props.icon) || Boolean(slots.icon) || Boolean(slots.prefix))
)

if (isDev()) {
  watchEffect(() => {
    const requestedVisualModes = [props.plain, props.text, props.link].filter(Boolean).length

    if (requestedVisualModes > 1) {
      warnOnce("XyButton", "`plain`、`text`、`link` 同时传入时会按 `link > text > plain` 归一化。")
    }

    if (props.bg && !isText.value) {
      warnOnce("XyButton", "`bg` 仅在 `text` 模式下生效。")
    }

    if (props.circle && !isIconOnly.value) {
      warnOnce(
        "XyButton",
        "只有纯图标按钮才会应用 `circle` 布局；带文本、suffix 或自定义 loading 内容时会退回普通布局。"
      )
    }

    const hasAccessibleName =
      hasDefaultSlot.value ||
      typeof attrs["aria-label"] === "string" ||
      typeof attrs["aria-labelledby"] === "string"

    if (isIconOnly.value && !hasAccessibleName) {
      warnOnce("XyButton", "纯图标按钮需要提供 `aria-label` 或 `aria-labelledby`。")
    }
  })
}

defineExpose({
  ref: buttonRef,
  size: resolvedSize,
  type: resolvedType,
  disabled: isDisabled
})
</script>

<template>
  <component
    :is="props.tag"
    ref="buttonRef"
    v-bind="buttonAttrs"
    :class="buttonKls"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <template v-if="props.loading">
      <slot v-if="$slots.loading" name="loading" />
      <span v-else class="xy-button__icon xy-button__icon--loading">
        <XyIcon :icon="props.loadingIcon" :size="iconSize" spin />
      </span>
    </template>
    <template v-else-if="showLeadingIcon">
      <span class="xy-button__icon">
        <XyIcon v-if="props.icon" :icon="props.icon" :size="iconSize" />
        <slot v-else-if="$slots.icon" name="icon" />
        <slot v-else name="prefix" />
      </span>
    </template>
    <span v-if="hasDefaultSlot" class="xy-button__label">
      <slot />
    </span>
    <span v-if="$slots.suffix" class="xy-button__icon xy-button__icon--suffix">
      <slot name="suffix" />
    </span>
  </component>
</template>
