---
title: Dialog 对话框
description: 对话框组件，用于模态窗口。
outline: deep
---

# Dialog 对话框

`xyu-dialog` 是前台组件库的对话框组件，用于模态窗口展示。

## 基础用法

:::demo 基础对话框用法。
dialog/basic
:::

## 自定义内容

:::demo 使用默认插槽自定义对话框内容。
dialog/custom
:::

## 关闭操作

:::demo 使用 `show-close` 控制关闭按钮显示。
dialog/close
:::

## 底部操作栏

:::demo 使用 `footer` 插槽添加底部操作按钮。
dialog/footer
:::

## 点击遮罩关闭

:::demo 使用 `close-on-click-modal` 控制点击遮罩关闭。
dialog/modal
:::

## 尺寸

:::demo 使用 `size` 属性设置对话框尺寸。
dialog/size
:::

## API

### Dialog Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 是否显示 | `boolean` | - |
| `title` | 标题 | `string` | - |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` |
| `effect` | 主题风格 | `'light' \| 'dark'` | `'light'` |
| `top` | 距离顶部距离 | `string` | `'15vh'` |
| `show-close` | 是否显示关闭按钮 | `boolean` | `true` |
| `close-on-click-modal` | 点击遮罩是否关闭 | `boolean` | `true` |
| `close-on-press-escape` | 按 ESC 是否关闭 | `boolean` | `true` |
| `destroy-on-close` | 关闭时是否销毁内容 | `boolean` | `false` |
| `z-index` | z-index 值 | `number` | `2000` |

### Dialog Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 显示状态变化时触发 | `(value: boolean)` |
| `open` | 打开对话框时触发 | - |
| `close` | 关闭对话框时触发 | - |
| `opened` | 打开动画结束时触发 | - |

### Dialog Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 对话框内容 |
| `header` | 自定义标题区 |
| `footer` | 自定义底部操作区 |
