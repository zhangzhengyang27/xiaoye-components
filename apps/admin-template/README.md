# admin-template

管理后台模板，基于 xiaoye-components 构建的完整中后台解决方案。

## 功能特性

- 完整的后台管理系统模板
- 深色/浅色主题切换
- 响应式布局
- 菜单系统
- 状态管理（Pinia）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 文档

- [主题切换实现](./docs/theme-switch.md) - 详细的主题切换方案说明

## 项目结构

```
src/
├── stores/           # Pinia 状态管理
│   ├── app.ts       # 应用状态（侧边栏、主题）
│   ├── menu.ts      # 菜单状态
│   └── user.ts      # 用户状态
├── layout/          # 布局组件
│   ├── index.vue   # 主布局
│   └── components/ # 布局子组件
├── views/          # 页面视图
│   ├── business/   # 业务页面
│   ├── system/     # 系统管理页面
│   └── ...
└── style/         # 全局样式
    └── index.scss  # 主题变量定义
```

## 主题切换

项目实现了完整的深色/浅色主题切换功能，包括：

- 状态持久化（localStorage）
- 平滑过渡动画
- 所有组件样式响应主题变化

详见 [主题切换实现文档](./docs/theme-switch.md)。
