---
title: Drawer 抽屉
description: 用于保留上下文的侧边录入或信息面板。
outline: deep
---

# Drawer 抽屉

`xy-drawer` 更适合详情查看、大表单编辑和侧边说明这类“希望保留主页面上下文”的场景。

## 基础用法

:::demo 右侧抽屉适合做详情查看和表单编辑，能保留列表页的上下文。
drawer/basic
:::

## 打开方向与宽度

:::demo 通过 `placement` 和 `size` 可以把 Drawer 调整成更像侧边导航或详情面板的结构。
drawer/placement
:::

## API

### Drawer Attributes

| 属性               | 说明                   | 类型               | 默认值   |
| ------------------ | ---------------------- | ------------------ | -------- |
| `model-value`      | 是否打开               | `boolean`          | `false`  |
| `title`            | 抽屉标题               | `string`           | `''`     |
| `size`             | 抽屉宽度               | `string \| number` | `420`    |
| `placement`        | 打开方向               | `'left' \| 'right'`| `'right'`|
| `close-on-overlay` | 点击遮罩是否关闭       | `boolean`          | `true`   |
| `close-on-esc`     | 按下 `Escape` 是否关闭 | `boolean`          | `true`   |
| `destroy-on-close` | 关闭后是否销毁内容     | `boolean`          | `false`  |

### Drawer Events

| 事件                 | 说明             | 参数      |
| -------------------- | ---------------- | --------- |
| `update:model-value` | 开关状态变化     | `boolean` |
| `open`               | 打开时触发       | —         |
| `close`              | 关闭时触发       | —         |

### Drawer Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `header`  | 自定义头部   |
| `default` | 主体内容     |
| `footer`  | 底部操作区   |
