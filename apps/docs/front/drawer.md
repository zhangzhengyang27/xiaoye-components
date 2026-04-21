---
title: Drawer 抽屉
description: 抽屉组件，用于从侧面滑出的面板。
outline: deep
---

# Drawer 抽屉

`xyu-drawer` 是前台组件库的抽屉组件，用于从侧面滑出的面板。

## 基础用法

:::demo 基础抽屉用法。
drawer/basic
:::

## 抽屉位置

:::demo 使用 `placement` 属性设置抽屉滑出方向。
drawer/placement
:::

## 隐藏头部

:::demo 使用 `with-header` 属性隐藏头部。
drawer/header
:::

## 自定义内容

:::demo 使用默认插槽自定义抽屉内容。
drawer/custom
:::

## 尺寸

:::demo 使用 `size` 属性设置抽屉尺寸。
drawer/size
:::

## API

### Drawer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 是否显示 | `boolean` | - |
| `title` | 标题 | `string` | - |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` |
| `placement` | 抽屉位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| `show-close` | 是否显示关闭按钮 | `boolean` | `true` |
| `close-on-click-modal` | 点击遮罩是否关闭 | `boolean` | `true` |
| `destroy-on-close` | 关闭时是否销毁内容 | `boolean` | `false` |
| `z-index` | z-index 值 | `number` | `2000` |
| `with-header` | 是否显示头部 | `boolean` | `true` |

### Drawer Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 显示状态变化时触发 | `(value: boolean)` |
| `close` | 关闭抽屉时触发 | - |

### Drawer Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 抽屉内容 |
| `header` | 自定义标题区 |
| `footer` | 自定义底部操作区 |
