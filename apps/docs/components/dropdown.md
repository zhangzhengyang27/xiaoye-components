---
title: Dropdown 下拉菜单
description: 用于承载操作菜单，而不是承载值选择。
---

# Dropdown 下拉菜单

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `DropdownItem[]` | `[]` | 菜单项列表 |
| `placement` | `Placement` | `"bottom-start"` | 菜单位置 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `closeOnSelect` | `boolean` | `true` | 选择后是否关闭 |

`DropdownItem` 结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 菜单项标识 |
| `label` | `string` | 展示文案 |
| `disabled` | `boolean` | 是否禁用 |
| `danger` | `boolean` | 是否危险操作样式 |
| `description` | `string` | 辅助描述 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `select` | `(item: DropdownItem)` | 选择菜单项 |
| `visibleChange` | `(value: boolean)` | 菜单开关状态变化 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 触发区域 |

## 可访问性约定

- 使用 `menu / menuitem` 语义。
- 支持 `ArrowUp / ArrowDown / Home / End` 遍历菜单项。
- `Enter / Space` 选择当前高亮项。
- `Escape` 和外部点击关闭菜单。

