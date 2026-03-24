---
title: Pagination 分页
description: 列表页底部的分页切换组件。
outline: deep
---

# Pagination 分页

`xy-pagination` 用于列表页分页切换，支持当前页、每页条数和总条数联动。

## 基础用法

:::demo 最常见的场景是把它放在 `xy-table` 底部，并用双向绑定接住页码与每页条数。
pagination/basic
:::

## 服务端参数同步

:::demo 后台列表请求通常需要 `page / pageSize / offset / limit` 这一类参数，Pagination 更适合作为外部请求状态的一部分。
pagination/server-sync
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

| 属性           | 说明             | 类型       | 默认值         |
| -------------- | ---------------- | ---------- | -------------- |
| `current-page` | 当前页码         | `number`   | `1`            |
| `page-size`    | 每页条数         | `number`   | `10`           |
| `total`        | 总条数           | `number`   | —              |
| `page-sizes`   | 可选每页条数     | `number[]` | `[10, 20, 50]` |
| `disabled`     | 是否禁用分页操作 | `boolean`  | `false`        |

### Pagination Events

| 事件                  | 说明                         | 参数               |
| --------------------- | ---------------------------- | ------------------ |
| `update:current-page` | 当前页变化时触发             | `number`           |
| `update:page-size`    | 每页条数变化时触发           | `number`           |
| `change`              | 页码或每页条数变化时统一触发 | `(page, pageSize)` |
