---
title: Dropdown 下拉菜单
description: 用于承载操作菜单，而不是承载值选择。
outline: deep
---

# Dropdown 下拉菜单

`xy-dropdown` 负责“操作菜单”，不是“值选择器”。如果用户是在做操作，而不是在选择枚举值，优先用 Dropdown。

## 基础用法

:::demo 行操作菜单是 Dropdown 最典型的使用场景，适合把弱操作、危险操作和说明文案收进一个菜单里。
dropdown/basic
:::

## 选择后保持展开

:::demo 关闭行为可以由 `close-on-select` 控制，适合一些连续操作或辅助说明场景。
dropdown/manual-close
:::

## 键盘与行为约定

- `ArrowUp / ArrowDown / Home / End` 在菜单项之间移动。
- `Enter / Space` 选择当前高亮项。
- `Escape` 关闭菜单并把焦点还给触发器。

## API

### Dropdown Attributes

| 属性               | 说明               | 类型             | 默认值           |
| ------------------ | ------------------ | ---------------- | ---------------- |
| `items`            | 菜单项列表         | `DropdownItem[]` | `[]`             |
| `placement`        | 菜单位置           | `Placement`      | `'bottom-start'` |
| `disabled`         | 是否禁用           | `boolean`        | `false`          |
| `close-on-select`  | 选择后是否关闭     | `boolean`        | `true`           |

### DropdownItem

| 字段          | 说明           | 类型      | 默认值  |
| ------------- | -------------- | --------- | ------- |
| `key`         | 菜单项标识     | `string`  | —       |
| `label`       | 展示文案       | `string`  | —       |
| `disabled`    | 是否禁用       | `boolean` | `false` |
| `danger`      | 是否危险操作样式 | `boolean` | `false` |
| `description` | 辅助描述       | `string`  | `undefined` |

### Dropdown Events

| 事件              | 说明               | 参数             |
| ----------------- | ------------------ | ---------------- |
| `select`          | 选择菜单项         | `DropdownItem`   |
| `visible-change`  | 菜单开关状态变化   | `boolean`        |

### Dropdown Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 触发区域 |
