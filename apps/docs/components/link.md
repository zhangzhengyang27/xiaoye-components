---
title: Link 文字链接
description: 轻量跳转、说明区弱操作和文本级动作入口。
outline: deep
---

# Link 文字链接

`xy-link` 更适合承载正文跳转、说明区弱操作和文本级动作。它和 `xy-button link` 的差别不在“看起来像不像链接”，而在语义上：`xy-link` 默认走原生链接语义，更适合承载跳转；`xy-button link` 仍然属于按钮体系，更适合承载动作。

<p class="xy-section-lead">
  如果一个操作本质上是在“跳到别处”，优先用 `xy-link`。如果它仍然是当前页面里的动作，只是想做得更轻，再考虑 `xy-button link`。
</p>

## 基础用法

:::demo `type` 用来表达语义等级。和 Button 不同，Link 天生更轻，不承担大面积主操作按钮的视觉职责。
link/basic
:::

## 下划线策略

`underline` 支持 `always / hover / never`，同时兼容布尔值写法，其中 `true` 会映射为 `hover`，`false` 会映射为 `never`。

:::demo 推荐默认使用 `hover`，这样既保留链接感，又不会让正文里出现过多常显装饰线。
link/underline
:::

## 跳转与禁用

当存在 `href` 时，`xy-link` 会保持原生链接行为；当 `disabled` 为 `true` 时，会移除 `href / target` 并阻止交互。没有 `href` 时，它也可以作为轻量文本动作使用。

:::demo 跳转型链接和动作型链接都可以承载，但如果它是页面主决策，仍然优先用 Button。
link/disabled
:::

## 图标

`icon` 属性适合前置图标，`icon` 插槽适合补充后置图标或自定义图形。纯图标 `xy-link` 需要显式提供 `aria-label`。

:::demo 图标不会改变 Link 的语义，只是在文字周围补充方向感和信息密度。
link/icon
:::

## 何时使用

- 在说明区、表格正文或卡片摘要里补充“查看详情”“了解更多”这类弱操作。
- 需要原生链接语义、`href / target` 或浏览器默认跳转行为。
- 需要比 `xy-button link` 更轻、更接近正文排版的文本操作。

## 什么时候不用 Link

- 当前动作仍然属于表单提交、保存、删除这类页面内操作。
- 你需要明显的主次操作层级，而不只是正文跳转。
- 你希望操作和 Button 体系的尺寸、状态、分组能力保持一致。

## Link API

### Link Attributes

| 属性        | 说明              | 类型                                                                     | 默认值      |
| ----------- | ----------------- | ------------------------------------------------------------------------ | ----------- |
| `type`      | 链接语义色        | `'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'` | `'default'` |
| `underline` | 下划线显示策略    | `boolean \| 'always' \| 'never' \| 'hover'`                              | `'hover'`   |
| `disabled`  | 是否禁用交互      | `boolean`                                                                | `false`     |
| `href`      | 原生链接地址      | `string`                                                                 | `''`        |
| `target`    | 原生跳转目标      | `'_blank' \| '_parent' \| '_self' \| '_top' \| string`                   | `'_self'`   |
| `icon`      | 前置 Iconify 图标 | `string`                                                                 | —           |

### Link Events

| 事件    | 说明                           | 参数         |
| ------- | ------------------------------ | ------------ |
| `click` | 点击链接时触发；禁用时不会触发 | `MouseEvent` |

### Link Slots

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 链接主内容               |
| `icon`    | 自定义后置图标或附加图形 |

## 可访问性与行为约定

- 有 `href` 时保持原生 `<a>` 语义，浏览器默认跳转仍然生效。
- 没有 `href` 时组件会补 `role="link"` 和 `tabindex="0"`，允许通过 `Enter` 触发文本动作。
- `disabled` 时会输出 `aria-disabled="true"`，同时移除 `href / target` 并阻止点击事件。
- 纯图标 `xy-link` 应显式补 `aria-label`，例如 `<xy-link icon="mdi:information-outline" aria-label="查看说明" />`。
