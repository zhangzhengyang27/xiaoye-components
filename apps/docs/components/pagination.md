---
title: Pagination 分页
description: 列表页底部的分页切换组件。
outline: deep
---

# Pagination 分页

`xy-pagination` 用于列表页分页切换，支持当前页、每页条数、页码折叠、省略号、跳页输入和布局编排。

## 基础用法

:::demo 最常见的场景是把它放在 `xy-table` 底部，并用双向绑定接住页码与每页条数。
pagination/basic
:::

## 服务端参数同步

:::demo 后台列表请求通常需要 `page / pageSize / offset / limit` 这一类参数，Pagination 更适合作为外部请求状态的一部分。
pagination/server-sync
:::

## 布局与背景样式

:::demo 通过 `layout` 可以组合 `prev / pager / next / jumper / total / sizes / slot`，`background` 则更接近 Element Plus 的按钮式分页。
pagination/layout
:::

## 尺寸层级

:::demo `small` 适合更紧凑的列表工具区，`size` 则能和全局或局部表单尺寸体系保持一致。
pagination/size
:::

## 筛选后重置分页

:::demo 当筛选条件变化时，通常需要把当前页重置回 `1`，避免用户停留在失效页码上。
pagination/filter-reset
:::

## 禁用状态

:::demo 当列表处于整体只读、加载中或没有权限切页时，可以统一禁用分页交互。
pagination/disabled
:::

## 何时使用

- 列表页底部。
- 查询结果页的内容区域下方。
- 与 `xy-table` 组合成后台列表闭环。

## API

### Pagination Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `current-page` | 当前页码 | `number` | `undefined` |
| `default-current-page` | 非受控场景下的初始页码 | `number` | `1` |
| `page-size` | 每页条数 | `number` | `undefined` |
| `default-page-size` | 非受控场景下的初始每页条数 | `number` | `10` |
| `total` | 总条数 | `number` | `undefined` |
| `page-count` | 总页数，传入时优先级高于 `total` | `number` | `undefined` |
| `pager-count` | 显示的页码按钮数量，超出后会折叠成省略号 | `number` | `7` |
| `layout` | 分页布局，支持 `prev, pager, next, jumper, total, sizes, slot, ->` | `string` | `'prev, pager, next, jumper, ->, total'` |
| `page-sizes` | 可选每页条数 | `number[]` | `[10, 20, 30, 40, 50, 100]` |
| `prev-text` | 上一页按钮文案 | `string` | `''` |
| `next-text` | 下一页按钮文案 | `string` | `''` |
| `size` | 分页尺寸 | `ComponentSize` | 跟随全局配置 |
| `small` | 是否启用紧凑尺寸，优先级高于 `size` | `boolean` | `false` |
| `teleported` | 每页条数下拉是否挂到 body | `boolean` | `true` |
| `append-size-to` | 每页条数下拉挂载目标 | `string \| HTMLElement` | `'body'` |
| `popper-class` | 每页条数下拉自定义类名 | `string` | `''` |
| `popper-style` | 每页条数下拉自定义样式 | `StyleValue` | `undefined` |
| `disabled` | 是否禁用分页操作 | `boolean` | `false` |
| `background` | 是否启用带背景的按钮风格 | `boolean` | `false` |
| `hide-on-single-page` | 仅一页时是否隐藏 | `boolean` | `false` |

### Pagination Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:current-page` | 当前页变化时触发 | `number` |
| `update:page-size` | 每页条数变化时触发 | `number` |
| `current-change` | 当前页变化时触发 | `number` |
| `size-change` | 每页条数变化时触发 | `number` |
| `prev-click` | 点击上一页时触发 | `number` |
| `next-click` | 点击下一页时触发 | `number` |
| `change` | 页码或每页条数变化时统一触发 | `(page, pageSize)` |

### Pagination Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 当 `layout` 中包含 `slot` 时渲染自定义内容 |
