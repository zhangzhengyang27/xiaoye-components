---
title: Modal 弹窗
description: 适合阻断上下文的录入、确认和强提示场景。
outline: deep
---

# Modal 弹窗

`xy-modal` 用于承载阻断式录入、确认和强提示。除了基础的焦点转移、`Escape` 关闭和遮罩关闭，它也支持 `before-close`、头部裁剪和滚动锁定控制。

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

## 关闭控制与结构裁剪

:::demo `before-close`、`show-close`、`with-header` 和 `lock-scroll` 更适合做严格确认或简化头部结构的弹窗。
modal/close-control
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

| 属性                   | 说明                   | 类型               | 默认值  |
| ---------------------- | ---------------------- | ------------------ | ------- |
| `model-value`          | 是否打开弹窗           | `boolean`          | `false` |
| `title`                | 弹窗标题               | `string`           | `''`    |
| `width`                | 面板宽度               | `string \| number` | `560`   |
| `append-to-body`       | 是否默认 teleport 到 body | `boolean`       | `true`  |
| `append-to`            | teleport 挂载目标      | `string \| HTMLElement` | `'body'` |
| `modal`                | 是否显示遮罩层         | `boolean`          | `true`  |
| `modal-class`          | 遮罩层自定义类名       | `string`           | `''`    |
| `modal-penetrable`     | 无遮罩时是否允许穿透点击背景 | `boolean`     | `false` |
| `close-on-overlay`     | 点击遮罩是否关闭       | `boolean`          | `true`  |
| `close-on-click-modal` | 点击遮罩是否关闭，别名配置 | `boolean`      | `undefined` |
| `close-on-esc`         | 按下 `Escape` 是否关闭 | `boolean`          | `true`  |
| `close-on-press-escape`| 按下 `Escape` 是否关闭，别名配置 | `boolean` | `undefined` |
| `open-delay`           | 打开延迟，单位毫秒     | `number`           | `0`     |
| `close-delay`          | 关闭延迟，单位毫秒     | `number`           | `0`     |
| `destroy-on-close`     | 关闭后是否销毁内容     | `boolean`          | `false` |
| `show-close`           | 是否显示右上角关闭按钮 | `boolean`          | `true`  |
| `lock-scroll`          | 打开时是否锁定 body 滚动 | `boolean`        | `true`  |
| `with-header`          | 是否渲染默认头部区域   | `boolean`          | `true`  |
| `before-close`         | 关闭前拦截函数         | `(done: (cancel?: boolean) => void) => void \| Promise<void>` | `undefined` |

### Modal Events

| 事件                 | 说明                   | 参数      |
| -------------------- | ---------------------- | --------- |
| `update:model-value` | 弹窗开关状态变化时触发 | `boolean` |
| `open`               | 弹窗打开后触发         | —         |
| `opened`             | 弹窗进入完成后触发     | —         |
| `close`              | 弹窗关闭时触发         | —         |
| `closed`             | 弹窗离开完成后触发     | —         |

### Modal Slots

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 弹窗主体内容     |
| `header`  | 自定义头部内容   |
| `footer`  | 自定义底部操作区 |
