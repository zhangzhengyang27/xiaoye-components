---
title: MarketingModal 营销弹层
description: 营销场景弹层组件，支持优惠券、限时抢购、满减活动等
outline: deep
---

# MarketingModal 营销弹层

营销场景专用弹层组件，支持优惠券、限时抢购、满减活动等不同类型，提供多层过渡动画和倒计时功能。

## 基础用法

:::demo marketing-modal/basic
basic
:::

## 类型

:::demo marketing-modal/types
types
:::

## 底部弹出

:::demo marketing-modal/bottom-sheet
bottom-sheet
:::

## 倒计时

:::demo marketing-modal/countdown
countdown
:::

## 自动关闭

:::demo marketing-modal/auto-close
auto-close
:::

## 自定义内容

:::demo marketing-modal/custom
custom
:::

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 控制显示状态 | `boolean` | `false` |
| `type` | 弹层类型 | `'coupon' \| 'flash-sale' \| 'promotion' \| 'custom'` | `'custom'` |
| `title` | 标题 | `string` | `""` |
| `backdrop-blur` | 背景模糊效果 | `boolean` | `true` |
| `countdown` | 倒计时秒数 | `number` | `0` |
| `auto-close` | 自动关闭倒计时（秒） | `number` | `0` |
| `variant` | 弹出方式 | `'centered' \| 'bottom-sheet'` | `'centered'` |
| `show-close` | 显示关闭按钮 | `boolean` | `true` |
| `close-on-click-overlay` | 点击遮罩关闭 | `boolean` | `true` |
| `close-on-press-escape` | ESC 键关闭 | `boolean` | `true` |
| `backdrop-class` | 遮罩层额外类名 | `string` | `""` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 显示状态变化 | `(value: boolean)` |
| `open` | 打开时触发 | `-` |
| `opened` | 打开动画结束后触发 | `-` |
| `close` | 关闭时触发 | `-` |
| `closed` | 关闭动画结束后触发 | `-` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 弹层主体内容 |
| `header` | 自定义头部 |
| `footer` | 自定义底部 |
| `icon` | 自定义类型图标 |

### 依赖

此组件内部使用了以下 xiaoye-components 组件：

- `xy-icon` - 图标展示
