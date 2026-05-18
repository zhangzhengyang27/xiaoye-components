---
title: FAQ 常见问题
description: xiaoye-components 使用过程中的常见问题与解答。
outline: deep
---

# FAQ 常见问题

以下是使用 xiaoye-components 过程中常见的问题和解决方案。

## 安装与引入

### 如何安装？

```bash
# pnpm（推荐）
pnpm add @xiaoye/components

# npm
npm install @xiaoye/components

# yarn
yarn add @xiaoye/components
```

### 如何按需引入组件？

支持 ESM Tree Shaking，直接导入即可：

```ts
import { XyButton, XyInput } from '@xiaoye/components'
```

Vite / Rollup 会自动进行 Tree Shaking，未使用的组件不会被打包。

### 是否支持全量注册？

支持。在入口文件统一注册所有组件：

```ts
import XyComponents from '@xiaoye/components'

const app = createApp(App)
app.use(XyComponents)
```

## 主题定制

### 如何修改主题色？

通过覆盖 CSS 变量实现：

```css
:root {
  --xy-color-primary: #409eff;
  --xy-border-radius-base: 4px;
}
```

完整的 CSS 变量列表请参考 [主题定制](./theming)。

### ConfigProvider 能管理主题吗？

不能。`ConfigProvider` 仅负责 `namespace`、`locale`、`zIndex`、`size` 等运行时配置，不管理主题。主题完全由 CSS 变量驱动。

### 是否支持暗黑模式？

当前版本暂未内置暗黑模式，但底层基于 CSS 变量，可自行扩展。详见 [主题定制 - 暗黑模式扩展](./theming#暗黑模式)。

## 表单相关

### Form 的 rules 支持哪些校验规则？

基于 async-validator，支持以下规则类型：

| 规则 | 说明 |
|------|------|
| `required` | 必填 |
| `type` | 类型检查（string/number/boolean/array/object/date/url/email 等） |
| `pattern` | 正则表达式 |
| `min/max` | 数值或字符串长度范围 |
| `len` | 固定长度 |
| `enum` | 枚举值列表 |
| `whitespace` | 是否允许纯空格 |
| `validator` | 自定义异步校验函数 |

### 动态表单字段如何处理？

Form 支持 `prop` 点路径和路径数组，适合嵌套对象结构：

```vue
<xy-form-item prop="user.name" label="姓名" />
<xy-form-item prop="user.contacts[0].phone" label="电话" />
```

动态增减字段建议配合 `v-for` 和响应式数组自行管理，或使用 `@xiaoye/pro-components` 中的 `ProForm`。

## 组件交互

### Dialog 在 SSR 环境下报错怎么办？

这是已修复的 SSR 兼容性问题。如果仍然遇到问题，请确保使用最新版本。核心修复点：

- `useOverlayDialog` 返回值补全了 `appendTo`、`teleportDisabled`、`rendered`、`contentRendered`
- `useFocusTrap` 添加了 `typeof document === "undefined"` 守卫
- `useFloatingVisibility` 添加了 `typeof window !== "undefined"` 守卫

### Teleport 相关的 SSR 问题如何排查？

如果自定义组件使用了 `<teleport>`，请确保：

1. `:to` 绑定的值在 SSR 阶段不会为 `undefined`
2. 考虑添加 `:disabled` 绑定，在服务端渲染时禁用 teleport
3. 使用 `computed` 包装目标引用，避免模板中直接访问可能不存在的属性

### Tooltip / Popover 浮层被遮挡怎么办？

常见原因及解决方式：

| 原因 | 解决方案 |
|------|----------|
| 父容器设置了 `overflow: hidden` | 将浮层 `teleport` 到 `body`（默认行为） |
| z-index 不够高 | 通过 `ConfigProvider` 设置全局 `zIndex` 或调整父容器层级 |
| 在固定定位容器内 | 设置 `append-to` 为 `'body'` |

## Pro 组件

### ProTable 与基础 Table 有什么区别？

**基础 Table** (`xy-table`) 是数据展示组件，需要手动传入数据和列配置。

**ProTable** (`xy-pro-table`) 是业务增强组件，内置：
- 远程数据加载（自动管理 loading/pagination）
- 列配置驱动（FieldSchema 定义）
- 工具栏插槽（搜索/刷新/导出等）
- 与 SearchForm 联动

架构关系：`ProTable` → 封装 `Table` + `Pagination` + `Loading` + 数据请求逻辑。

### Pro 组件需要额外安装吗？

是的，Pro 组件在独立包中：

```bash
pnpm add @xiaoye/pro-components
```

## 样式与构建

### CSS 变量的前缀是什么？

所有设计令牌使用 `--xy-` 前缀，例如：

- `--xy-color-primary` — 主色调
- `--xy-font-size-md` — 中号字体
- `--xy-radius-base` — 基础圆角

### 为什么样式没有生效？

常见排查步骤：

1. **确认引入了组件样式**：ESM 导入会自动包含样式，但如果使用了按需加载插件，需确认插件配置正确。
2. **检查 CSS 变量作用域**：确保变量覆盖写在全局作用域（`:root`），而非组件 scoped 内。
3. **确认 namespace 一致**：如修改了 `namespace`，CSS 变量名会随之变化（如 `--xy-color-primary` → `--custom-color-primary`）。
4. **浏览器缓存**：清除缓存后重试。

### VitePress 文档站如何构建？

```bash
pnpm build:docs
```

构建产物输出到 `apps/docs/.vitepress/dist`。

## 版本管理

### 使用什么版本管理方案？

使用 Changesets 进行版本管理和变更日志生成：

1. 创建变更文件：`pnpm changeset`
2. 发布版本：`pnpm release`
3. 变更记录会自动更新到 Changelog

详细说明参考 [更新日志](../changelog)。

## 可访问性

### 组件是否支持键盘导航？

大部分交互组件支持键盘操作：

- **Tabs**：`ArrowLeft/Right` 切换页签
- **Rate**：`ArrowUp/Right` 增加评分，`ArrowDown/Left` 降低评分
- **Switch**：`Space/Enter` 切换状态
- **Tooltip/Popover/Dropdown**：`Escape` 关闭浮层

### 是否符合 WAI-ARIA 规范？

组件内置 ARIA 属性，包括 `aria-label`、`aria-disabled`、`role` 等。详细的可访问性约定请参考 [可访问性约定](./accessibility)。

---

> 还有其他问题？欢迎在 [GitHub Issues](https://github.com/xiaoye/xiaoye-components/issues) 提交反馈。
