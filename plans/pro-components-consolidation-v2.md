# Pro Components 收口方案 V2

## 当前状态

这份文档不再描述“准备怎么迁移”。当前仓库已经完成以下收口动作：

- `xiaoye-components` 收束为通用基础组件库。
- `xiaoye-pro-components` 收束为中后台业务增强组件库。
- 旧的 `internal/`、`legacy/` 目录已经从 `packages/pro-components` 物理删除。
- docs 专用 legacy 安装层已经移除，文档主题直接安装正式公开包。
- 增强层公开面已经从更分散的旧形态，收口为当前 `component-manifest.json` 中维护的 21 个正式公开增强组件。

## 当前公开增强组件

### 表单与筛选

- `search-form`
- `pro-form`
- `overlay-form`
- `steps-form`
- `filter-panel`
- `request-form`

### 列表与数据

- `pro-table`
- `column-setting-panel`
- `saved-view-tabs`
- `table-filter-drawer`
- `import-result-table`

### 详情与历史

- `audit-timeline`
- `detail-panel`
- `detail-page`

### 页面容器

- `async-state-container`
- `list-page`
- `crud-page`
- `split-layout-page`

### 流程与任务

- `approval-flow-panel`
- `import-wizard`
- `export-task-panel`

## 已完成的合并

以下重复边界已经合并到新的公开心智中：

- `drawer-form` + `modal-form` -> `overlay-form`
- `steps-form` + `drawer-steps-form` -> `steps-form`
- `detail-drawer` + `detail-dialog` -> `detail-panel`
- `master-detail-page` + `split-view-page` -> `split-layout-page`

这些旧名字不再作为正式公开组件维护，也不再占据 docs 一级导航。

## 当前边界约定

- 公开增强组件只保留真正有稳定契约的业务增强件。
- 列表头、批量条、详情分区、附件区、变更对比、操作日志等能力，允许继续存在于实现层，但默认作为页面容器内部块或场景片段理解。
- 不再为了“每个局部块都有一页”去扩充公开组件数量。
- 不新增第三个 npm 包，继续维持：
  - `xiaoye-components`
  - `xiaoye-pro-components`

## 根入口白名单

当前 `@xiaoye/pro-components` / `xiaoye-pro-components` 的根入口遵循两条固定规则：

- `packages/pro-components/exports.ts` 只允许显式导出 21 个正式公开增强组件值，不再使用 `export *`。
- `packages/pro-components/index.ts` 只允许导出两类类型：
  - 每个正式公开增强组件的主 `Props / Instance / 主数据类型`
  - `core.ts` 中稳定的共享协议类型

不再适合作为根入口长期公开承诺的类型，原则上要降到组件子入口或源码内部，例如：

- 插槽入参和事件细节类型
- 仅用于 props 字面量联合的容器/模式类型
- 对共享类型的业务别名
- 组件内部状态枚举

当前根入口白名单已经由 `scripts/check-pro-components.mjs` 显式校验，不允许通过修改组件子入口把类型自动带回包根。

## 文档与示例约定

- docs 首页、快速开始、增强总览、示例总览都要以“双产品线”心智表达。
- 增强示例优先展示真实后台场景页，不再把低价值 `basic.vue` 当作默认主入口。
- `/examples/admin` 继续承担旗舰后台闭环示例角色。

## 后续收尾原则

- 新增增强件前，优先先判断它是不是应当落入现有页面容器或场景片段，而不是直接新增一级公开组件。
- 如果公开组件内部仍残留旧命名实现，应继续逐步向当前公开心智收敛，但前提是不破坏现有构建、类型和文档链路。
- 一致性规则继续以 `packages/pro-components/component-manifest.json` 为主源，由 `pnpm check:pro-components` 守卫。
