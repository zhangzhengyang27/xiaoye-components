import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref<{ name: string; avatar: string; roles: string[] } | null>(null)
  const sidebarCollapsed = ref(false)
  const themeMode = ref<'light' | 'dark'>('light')
  const breadcrumbs = ref<Array<{ path: string; title: string }>>([])

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
    return false
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = null
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

  const sidebarWidth = computed(() => sidebarCollapsed.value ? '64px' : '220px')

  return {
    isLoggedIn,
    userInfo,
    sidebarCollapsed,
    themeMode,
    breadcrumbs,
    sidebarWidth,
    login,
    logout,
    toggleSidebar,
    setThemeMode,
    setBreadcrumbs
  }
})
