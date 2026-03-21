---
title: Drawer 抽屉
description: 用于保留上下文的侧边录入或信息面板。
---

# Drawer 抽屉

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否打开 |
| `title` | `string` | `""` | 抽屉标题 |
| `size` | `string \| number` | `420` | 抽屉宽度 |
| `placement` | `"left" \| "right"` | `"right"` | 打开方向 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩是否关闭 |
| `closeOnEsc` | `boolean` | `true` | `Escape` 是否关闭 |
| `destroyOnClose` | `boolean` | `false` | 关闭后是否销毁内容 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 开关状态变化 |
| `open` | `()` | 打开时触发 |
| `close` | `()` | 关闭时触发 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `header` | 自定义头部 |
| `default` | 主体内容 |
| `footer` | 底部操作区 |

## 可访问性约定

- 焦点带入、焦点恢复与 `Modal` 保持一致。
- `Tab / Shift+Tab` 在抽屉内部循环。
- `Escape` 和遮罩关闭逻辑与 `Modal` 一致。

