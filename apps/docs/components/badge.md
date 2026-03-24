---
title: Badge 徽章
description: 数值、点状和自定义内容徽章组件。
outline: deep
---

# Badge 徽章

`xy-badge` 参考 Element Plus 的 `Badge` 设计，适合消息数、待办数量、状态提醒和角标标记。它既可以独立显示，也可以附着在按钮、标签或文本上。

## 基础用法

:::demo 数值型徽章最适合消息提醒、未读数和任务数量。
badge/basic
:::

## 最大值与隐藏零值

:::demo `max` 和 `show-zero` 适合做通知数、待办数这类有上限表达的场景。
badge/max
:::

## 自定义内容与颜色

:::demo 支持文字徽章、自定义颜色，以及通过 `content` 插槽自定义内容结构。
badge/customize
:::

## 点状徽章

:::demo `is-dot` 适合状态提醒、在线标记和轻量提示。
badge/dot
:::

## 偏移量

:::demo `offset` 用于精细微调徽章与宿主元素的相对位置。
badge/offset
:::

## API

### Badge Attributes

| 属性          | 说明                       | 类型                                                  | 默认值     |
| ------------- | -------------------------- | ----------------------------------------------------- | ---------- |
| `value`       | 显示值                     | `string \| number`                                    | `''`       |
| `max`         | 最大值，超出时显示 `{max}+` | `number`                                            | `99`       |
| `is-dot`      | 是否显示为小圆点           | `boolean`                                             | `false`    |
| `hidden`      | 是否隐藏徽章               | `boolean`                                             | `false`    |
| `type`        | 徽章类型                   | `'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'` | `'danger'` |
| `show-zero`   | 值为 0 时是否显示          | `boolean`                                             | `true`     |
| `color`       | 自定义背景色               | `string`                                              | `''`       |
| `badge-style` | 自定义徽章样式             | `StyleValue`                                          | —          |
| `offset`      | 徽章偏移量 `[x, y]`        | `[number, number]`                                    | `[0, 0]`   |
| `badge-class` | 自定义徽章类名             | `string`                                              | `''`       |

### Badge Slots

| 插槽      | 说明                             |
| --------- | -------------------------------- |
| `default` | 宿主内容                         |
| `content` | 自定义徽章内容，接收 `{ value }` |

### Badge Exposes

| 暴露项    | 说明         | 类型                    |
| --------- | ------------ | ----------------------- |
| `content` | 计算后的徽章值 | `ComputedRef<string>` |
