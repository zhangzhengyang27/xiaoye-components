---
title: TreeSelect 树选择
description: 用于组织、目录和权限树单选的层级选择组件。
outline: deep
---

# TreeSelect 树选择

`xy-tree-select` 面向组织、菜单、分类目录这类层级单选场景。当前 v1 只做单选树选，不提供多选和 tag 回显。

## 基础用法

:::demo 通过 `node-key` 标识节点主键，组件会在选择后回显节点标签。
tree-select/basic
:::

## 过滤与清空

:::demo 开启 `filterable` 后，可以在面板内搜索已加载节点，并结合 `clearable` 清空当前值。
tree-select/filterable
:::

## 表单场景

:::demo 放在 `xy-form-item` 中时，树选择会在选择和关闭时参与表单校验。
tree-select/form
:::
