---
title: Tooltip 文字提示
description: 用于承载简短说明，不承载复杂交互内容。
---

# Tooltip 文字提示

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `""` | 纯文本提示内容 |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 浮层位置 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `openDelay` | `number` | `80` | 打开延迟 |
| `closeDelay` | `number` | `60` | 关闭延迟 |
| `enterable` | `boolean` | `true` | 鼠标能否进入提示层继续停留 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 触发区域 |
| `content` | 自定义提示内容 |

## 可访问性约定

- 支持 `focus` 打开，而不是只支持 hover。
- `Escape` 可关闭当前提示层。
- 触发器通过 `aria-describedby` 关联提示层。
- 如果内容里需要操作按钮，应改用 [Popover 气泡卡片](/components/popover)。

