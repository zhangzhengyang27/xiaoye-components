---
title: Drawer 抽屉
description: 用于保留上下文的侧边录入或信息面板。
outline: deep
---

# Drawer 抽屉

`xy-drawer` 更适合详情查看、大表单编辑和侧边说明这类“希望保留主页面上下文”的场景。当前版本除了左右抽屉，也支持上下方向、Element Plus 风格的 `direction` 别名和关闭前拦截。

## 基础用法

:::demo 右侧抽屉适合做详情查看和表单编辑，能保留列表页的上下文。
drawer/basic
:::

## 受控显示与布局切换

:::demo 抽屉通常由列表页外部控制打开、关闭、方向和宽度，这样更适合做筛选面板和详情面板联动。
drawer/controlled
:::

## 打开方向与尺寸

:::demo 通过 `placement` 和 `size` 可以把 Drawer 调整成更像侧边导航、顶部筛选面板或底部说明层的结构。
drawer/placement
:::

## 关闭控制与上下抽屉

:::demo `direction`、`before-close`、`with-header` 和 `show-close` 适合做更接近配置面板或顶部筛选层的抽屉。
drawer/direction
:::

## API

### Drawer Attributes

| 属性                   | 说明                   | 类型                | 默认值    |
| ---------------------- | ---------------------- | ------------------- | --------- |
| `model-value`          | 是否打开               | `boolean`           | `false`   |
| `title`                | 抽屉标题               | `string`            | `''`      |
| `size`                 | 抽屉宽度或高度         | `string \| number`  | `420`     |
| `placement`            | 打开方向               | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `direction`            | Element Plus 风格方向别名 | `'ltr' \| 'rtl' \| 'ttb' \| 'btt'` | `undefined` |
| `append-to-body`       | 是否默认 teleport 到 body | `boolean`       | `true`    |
| `append-to`            | teleport 挂载目标      | `string \| HTMLElement` | `'body'` |
| `modal`                | 是否显示遮罩层         | `boolean`           | `true`    |
| `modal-class`          | 遮罩层自定义类名       | `string`            | `''`      |
| `modal-penetrable`     | 无遮罩时是否允许穿透点击背景 | `boolean`     | `false`   |
| `close-on-overlay`     | 点击遮罩是否关闭       | `boolean`           | `true`    |
| `close-on-click-modal` | 点击遮罩是否关闭，别名配置 | `boolean`       | `undefined` |
| `close-on-esc`         | 按下 `Escape` 是否关闭 | `boolean`           | `true`    |
| `close-on-press-escape`| 按下 `Escape` 是否关闭，别名配置 | `boolean` | `undefined` |
| `open-delay`           | 打开延迟，单位毫秒     | `number`            | `0`       |
| `close-delay`          | 关闭延迟，单位毫秒     | `number`            | `0`       |
| `destroy-on-close`     | 关闭后是否销毁内容     | `boolean`           | `false`   |
| `show-close`           | 是否显示右上角关闭按钮 | `boolean`           | `true`    |
| `lock-scroll`          | 打开时是否锁定 body 滚动 | `boolean`         | `true`    |
| `with-header`          | 是否渲染默认头部区域   | `boolean`           | `true`    |
| `before-close`         | 关闭前拦截函数         | `(done: (cancel?: boolean) => void) => void \| Promise<void>` | `undefined` |

### Drawer Events

| 事件                 | 说明         | 参数      |
| -------------------- | ------------ | --------- |
| `update:model-value` | 开关状态变化 | `boolean` |
| `open`               | 打开时触发   | —         |
| `opened`             | 进入完成后触发 | —       |
| `close`              | 关闭时触发   | —         |
| `closed`             | 离开完成后触发 | —       |

### Drawer Slots

| 插槽      | 说明       |
| --------- | ---------- |
| `header`  | 自定义头部 |
| `default` | 主体内容   |
| `footer`  | 底部操作区 |
