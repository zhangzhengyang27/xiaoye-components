<script setup lang="ts">
import { XyIcon } from 'xiaoye-components'

defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="sidebar-logo" :class="{ collapsed }">
    <button class="logo-btn" @click="emit('toggle')">
      <XyIcon icon="mdi:menu" :size="20" />
    </button>
    <div class="logo-content">
      <XyIcon icon="mdi:rocket" :size="28" class="logo-icon" />
      <span class="logo-text">Xiaoye Admin</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid #1e293b;
  
  .logo-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  
  .logo-content {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: 12px;
    overflow: hidden;
    transition: opacity 0.2s;
    
    .logo-icon {
      color: #3b82f6;
    }
    
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
    }
  }
  
  &.collapsed {
    .logo-content {
      opacity: 0;
      width: 0;
      margin-left: 0;
      overflow: hidden;
    }
    
    .logo-btn {
      margin: 0 auto;
    }
  }
}
</style>
