import { defineStore } from 'pinia'
import { ref } from 'vue'

// 文章分类
export interface Category {
  id: number
  name: string
  slug: string
  parentId: number | null
  description: string
  sort: number
  articleCount: number
  createTime: string
}

// 角色
export interface Role {
  id: string
  name: string
  code: string
  description: string
  status: 'active' | 'inactive'
  userCount: number
  permissions: string[]
  createTime: string
}

// 文件
export interface FileItem {
  id: number
  name: string
  url: string
  size: number
  type: 'image' | 'video' | 'document' | 'other'
  mimeType: string
  uploader: string
  createTime: string
}

// 日志
export interface OperationLog {
  id: number
  module: string
  action: string
  method: string
  url: string
  operator: string
  ip: string
  location: string
  params: string
  result: string
  status: 'success' | 'failed'
  duration: number
  time: string
}

// 任务
export interface Task {
  id: number
  name: string
  type: 'backup' | 'cleanup' | 'sync' | 'export' | 'import'
  status: 'pending' | 'running' | 'success' | 'failed'
  progress: number
  cronExpression?: string
  lastRunTime?: string
  nextRunTime?: string
  creator: string
  createTime: string
}

// 报表
export interface Report {
  id: number
  name: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  dateRange: [string, string]
  data: Record<string, number>
  createTime: string
}

export const useMockStore = defineStore('mock', () => {
  // 文章分类
  const categories = ref<Category[]>([
    { id: 1, name: '前端开发', slug: 'frontend', parentId: null, description: '前端技术相关文章', sort: 1, articleCount: 156, createTime: '2024-01-01' },
    { id: 2, name: 'Vue生态', slug: 'vue', parentId: 1, description: 'Vue相关技术', sort: 1, articleCount: 89, createTime: '2024-01-02' },
    { id: 3, name: 'React生态', slug: 'react', parentId: 1, description: 'React相关技术', sort: 2, articleCount: 67, createTime: '2024-01-03' },
    { id: 4, name: '后端开发', slug: 'backend', parentId: null, description: '后端技术相关文章', sort: 2, articleCount: 203, createTime: '2024-01-04' },
    { id: 5, name: 'Node.js', slug: 'nodejs', parentId: 4, description: 'Node.js相关技术', sort: 1, articleCount: 78, createTime: '2024-01-05' },
    { id: 6, name: 'Python', slug: 'python', parentId: 4, description: 'Python相关技术', sort: 2, articleCount: 125, createTime: '2024-01-06' },
    { id: 7, name: '运维部署', slug: 'devops', parentId: null, description: 'DevOps相关技术', sort: 3, articleCount: 45, createTime: '2024-01-07' },
    { id: 8, name: '数据库', slug: 'database', parentId: null, description: '数据库技术文章', sort: 4, articleCount: 67, createTime: '2024-01-08' },
    { id: 9, name: '人工智能', slug: 'ai', parentId: null, description: 'AI相关技术', sort: 5, articleCount: 234, createTime: '2024-01-09' },
    { id: 10, name: '行业资讯', slug: 'news', parentId: null, description: '行业最新资讯', sort: 6, articleCount: 312, createTime: '2024-01-10' }
  ])

  // 角色列表
  const roles = ref<Role[]>([
    { id: 'admin', name: '超级管理员', code: 'SUPER_ADMIN', description: '拥有系统所有权限', status: 'active', userCount: 2, permissions: ['*'], createTime: '2024-01-01' },
    { id: 'manager', name: '运营经理', code: 'MANAGER', description: '负责日常运营管理', status: 'active', userCount: 8, permissions: ['user.view', 'user.edit', 'order.*', 'content.*', 'stats.view'], createTime: '2024-01-02' },
    { id: 'editor', name: '内容编辑', code: 'EDITOR', description: '负责内容编辑发布', status: 'active', userCount: 15, permissions: ['content.*', 'article.publish'], createTime: '2024-01-03' },
    { id: 'analyst', name: '数据分析师', code: 'ANALYST', description: '查看分析数据报表', status: 'active', userCount: 5, permissions: ['stats.*', 'report.view', 'export.*'], createTime: '2024-01-04' },
    { id: 'viewer', name: '访客', code: 'VIEWER', description: '仅可查看数据', status: 'active', userCount: 156, permissions: ['*.view'], createTime: '2024-01-05' },
    { id: 'user', name: '普通用户', code: 'USER', description: '注册用户', status: 'inactive', userCount: 0, permissions: ['profile.*'], createTime: '2024-01-06' }
  ])

  // 文件列表
  const files = ref<FileItem[]>([
    { id: 1, name: 'hero-banner.jpg', url: 'https://picsum.photos/1200/400?random=1', size: 245760, type: 'image', mimeType: 'image/jpeg', uploader: '张三', createTime: '2026-05-18 10:30:25' },
    { id: 2, name: 'product-demo.mp4', url: 'https://example.com/demo.mp4', size: 52428800, type: 'video', mimeType: 'video/mp4', uploader: '李四', createTime: '2026-05-17 15:20:30' },
    { id: 3, name: '用户手册.pdf', url: 'https://example.com/manual.pdf', size: 3145728, type: 'document', mimeType: 'application/pdf', uploader: '王五', createTime: '2026-05-16 09:15:00' },
    { id: 4, name: 'logo.svg', url: 'https://picsum.photos/200/200?random=2', size: 4096, type: 'image', mimeType: 'image/svg+xml', uploader: '赵六', createTime: '2026-05-15 14:45:20' },
    { id: 5, name: '数据报表.xlsx', url: 'https://example.com/report.xlsx', size: 1048576, type: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploader: '钱七', createTime: '2026-05-14 11:30:00' },
    { id: 6, name: '用户头像1.png', url: 'https://picsum.photos/100/100?random=3', size: 32768, type: 'image', mimeType: 'image/png', uploader: '孙八', createTime: '2026-05-13 16:20:10' },
    { id: 7, name: '品牌介绍.docx', url: 'https://example.com/intro.docx', size: 524288, type: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploader: '周九', createTime: '2026-05-12 08:45:30' },
    { id: 8, name: '背景图2.jpg', url: 'https://picsum.photos/1920/1080?random=4', size: 524288, type: 'image', mimeType: 'image/jpeg', uploader: '吴十', createTime: '2026-05-11 13:15:00' }
  ])

  // 操作日志
  const operationLogs = ref<OperationLog[]>([
    { id: 1, module: '用户管理', action: '创建用户', method: 'POST', url: '/api/users', operator: 'admin', ip: '192.168.1.100', location: '北京市朝阳区', params: '{"name":"新用户","email":"new@example.com"}', result: '创建成功，用户ID: 156', status: 'success', duration: 520, time: '2026-05-18 15:30:45' },
    { id: 2, module: '订单管理', action: '更新订单状态', method: 'PUT', url: '/api/orders/123', operator: '张三', ip: '192.168.1.101', location: '上海市浦东新区', params: '{"status":"shipped"}', result: '订单状态已更新', status: 'success', duration: 320, time: '2026-05-18 15:28:30' },
    { id: 3, module: '系统设置', action: '修改系统配置', method: 'PUT', url: '/api/config', operator: 'admin', ip: '192.168.1.100', location: '北京市海淀区', params: '{"siteName":"新名称"}', result: '配置更新失败: 无权限', status: 'failed', duration: 800, time: '2026-05-18 15:25:10' },
    { id: 4, module: '内容管理', action: '发布文章', method: 'POST', url: '/api/articles', operator: '李四', ip: '192.168.1.102', location: '广州市天河区', params: '{"title":"新文章"}', result: '文章已发布', status: 'success', duration: 1250, time: '2026-05-18 15:20:05' },
    { id: 5, module: '文件管理', action: '上传文件', method: 'POST', url: '/api/upload', operator: '王五', ip: '192.168.1.103', location: '深圳市南山区', params: '{"filename":"manual.pdf"}', result: '文件上传成功', status: 'success', duration: 2500, time: '2026-05-18 15:15:00' },
    { id: 6, module: '权限管理', action: '分配角色', method: 'PUT', url: '/api/users/100/role', operator: 'admin', ip: '192.168.1.100', location: '北京市朝阳区', params: '{"roleId":"manager"}', result: '角色分配成功', status: 'success', duration: 450, time: '2026-05-18 14:50:20' },
    { id: 7, module: '数据分析', action: '导出报表', method: 'POST', url: '/api/export/report', operator: '赵六', ip: '192.168.1.104', location: '杭州市西湖区', params: '{"type":"monthly"}', result: '报表已生成', status: 'success', duration: 5200, time: '2026-05-18 14:45:30' },
    { id: 8, module: '系统监控', action: '查看监控面板', method: 'GET', url: '/api/monitor', operator: '钱七', ip: '192.168.1.105', location: '成都市高新区', params: '{}', result: '获取监控数据成功', status: 'success', duration: 280, time: '2026-05-18 14:30:15' }
  ])

  // 定时任务
  const tasks = ref<Task[]>([
    { id: 1, name: '数据库每日备份', type: 'backup', status: 'success', progress: 100, cronExpression: '0 2 * * *', lastRunTime: '2026-05-18 02:00:00', nextRunTime: '2026-05-19 02:00:00', creator: '系统', createTime: '2024-01-01' },
    { id: 2, name: '日志清理', type: 'cleanup', status: 'success', progress: 100, cronExpression: '0 3 * * *', lastRunTime: '2026-05-18 03:00:00', nextRunTime: '2026-05-19 03:00:00', creator: '系统', createTime: '2024-01-02' },
    { id: 3, name: '用户数据同步', type: 'sync', status: 'running', progress: 67, cronExpression: '0 */6 * * *', lastRunTime: '2026-05-18 12:00:00', nextRunTime: '2026-05-18 18:00:00', creator: 'admin', createTime: '2024-01-03' },
    { id: 4, name: '月度数据导出', type: 'export', status: 'pending', progress: 0, cronExpression: '0 0 1 * *', lastRunTime: '2026-05-01 00:00:00', nextRunTime: '2026-06-01 00:00:00', creator: 'admin', createTime: '2024-01-04' },
    { id: 5, name: '缓存预热', type: 'sync', status: 'success', progress: 100, cronExpression: '0 6 * * *', lastRunTime: '2026-05-18 06:00:00', nextRunTime: '2026-05-19 06:00:00', creator: '系统', createTime: '2024-01-05' },
    { id: 6, name: '用户权限同步', type: 'sync', status: 'failed', progress: 45, cronExpression: '0 */4 * * *', lastRunTime: '2026-05-18 08:00:00', nextRunTime: '2026-05-18 16:00:00', creator: 'admin', createTime: '2024-01-06' },
    { id: 7, name: 'CDN缓存刷新', type: 'sync', status: 'success', progress: 100, cronExpression: '0 */2 * * *', lastRunTime: '2026-05-18 15:00:00', nextRunTime: '2026-05-18 17:00:00', creator: '系统', createTime: '2024-01-07' },
    { id: 8, name: '数据统计汇总', type: 'export', status: 'success', progress: 100, cronExpression: '0 1 * * *', lastRunTime: '2026-05-18 01:00:00', nextRunTime: '2026-05-19 01:00:00', creator: '系统', createTime: '2024-01-08' }
  ])

  // 报表数据
  const reports = ref<Report[]>([
    { id: 1, name: '日活用户报表', type: 'daily', dateRange: ['2026-05-18', '2026-05-18'], data: { visits: 12847, users: 4523, newUsers: 234, bounceRate: 35.6, avgSession: 285 }, createTime: '2026-05-18 00:05:00' },
    { id: 2, name: '周订单报表', type: 'weekly', dateRange: ['2026-05-12', '2026-05-18'], data: { orders: 1256, amount: 892340, avgAmount: 710.46, completed: 1089, cancelled: 78 }, createTime: '2026-05-18 00:10:00' },
    { id: 3, name: '月度销售报表', type: 'monthly', dateRange: ['2026-04-01', '2026-04-30'], data: { sales: 4567800, orders: 6789, customers: 3456, returnRate: 2.3 }, createTime: '2026-05-01 00:15:00' },
    { id: 4, name: '季度营收报表', type: 'monthly', dateRange: ['2026-01-01', '2026-03-31'], data: { revenue: 12345678, profit: 4567890, cost: 7777788, margin: 37.0 }, createTime: '2026-04-01 00:20:00' }
  ])

  // CRUD operations for categories
  function addCategory(category: Omit<Category, 'id'>) {
    const newId = Math.max(...categories.value.map(c => c.id), 0) + 1
    categories.value.push({ ...category, id: newId })
    return newId
  }

  function updateCategory(id: number, updates: Partial<Category>) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
    }
  }

  function deleteCategory(id: number) {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  // CRUD operations for roles
  function addRole(role: Omit<Role, 'id'>) {
    const newId = `${Date.now()}`
    roles.value.push({ ...role, id: newId })
    return newId
  }

  function updateRole(id: string, updates: Partial<Role>) {
    const index = roles.value.findIndex(r => r.id === id)
    if (index !== -1) {
      roles.value[index] = { ...roles.value[index], ...updates }
    }
  }

  function deleteRole(id: string) {
    roles.value = roles.value.filter(r => r.id !== id)
  }

  // File operations
  function deleteFile(id: number) {
    files.value = files.value.filter(f => f.id !== id)
  }

  return {
    categories,
    roles,
    files,
    operationLogs,
    tasks,
    reports,
    addCategory,
    updateCategory,
    deleteCategory,
    addRole,
    updateRole,
    deleteRole,
    deleteFile
  }
})

// 用户操作日志
export interface UserActivity {
  id: number
  userId: number
  action: string
  type: 'info' | 'success' | 'warning' | 'danger'
  ip: string
  location: string
  time: string
}

// 用户订单
export interface UserOrder {
  id: string
  userId: number
  product: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'completed'
  createTime: string
}

// 服务器监控
export interface Server {
  id: number
  name: string
  ip: string
  port: number
  status: 'online' | 'offline' | 'warning'
  cpu: number
  memory: number
  disk: number
  uptime: string
}

// 系统日志
export interface SystemLog {
  id: number
  level: 'info' | 'success' | 'warning' | 'error'
  source: string
  message: string
  time: string
}

// 监控数据
export interface MonitorData {
  onlineUsers: number
  totalRequests: number
  avgResponseTime: number
  errorRate: number
  cpu: number
  memory: number
  disk: number
  network: number
}

export const useMonitorStore = defineStore('monitor', () => {
  const servers = ref<Server[]>([
    { id: 1, name: 'Web服务器-01', ip: '192.168.1.100', port: 8080, status: 'online', cpu: 45, memory: 68, disk: 52, uptime: '15天 6小时' },
    { id: 2, name: 'Web服务器-02', ip: '192.168.1.101', port: 8080, status: 'online', cpu: 38, memory: 62, disk: 48, uptime: '15天 6小时' },
    { id: 3, name: '数据库服务器', ip: '192.168.1.102', port: 3306, status: 'online', cpu: 52, memory: 75, disk: 65, uptime: '30天 2小时' },
    { id: 4, name: '缓存服务器', ip: '192.168.1.103', port: 6379, status: 'online', cpu: 28, memory: 45, disk: 30, uptime: '30天 2小时' },
    { id: 5, name: '文件服务器', ip: '192.168.1.104', port: 21, status: 'offline', cpu: 0, memory: 0, disk: 0, uptime: '-' },
    { id: 6, name: '消息队列服务器', ip: '192.168.1.105', port: 5672, status: 'online', cpu: 35, memory: 55, disk: 42, uptime: '20天 8小时' }
  ])

  const logs = ref<SystemLog[]>([
    { id: 1, level: 'info', source: 'Auth', message: '用户 admin 登录系统', time: '2026-05-18 15:30:45' },
    { id: 2, level: 'success', source: 'Database', message: '数据库连接池初始化成功', time: '2026-05-18 15:28:30' },
    { id: 3, level: 'warning', source: 'Monitor', message: 'CPU 使用率超过 80%', time: '2026-05-18 15:25:10' },
    { id: 4, level: 'error', source: 'API', message: '接口 /api/users 响应超时', time: '2026-05-18 15:20:05' },
    { id: 5, level: 'info', source: 'Backup', message: '系统备份任务开始执行', time: '2026-05-18 15:15:00' },
    { id: 6, level: 'success', source: 'Cache', message: '缓存预热完成', time: '2026-05-18 15:10:00' },
    { id: 7, level: 'info', source: 'Queue', message: '消息队列消费者启动成功', time: '2026-05-18 15:05:00' },
    { id: 8, level: 'success', source: 'Scheduler', message: '定时任务调度器已启动', time: '2026-05-18 15:00:00' }
  ])

  const monitorData = ref<MonitorData>({
    onlineUsers: 156,
    totalRequests: 125893,
    avgResponseTime: 125,
    errorRate: 0.15,
    cpu: 45,
    memory: 68,
    disk: 52,
    network: 23
  })

  function refreshData() {
    monitorData.value = {
      onlineUsers: 150 + Math.floor(Math.random() * 20),
      totalRequests: monitorData.value.totalRequests + Math.floor(Math.random() * 100),
      avgResponseTime: 100 + Math.floor(Math.random() * 50),
      errorRate: Math.random() * 0.5,
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100)
    }

    servers.value = servers.value.map(s => ({
      ...s,
      cpu: s.status === 'online' ? Math.floor(Math.random() * 100) : 0,
      memory: s.status === 'online' ? Math.floor(Math.random() * 100) : 0
    }))
  }

  return {
    servers,
    logs,
    monitorData,
    refreshData
  }
})
