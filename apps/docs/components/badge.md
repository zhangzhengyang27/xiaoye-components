---
title: Badge 徽章
description: 数值、点状和自定义内容徽章组件。
outline: deep
---

# Badge 徽章

`xy-badge` 适合消息数、待办数量、状态提醒和角标标记。它既可以独立显示，也可以附着在按钮、标签或文本上。

## 何时使用

- 需要在图标、头像或按钮旁显示未读消息数、待办数量等数值提示。
- 需要用小圆点标记"有新内容""在线"等状态，但不需显示具体数字。
- 需要在标签或卡片角落展示状态标记（如"新""热""Beta"）。

## 何时不使用

- 需要展示大量文本或复杂内容时，优先使用 `xy-tag` 或 `xy-tooltip`。
- 需要可交互的筛选标签时，优先使用 `xy-tag` 的 `closable` 模式。
- 需要全局消息提醒时，优先使用 `xy-message` 或 `xy-notification`。

## 最佳实践

### 数值徽章 vs 点状徽章

| 场景 | 推荐方式 |
|------|----------|
| 有具体数量（未读消息 5 条） | 数值型 `value` |
| 只需标记"有新内容" | 点状 `is-dot` |
| 数量可能很大 | 配合 `max` 显示 `99+` |
| 数量为 0 时不应显示 | 不传 `show-zero`（默认不显示） |

### 徽章与宿主元素

```vue
<xy-badge :value="3">
  <xy-button>消息</xy-button>
</xy-badge>
```

建议始终将 Badge 包裹在语义明确的宿主元素上，避免 Badge 悬空无参照。

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
| `type`        | 徽章类型                   | `BadgeType` | `'danger'` |
| `show-zero`   | 值为 0 时是否显示          | `boolean`                                             | `true`     |
| `color`       | 自定义背景色               | `string`                                              | `''`       |
| `badge-style` | 自定义徽章样式             | `StyleValue`                                          | —          |
| `offset`      | 徽章偏移量 `[x, y]`        | `[number, number]`                                    | `[0, 0]`   |
| `badge-class` | 自定义徽章类名             | `string`                                              | `''`       |

### Badge Slots

| 插槽      | 说明                             |
| --------- | -------------------------------- |
| `default` | 宿主内容                         |
| `content` | 自定义徽章内容，接收 `BadgeContentSlotProps` |

### Badge Exposes

| 暴露项    | 说明         | 类型                    |
| --------- | ------------ | ----------------------- |
| `content` | 计算后的徽章值 | `BadgeInstance["content"]` |
