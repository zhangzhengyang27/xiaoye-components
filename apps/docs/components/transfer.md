---
title: Transfer 穿梭框
description: 用于成员、权限和资源双栏分配的基础穿梭框组件。
outline: deep
---

# Transfer 穿梭框

`xy-transfer` 适合成员分配、权限绑定和资源配置这类双栏迁移场景。当前 v1 只做基础双栏穿梭，不提供树穿梭和表格穿梭。

## 基础用法

:::demo 默认通过 `v-model` 绑定右侧目标列表的 key 数组。
transfer/basic
:::

## 搜索与禁用项

:::demo 开启 `filterable` 后可以分别在左右两栏做本地过滤，禁用项不会参与迁移。
transfer/filterable
:::
