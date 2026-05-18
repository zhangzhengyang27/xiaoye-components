import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'mdi:dashboard' }
      },
      {
        path: '/system/user',
        name: 'UserManagement',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'mdi:account' }
      },
      {
        path: '/system/user/:id',
        name: 'UserDetail',
        component: () => import('@/views/system/user/detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: '/system/role',
        name: 'RoleManagement',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'mdi:shield-account' }
      },
      {
        path: '/system/menu',
        name: 'MenuManagement',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'mdi:menu' }
      },
      {
        path: '/system/log',
        name: 'OperationLog',
        component: () => import('@/views/system/log/index.vue'),
        meta: { title: '操作日志', icon: 'mdi:text-box-multiple' }
      },
      {
        path: '/system/permission',
        name: 'PermissionManagement',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '权限管理', icon: 'mdi:shield-lock' }
      },
      {
        path: '/system/file',
        name: 'FileManagement',
        component: () => import('@/views/system/file/index.vue'),
        meta: { title: '文件管理', icon: 'mdi:folder' }
      },
      {
        path: '/system/announcement',
        name: 'AnnouncementManagement',
        component: () => import('@/views/system/announcement/index.vue'),
        meta: { title: '通知公告', icon: 'mdi:bulletin-board' }
      },
      {
        path: '/system/task',
        name: 'TaskManagement',
        component: () => import('@/views/system/task/index.vue'),
        meta: { title: '任务管理', icon: 'mdi:clock-outline' }
      },
      {
        path: '/system/monitor',
        name: 'SystemMonitor',
        component: () => import('@/views/system/monitor/index.vue'),
        meta: { title: '系统监控', icon: 'mdi:monitor-dashboard' }
      },
      {
        path: '/content/article',
        name: 'ArticleManagement',
        component: () => import('@/views/content/article/index.vue'),
        meta: { title: '文章管理', icon: 'mdi:file-text' }
      },
      {
        path: '/content/category',
        name: 'CategoryManagement',
        component: () => import('@/views/content/category/index.vue'),
        meta: { title: '分类管理', icon: 'mdi:folder-multiple' }
      },
      {
        path: '/statistics/report',
        name: 'StatisticsReport',
        component: () => import('@/views/statistics/report/index.vue'),
        meta: { title: '统计报表', icon: 'mdi:bar-chart' }
      },
      {
        path: '/statistics/analysis',
        name: 'DataAnalysis',
        component: () => import('@/views/statistics/analysis/index.vue'),
        meta: { title: '数据分析', icon: 'mdi:trending-up' }
      },
      {
        path: '/settings/basic',
        name: 'BasicSettings',
        component: () => import('@/views/settings/basic/index.vue'),
        meta: { title: '基础设置', icon: 'mdi:settings' }
      },
      {
        path: '/settings/security',
        name: 'SecuritySettings',
        component: () => import('@/views/settings/security/index.vue'),
        meta: { title: '安全设置', icon: 'mdi:lock' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', icon: 'mdi:account-circle' }
      },
      {
        path: '/business/order',
        name: 'OrderManagement',
        component: () => import('@/views/business/order/index.vue'),
        meta: { title: '订单管理', icon: 'mdi:cart' }
      },
      {
        path: '/business/product',
        name: 'ProductManagement',
        component: () => import('@/views/business/product/index.vue'),
        meta: { title: '商品管理', icon: 'mdi:package-variant' }
      },
      {
        path: '/visualization/charts',
        name: 'ChartsDashboard',
        component: () => import('@/views/visualization/charts/index.vue'),
        meta: { title: '图表统计', icon: 'mdi:chart-line' }
      },
      {
        path: '/visualization/icon',
        name: 'IconGallery',
        component: () => import('@/views/visualization/icon/index.vue'),
        meta: { title: '图标库', icon: 'mdi:emoticon' }
      },
      {
        path: '/error/403',
        name: 'Forbidden',
        component: () => import('@/views/error/403.vue'),
        meta: { title: '403', hidden: true }
      },
      {
        path: '/error/500',
        name: 'ServerError',
        component: () => import('@/views/error/500.vue'),
        meta: { title: '500', hidden: true }
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue'),
        meta: { title: '404', hidden: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
