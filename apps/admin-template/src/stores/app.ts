import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref<{ name: string; avatar: string; roles: string[] } | null>(null)
  const sidebarCollapsed = ref(false)
  const themeMode = ref<'light' | 'dark'>('dark')
  const breadcrumbs = ref<Array<{ path: string; title: string }>>([])

  // 从 localStorage 恢复登录状态
  function restoreFromStorage() {
    try {
      const stored = localStorage.getItem('xiaoye-admin-auth')
      if (stored) {
        const data = JSON.parse(stored)
        isLoggedIn.value = data.isLoggedIn ?? false
        userInfo.value = data.userInfo ?? null
        sidebarCollapsed.value = data.sidebarCollapsed ?? false
        themeMode.value = data.themeMode ?? 'dark'
      }
    } catch (e) {
      console.warn('Failed to restore from storage:', e)
    }
  }

  // 保存到 localStorage
  function saveToStorage() {
    try {
      localStorage.setItem('xiaoye-admin-auth', JSON.stringify({
        isLoggedIn: isLoggedIn.value,
        userInfo: userInfo.value,
        sidebarCollapsed: sidebarCollapsed.value,
        themeMode: themeMode.value
      }))
    } catch (e) {
      console.warn('Failed to save to storage:', e)
    }
  }

  // 监听变化自动保存
  watch([isLoggedIn, userInfo, sidebarCollapsed, themeMode], saveToStorage, { deep: true })

  // 初始化时恢复状态
  restoreFromStorage()

  function login(username: string, password: string) {
    if (username === 'admin' && password === '123456') {
      isLoggedIn.value = true
      userInfo.value = {
        name: '管理员',
        avatar: '',
        roles: ['admin']
      }
      return true
    }
    if (username === 'user' && password === 'user123') {
      isLoggedIn.value = true
      userInfo.value = {
        name: '普通用户',
        avatar: '',
        roles: ['user']
      }
      return true
    }
    if (username === 'guest' && password === 'guest123') {
      isLoggedIn.value = true
      userInfo.value = {
        name: '访客',
        avatar: '',
        roles: ['guest']
      }
      return true
    }
    return false
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = null
    localStorage.removeItem('xiaoye-admin-auth')
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setThemeMode(mode: 'light' | 'dark') {
    themeMode.value = mode
  }

  function setBreadcrumbs(items: Array<{ path: string; title: string }>) {
    breadcrumbs.value = items
  }

  return {
    isLoggedIn,
    userInfo,
    sidebarCollapsed,
    themeMode,
    breadcrumbs,
    login,
    logout,
    toggleSidebar,
    setThemeMode,
    setBreadcrumbs
  }
})
