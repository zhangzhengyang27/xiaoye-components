---
title: Dropdown 下拉菜单
description: 下拉菜单组件，用于展示操作列表。
outline: deep
---

# Dropdown 下拉菜单

`xyu-dropdown` 是前台组件库的下拉菜单组件，用于展示操作列表。

## 基础用法

:::demo 基础下拉菜单用法。
dropdown/basic
:::

## 触发方式

:::demo 使用 `trigger` 属性设置触发方式。
dropdown/trigger
:::

## 菜单项

:::demo 使用 `items` 属性传入菜单项列表。
dropdown/items
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用下拉菜单。
dropdown/disabled
:::

## 对齐方式

:::demo 使用 `placement` 属性设置菜单位置。
dropdown/placement
:::

## API

### Dropdown Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 菜单项列表 | `DropdownMenuItem[]` | `[]` |
| `trigger` | 触发方式 | `'hover' \| 'click' \| 'contextmenu'` | `'hover'` |
| `placement` | 菜单位置 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `disabled` | 是否禁用 | `boolean` | `false` |

### DropdownMenuItem 类型

```ts
interface DropdownMenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  divided?: boolean;
}
```

### Dropdown Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `select` | 点击菜单项时触发 | `(key: string)` |

### Dropdown Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发器内容 |
| `menu` | 自定义菜单内容 |
