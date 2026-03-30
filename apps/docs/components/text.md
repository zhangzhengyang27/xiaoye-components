---
title: Text 文本
description: 轻量文本语义、颜色强调与截断展示组件。
outline: deep
---

# Text 文本

`xy-text` 用于承载正文级文本、状态说明和卡片摘要。它不是富文本组件，而是给普通文本补上语义色、尺寸节奏、截断、复制和展开能力。

## 基础用法

:::demo `type` 用来表达文本语义等级，更适合正文中的“强调”和“状态提示”，而不是按钮那种强交互色块。
text/basic
:::

## 尺寸

:::demo `xy-text` 跟随全局尺寸，也可以局部覆盖为 `sm / md / lg`。适合同一页面里区分正文、辅助说明和强调标题。
text/size
:::

## 单行截断

:::demo 开启 `truncated` 后会走单行省略逻辑，实际发生溢出时会自动补 `title`。
text/truncated
:::

## 多行截断

:::demo `line-clamp` 适合摘要块、列表描述和说明文案，多行溢出时也会自动补 `title`。
text/line-clamp
:::

## 自定义标签

:::demo `tag` 可以让 Text 保持原本的排版语义，例如 `p / strong / del`，而不是强行只渲染成 `span`。
text/tag
:::

## 复制与语义样式

:::demo `copyable` 适合承载编号、链接和命令片段，`strong / underline / delete` 用于轻量语义强调。
text/actions
:::

## 可展开文本

:::demo `expandable` 适合搭配 `line-clamp` 承载较长说明，默认先收起，点击后展开完整内容。
text/expandable
:::

## 何时使用

- 需要在正文里对某一段说明做轻量语义强调。
- 需要在卡片、列表或摘要区控制文本截断，而不想每次都手写样式。
- 需要保留 `p / strong / del` 这类标签语义，同时接入统一的主题色和字号。

## Text API

### Text Attributes

| 属性         | 说明               | 类型                                                                     | 默认值       |
| ------------ | ------------------ | ------------------------------------------------------------------------ | ------------ |
| `type`       | 文本语义色         | `'default' \| 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | `'default'`  |
| `size`       | 文本尺寸           | `'sm' \| 'md' \| 'lg'`                                                   | 跟随全局配置 |
| `truncated`  | 是否启用单行省略   | `boolean`                                                                | `false`      |
| `line-clamp` | 多行省略的最大行数 | `number \| string`                                                       | —            |
| `tag`        | 渲染的根标签       | `string`                                                                 | `'span'`     |
| `copyable`   | 是否显示复制按钮   | `boolean`                                                                | `false`      |
| `ellipsis-tooltip` | 溢出时是否补充 tooltip | `boolean`                                                        | `false`      |
| `expandable` | 是否支持展开收起   | `boolean`                                                                | `false`      |
| `strong`     | 是否加粗显示       | `boolean`                                                                | `false`      |
| `underline`  | 是否添加下划线     | `boolean`                                                                | `false`      |
| `delete`     | 是否添加删除线     | `boolean`                                                                | `false`      |

### Text Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 文本内容 |

## 行为约定

- `truncated` 只处理单行省略，`line-clamp` 处理多行省略，两者不建议同时使用。
- 没有显式传 `title` 时，组件会在内容真实溢出后自动补 `title`。
- `expandable` 只在文本真实溢出时展示展开按钮。
- `tag` 只改变语义标签，不改变颜色、字号和截断策略。
