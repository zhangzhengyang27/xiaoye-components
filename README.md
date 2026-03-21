# xiaoye-components

`xiaoye-components` 是一个面向中后台系统的 Vue 3 组件库，主打低心智负担的 API、一致的类型体验和可直接落地的文档案例。

## 当前状态

- 项目阶段：`v0` 基础建设
- 目标：优先完成中后台高频组件的最小可用闭环
- 技术栈：`Vue 3 + TypeScript + Vite + pnpm`

## 本地开发

```bash
pnpm install
pnpm dev:docs
```

常用命令：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 仓库结构

- `apps/docs`：VitePress 文档站
- `apps/playground`：本地联调 playground
- `packages/components`：组件源码
- `packages/theme`：Token 和组件样式
- `packages/tokens`：设计 Token 定义
- `packages/xiaoye-components`：聚合导出与发布入口

## 路线

- `0.1.x`：基础设施、主题系统、基础组件
- `0.2.x`：表单链路和高频交互组件
- `0.3.x`：表格和示例页面
- `0.4.x`：首个可推广的公开版本

