<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { XyIcon, XyAvatar, XyDropdown, XyDropdownMenu, XyDropdownItem, XyBadge } from 'xiaoye-components'

const appStore = useAppStore()
const router = useRouter()

const showNotifications = ref(false)

const userMenuOptions = [
  { key: 'profile', icon: 'mdi:account-circle', label: '个人中心' },
  { key: 'settings', icon: 'mdi:cog', label: '账户设置' },
  { divider: true },
  { key: 'logout', icon: 'mdi:logout', label: '退出登录' }
]

function handleUserCommand(command: string) {
  if (command === 'logout') {
    appStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<template>
  <div class="header-content">
    <div class="header-left">
      <button class="collapse-btn" @click="appStore.toggleSidebar">
        <XyIcon :icon="appStore.sidebarCollapsed ? 'mdi:menu' : 'mdi:menu-open'" :size="22" />
      </button>
      
      <div class="breadcrumb">
        <span class="breadcrumb-text">控制台</span>
      </div>
    </div>
    
    <div class="header-right">
      <div class="header-actions">
        <button class="action-btn" @click="showNotifications = !showNotifications">
          <XyIcon icon="mdi:bell-outline" :size="20" />
          <XyBadge :value="2" :max="99" class="notification-badge" />
        </button>
        
        <button class="action-btn">
          <XyIcon icon="mdi:magnify" :size="20" />
        </button>
        
        <button class="action-btn theme-toggle">
          <XyIcon icon="mdi:theme-light-dark" :size="20" />
        </button>
      </div>
      
      <div class="user-section">
        <div class="user-info">
          <span class="user-name">{{ appStore.userInfo?.name || '管理员' }}</span>
          <span class="user-role">超级管理员</span>
        </div>
        
        <XyDropdown trigger="click" @command="handleUserCommand">
          <XyAvatar 
            :size="40" 
            class="user-avatar cursor-pointer"
          >
            {{ (appStore.userInfo?.name || 'A')[0].toUpperCase() }}
          </XyAvatar>
          
          <template #dropdown>
            <XyDropdownMenu>
              <template v-for="option in userMenuOptions" :key="option.key">
                <XyDropdownItem v-if="!option.divider" :command="option.key">
                  <XyIcon :icon="option.icon" :size="16" />
                  <span>{{ option.label }}</span>
                </XyDropdownItem>
                <div v-else class="dropdown-divider"></div>
              </template>
            </XyDropdownMenu>
          </template>
        </XyDropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
  
  .breadcrumb {
    .breadcrumb-text {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #f1f5f9;
      letter-spacing: -0.01em;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    
    .action-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #f1f5f9;
      }
      
      &.theme-toggle:hover {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
        color: #a5b4fc;
      }
      
      .notification-badge {
        position: absolute;
        top: 6px;
        right: 6px;
      }
    }
  }
  
  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 20px;
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    
    .user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      .user-name {
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
        line-height: 1.3;
      }
      
      .user-role {
        font-size: 12px;
        color: #64748b;
        line-height: 1.3;
      }
    }
    
    .user-avatar {
      transition: transform 0.2s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.dropdown-divider {
  height: 1px;
  margin: 7px 0;
  background: rgba(255, 255, 255, 0.06);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
