# AGENTS.md

## 通用要求

- 每次回答使用中文。
- 优先通过读取仓库上下文后再动手修改，不要先入为主。
- 任务适合并行探索、验证或定点修改时，优先使用子代理；不适合的任务不要强行拆分。
- 搜索文件或文本优先使用 `rg`。
- 不要覆盖或回退用户未明确要求处理的改动。

## 代码约定

- 组件命名统一以 kebab-case 主名为准，例如 `button`、`form-item`。
- TypeScript 中使用对应的 PascalCase 标识符，例如 `XyButton`、`XyFormItem`。
- Vue 模板、文档示例、测试模板中的组件标签统一使用 `xy-button`、`xy-form-item` 这类 kebab-case。
- 修改组件相关逻辑后，优先补齐或更新对应测试。

## 仓库命令

- 安装依赖：`pnpm install`
- 启动文档：`pnpm dev:docs`
- 启动联调：`pnpm dev:playground`
- 测试：`pnpm test`
- 类型检查：`pnpm typecheck`
- Lint：`pnpm lint`

## 目录提示

- `apps/docs`：VitePress 文档站
- `apps/playground`：本地联调 playground
- `packages/components`：组件源码
- `packages/theme`：主题样式
- `packages/xiaoye-components`：聚合导出与发布入口
