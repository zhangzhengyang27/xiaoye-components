---
title: Drawer 抽屉
description: 用于保留上下文的侧边录入或信息面板。
outline: deep
---

# Drawer 抽屉

`xy-drawer` 更适合详情查看、大表单编辑和侧边说明这类“希望保留主页面上下文”的场景。当前实现延续了项目内的 `placement` 习惯，补齐了 `direction`、可拖拽尺寸、自定义头部 slot props、焦点事件和 `handleClose()` expose。

## 基础用法

:::demo 右侧抽屉适合做详情查看和表单编辑，能保留列表页的上下文。
drawer/basic
:::

## 方向与尺寸对照

:::demo `placement` 仍然是项目内推荐写法；如果你需要使用 `direction`，它会优先覆盖 `placement`。
drawer/placement
:::

## 受控显示与关闭策略

:::demo 抽屉通常由列表页外部控制打开、关闭、方向和宽度，这样更适合做筛选面板和详情面板联动。
drawer/controlled
:::

## 自定义头部与 slot props

:::demo `header` 插槽会拿到 `close`、`titleId` 和 `titleClass`，既能自定义头部，又不会丢掉可访问标题和关闭链路。
drawer/header
:::

## 可拖拽尺寸

:::demo 打开 `resizable` 后，拖动抽屉边缘可以实时改宽高，并通过 `resize-start`、`resize`、`resize-end` 拿到像素尺寸。
drawer/resizable
:::

## 全屏与关闭图标

:::demo `fullscreen` 会让抽屉直接占满视口，`close-icon` 则用于替换默认关闭图标，适合工作区式的大面板。
drawer/fullscreen
:::

## 嵌套抽屉

:::demo 默认 `append-to-body` 就是 `true`，所以内层抽屉会自动进入更高层级，不需要额外配置。
drawer/nested
:::

## 关闭控制与上下抽屉

:::demo `direction`、`before-close`、`with-header` 和 `show-close` 适合做更接近配置面板或顶部筛选层的抽屉。
drawer/direction
:::

## 无遮罩可穿透

:::demo `modal=false` 时抽屉不会渲染遮罩；再配合 `modal-penetrable`，背景区域仍然可以继续交互。
drawer/modal
:::

## 使用说明

- `direction` 优先级高于 `placement`；如果两者同时传入，会以 `direction` 推导出的方向为准。
- `append-to` 优先级高于 `append-to-body`；一旦显式指定挂载目标，就会直接 teleport 到该节点。
- `close-on-click-modal` 优先级高于 `close-on-overlay`，`close-on-press-escape` 优先级高于 `close-on-esc`，这两个别名提供了额外兼容。
- `modal-class` 作用在遮罩层容器上，因此只在 `modal=true` 时生效；组件的原生 `class` 与 `style` 会透传到抽屉面板本身。
- `modal=false` 时不会响应外部点击关闭；如果还希望背景可点击，请再打开 `modal-penetrable`。
- 键盘焦点默认会被限制在抽屉内部；但在 `modal=false` 且 `modal-penetrable=true` 的场景里，指针点击外部可交互元素时，不会被抽屉强制拉回焦点。
- 抽屉内容默认是懒渲染的，也就是第一次真正打开后才会挂载内部内容；需要拿 DOM 或测量尺寸时，优先放到 `open` 之后处理。
- `destroy-on-close` 适合每次打开都希望重新挂载内容的场景，例如重置复杂表单、重新执行初始化逻辑。
- 关闭前拦截优先于销毁逻辑；如果 `before-close` 取消了关闭，内容不会被卸载。
- `title` 插槽和 `custom-class` 仅保留兼容能力；新代码优先使用 `header` 插槽和组件原生 `class`。

## direction 与 placement 的区别

- 继续保留项目内的 `placement` 写法，不强制切到 `direction`。
- 默认 `size` 仍然是 `420`，默认 `append-to-body` 仍然是 `true`，以保持当前项目里的既有使用习惯。
- 保留了 `title` 插槽和 `custom-class` 的兼容层，但会给出废弃提示；新代码优先使用 `header` 插槽和组件原生 `class`。

## API

### Drawer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 是否打开抽屉 | `boolean` | `false` |
| `title` | 抽屉标题；当你完全自定义 `header` 时，仍建议传入用于可访问名称兜底 | `string` | `''` |
| `size` | 抽屉宽度或高度；左右方向作用于宽度，上下方向作用于高度 | `string \| number` | `420` |
| `placement` | 项目内保留的打开方向写法 | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `direction` | 方向别名，优先级高于 `placement` | `'ltr' \| 'rtl' \| 'ttb' \| 'btt'` | `undefined` |
| `append-to-body` | 默认是否 teleport 到 `body` | `boolean` | `true` |
| `append-to` | teleport 挂载目标；传入后会覆盖 `append-to-body` | `string \| HTMLElement` | `'body'` |
| `modal` | 是否显示遮罩层 | `boolean` | `true` |
| `modal-class` | 遮罩层自定义类名，仅在 `modal=true` 时生效 | `string` | `''` |
| `modal-penetrable` | 无遮罩时是否允许背景继续点击 | `boolean` | `false` |
| `close-on-overlay` | 点击遮罩是否关闭 | `boolean` | `true` |
| `close-on-click-modal` | 点击遮罩是否关闭的别名配置，优先级高于 `close-on-overlay` | `boolean` | `undefined` |
| `close-on-esc` | 按下 `Escape` 是否关闭 | `boolean` | `true` |
| `close-on-press-escape` | `Escape` 关闭的别名配置，优先级高于 `close-on-esc` | `boolean` | `undefined` |
| `open-delay` | 打开延迟，单位毫秒 | `number` | `0` |
| `close-delay` | 关闭延迟，单位毫秒 | `number` | `0` |
| `destroy-on-close` | 关闭后是否销毁内容 | `boolean` | `false` |
| `show-close` | 是否显示右上角关闭按钮 | `boolean` | `true` |
| `lock-scroll` | 打开时是否锁定 `body` 滚动 | `boolean` | `true` |
| `with-header` | 是否渲染默认头部容器 | `boolean` | `true` |
| `before-close` | 关闭前拦截函数，第二个参数会给出触发来源：`close`、`backdrop`、`escape`、`programmatic` | `(done: (cancel?: boolean) => void, reason?: DrawerCloseReason) => void \| Promise<void>` | `undefined` |
| `resizable` | 是否允许拖动边缘调整尺寸 | `boolean` | `false` |
| `custom-class` | 面板自定义类名的兼容别名，建议改用组件原生 `class` | `string` | `''` |
| `header-class` | 头部容器自定义类名 | `string` | `''` |
| `body-class` | 主体容器自定义类名 | `string` | `''` |
| `footer-class` | 底部容器自定义类名 | `string` | `''` |
| `z-index` | 指定抽屉层级 | `number` | `undefined` |
| `header-aria-level` | 默认标题节点的 `aria-level` | `string \| number` | `2` |
| `modal-fade` | 是否保留遮罩层淡入淡出 | `boolean` | `true` |
| `close-icon` | 关闭按钮图标，使用图标字符串 | `string` | `'mdi:close'` |
| `fullscreen` | 是否让抽屉占满整个视口 | `boolean` | `false` |
| `transition` | 自定义过渡配置，支持过渡名或 Vue Transition 对象 | `string \| TransitionProps` | `'xy-drawer-fade'` |

### Drawer Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 开关状态变化 | `boolean` |
| `open` | 打开时触发 | — |
| `opened` | 进入完成后触发 | — |
| `close` | 关闭时触发 | — |
| `closed` | 离开完成后触发 | — |
| `open-auto-focus` | 抽屉打开并完成初始聚焦后触发 | — |
| `close-auto-focus` | 抽屉关闭并恢复焦点后触发 | — |
| `resize-start` | 开始拖拽尺寸时触发 | `(event: MouseEvent, size: number)` |
| `resize` | 拖拽尺寸过程中触发 | `(event: MouseEvent, size: number)` |
| `resize-end` | 结束拖拽尺寸时触发 | `(event: MouseEvent, size: number)` |

### Drawer Slots

| 插槽 | 说明 |
| --- | --- |
| `header` | 自定义头部，插槽参数为 `{ close, titleId, titleClass }` |
| `default` | 主体内容 |
| `footer` | 底部操作区 |
| `title` | 与 `header` 类似的兼容插槽，仅用于对齐旧用法，建议优先使用 `header` |

### Drawer Exposes

| 名称 | 说明 |
| --- | --- |
| `handleClose` | 主动触发关闭流程，会经过 `before-close` 拦截 |
| `afterEnter` | 进入完成回调的兼容 expose，建议优先使用 `opened` 事件 |
| `afterLeave` | 离开完成回调的兼容 expose，建议优先使用 `closed` 事件 |
