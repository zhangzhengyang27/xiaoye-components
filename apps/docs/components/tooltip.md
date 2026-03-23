---
title: Tooltip 文字提示
description: 用于承载简短说明，不承载复杂交互内容。
outline: deep
---

# Tooltip 文字提示

`xy-tooltip` 用来承载一两句补充说明。当前实现同时覆盖 hover 和 focus 路径，适合按钮解释、表头提示和轻量说明文案。

## 基础用法

:::demo Tooltip 不只服务鼠标悬停，也支持焦点进入触发区域时打开。
tooltip/basic
:::

## 不同方向

:::demo `placement` 用于控制浮层方向，适合根据页面空间决定提示出现的位置。
tooltip/placement
:::

## 自定义内容

:::demo 如果内容不只是单行文本，可以用 `content` 插槽渲染一小段说明，但仍然不建议承载复杂交互。
tooltip/custom
:::

## API

### Tooltip Attributes

| 属性          | 说明                   | 类型                                                   | 默认值  |
| ------------- | ---------------------- | ------------------------------------------------------ | ------- |
| `content`     | 纯文本提示内容         | `string`                                               | `''`    |
| `placement`   | 浮层方向               | `'top' \| 'bottom' \| 'left' \| 'right'`               | `'top'` |
| `disabled`    | 是否禁用               | `boolean`                                              | `false` |
| `open-delay`  | 打开延迟，单位毫秒     | `number`                                               | `80`    |
| `close-delay` | 关闭延迟，单位毫秒     | `number`                                               | `60`    |
| `enterable`   | 浮层是否允许鼠标进入   | `boolean`                                              | `true`  |

### Tooltip Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 触发区域       |
| `content` | 自定义提示内容 |
