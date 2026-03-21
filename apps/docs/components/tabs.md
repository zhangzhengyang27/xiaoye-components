---
title: Tabs 标签页
description: 页面分区、局部导航和视图切换的基础页签组件。
---

# Tabs 标签页

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `首个可用项` | 当前激活项 |
| `items` | `TabItem[]` | `[]` | 页签项配置 |

`TabItem` 结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 唯一标识 |
| `label` | `string` | 展示文案 |
| `disabled` | `boolean` | 是否禁用 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: string)` | 激活项变化 |
| `change` | `(value: string)` | 切换页签时触发 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 面板内容，暴露 `activeKey` 与 `activeItem` |

## 可访问性约定

- 使用 `tablist / tab / tabpanel` 语义。
- 支持方向键切换。
- `Home / End` 快速跳到首尾可用项。
- 遇到禁用项时自动跳过。

