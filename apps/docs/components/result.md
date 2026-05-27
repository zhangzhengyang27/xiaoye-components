---
title: Result 结果
description: 用于承接提交、校验、审批、同步等操作完成后的结果反馈。
outline: deep
---

# Result 结果

`xy-result` 用来承接"操作完成之后，下一步该做什么"这类结果态。推荐使用 `status` + `description` 组合；`sub-title` / `subTitle` 为兼容入口，功能与 `description` 相同但优先级更低。

## 基础用法

:::demo 使用 `status`、`title` 和 `description` 写法，适合先把页面结果态快速补齐。
result/basic
:::

## 状态扩展

:::demo 当你更希望沿用当前库的状态命名时，可以直接使用 `status + description`。
result/status
:::

## 卡片态

:::demo `variant='card'` 适合放在详情页、弹窗和抽屉里，能提供更明确的容器感。
result/card
:::

## 自定义图标与补充内容

:::demo 通过 `icon`、默认插槽和 `extra` 可以把结果态扩成一个更完整的业务闭环。
result/custom
:::

## 兼容规则

### 命名对照

- 模板属性写法使用 kebab-case：`sub-title`、`icon-size`
- 源码 props / TS 类型写法使用 camelCase：`subTitle`、`iconSize`
- 如果是在 TS 对象、组件 props 类型或 JSX / TSX 场景里传参，应以 `subTitle` 为准
- 常规模板里仍可继续写 `sub-title`，但它属于兼容入口，不是新的主推荐描述字段

### 优先级与兼容

- `icon` 与 `status` 同时存在时，以 `icon` 为准，图标和强调色都会跟着切换。
- **`description` 是推荐的主描述字段**；未传时才会回退到 `subTitle`（模板写法 `sub-title`）。二者功能相同，`description` 优先级更高。
- `status` 现在额外兼容 `info / error / 403 / 404 / 500`，便于承接后台常见异常页和权限页语义。
- 默认值下 `status` 为 `neutral`，尺寸跟随 `xy-config-provider` 的全局 `size`，否则回退到 `md`。

## 何时使用

- 表单提交成功、失败或等待补充时。
- 审批、同步、导入、发布等任务结束后，需要告诉用户"结果 + 下一步"时。
- 详情页、抽屉或弹窗里需要一块结构清晰的状态承接区时。

## API

### Result Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 结果标题 | `string` | `undefined` |
| `description` | 主描述文案，优先级高于 `sub-title` / `subTitle` | `string` | `undefined` |
| `sub-title` | 兼容描述字段（对应 TS 类型 `subTitle`），未传 `description` 时生效 | `string` | `''` |
| `icon` | 图标语义 | `ResultIconType` | `undefined` |
| `status` | 当前库风格状态语义，并兼容后台状态码场景 | `ResultStatus` | `'neutral'` |
| `size` | 组件尺寸，未传时跟随全局配置 | `ResultProps["size"]` | `全局 size / 'md'` |
| `variant` | 视觉变体 | `ResultVariant` | `'plain'` |
| `icon-size` | 自定义图标尺寸 | `string \| number` | `undefined` |

### Result Slots

| 插槽 | 说明 |
| --- | --- |
| `icon` | 自定义图标区 |
| `title` | 自定义标题区 |
| `description` | 主描述区，优先级高于 `sub-title` |
| `sub-title` | 兼容描述插槽，仅在未使用 `description` 插槽且未传 `description` prop 时渲染 |
| `default` | 描述区下方的补充内容 |
| `extra` | 底部操作区 |

### Result CSS Variables

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| `--xy-result-padding` | 容器内边距 | `40px 20px` |
| `--xy-result-gap` | 各区块垂直间距 | `14px` |
| `--xy-result-icon-size` | 默认图标尺寸 | `72px` |
| `--xy-result-icon-shell-size` | 图标外层圆壳尺寸 | `112px` |
| `--xy-result-title-font-size` | 标题字号 | `24px` |
| `--xy-result-description-font-size` | 描述字号 | `14px` |
| `--xy-result-title-color` | 标题颜色 | `var(--xy-text-color)` |
| `--xy-result-description-color` | 描述颜色 | `var(--xy-text-color-secondary)` |
| `--xy-result-content-max-width` | 内容区最大宽度 | `560px` |
| `--xy-result-extra-margin-top` | 操作区上边距 | `10px` |
| `--xy-result-card-border-color` | 卡片态边框色 | `color-mix(in srgb, var(--xy-border-color) 92%, white)` |
| `--xy-result-card-background` | 卡片态背景色 | `color-mix(in srgb, var(--xy-bg-color) 95%, var(--xy-bg-color-muted))` |
