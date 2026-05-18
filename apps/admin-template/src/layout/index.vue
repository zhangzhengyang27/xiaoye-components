<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useMenuStore } from '@/stores/menu'
import { XyMenu, XyMenuItem, XySubMenu, XyIcon } from 'xiaoye-components'
import SidebarLogo from './components/SidebarLogo.vue'
import Header from './components/Header.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const menuStore = useMenuStore()

const currentPath = computed(() => route.path)

function handleMenuClick(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
      <div class="sidebar-glow"></div>
      <SidebarLogo :collapsed="appStore.sidebarCollapsed" @toggle="appStore.toggleSidebar" />
      
      <nav class="sidebar-nav">
        <XyMenu
          mode="vertical"
          :collapse="appStore.sidebarCollapsed"
          :default-active="currentPath"
          class="admin-menu"
        >
          <template v-for="menu in menuStore.menus" :key="menu.id">
            <XyMenuItem
              v-if="!menu.children"
              :index="menu.path"
              class="menu-item-wrapper"
              @click="handleMenuClick(menu.path!)"
            >
              <XyIcon :icon="menu.icon" class="menu-icon" />
              <template #title>
                <span class="menu-text">{{ menu.name }}</span>
              </template>
            </XyMenuItem>
            
            <XySubMenu v-else :index="menu.id" class="submenu-wrapper">
              <template #icon>
                <XyIcon :icon="menu.icon" class="menu-icon" />
              </template>
              <template #title>
                <span class="menu-text">{{ menu.name }}</span>
              </template>
              
              <XyMenuItem
                v-for="child in menu.children"
                :key="child.id"
                :index="child.path"
                class="submenu-item"
                @click="handleMenuClick(child.path!)"
              >
                <XyIcon :icon="child.icon" class="menu-icon" />
                <template #title>
                  <span class="menu-text">{{ child.name }}</span>
                </template>
              </XyMenuItem>
            </XySubMenu>
          </template>
        </XyMenu>
      </nav>
      
      <div class="sidebar-footer">
        <div class="footer-glow"></div>
        <div class="system-info">
          <XyIcon icon="mdi:server" :size="16" />
          <span v-show="!appStore.sidebarCollapsed" class="version">v2.0.0</span>
        </div>
      </div>
    </aside>
    
    <div class="admin-content-wrapper">
      <header class="admin-header glass-effect">
        <Header />
      </header>
      
      <main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #0a0e1a;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
}

.admin-sidebar {
  width: var(--admin-sidebar-width);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(3, 7, 18, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
  
  .sidebar-glow {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }
  
  &.collapsed {
    width: var(--admin-sidebar-width-collapsed);
    
    .sidebar-glow {
      width: 60px;
      height: 150px;
    }
    
    .menu-text,
    .version {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }
  }
  
  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 12px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
    }
  }
  
  :deep(.xy-menu) {
    border-right: none;
    background: transparent !important;
    
    .xy-menu-item,
    .xy-submenu__title {
      color: #64748b !important;
      margin: 3px 0;
      border-radius: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      height: 46px;
      line-height: 46px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05) !important;
        color: #94a3b8 !important;
        
        .menu-icon {
          color: #818cf8;
        }
      }
      
      &.is-active {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.12) 100%) !important;
        color: #a5b4fc !important;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 22px;
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.45);
        }
        
        .menu-icon {
          color: #818cf8;
        }
      }
    }
    
    .xy-submenu {
      .xy-menu {
        background: transparent !important;
        
        .xy-menu-item {
          padding-left: 52px !important;
          height: 40px;
          line-height: 40px;
          
          &.is-active::before {
            height: 18px;
          }
        }
      }
    }
  }
  
  .menu-icon {
    font-size: 19px;
    margin-right: 11px;
    transition: color 0.2s ease;
    color: inherit;
  }
  
  .menu-text {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 13.5px;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .sidebar-footer {
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    position: relative;
    
    .footer-glow {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 100px;
      background: radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
      pointer-events: none;
      filter: blur(30px);
    }
    
    .system-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 13px;
      position: relative;
      z-index: 1;
      
      .version {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 500;
      }
    }
  }
}

.admin-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  z-index: 10;
}

.admin-header {
  height: var(--admin-header-height);
  display: flex;
  align-items: center;
  padding: 0 32px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 14, 26, 0.85) !important;
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-main {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
  position: relative;
  background: transparent;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
