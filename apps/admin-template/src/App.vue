<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

watch(() => appStore.themeMode, (mode) => {
  document.documentElement.setAttribute('data-theme', mode)
  document.body.classList.add('theme-transitioning')
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning')
  }, 300)
}, { immediate: true })
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
