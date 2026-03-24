---
title: Result 结果
description: 用于承接提交、校验、审批、同步等操作完成后的结果反馈。
outline: deep
---

# Result 结果

`xy-result` 用来承接“操作完成之后，下一步该做什么”这类结果态。它参考了 Element Plus 的 `Result`，保留了 `title / sub-title / icon` 兼容入口，同时补了更适合当前库的 `status`、`description`、尺寸体系和卡片态。

## 基础用法

:::demo 兼容 Element Plus 的 `icon`、`title` 和 `sub-title` 写法，适合先把页面结果态快速补齐。
result/basic
:::

## 状态扩展

:::demo 当你更希望沿用当前库的状态命名时，可以直接使用 `status + description`。这也是文档更推荐的写法。
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

- `icon` 与 `status` 同时存在时，以 `icon` 为准，图标和强调色都会跟着切换。
- `description` 是新的主描述字段；未传时才会回退到 `sub-title` 或 `subTitle`。
- 默认值下 `status` 为 `neutral`，尺寸跟随 `xy-config-provider` 的全局 `size`，否则回退到 `md`。

## 何时使用

- 表单提交成功、失败或等待补充时。
- 审批、同步、导入、发布等任务结束后，需要告诉用户“结果 + 下一步”时。
- 详情页、抽屉或弹窗里需要一块结构清晰的状态承接区时。

## API

### Result Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 结果标题 | `string` | `undefined` |
| `description` | 主描述文案，优先级高于 `sub-title` / `subTitle` | `string` | `undefined` |
| `sub-title` | Element Plus 兼容描述字段 | `string` | `''` |
| `icon` | Element Plus 兼容图标语义 | `'primary' \| 'success' \| 'warning' \| 'info' \| 'error'` | `undefined` |
| `status` | 当前库风格的状态语义 | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` |
| `size` | 组件尺寸，未传时跟随全局配置 | `'sm' \| 'md' \| 'lg'` | `全局 size / 'md'` |
| `variant` | 视觉变体 | `'plain' \| 'card'` | `'plain'` |
| `icon-size` | 自定义图标尺寸 | `string \| number` | `undefined` |

### Result Slots

| 插槽 | 说明 |
| --- | --- |
| `icon` | 自定义图标区 |
| `title` | 自定义标题区 |
| `description` | 主描述区，优先级高于 `sub-title` |
| `sub-title` | Element Plus 兼容描述插槽 |
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
