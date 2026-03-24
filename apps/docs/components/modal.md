---
title: Modal 弹窗
description: 适合阻断上下文的录入、确认和强提示场景。
outline: deep
---

# Modal 弹窗

`xy-modal` 用于承载阻断式录入、确认和强提示。当前版本重点保证焦点转移、`Escape` 关闭、遮罩关闭和关闭后焦点恢复这几类基础行为。

## 基础用法

:::demo 最常见的场景是弹窗表单录入或二次确认，并通过 `footer` 插槽放一组操作按钮。
modal/basic
:::

## 异步确认与提交中态

:::demo 删除、归档和发布这类动作通常不会立即结束，弹窗关闭时机应该由异步结果决定。
modal/async-confirm
:::

## 自定义头部与关闭策略

:::demo 当内容更偏强提示或配置确认时，可以自定义头部，并关闭遮罩点击退出。
modal/custom
:::

## 何时使用

- 弹窗表单录入，例如新建成员、编辑信息。
- 二次确认，例如删除、停用、归档。
- 强提示或阻断式阅读，例如重要配置确认。

:::tip 使用建议
如果内容只是补充说明或轻量交互，不需要阻断主页面时，优先使用 `xy-popover`。只有在需要强制用户处理当前任务时，再使用 `xy-modal`。
:::

## API

### Modal Attributes

| 属性               | 说明                   | 类型               | 默认值  |
| ------------------ | ---------------------- | ------------------ | ------- |
| `model-value`      | 是否打开弹窗           | `boolean`          | `false` |
| `title`            | 弹窗标题               | `string`           | `''`    |
| `width`            | 面板宽度               | `string \| number` | `560`   |
| `close-on-overlay` | 点击遮罩是否关闭       | `boolean`          | `true`  |
| `close-on-esc`     | 按下 `Escape` 是否关闭 | `boolean`          | `true`  |
| `destroy-on-close` | 关闭后是否销毁内容     | `boolean`          | `false` |

### Modal Events

| 事件                 | 说明                   | 参数      |
| -------------------- | ---------------------- | --------- |
| `update:model-value` | 弹窗开关状态变化时触发 | `boolean` |
| `open`               | 弹窗打开后触发         | —         |
| `close`              | 弹窗关闭时触发         | —         |

### Modal Slots

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 弹窗主体内容     |
| `header`  | 自定义头部内容   |
| `footer`  | 自定义底部操作区 |
