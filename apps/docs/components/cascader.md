---
title: Cascader 级联选择
description: 用于地区、目录和路径式分类选择的级联选择组件。
outline: deep
---

# Cascader 级联选择

`xy-cascader` 适合地区、目录和路径式分类选择。当前 v1 只做单选，值固定为完整路径数组。

## 基础用法

:::demo 逐级点击选项后，组件会在触发器里按路径回显，并对外输出完整路径值。
cascader/basic
:::

## 搜索过滤

:::demo 开启 `filterable` 后，会在当前已加载节点中按路径文本搜索。
cascader/filterable
:::

## 懒加载

:::demo `lazy + load` 适合大型目录或按需加载的分类体系。
cascader/lazy
:::
