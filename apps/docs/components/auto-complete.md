---
title: AutoComplete 自动完成
description: 用于搜索建议、命中提示和远程联想输入的轻量组件。
outline: deep
---

# AutoComplete 自动完成

`xy-auto-complete` 适合搜索建议、命中提示和远程联想输入。它的核心是“受控输入 + 建议列表”，不承担多选或 mention 这类更重的职责。

## 基础用法

:::demo 默认会按标签文案做本地过滤，并在选择建议项后把标签文案回填到输入框。
auto-complete/basic
:::

## 远程建议

:::demo 开启 `remote` 后，组件只派发 `search-change`，列表内容完全由外部控制。
auto-complete/remote
:::

## 表单场景

:::demo 放到 `xy-form-item` 中时，自动完成会在选择和关闭时参与表单校验。
auto-complete/form
:::
