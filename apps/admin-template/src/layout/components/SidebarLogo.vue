<script setup lang="ts">
import { XyIcon } from 'xiaoye-components'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="sidebar-logo" :class="{ collapsed }">
    <div class="logo-container">
      <div class="logo-icon">
        <XyIcon icon="mdi:hexagon-slice-6" :size="collapsed ? 28 : 32" />
      </div>
      
      <transition name="logo-fade">
        <div v-show="!collapsed" class="logo-text">
          <h1 class="logo-title">XIAOYE</h1>
          <span class="logo-subtitle">ADMIN</span>
        </div>
      </transition>
    </div>
    
    <button 
      v-if="!collapsed"
      class="toggle-btn"
      @click="$emit('toggle')"
    >
      <XyIcon icon="mdi:chevron-left" :size="18" />
    </button>
    <button 
      v-else
      class="toggle-btn collapsed-toggle"
      @click="$emit('toggle')"
    >
      <XyIcon icon="mdi:chevron-right" :size="18" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--color-border-subtle);
  position: relative;
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-glow-primary);
      transition: all var(--transition-base);
      flex-shrink: 0;
      
      :deep(.xy-icon) {
        color: #fff;
      }
    }
    
    .logo-text {
      overflow: hidden;
      
      .logo-title {
        font-family: var(--font-display);
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.15em;
        margin: 0;
        line-height: 1.2;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .logo-subtitle {
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.25em;
        color: var(--color-text-muted);
        text-transform: uppercase;
      }
    }
  }
  
  .toggle-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border-subtle);
    background: var(--color-bg-glass);
    color: var(--color-text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base);
    
    &:hover {
      background: var(--color-bg-glass-hover);
      color: var(--color-text-secondary);
      border-color: var(--color-border-default);
    }
    
    &.collapsed-toggle {
      position: static;
      transform: none;
      margin-top: 12px;
    }
  }
  
  &.collapsed {
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .logo-container {
      justify-content: center;
    }
  }
}

.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: all var(--transition-base);
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
  width: 0;
  margin: 0;
}
</style>
