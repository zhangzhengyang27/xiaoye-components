---
title: DetailPage 详情页面容器
description: 统一页面头部、详情分组、附件、差异和日志的详情页容器。
outline: deep
---

# DetailPage 详情页面容器

`xy-detail-page` 用来把详情头部、分组信息区、附件区、变更区和历史区组织成统一详情页面。

## 基础用法

:::demo 适合中后台详情页的完整结构。
pro/detail-page/basic
:::

## 当前定位

- 承接详情页的结构和常见详情子面板。
- 不直接处理路由和后端 SDK。

## 类型命名约定

- 对外主类型名统一使用 `DetailPageBreadcrumbItem`、`DetailPageAction`、`DetailPageAttachmentFile`、`DetailPageProps`。
- 旧的 `PageHeaderBreadcrumbItem`、`PageHeaderAction`、`AttachmentPanelFile` 仅作为源码兼容别名保留，不再作为正式文档类型入口。
