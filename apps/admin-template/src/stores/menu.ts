import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<Menu[]>([
    {
      id: 'dashboard',
      name: '仪表盘',
      icon: 'mdi:dashboard',
      path: '/dashboard'
    },
    {
      id: 'system',
      name: '系统管理',
      icon: 'mdi:settings-box',
      children: [
        { id: 'user', name: '用户管理', icon: 'mdi:account', path: '/system/user' },
        { id: 'role', name: '角色管理', icon: 'mdi:shield-account', path: '/system/role' },
        { id: 'menu', name: '菜单管理', icon: 'mdi:menu', path: '/system/menu' },
        { id: 'permission', name: '权限管理', icon: 'mdi:shield-lock', path: '/system/permission' },
        { id: 'log', name: '操作日志', icon: 'mdi:text-box-multiple', path: '/system/log' },
        { id: 'file', name: '文件管理', icon: 'mdi:folder', path: '/system/file' },
        { id: 'announcement', name: '通知公告', icon: 'mdi:bulletin-board', path: '/system/announcement' },
        { id: 'task', name: '任务管理', icon: 'mdi:clock-outline', path: '/system/task' },
        { id: 'monitor', name: '系统监控', icon: 'mdi:monitor-dashboard', path: '/system/monitor' }
      ]
    },
    {
      id: 'business',
      name: '业务管理',
      icon: 'mdi:store',
      children: [
        { id: 'order', name: '订单管理', icon: 'mdi:cart', path: '/business/order' },
        { id: 'product', name: '商品管理', icon: 'mdi:package-variant', path: '/business/product' }
      ]
    },
    {
      id: 'content',
      name: '内容管理',
      icon: 'mdi:file-edit',
      children: [
        { id: 'article', name: '文章管理', icon: 'mdi:file-text', path: '/content/article' },
        { id: 'category', name: '分类管理', icon: 'mdi:folder-multiple', path: '/content/category' }
      ]
    },
    {
      id: 'statistics',
      name: '统计分析',
      icon: 'mdi:chart-bar',
      children: [
        { id: 'report', name: '统计报表', icon: 'mdi:bar-chart', path: '/statistics/report' },
        { id: 'analysis', name: '数据分析', icon: 'mdi:trending-up', path: '/statistics/analysis' },
        { id: 'charts', name: '图表统计', icon: 'mdi:chart-line', path: '/visualization/charts' }
      ]
    },
    {
      id: 'components',
      name: '组件示例',
      icon: 'mdi:view-dashboard',
      children: [
        { id: 'icon', name: '图标库', icon: 'mdi:emoticon', path: '/visualization/icon' }
      ]
    },
    {
      id: 'settings',
      name: '系统设置',
      icon: 'mdi:cog',
      children: [
        { id: 'basic', name: '基础设置', icon: 'mdi:settings', path: '/settings/basic' },
        { id: 'security', name: '安全设置', icon: 'mdi:lock', path: '/settings/security' }
      ]
    }
  ])

  function getMenuByPath(path: string) {
    for (const menu of menus.value) {
      if (menu.path === path) return menu
      if (menu.children) {
        const found = menu.children.find((child: Menu) => child.path === path)
        if (found) return found
      }
    }
    return null
  }

  return {
    menus,
    getMenuByPath
  }
})

export interface Menu {
  id: string
  name: string
  icon: string
  path?: string
  children?: Menu[]
}
