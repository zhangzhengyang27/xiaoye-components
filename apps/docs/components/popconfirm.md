---
title: Popconfirm 气泡确认框
description: 用于承接轻量确认动作，支持正文插槽、异步确认和虚拟触发。
outline: deep
---

# Popconfirm 气泡确认框

`xy-popconfirm` 适合承接“删除前确认”“发布前确认”“切换前提醒”这类轻量确认动作。它依然是一个原地完成的小浮层，但这版已经从固定确认壳子升级成可组合的业务确认浮层。

## 基础用法

:::demo 最常见的用法是用 `title + content` 交代风险，再把确认动作留在当前按钮附近完成。
popconfirm/basic
:::

## 位置

:::demo `placement` 继承当前浮层体系的位置能力，适合在工具栏、表格行操作和卡片角标里做细调。
popconfirm/placement
:::

## 自定义图标与按钮

:::demo `effect`、图标、按钮类型和按钮透传 props 可以组合使用，让确认框更贴近业务语义。
popconfirm/custom
:::

## 正文插槽

:::demo `title` 继续承接标题区，默认插槽只负责正文区；需要更复杂的提示说明时，优先用默认插槽而不是把内容塞进 `title`。
popconfirm/body-slot
:::

## 异步确认与 loading

:::demo `before-confirm` / `before-cancel` 支持 Promise。执行期间组件会自动托管按钮 loading 和禁用状态，避免重复提交。
popconfirm/async-confirm
:::

## 虚拟触发与外部控制

:::demo `virtual-ref`、`virtual-triggering` 和 `v-model` 适合右键菜单、外部控制按钮或虚拟锚点场景。
popconfirm/virtual-triggering
:::

## 什么时候用 Popconfirm

- 你只需要一次轻量确认，不希望把流程升级成完整对话框。
- 你需要承接一小段正文说明，但还不想进入完整 Popover 或 Dialog。
- 你希望确认动作自动托管 loading、关闭和基础交互状态，而不是每次都手写一层。

## 内容结构约定

- `title` 始终属于头部主语义，不会被默认插槽替代。
- 默认插槽只承接正文区；未提供默认插槽时，组件才会回退渲染 `content`。
- `actions` 插槽只承接底部动作区，不负责正文结构。

## 异步 hook 约定

- `before-confirm` / `before-cancel` 返回 `false` 时，面板保持打开，且不会继续派发 `confirm` / `cancel`。
- hook 返回 `Promise` 时，组件会自动进入 pending 状态：当前动作按钮 loading，两个默认按钮都会被禁用。
- hook resolve 后，才会派发对应事件并关闭面板；reject 时保持展开。

## 白名单兼容属性

`xy-popconfirm` 当前显式接入了部分 Tooltip 能力，而不是把任意属性全部透传到底层浮层。当前可复用的白名单能力主要包括：

- `trigger-keys`
- `transition`
- `popper-options`
- `open-delay / close-delay / show-after / hide-after`
- `virtual-ref / virtual-triggering`

如果你需要任意正文结构、完全自由的触发策略或更复杂的浮层控制，优先改用 `xy-popover`。

## locale 文案兜底

如果没有显式传入 `confirm-button-text` 或 `cancel-button-text`，`xy-popconfirm` 会优先读取 `xy-config-provider` 的以下 locale key：

- `popconfirmConfirmButtonText`
- `popconfirmCancelButtonText`

都没有时，分别回退到内置默认文案 `确定` 和 `取消`。

## API

### Popconfirm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 受控显示状态 | `boolean` | `false` |
| `title` | 标题文案 | `string` | `''` |
| `content` | 纯文本正文；未提供默认插槽时作为正文区兜底 | `string` | `''` |
| `placement` | 浮层位置 | `Placement` | `'bottom'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `width` | 面板宽度，最小值为 `150px` | `string \| number` | `150` |
| `open-delay` | 打开延时白名单属性 | `number` | `80` |
| `close-delay` | 关闭延时白名单属性 | `number` | `60` |
| `show-after` | 打开延时别名，优先级高于 `open-delay` | `number` | `undefined` |
| `hide-after` | 关闭延时别名，优先级高于 `close-delay`；确认/取消成功后也遵循该延时 | `number` | `200` |
| `effect` | 视觉风格 | `'light' \| 'dark'` | `'light'` |
| `teleported` | 是否通过 Teleport 挂载到外层容器 | `boolean` | `true` |
| `append-to` | Teleport 的挂载目标 | `string \| HTMLElement` | `'body'` |
| `persistent` | 关闭后是否保留 DOM | `boolean` | `false` |
| `offset` | 浮层偏移量 | `number` | `10` |
| `trigger-keys` | 键盘打开键白名单 | `string[]` | Tooltip 内置默认值 |
| `show-arrow` | 是否显示箭头 | `boolean` | `true` |
| `close-on-esc` | `Escape` 是否关闭 | `boolean` | `true` |
| `close-on-outside` | 点击外部是否关闭 | `boolean` | `true` |
| `popper-class` | 浮层容器自定义类名 | `string` | `''` |
| `popper-style` | 浮层容器自定义样式 | `StyleValue` | `undefined` |
| `transition` | 过渡名称 | `string` | `'xy-fade'` |
| `popper-options` | 浮层定位兼容配置子集 | `TooltipPopperOptions` | `undefined` |
| `icon` | 前置图标 | `string` | `'mdi:help-circle-outline'` |
| `icon-color` | 图标颜色 | `string` | `'#f90'` |
| `hide-icon` | 是否隐藏图标 | `boolean` | `false` |
| `confirm-button-text` | 确认按钮文案；未传时回退到 `locale.popconfirmConfirmButtonText` 或 `'确定'` | `string` | `undefined` |
| `cancel-button-text` | 取消按钮文案；未传时回退到 `locale.popconfirmCancelButtonText` 或 `'取消'` | `string` | `undefined` |
| `confirm-button-type` | 确认按钮类型 | `ButtonType \| 'text'` | `'primary'` |
| `cancel-button-type` | 取消按钮类型 | `ButtonType \| 'text'` | `'text'` |
| `confirm-button-props` | 透传给确认按钮的补充配置；不会覆盖内部 loading/disabled 和 `confirm-button-type` | `Partial<ButtonProps>` | `undefined` |
| `cancel-button-props` | 透传给取消按钮的补充配置；不会覆盖内部 loading/disabled 和 `cancel-button-type` | `Partial<ButtonProps>` | `undefined` |
| `before-confirm` | 确认前置 hook，支持返回 `boolean` 或 `Promise` | `PopconfirmHook` | `undefined` |
| `before-cancel` | 取消前置 hook，支持返回 `boolean` 或 `Promise` | `PopconfirmHook` | `undefined` |
| `virtual-ref` | 虚拟定位引用 | `ReferenceElement \| null` | `null` |
| `virtual-triggering` | 是否启用虚拟触发模式 | `boolean` | `false` |

### Popconfirm Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 开关状态变化 | `boolean` |
| `before-show` | 面板即将打开时触发 | — |
| `show` | 面板完成进入后触发 | — |
| `before-hide` | 面板即将关闭时触发 | — |
| `hide` | 面板完成离开后触发 | — |
| `open` | 浮层逻辑打开时触发 | — |
| `close` | 浮层逻辑关闭时触发 | — |
| `confirm` | 确认动作完成后触发 | `MouseEvent` |
| `cancel` | 取消动作完成后触发 | `MouseEvent` |

### Popconfirm Slots

| 插槽 | 说明 |
| --- | --- |
| `reference` | 触发区域；常规模式下通过点击它打开确认框 |
| `default` | 正文区；插槽参数为 `{ confirm, cancel, close, confirming, cancelling }` |
| `actions` | 自定义操作区；插槽参数为 `{ confirm, cancel, close, confirming, cancelling }` |

### Popconfirm Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `hide` | 立即关闭确认框 | `() => void` |
| `popperRef` | 面板根节点引用 | `Ref<HTMLElement \| null>` |
