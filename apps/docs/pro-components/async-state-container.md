---
title: AsyncStateContainer 异步状态容器
description: 统一 loading、error、empty 和 content 四种异步状态。
outline: deep
---

# AsyncStateContainer 异步状态容器

`xy-async-state-container` 用来收口页面级和区块级的异步状态。

## 基础用法

:::demo 适合请求列表、详情区和面板容器的状态承载。
pro/async-state-container/basic
:::

## 当前定位

- 统一 loading / error / empty / content 的承载结构。
- 常与 `RequestForm`、`ListPage`、`DetailPage` 一起使用。

## AsyncStateContainer API

### AsyncStateContainer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `loading` | 是否加载中，为 `true` 时优先展示加载态 | `boolean` | `false` |
| `error` | 错误信息，非空时展示错误态 | `string \| null` | `null` |
| `empty` | 是否为空态，仅在非加载且无错误时生效 | `boolean` | `false` |
| `empty-title` | 空态标题 | `string` | `'暂无数据'` |
| `empty-description` | 空态描述 | `string` | `'当前条件下没有可展示的内容。'` |
| `loading-text` | 加载态文案 | `string` | `'正在加载数据'` |

### AsyncStateContainer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `retry` | 点击错误态内置的「重新加载」按钮时派发 | `() => void` |

### AsyncStateContainer Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 正常内容区 | — |
| `loading` | 自定义加载态 | — |
| `error` | 自定义错误态 | `{ error: string \| null }` |
| `empty` | 自定义空态 | — |
