<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'

interface TabsContext {
  currentValue: ComputedRef<string>
  updateActive: (name: string) => void
  registerTab: (item: { key: string; label: string; disabled?: boolean; closable?: boolean }) => void
  unregisterTab: (key: string) => void
}

const props = withDefaults(defineProps<{
  label?: string
  name: string
  disabled?: boolean
  closable?: boolean
}>(), {
  disabled: false,
  closable: true
})

const tabsContext = inject<TabsContext | null>('tabsContext', null)

if (tabsContext) {
  tabsContext.registerTab({
    key: props.name,
    label: props.label || props.name,
    disabled: props.disabled,
    closable: props.closable
  })
}

const isActive = computed(() => {
  return tabsContext?.currentValue.value === props.name
})
</script>

<template>
  <div
    v-if="isActive"
    class="xy-tab-pane"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.xy-tab-pane {
  padding: 20px;
}
</style>
