---
title: Tooltip 文字提示
description: 用于承载简短说明，不承载复杂交互内容。
outline: deep
---

# Tooltip 文字提示

`xy-tooltip` 用来承载一两句补充说明。它支持 `hover`、`click`、`focus` 和 `manual` 四种触发方式，适合按钮解释、表头提示和轻量说明文案。

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

## API

### Tooltip Attributes

| 属性          | 说明                   | 类型                                                                 | 默认值  |
| ------------- | ---------------------- | -------------------------------------------------------------------- | ------- |
| `model-value` | 受控显示状态           | `boolean`                                                            | `false` |
| `content`     | 纯文本提示内容         | `string`                                                             | `''`    |
| `placement`   | 浮层方向               | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'right'` | `'top'` |
| `disabled`    | 是否禁用               | `boolean`                                                            | `false` |
| `open-delay`  | 打开延迟，单位毫秒     | `number`                                                             | `80`    |
| `close-delay` | 关闭延迟，单位毫秒     | `number`                                                             | `60`    |
| `show-after`  | 打开延迟别名，优先级高于 `open-delay` | `number`                                      | `undefined` |
| `hide-after`  | 关闭延迟别名，优先级高于 `close-delay` | `number`                                     | `undefined` |
| `enterable`   | 浮层是否允许鼠标进入   | `boolean`                                                            | `true`  |
| `trigger`     | 触发方式               | `'hover' \| 'click' \| 'focus' \| 'manual'`                          | `'hover'` |
| `offset`      | 浮层偏移量             | `number`                                                             | `10`    |
| `show-arrow`  | 是否显示箭头           | `boolean`                                                            | `true`  |
| `max-width`   | 提示最大宽度           | `string \| number`                                                   | `240`   |
| `teleported`  | 是否通过 Teleport 挂载到外层容器 | `boolean`                                                   | `true` |
| `append-to`   | Teleport 的挂载目标    | `string \| HTMLElement`                                              | `'body'` |
| `persistent`  | 关闭后是否保留 DOM     | `boolean`                                                            | `false` |
| `popper-class`| 浮层容器自定义类名     | `string`                                                             | `''` |
| `popper-style`| 浮层容器自定义样式     | `StyleValue`                                                         | `undefined` |
| `close-on-esc` | 按下 `Escape` 是否关闭 | `boolean`                                                           | `true` |
| `close-on-outside` | 点击外部是否关闭   | `boolean`                                                           | `true` |

### Tooltip Events

| 事件                 | 说明         | 参数      |
| -------------------- | ------------ | --------- |
| `update:model-value` | 开关状态变化 | `boolean` |
| `open`               | 打开时触发   | —         |
| `close`              | 关闭时触发   | —         |

### Tooltip Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 触发区域       |
| `content` | 自定义提示内容 |
