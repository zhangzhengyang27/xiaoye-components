---
title: Card 卡片
description: 头部、主体、底部三段式内容容器。
outline: deep
---

# Card 卡片

`xy-card` 参考 Element Plus 的 `Card` 设计，并补了更贴合中后台容器的布局和状态能力。适合列表摘要、筛选面板、统计区块、图文信息块和数据态承载。

## 基础用法

:::demo 头部、主体、底部是最常见的卡片结构，适合设置面板和信息摘要。
card/basic
:::

## 简单卡片

:::demo 不需要头部和底部时，`xy-card` 也可以退化成一个带边框和内边距的内容容器。
card/simple
:::

## 图文卡片

:::demo 图片、标题和描述可以直接放在卡片主体里，适合内容流和媒体摘要场景。
card/image
:::

## 阴影模式

:::demo `always / hover / never` 对应不同的信息层级和交互密度。
card/shadow
:::

## Header Extra 与面板变体

:::demo `extra`、`variant`、`size` 和分隔线开关更适合筛选面板、设置区块和运维侧栏。
card/panel
:::

## Loading 与 Empty

:::demo `loading` 和 `empty` 让 Card 既能承载数据，也能承载容器状态。
card/states
:::

## API

### Card Attributes

| 属性           | 说明               | 类型                              | 默认值     |
| -------------- | ------------------ | --------------------------------- | ---------- |
| `size`         | 卡片密度           | `ComponentSize`                   | 跟随全局配置 |
| `variant`      | 卡片表面风格       | `'default' \| 'muted'`            | `'default'` |
| `bordered`     | 是否显示外边框     | `boolean`                         | `true`      |
| `header`       | 头部内容           | `string`                          | `''`        |
| `footer`       | 底部内容           | `string`                          | `''`        |
| `extra`        | 头部右侧补充内容   | `string`                          | `''`        |
| `body-style`   | 主体样式           | `StyleValue`                      | `''`        |
| `header-class` | 头部自定义类名     | `string`                          | `''`        |
| `body-class`   | 主体自定义类名     | `string`                          | `''`        |
| `footer-class` | 底部自定义类名     | `string`                          | `''`        |
| `header-divider` | 是否显示头部分隔线 | `boolean`                       | `true`      |
| `footer-divider` | 是否显示底部分隔线 | `boolean`                       | `true`      |
| `shadow`       | 阴影显示方式       | `'always' \| 'hover' \| 'never'`  | `'always'`  |
| `loading`      | 是否显示加载态     | `boolean`                         | `false`     |
| `loading-text` | 默认加载态文案     | `string`                          | `'加载中'`  |
| `empty`        | 是否显示空态       | `boolean`                         | `false`     |
| `empty-title`  | 默认空态标题       | `string`                          | `'暂无数据'` |
| `empty-description` | 默认空态描述 | `string`                          | `''`        |

### Card Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 卡片主体 |
| `header`  | 完全自定义卡片头部，优先级高于 `header/extra` |
| `extra`   | 标准头部右侧操作区 |
| `footer`  | 卡片底部 |
| `loading` | 自定义加载态内容 |
| `empty`   | 自定义空态内容 |
