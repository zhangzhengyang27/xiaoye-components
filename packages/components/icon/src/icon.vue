<script setup lang="ts">
import { computed } from "vue"
import { Icon as IconifyIcon } from "@iconify/vue"
import { useNamespace } from "@xiaoye/composables"

export interface IconProps {
  icon: string
  size?: number | string
  rotate?: number
  spin?: boolean
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 16,
  rotate: 0,
  spin: false
})

const ns = useNamespace("icon")
const pixelSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
)
const style = computed(() => ({
  width: pixelSize.value,
  height: pixelSize.value,
  transform: `rotate(${props.rotate}deg)`
}))
</script>

<template>
  <span :class="[ns.base.value, ns.is('spin', props.spin)]" aria-hidden="true">
    <IconifyIcon :icon="props.icon" :style="style" focusable="false" />
  </span>
</template>