---
title: Tooltip 文字提示
description: 用于承载简短说明，不承载复杂交互内容。
outline: deep
---

# Tooltip 文字提示

`xy-tooltip` 用来承载一两句补充说明。它支持 `hover`、`click`、`focus`、`contextmenu` 和 `manual`，也支持触发方式数组、键盘切换、受控显示和虚拟触发，适合按钮解释、表头提示和轻量说明文案。

## 基础用法

:::demo Tooltip 不只服务鼠标悬停，也支持焦点进入触发区域时打开。
tooltip/basic
:::

## 不同方向

:::demo `placement` 用于控制浮层方向，适合根据页面空间决定提示出现的位置。
tooltip/placement
:::

## 自定义内容

:::demo 如果内容不只是单行文本，可以用 `content` 插槽渲染一小段说明，但仍然不建议承载复杂交互。
tooltip/custom
:::

## 触发方式与尺寸控制

:::demo `trigger`、`offset`、`show-arrow` 和 `max-width` 适合在点击提示、紧凑表头说明和较长文案场景里做细调。
tooltip/trigger
:::

## 受控与手动模式

:::demo `trigger="manual"` 时不会自动响应 hover、click 或 focus，适合完全由外部状态驱动。
tooltip/controlled
:::

## 高级触发

:::demo `trigger` 可以传数组；`trigger-keys`、`contextmenu` 和 `popper-options` 适合更复杂的桌面端交互。
tooltip/advanced
:::

> `raw-content` 会直接渲染 HTML 字符串，只建议在内容可信时使用；有现成 Vue 节点时优先使用 `content` 插槽。

## API

### Tooltip Attributes

| 属性          | 说明                   | 类型                                                                 | 默认值  |
| ------------- | ---------------------- | -------------------------------------------------------------------- | ------- |
| `model-value` | 受控显示状态           | `boolean`                                                            | `false` |
| `content`     | 纯文本提示内容         | `string`                                                             | `''`    |
| `placement`   | 浮层方向               | `Placement` | `'top'` |
| `disabled`    | 是否禁用               | `boolean`                                                            | `false` |
| `open-delay`  | 打开延迟，单位毫秒     | `number`                                                             | `80`    |
| `close-delay` | 关闭延迟，单位毫秒     | `number`                                                             | `60`    |
| `show-after`  | 打开延迟别名，优先级高于 `open-delay` | `number`                                      | `undefined` |
| `hide-after`  | 关闭延迟别名，优先级高于 `close-delay` | `number`                                     | `undefined` |
| `enterable`   | 浮层是否允许鼠标进入   | `boolean`                                                            | `true`  |
| `trigger`     | 触发方式，支持单值或数组 | `TooltipTrigger \| TooltipTrigger[]`                               | `'hover'` |
| `trigger-keys`| 触发器键盘切换按键     | `string[]`                                                           | `['Enter', 'NumpadEnter', 'Space', ' ']` |
| `offset`      | 浮层偏移量             | `number`                                                             | `10`    |
| `show-arrow`  | 是否显示箭头           | `boolean`                                                            | `true`  |
| `max-width`   | 提示最大宽度           | `string \| number`                                                   | `240`   |
| `teleported`  | 是否通过 Teleport 挂载到外层容器 | `boolean`                                                   | `true` |
| `append-to`   | Teleport 的挂载目标    | `string \| HTMLElement`                                              | `'body'` |
| `persistent`  | 关闭后是否保留 DOM     | `boolean`                                                            | `false` |
| `popper-class`| 浮层容器自定义类名     | `string`                                                             | `''` |
| `popper-style`| 浮层容器自定义样式     | `StyleValue`                                                         | `undefined` |
| `aria-label`  | 自定义辅助说明文本     | `string`                                                             | `undefined` |
| `effect`      | 视觉主题               | `'dark' \| 'light'`                                                  | `'dark'` |
| `raw-content` | 是否把 `content` 当作 HTML 字符串渲染 | `boolean`                                                | `false` |
| `transition`  | 过渡动画名称           | `string`                                                             | `'xy-fade'` |
| `virtual-ref` | 虚拟触发引用           | `ReferenceElement \| null`                                           | `null` |
| `virtual-triggering` | 是否启用虚拟触发 | `boolean`                                                            | `false` |
| `popper-options` | 高级定位参数         | `TooltipPopperOptions`                                               | `undefined` |
| `close-on-esc` | 按下 `Escape` 是否关闭 | `boolean`                                                           | `true` |
| `close-on-outside` | 点击外部是否关闭   | `boolean`                                                           | `true` |

### Tooltip Popper Options

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `strategy` | 定位策略 | `'absolute' \| 'fixed'` | `'fixed'` |
| `z-index` | 浮层层级 | `number` | 跟随全局 overlay 栈 |
| `arrow-padding` | 箭头与边界的安全距离 | `number` | `8` |
| `shift-padding` | `shift` 中间件的边界留白 | `number` | `8` |
| `flip` | 是否允许翻转 | `boolean` | `true` |
| `fallback-placements` | 翻转候选方向 | `Placement[]` | `[]` |

### Tooltip Events

| 事件                 | 说明         | 参数      |
| -------------------- | ------------ | --------- |
| `update:model-value` | 开关状态变化 | `boolean` |
| `before-show`        | 打开前触发   | —         |
| `open`               | 打开时触发   | —         |
| `show`               | 进入过渡结束后触发 | —      |
| `before-hide`        | 关闭前触发   | —         |
| `close`              | 关闭时触发   | —         |
| `hide`               | 离场过渡结束后触发 | —      |

### Tooltip Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 触发区域。非虚拟触发时建议保持单一触发根节点 |
| `content` | 自定义提示内容 |

### Tooltip Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `triggerRef` | 当前触发节点引用 | `Ref<HTMLElement \| null>` |
| `contentRef` | 当前内容节点引用 | `Ref<HTMLElement \| null>` |
| `show` | 立即打开 Tooltip | `() => void` |
| `hide` | 立即关闭 Tooltip | `() => void` |
| `updatePopper` | 重新计算定位 | `() => Promise<void>` |
| `isFocusInsideContent` | 判断焦点是否位于内容区 | `(event?: FocusEvent) => boolean` |
