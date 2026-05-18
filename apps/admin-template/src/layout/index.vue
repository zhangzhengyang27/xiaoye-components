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
      <SidebarLogo :collapsed="appStore.sidebarCollapsed" @toggle="appStore.toggleSidebar" />
      
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
            @click="handleMenuClick(menu.path!)"
          >
            <XyIcon :icon="menu.icon" />
            <template #title>{{ menu.name }}</template>
          </XyMenuItem>
          
          <XySubMenu v-else :index="menu.id">
            <template #icon>
              <XyIcon :icon="menu.icon" />
            </template>
            <template #title>{{ menu.name }}</template>
            
            <XyMenuItem
              v-for="child in menu.children"
              :key="child.id"
              :index="child.path"
              @click="handleMenuClick(child.path!)"
            >
              <XyIcon :icon="child.icon" />
              <template #title>{{ child.name }}</template>
            </XyMenuItem>
          </XySubMenu>
        </template>
      </XyMenu>
    </aside>
    
    <div class="admin-content-wrapper">
      <header class="admin-header">
        <Header />
      </header>
      
      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 220px;
  background: #0f172a;
  color: #fff;
  flex-shrink: 0;
  transition: width 0.2s;
  overflow: hidden;
  
  &.collapsed {
    width: 64px;
  }
  
  :deep(.xy-menu) {
    border-right: none;
    background: transparent;
    
    .xy-menu-item,
    .xy-submenu-title {
      color: #cbd5e1;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      
      &.is-active {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
        
        .xy-icon {
          color: #60a5fa;
        }
      }
    }
  }
}

.admin-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-header {
  padding: 0 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
}

.admin-main {
  flex: 1;
  padding: 24px;
  background: #f1f5f9;
  overflow-y: auto;
}
</style>
