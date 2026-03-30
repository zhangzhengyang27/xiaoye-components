# AGENTS.md

## 通用要求

- 每次回答使用中文。
- 接到新任务时，先用自己的理解复述目标；如果问题有歧义或关键信息缺失，先向用户确认，不要盲目修改。
- 优先通过读取仓库上下文后再动手修改，不要先入为主。
- 任务适合并行探索、验证或定点修改时，优先使用子代理；不适合的任务不要强行拆分。
- 搜索文件或文本优先使用 `rg`。
- 不要覆盖或回退用户未明确要求处理的改动。

## 代码约定

- 组件目录统一放在 `packages/components/<name>`，通常包含 `index.ts`、`src/`、`__tests__/`。
- 组件命名统一以 kebab-case 主名为准，例如 `button`、`form-item`、`time-picker`、`input-number`。
- TypeScript 中使用对应的 PascalCase 标识符，例如 `XyButton`、`XyFormItem`、`XyTimePicker`。
- Vue 模板、文档示例、测试模板中的组件标签统一使用 `xy-button`、`xy-form-item`、`xy-time-picker` 这类 kebab-case。
- 新增或修改组件时，除源码外，优先同步检查这些入口是否需要更新：
  - `packages/components/component-manifest.ts`
  - `packages/components/index.ts`
  - `packages/theme/index.css`
- 组件清单、文档侧边栏、聚合安装断言和一致性校验以 `packages/components/component-manifest.ts` 为主源，避免多处手工同步。
- 修改组件相关逻辑后，优先补齐或更新对应单测；如果组件有类型导出或安装入口变化，也要检查 `tests/types/fixtures` 和 `packages/xiaoye-components/__tests__`。

## 增强层导出规则

- 增强组件源码统一位于 `packages/pro-components/<name>`，并通过 `packages/pro-components/component-manifest.json` 维护 21 个正式公开增强组件清单。
- 新增或修改增强组件时，优先同步检查这些入口是否需要更新：
  - `packages/pro-components/component-manifest.json`
  - `packages/pro-components/exports.ts`
  - `packages/pro-components/index.ts`
  - `packages/pro-components/style.css`
  - `packages/xiaoye-pro-components/index.ts`
  - `tests/types/fixtures/xiaoye-pro-components.ts`
  - `tests/types/fixtures/pro-root-boundary.ts`
  - `scripts/check-pro-components.mjs`
- `packages/pro-components/exports.ts` 只允许显式导出正式公开增强组件值，例如 `XyProTable`、`XyListPage`；不要在这里使用 `export *`，也不要把组件类型从这里抛到包根。
- `packages/pro-components/index.ts` 是增强层根入口白名单：
  - 只允许导出正式公开增强组件值。
  - 类型只允许导出每个公开增强组件的主 `Props / Instance / 主数据类型`，以及 `core.ts` 里的稳定共享协议类型。
  - 插槽入参、事件载荷、组件内部状态枚举、props 字面量联合、对共享类型的业务别名，默认不应出现在根入口。
- 如果某个类型只适合组件子入口使用，应保留在 `packages/pro-components/<name>/index.ts` 或源码内部，不要再把它抬到 `@xiaoye/pro-components` / `xiaoye-pro-components` 根入口。
- 旧兼容类型如果必须保留，应只保留在源码层，并显式标注 `@deprecated`；默认不要继续从组件 `index.ts` 或包根对外导出。
- 增强层根入口边界由两层守卫共同维护：
  - `scripts/check-pro-components.mjs` 会校验组件值导出白名单和根入口类型白名单。
  - `tests/types/fixtures/pro-root-boundary.ts` 会校验一批已降级的细节类型无法再从根入口导入。
- 修改增强层公开导出后，至少补跑：
  - `pnpm check:pro-components`
  - `pnpm typecheck:types`
  - 视影响范围再补 `pnpm typecheck:packages`、`pnpm build:docs`、`pnpm build:lib`

## 当前组件范围

- 当前 `packages/components/index.ts` 已导出 62 个组件：
  - 配置入口：`config-provider`
  - 基础与展示：`icon`、`button`、`link`、`breadcrumb`、`text`、`badge`、`avatar`、`image`、`watermark`、`card`、`carousel`、`affix`、`anchor`、`menu`、`row`、`col`、`scrollbar`、`splitter`、`divider`、`tag`、`space`、`tabs`
  - 表单输入：`input`、`radio`、`checkbox`、`switch`、`input-tag`、`input-number`、`rate`、`slider`、`select`、`form`、`upload`
  - 时间相关：`date-picker`、`time-picker`、`time-select`、`scheduler`
  - 反馈与浮层：`alert`、`message`、`notification`、`backtop`、`collapse`、`collapse-transition`、`empty`、`loading`、`skeleton`、`result`、`tooltip`、`popover`、`popconfirm`、`dropdown`、`dialog`、`drawer`
  - 数据展示：`progress`、`steps`、`statistic`、`countdown`、`timeline`、`tree`、`table`、`pagination`
- 更新 `AGENTS.md`、文档导航或任务说明时，组件清单应以上述导出入口为准，不要沿用旧列表。

## 文档与测试约定

- 组件文档页位于 `apps/docs/components/<name>.md`。
- 组件示例位于 `apps/docs/examples/<name>/`；组合型示例目前还包含 `apps/docs/examples/basic-form`、`apps/docs/examples/feedback-data`、`apps/docs/examples/admin.md`。
- 文档站配置与主题扩展主要位于：
  - `apps/docs/.vitepress/config.ts`
  - `apps/docs/.vitepress/theme`
  - `apps/docs/.vitepress/plugins`
  - `apps/docs/.vitepress/utils`
- 组件单元测试通常放在 `packages/components/<name>/__tests__/*.spec.ts`。
- 类型测试夹具位于 `tests/types/fixtures/*.ts`；新增组件或调整导出类型时，优先补齐对应夹具。
- 文档示例和测试中的组件使用方式，应该与聚合包 `packages/xiaoye-components/index.ts` 的对外导出保持一致。

## 仓库命令

- 安装依赖：`pnpm install`
- 启动文档：`pnpm dev` 或 `pnpm dev:docs`
- 启动联调：`pnpm dev:playground`
- 测试：`pnpm test`
- 测试监听：`pnpm test:watch`
- 类型检查：`pnpm typecheck`
- 包与应用类型检查拆分命令：
  - `pnpm typecheck:packages`
  - `pnpm typecheck:types`
- Lint：`pnpm lint`
- 构建全部产物：`pnpm build`
- 分别构建：
  - `pnpm build:lib`
  - `pnpm build:docs`
  - `pnpm build:playground`
- 文档预览：`pnpm preview:docs`
- Changesets 相关：
  - `pnpm changeset`
  - `pnpm version-packages`
  - `pnpm release`
- 清理构建产物：`pnpm clean`

## 目录提示

- `apps/docs`：VitePress 文档站，组件文档、示例和首页内容都在这里。
- `apps/playground`：本地联调 playground。
- `packages/components`：组件源码、安装入口和单测。
- `packages/composables`：跨组件复用的组合式逻辑。
- `packages/theme`：组件样式入口与 CSS 实现。
- `packages/tokens`：设计令牌相关源码。
- `packages/utils`：类型、DOM、Vue 工具函数。
- `packages/xiaoye-components`：聚合导出、安装入口和发布产物。
- `tests/types`：类型测试夹具与独立 tsconfig。
- `scripts`：仓库脚本。
- `.changeset`：版本变更记录。

## 本地产物与忽略项

- 以下目录通常属于本地生成内容，不应在未明确要求时提交：
  - `.playwright-cli/`
  - `apps/docs/.vitepress/cache`
  - `apps/docs/.vitepress/dist`
  - `apps/docs/.vitepress/.temp`
  - `apps/playground/dist`
  - `packages/xiaoye-components/dist`
  - `coverage`
  - `output/`
- 修改忽略规则时，先以根目录 `.gitignore` 为准，避免把调试日志、页面快照或构建产物带入提交。
