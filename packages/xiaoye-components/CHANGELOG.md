# xiaoye-components

## 0.4.0

### Minor Changes

- 重构设计令牌系统并新增 frontline 组件模块

## 0.3.0

### Minor Changes

- 发布 0.3.0，补充基础组件库与增强组件库的最新能力更新。

## 0.2.0

### Minor Changes

- 4eb1885: 将 `Modal` 正式替换为高兼容的 `Dialog`。
  - 移除 `xy-modal`、`Modal` 文档页和旧示例目录，统一切换到 `xy-dialog`
  - 新增对齐 Element Plus `Dialog` 的能力，包括 `append-to-body`、`close-on-click-modal`、`close-on-press-escape`、`center`、`align-center`、`fullscreen`、`draggable`、`overflow`、分区 class、自定义 `transition` 和实例 `resetPosition`
  - 抽出共享的 `useOverlayDialog` 供 `Dialog` 与 `Drawer` 复用，并补齐 `open-auto-focus` / `close-auto-focus` 焦点事件
  - 这次变更包含明确的 breaking rename：原有 `xy-modal` 需要迁移到 `xy-dialog`

- ff2024b: 发布首个可对外试用的 `v0` 基础版本，并补强中后台高频交互链路。
  - 将根构建工具链升级到 `Vite 8.0.1`，同步对齐 `@vitejs/plugin-vue` 与 `vitest` 的兼容版本。
  - 增强 `Select` 的交互边界，补充键盘导航、活动项高亮、搜索态焦点处理、空结果文案和更完整的 `aria` 属性。
  - 增强 `Form` 的字段级操作能力，`validateField`、`resetFields`、`clearValidate` 支持字段集合，表单项错误信息与输入控件建立描述关联。
  - 增强 `Table` 的行级交互能力，支持稳定的 `rowKey`、行点击事件、键盘触发行操作，以及 `loading` / `empty` 插槽扩展。

- ff2024b: 补齐首个公开版本的发布说明，并继续把中后台高频链路的交互边界做深一层。
  - 建立基于 Vue 3、TypeScript、Vite 8 和 pnpm workspace 的组件库基础设施
  - 提供 ConfigProvider、Button、Input、Select、Form、Table、Modal、Tabs、Tooltip、Pagination 等 MVP 组件
  - 落地 Design Token、CSS Variables、VitePress 文档站、Playground、Vitest 与类型检查流程
  - 增强 Select 的键盘导航、筛选空态文案与 aria 语义
  - 增强 Form 的字段级校验、重置与消息关联能力
  - 增强 Table 的行级交互、自定义空态与稳定行 key 支持

- b823946: 将 `xy-icon` 切换为基于 Iconify 的图标方案。
  - 移除 `name` 属性，改为必填的 `icon` 字符串标识
  - 移除 `BuiltinIconName` 类型导出和内建图标集合
  - `xy-icon` 继续保留 `size`、`rotate`、`spin` 包装能力
