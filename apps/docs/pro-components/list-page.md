---
title: ListPage 列表页面容器
description: 统一筛选栏、列表、批量动作和请求状态的页面容器。
outline: deep
---

# ListPage 列表页面容器

`xy-list-page` 用来把 `SearchForm + ProTable + 请求状态 + 页面内批量动作区` 收成一块稳定的列表页容器。

## 基础用法

:::demo 适合中后台列表页的标准骨架。
pro/list-page/basic
:::

## 当前定位

- 承接列表页里的搜索、列表、分页、批量动作和异步状态。
- 不直接处理表单编辑或详情展示，那些能力继续交给 `CrudPage` 和 `DetailPage`。

## 类型命名约定

- 对外主类型名统一使用 `ListPageBatchAction`、`ListPageProps`、`ListPageActionRef`。
- 旧的 `BatchActionBarAction` 仅作为源码兼容别名保留，不再作为正式文档类型入口。
