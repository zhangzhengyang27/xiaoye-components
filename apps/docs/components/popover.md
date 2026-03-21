---
title: Popover 气泡卡片
description: 用于承载轻量说明或交互内容，比 Tooltip 更重，比 Modal 更轻。
---

# Popover 气泡卡片

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否打开 |
| `title` | `string` | `""` | 标题 |
| `placement` | `Placement` | `"bottom"` | 浮层位置 |
| `width` | `string \| number` | `320` | 面板宽度 |
| `closeOnOutside` | `boolean` | `true` | 点击外部是否关闭 |
| `closeOnEsc` | `boolean` | `true` | `Escape` 是否关闭 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 开关状态变化 |
| `open` | `()` | 打开时触发 |
| `close` | `()` | 关闭时触发 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `trigger` | 触发区域 |
| `header` | 自定义头部 |
| `default` | 面板主体内容 |

## 可访问性约定

- 当前实现优先服务点击触发的轻量交互。
- 打开后会把焦点带到内容区的首个可聚焦元素。
- `Escape` 和外部点击可关闭气泡。

