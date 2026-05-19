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
  border-bottom: 1px solid var(--admin-border);
  position: relative;
  transition: border-color 0.3s ease;
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
      transition: all 0.3s ease;
      flex-shrink: 0;
      
      :deep(.xy-icon) {
        color: #fff;
      }
    }
    
    .logo-text {
      overflow: hidden;
      
      .logo-title {
        font-family: 'Outfit', sans-serif;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.15em;
        margin: 0;
        line-height: 1.2;
        background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .logo-subtitle {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.25em;
        color: var(--admin-text-muted);
        text-transform: uppercase;
        transition: color 0.3s ease;
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
    border-radius: 6px;
    border: 1px solid var(--admin-border);
    background: transparent;
    color: var(--admin-text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
      border-color: rgba(99, 102, 241, 0.3);
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
  transition: all 0.3s ease;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
  width: 0;
  margin: 0;
}
</style>
