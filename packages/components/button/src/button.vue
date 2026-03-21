<script setup lang="ts">
import { computed } from "vue"
import type { ComponentSize, ComponentStatus } from "@xiaoye/utils"
import { useConfig, useNamespace } from "@xiaoye/composables"

export interface ButtonProps {
  variant?: "solid" | "outline" | "ghost" | "text"
  status?: ComponentStatus
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
  block?: boolean
  nativeType?: "button" | "submit" | "reset"
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "solid",
  status: "primary",
  size: undefined,
  disabled: false,
  loading: false,
  block: false,
  nativeType: "button"
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { size: globalSize } = useConfig()
const ns = useNamespace("button")
const mergedSize = computed(() => props.size ?? globalSize.value)

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  emit("click", event)
}
</script>

<template>
  <button
    :class="[
      ns.base.value,
      `${ns.base.value}--${props.variant}`,
      `${ns.base.value}--${props.status}`,
      `${ns.base.value}--${mergedSize}`,
      ns.is('block', props.block),
      ns.is('loading', props.loading)
    ]"
    :disabled="props.disabled || props.loading"
    :type="props.nativeType"
    @click="handleClick"
  >
    <span v-if="props.loading" class="xy-button__spinner" />
    <span v-if="$slots.prefix" class="xy-button__prefix">
      <slot name="prefix" />
    </span>
    <span class="xy-button__label">
      <slot />
    </span>
    <span v-if="$slots.suffix" class="xy-button__suffix">
      <slot name="suffix" />
    </span>
  </button>
</template>
