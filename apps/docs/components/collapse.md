---
title: Collapse 折叠面板
description: 用于收起说明、筛选配置和 FAQ 内容。
outline: deep
---

# Collapse 折叠面板

`xy-collapse` 适合承载 FAQ、筛选说明、表单补充配置和可选高级项。它更像“按需展开的内容容器”，不是 Tabs 那种视图切换器。

## 基础用法

:::demo 最常见的场景是 FAQ、说明文档或轻量设置项，一次可以展开多项。
collapse/basic
:::

## 手风琴模式

:::demo 开启 `accordion` 后，同一时间只会展开一个面板，适合设置面板和移动端详情页。
collapse/accordion
:::

## 禁用项与守卫

:::demo 禁用项不会响应切换；`before-collapse` 适合在展开前做权限、校验或异步确认。
collapse/guarded
:::

## API

### Collapse Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前展开项，手风琴模式下可传单值，非手风琴模式下传数组 | `CollapseModelValue` | `[]` |
| `accordion` | 是否启用手风琴模式 | `boolean` | `false` |
| `expand-icon-position` | 展开图标位置 | `CollapseExpandIconPosition` | `'right'` |
| `before-collapse` | 切换前守卫，返回 `false` 或 rejected Promise 时阻止切换 | `CollapseBeforeCollapse` | `undefined` |

### Collapse Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 展开项变化 | `CollapseModelValue` |
| `change` | 展开项变化时触发 | `CollapseModelValue` |

### Collapse Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | `xy-collapse-item` 列表 |

### Collapse Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `activeNames` | 当前内部维护的展开项列表 | `CollapseInstance["activeNames"]` |
| `setActiveNames` | 主动写入展开项列表，并同步触发 `update:model-value / change` | `CollapseInstance["setActiveNames"]` |

### CollapseItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题文案 | `string` | `''` |
| `name` | 唯一标识，不传时自动生成 | `CollapseActiveName` | `undefined` |
| `disabled` | 是否禁用当前项 | `boolean` | `false` |

### CollapseItem Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 自定义标题内容，插槽参数为 `CollapseItemTitleSlotProps` |
| `default` | 面板主体内容 |

### CollapseItem Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `isActive` | 当前面板项是否处于展开状态 | `CollapseItemInstance["isActive"]` |
