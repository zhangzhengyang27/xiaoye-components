<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { XyIcon, XyDropdown, XyDropdownMenu, XyDropdownItem, XyTooltip } from 'xiaoye-components'

const router = useRouter()
const appStore = useAppStore()

function handleLogout() {
  appStore.logout()
  router.push('/login')
}

function goToProfile() {
  router.push('/profile')
}

function goToSettings() {
  router.push('/settings/basic')
}

function toggleTheme() {
  const newMode = appStore.themeMode === 'light' ? 'dark' : 'light'
  appStore.setThemeMode(newMode)
}
</script>

<template>
  <div class="admin-header-content">
    <div class="header-left">
      <button class="sidebar-toggle" @click="appStore.toggleSidebar">
        <XyIcon icon="mdi:menu" :size="20" />
      </button>
    </div>
    
    <div class="header-right">
      <XyTooltip content="切换主题">
        <button class="theme-toggle" @click="toggleTheme">
          <XyIcon :icon="appStore.themeMode === 'light' ? 'mdi:moon' : 'mdi:sun'" :size="20" />
        </button>
      </XyTooltip>
      
      <XyTooltip content="通知">
        <button class="notification-btn">
          <XyIcon icon="mdi:bell" :size="20" />
          <span class="badge">3</span>
        </button>
      </XyTooltip>
      
      <XyDropdown>
        <template #trigger>
          <button class="user-btn">
            <XyIcon icon="mdi:account-circle" :size="24" />
            <span class="user-name">{{ appStore.userInfo?.name }}</span>
            <XyIcon icon="mdi:chevron-down" :size="16" />
          </button>
        </template>
        
        <XyDropdownMenu>
          <XyDropdownItem @click="goToProfile">
            <XyIcon icon="mdi:account" :size="16" />
            <span>个人中心</span>
          </XyDropdownItem>
          <XyDropdownItem @click="goToSettings">
            <XyIcon icon="mdi:settings" :size="16" />
            <span>账户设置</span>
          </XyDropdownItem>
          <XyDropdownItem divided @click="handleLogout">
            <XyIcon icon="mdi:logout" :size="16" />
            <span>退出登录</span>
          </XyDropdownItem>
        </XyDropdownMenu>
      </XyDropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  
  .header-left {
    .sidebar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: #f1f5f9;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #e2e8f0;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .theme-toggle,
    .notification-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: #f1f5f9;
      color: #475569;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
      
      &:hover {
        background: #e2e8f0;
      }
      
      .badge {
        position: absolute;
        top: 4px;
        right: 4px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 8px;
        background: #ef4444;
        color: #fff;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
      }
    }
    
    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #f1f5f9;
      }
      
      .user-name {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}
</style>
