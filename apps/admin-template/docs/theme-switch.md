---
title: 主题切换实现
description: 在管理后台模板中实现深色/浅色主题切换的完整方案。
keywords:
  - theme
  - dark mode
  - light mode
  - admin template
  - CSS variables
---

# 主题切换实现

本文档描述如何在管理后台模板中实现完整的深色/浅色主题切换功能，包括状态管理、CSS 变量设计、组件样式适配和过渡动画。

## 概述

### 技术方案

- **CSS 变量驱动**：使用 CSS 自定义属性（Custom Properties）定义主题变量
- **状态持久化**：使用 localStorage 保存用户主题偏好
- **平滑过渡**：添加 CSS transition 实现主题切换动画
- **组件级适配**：确保所有组件样式都响应主题变化

### 目录结构

```
apps/admin-template/src/
├── stores/
│   └── app.ts              # 应用状态管理（含主题状态）
├── layout/
│   ├── index.vue           # 布局组件
│   └── components/
│       ├── Header.vue      # 头部组件（含主题切换按钮）
│       └── SidebarLogo.vue # Logo 组件
├── style/
│   └── index.scss          # 全局样式（含主题变量定义）
└── views/
    └── business/
        └── order/
            └── index.vue   # 业务页面（展示主题效果）
```

---

## 主题状态管理

### Pinia Store 实现

```typescript
// stores/app.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)
  
  // 主题状态
  const isDark = ref(true)
  
  // 切换侧边栏
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 切换主题
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
  }
  
  // 应用主题到 DOM
  function applyTheme() {
    const html = document.documentElement
    if (isDark.value) {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', 'light')
    }
    // 保存到 localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  
  // 初始化主题
  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // 默认跟随系统
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }
  
  // 监听主题变化
  watch(isDark, applyTheme)
  
  return {
    sidebarCollapsed,
    isDark,
    toggleSidebar,
    toggleTheme,
    initTheme
  }
})
```

### 应用入口初始化

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// 初始化主题（需要在挂载前执行）
const appStore = useAppStore()
appStore.initTheme()

app.mount('#app')
```

---

## CSS 变量设计

### 变量定义结构

```scss
// src/style/index.scss

// =============================================
// 全局 CSS 变量（深色主题默认）
// =============================================
:root {
  // 布局变量
  --admin-sidebar-width: 220px;
  --admin-sidebar-width-collapsed: 64px;
  --admin-header-height: 64px;
  
  // 深色主题颜色变量
  --admin-bg: #0a0e1a;
  --admin-text: #e2e8f0;
  --admin-text-secondary: #64748b;
  --admin-text-muted: #475569;
  --admin-card-bg: rgba(15, 23, 42, 0.6);
  --admin-card-header-bg: rgba(15, 23, 42, 0.4);
  --admin-border: rgba(255, 255, 255, 0.06);
  --admin-sidebar-bg: linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(3, 7, 18, 0.98) 100%);
  --admin-header-bg: rgba(10, 14, 26, 0.85);
  --admin-sidebar-glow: rgba(99, 102, 241, 0.12);
  
  // 表格变量
  --xy-table-header-background: rgba(15, 23, 42, 0.95);
  --xy-table-header-color: #64748b;
  --xy-table-row-hover-background: rgba(99, 102, 241, 0.06);
  --xy-table-row-current-background: rgba(99, 102, 241, 0.1);
  --xy-table-row-striped-background: rgba(255, 255, 255, 0.01);
  --xy-table-border-color: rgba(255, 255, 255, 0.06);
  --xy-table-cell-color: #cbd5e1;
  
  // 输入框变量
  --xy-input-bg: rgba(255, 255, 255, 0.03);
  --xy-input-border: rgba(255, 255, 255, 0.08);
  --xy-input-hover-border: rgba(255, 255, 255, 0.12);
  --xy-input-text: #e2e8f0;
  --xy-input-placeholder: #475569;
  
  // 分页变量
  --xy-pagination-bg: rgba(255, 255, 255, 0.04);
  --xy-pagination-border: rgba(255, 255, 255, 0.08);
  --xy-pagination-text: #94a3b8;
  
  // 滚动条变量
  --scrollbar-track: rgba(255, 255, 255, 0.03);
  --scrollbar-thumb: rgba(255, 255, 255, 0.1);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.18);
  
  // 按钮变量
  --xy-button-default-bg: rgba(255, 255, 255, 0.04);
  --xy-button-default-border: rgba(255, 255, 255, 0.08);
  --xy-button-default-text: #94a3b8;
}

// =============================================
// 亮色主题变量覆盖
// =============================================
[data-theme="light"] {
  --admin-bg: #f8fafc;
  --admin-text: #1e293b;
  --admin-text-secondary: #64748b;
  --admin-text-muted: #94a3b8;
  --admin-card-bg: rgba(255, 255, 255, 0.85);
  --admin-card-header-bg: rgba(248, 250, 252, 0.9);
  --admin-border: rgba(0, 0, 0, 0.08);
  --admin-sidebar-bg: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  --admin-header-bg: rgba(248, 250, 252, 0.95);
  --admin-sidebar-glow: rgba(99, 102, 241, 0.08);
  
  // 表格变量
  --xy-table-header-background: rgba(248, 250, 252, 0.95);
  --xy-table-header-color: #64748b;
  --xy-table-row-hover-background: rgba(99, 102, 241, 0.04);
  --xy-table-row-current-background: rgba(99, 102, 241, 0.08);
  --xy-table-row-striped-background: rgba(0, 0, 0, 0.01);
  --xy-table-border-color: rgba(0, 0, 0, 0.06);
  --xy-table-cell-color: #475569;
  
  // 输入框变量
  --xy-input-bg: rgba(255, 255, 255, 0.8);
  --xy-input-border: rgba(0, 0, 0, 0.1);
  --xy-input-hover-border: rgba(0, 0, 0, 0.15);
  --xy-input-text: #1e293b;
  --xy-input-placeholder: #94a3b8;
  
  // 分页变量
  --xy-pagination-bg: rgba(255, 255, 255, 0.8);
  --xy-pagination-border: rgba(0, 0, 0, 0.08);
  --xy-pagination-text: #64748b;
  
  // 滚动条变量
  --scrollbar-track: rgba(0, 0, 0, 0.03);
  --scrollbar-thumb: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.25);
  
  // 按钮变量
  --xy-button-default-bg: rgba(255, 255, 255, 0.9);
  --xy-button-default-border: rgba(0, 0, 0, 0.1);
  --xy-button-default-text: #64748b;
}
```

---

## 布局组件适配

### 侧边栏样式

```vue
<!-- layout/index.vue -->
<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--admin-bg);
  position: relative;
  transition: background 0.3s ease;
}

.admin-sidebar {
  width: var(--admin-sidebar-width);
  background: var(--admin-sidebar-bg);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--admin-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .sidebar-glow {
    background: radial-gradient(ellipse, var(--admin-sidebar-glow) 0%, transparent 70%);
    transition: background 0.3s ease;
  }
  
  :deep(.xy-menu) {
    .xy-menu-item,
    .xy-submenu__title {
      color: var(--admin-text-secondary) !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        background: rgba(99, 102, 241, 0.05) !important;
        color: var(--admin-text) !important;
      }
      
      &.is-active {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.12) 100%) !important;
        color: #a5b4fc !important;
      }
    }
  }
  
  .sidebar-footer {
    border-top: 1px solid var(--admin-border);
    transition: border-color 0.3s ease;
    
    .system-info {
      color: var(--admin-text-secondary);
      transition: color 0.3s ease;
    }
  }
}

.admin-header {
  background: var(--admin-header-bg) !important;
  border-bottom: 1px solid var(--admin-border);
  transition: all 0.3s ease;
}
</style>
```

### 头部主题切换按钮

```vue
<!-- layout/components/Header.vue -->
<template>
  <div class="header-content">
    <!-- 面包屑等 -->
    
    <div class="header-actions">
      <!-- 主题切换按钮 -->
      <button 
        class="action-btn theme-toggle"
        :title="isDark ? '切换到浅色主题' : '切换到深色主题'"
        @click="toggleTheme"
      >
        <!-- 深色图标 -->
        <svg v-if="isDark" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <!-- 浅色图标 -->
        <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const isDark = computed(() => appStore.isDark)

function toggleTheme() {
  appStore.toggleTheme()
}
</script>

<style lang="scss" scoped>
.theme-toggle {
  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
    color: #818cf8;
  }
  
  .theme-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }
  
  &:hover .theme-icon {
    transform: rotate(15deg) scale(1.1);
  }
}
</style>
```

---

## 组件样式覆盖

### 表格样式

```scss
// src/style/index.scss

// 表格主体
.xy-table,
[data-theme] .xy-table {
  background: transparent !important;
  border: none !important;

  .xy-table__header-cell {
    background: var(--xy-table-header-background) !important;
    color: var(--xy-table-header-color) !important;
    border-bottom: 1px solid rgba(99, 102, 241, 0.2) !important;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .xy-table__cell {
    background: transparent !important;
    border-bottom: 1px solid var(--xy-table-border-color) !important;
    color: var(--xy-table-cell-color) !important;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .xy-table__row:hover > .xy-table__cell {
    background: var(--xy-table-row-hover-background) !important;
  }

  &.is-striped {
    .xy-table__row:nth-child(even) > .xy-table__cell {
      background: var(--xy-table-row-striped-background) !important;
    }
  }
}
```

### 卡片样式

```scss
.xy-card {
  border: 1px solid var(--admin-border);
  background: var(--admin-card-bg);
  transition: all 0.3s ease;

  &__header {
    background: var(--admin-card-header-bg);
    border-bottom: 1px solid var(--admin-border);
    transition: all 0.3s ease;
  }

  &__body {
    color: var(--xy-table-cell-color);
  }
}
```

---

## 业务页面适配

### 页面样式使用 CSS 变量

```vue
<!-- views/business/order/index.vue -->
<style lang="scss" scoped>
.order-management {
  .page-header {
    .header-left {
      .page-title {
        color: var(--admin-text);
        transition: color 0.3s ease;
      }
      
      .page-desc {
        color: var(--admin-text-secondary);
        transition: color 0.3s ease;
      }
    }
    
    .order-stats {
      border-top: 1px solid var(--admin-border);
      transition: border-color 0.3s ease;
      
      .stat-item .stat-content {
        background: var(--xy-table-row-striped-background);
        transition: background 0.3s ease;
        
        .stat-label {
          color: var(--admin-text-secondary);
          transition: color 0.3s ease;
        }
      }
    }
  }
  
  .customer-info {
    .customer-name {
      color: var(--admin-text);
      transition: color 0.3s ease;
    }
    
    .customer-phone {
      color: var(--admin-text-muted);
      transition: color 0.3s ease;
    }
  }
}
</style>
```

---

## 过渡动画

### 主题过渡动画

```scss
// src/style/index.scss

// =============================================
// 主题过渡动画
// =============================================
.theme-transitioning,
.theme-transitioning * {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease !important;
}

// 全局元素过渡
html, body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 切换按钮动画

```vue
<style lang="scss" scoped>
.theme-toggle {
  .theme-icon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:active .theme-icon {
    transform: rotate(180deg) scale(0.9);
  }
}
</style>
```

---

## 最佳实践

### 1. 变量命名规范

```scss
// 布局相关：--admin-*
--admin-bg
--admin-text
--admin-sidebar-bg

// 组件相关：--xy-组件名-属性
--xy-table-header-background
--xy-input-border
--xy-button-default-bg

// 通用：--scrollbar-*
--scrollbar-track
--scrollbar-thumb
```

### 2. 避免硬编码颜色

❌ **错误做法**：
```scss
.page-title {
  color: #1e293b; // 硬编码
}
```

✅ **正确做法**：
```scss
.page-title {
  color: var(--admin-text);
}
```

### 3. 测试覆盖完整性

主题切换后需要验证以下元素：

- [ ] 布局容器（侧边栏、头部、主内容区）
- [ ] 导航菜单
- [ ] 表格（表头、单元格、斑马纹）
- [ ] 表单组件（输入框、下拉框）
- [ ] 按钮
- [ ] 卡片
- [ ] 分页
- [ ] 弹窗/抽屉
- [ ] 滚动条

### 4. 持久化策略

```typescript
// 优先级：localStorage > 系统偏好
function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}
```

---

## 相关资源

- [CSS 自定义属性规范](https://www.w3.org/TR/css-variables/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
- [xiaoye-components 主题定制指南](/guide/theming)
