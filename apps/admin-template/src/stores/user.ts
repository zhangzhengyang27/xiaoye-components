import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([
    { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138001', status: 'active', role: 'admin', createTime: '2024-01-15' },
    { id: 2, name: '李四', email: 'lisi@example.com', phone: '13800138002', status: 'active', role: 'editor', createTime: '2024-01-16' },
    { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13800138003', status: 'inactive', role: 'user', createTime: '2024-01-17' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '13800138004', status: 'active', role: 'editor', createTime: '2024-01-18' },
    { id: 5, name: '钱七', email: 'qianqi@example.com', phone: '13800138005', status: 'active', role: 'user', createTime: '2024-01-19' }
  ])

  const roles = ref<Role[]>([
    { id: 'admin', name: '管理员', description: '拥有所有权限' },
    { id: 'editor', name: '编辑', description: '可以编辑内容' },
    { id: 'user', name: '普通用户', description: '仅可查看' }
  ])

  function addUser(user: Omit<User, 'id'>) {
    const newId = Math.max(...users.value.map((u: User) => u.id)) + 1
    users.value.push({ ...user, id: newId })
  }

  function updateUser(id: number, updates: Partial<User>) {
    const index = users.value.findIndex((u: User) => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates }
    }
  }

  function deleteUser(id: number) {
    users.value = users.value.filter((u: User) => u.id !== id)
  }

  return {
    users,
    roles,
    addUser,
    updateUser,
    deleteUser
  }
})

export interface User {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  role: string
  createTime: string
}

export interface Role {
  id: string
  name: string
  description: string
}
