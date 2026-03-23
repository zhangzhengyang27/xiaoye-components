---
title: Button 按钮
description: 页面主操作、次要操作和轻量文本动作入口。
outline: deep
---

# Button 按钮

`xy-button` 用来承载页面里的主操作、次操作和轻量动作。当前版本覆盖中后台最常用的一组按钮语义，并支持 `xy-button-group`、自定义根标签和表单重置联动。

## 总览示例

先看这一块，会比逐段往下读更快建立 Button 的能力地图。

:::demo 这一块对应当前 Button 的核心视觉组合。当前实现没有 `info` 和 `dashed` 变体，所以这里不伪造不存在的能力。
button/overview
:::

## 基础用法

:::demo 用 `type` 和 `plain` 快速区分主次操作，不需要先堆很多视觉变体。
button/basic
:::

## 朴素按钮

`plain` 适合取消、重置、导出这类次级操作。它会保留语义色，但降低填充感和视觉侵入性。

:::demo 朴素按钮通常和主按钮并排出现，用来表达“可点，但不是当前主决策”。
button/plain
:::

## 圆角按钮

`round` 会把按钮两侧做成胶囊式圆角，更适合需要弱化边角攻击感的工具栏或营销式操作位。

:::demo `round` 只影响形状，不改变按钮的交互语义和状态逻辑。
button/round
:::

## 圆形按钮

`circle` 适合只保留图标的紧凑操作。这个模式下必须显式提供 `aria-label`，否则读屏用户拿不到操作名称。

:::demo `circle` 只在纯图标按钮下生效，带文字时会自动回退到普通按钮布局。
button/circle
:::

## 禁用按钮

`disabled` 会直接阻止按钮交互；当 `loading` 为 `true` 时，组件也会走同一套禁用逻辑，避免重复提交。

:::demo 禁用态会保留当前按钮的视觉语义，但不会继续派发 `click` 事件。
button/disabled
:::

## Link 按钮

`link` 更适合放在信息流或需要明显“跳转感”的弱操作场景。

:::demo `link` 的优先级高于 `text` 和 `plain`，适合表达低负担但明确可点击的动作。
button/link
:::

## Text 按钮

`text` 适合放在表格操作列、说明块或工具栏尾部；如果需要一点额外强调，可以配合 `bg` 增加轻背景。

:::demo `text` 更偏向轻量操作，不承担主操作按钮的视觉责任。
button/text
:::

## 图标按钮

按钮支持 `icon` 属性、`icon` / `prefix` / `suffix` 插槽，以及 `round`、`circle` 这类形状类属性。

:::tip circle 的生效条件
`circle` 只会在“纯图标按钮”场景下生效；如果按钮里还有文本内容，它会自动退回普通按钮布局。
:::

:::demo `icon` prop 优先于 `icon` 插槽；当没有 `icon` prop 和 `icon` 插槽时，`prefix` 会作为前置内容。
button/icon
:::

## 按钮组

`xy-button-group` 用来组织一组连续动作。它会向内部按钮透传 `type` 和 `size`，`direction` 只负责整体布局方向。

:::demo 适合向导操作、批量操作或需要表现为单组控件的一串按钮。
button/group
:::

## 加载按钮

`loading` 会在视觉上保留按钮占位，并自动阻止交互。你可以直接改 `loading-icon`，也可以用 `loading` 插槽完全接管加载内容。

:::tip 行为约定
`loading` 插槽的优先级高于 `loading-icon`。如果两者同时提供，组件会优先渲染 `loading` 插槽。
:::

:::demo 适合保存、提交、同步这类有明显处理中阶段的即时操作。
button/loading
:::

## 尺寸

默认情况下 Button 会跟随全局尺寸配置；也可以通过 `size` 显式指定局部按钮尺寸，通过 `block` 占满整行宽度。

:::demo 筛选栏和工具栏通常用 `sm / md`，表单底部的主操作更适合配合 `block` 放成整行。
button/size
:::

## 块级按钮

`block` 适合抽屉底部、移动端确认区或需要整行承载的强操作按钮。

:::demo 当按钮需要明确占据整行宽度时，优先用 `block`，而不是手写容器宽度。
button/layout
:::

## 自定义标签

`tag` 可以把根节点改成 `a`、`div` 或其他组件；当它不是原生 `button`，组件会根据标签类型补 `role`、`tabindex` 和 `aria-disabled`。

:::demo 自定义标签适合把按钮语义挂到链接或自定义块元素上，同时保留按钮样式体系。
button/tag
:::

## 原生类型与表单重置

如果 Button 位于 `xy-form` 内部，`native-type="reset"` 会直接调用表单重置逻辑。这个能力更适合表单局部回滚，而不是清空所有上下文。

:::demo `native-type="reset"` 会优先走表单重置，而不是单纯依赖浏览器默认行为。
button/form-reset
:::

## Button API

### Button Attributes

| 属性           | 说明                       | 类型                                                           | 默认值          |
| -------------- | -------------------------- | -------------------------------------------------------------- | --------------- |
| `type`         | 按钮类型                   | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'`     |
| `size`         | 按钮尺寸                   | `'sm' \| 'md' \| 'lg'`                                         | 跟随全局配置    |
| `disabled`     | 是否禁用交互               | `boolean`                                                      | `false`         |
| `icon`         | 前置 Iconify 图标          | `string`                                                       | —               |
| `native-type`  | 原生按钮类型               | `'button' \| 'submit' \| 'reset'`                              | `'button'`      |
| `loading`      | 是否显示加载态，并阻止点击 | `boolean`                                                      | `false`         |
| `loading-icon` | 自定义加载图标             | `string`                                                       | `'mdi:loading'` |
| `plain`        | 是否为朴素按钮             | `boolean`                                                      | `false`         |
| `text`         | 是否为文本按钮             | `boolean`                                                      | `false`         |
| `link`         | 是否为链接按钮             | `boolean`                                                      | `false`         |
| `bg`           | 文本按钮是否保留背景       | `boolean`                                                      | `false`         |
| `autofocus`    | 是否使用原生自动聚焦能力   | `boolean`                                                      | `false`         |
| `round`        | 是否为圆角按钮             | `boolean`                                                      | `false`         |
| `circle`       | 是否为圆形按钮             | `boolean`                                                      | `false`         |
| `block`        | 是否占满整行宽度           | `boolean`                                                      | `false`         |
| `tag`          | 渲染的根标签               | `string \| Component`                                          | `'button'`      |

### Button Events

| 事件    | 说明                                                  | 参数         |
| ------- | ----------------------------------------------------- | ------------ |
| `click` | 点击按钮时触发；当 `loading` 或 `disabled` 时不会触发 | `MouseEvent` |

### Button Slots

| 插槽      | 说明                                            |
| --------- | ----------------------------------------------- |
| `default` | 按钮主内容                                      |
| `icon`    | 自定义前置图标，优先级低于 `icon` prop          |
| `loading` | 自定义加载内容，优先级高于 `loading-icon`       |
| `prefix`  | 按钮前缀内容，当没有 `icon` / `icon` 插槽时生效 |
| `suffix`  | 按钮后缀内容，通常用于补充图标或状态提示        |

### Button Exposes

| 暴露项     | 说明             | 类型                         |
| ---------- | ---------------- | ---------------------------- |
| `ref`      | 按钮根节点引用   | `Ref<HTMLElement \| null>`   |
| `size`     | 解析后的尺寸     | `ComputedRef<ComponentSize>` |
| `type`     | 解析后的按钮类型 | `ComputedRef<ButtonType>`    |
| `disabled` | 解析后的禁用状态 | `ComputedRef<boolean>`       |

## ButtonGroup API

### ButtonGroup Attributes

| 属性        | 说明                   | 类型                                                           | 默认值         |
| ----------- | ---------------------- | -------------------------------------------------------------- | -------------- |
| `size`      | 向组内按钮透传尺寸     | `'sm' \| 'md' \| 'lg'`                                         | 跟随全局配置   |
| `type`      | 向组内按钮透传按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | —              |
| `direction` | 按钮组排列方向         | `'horizontal' \| 'vertical'`                                   | `'horizontal'` |

### ButtonGroup Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 按钮组默认内容 |

## 可访问性与行为约定

- 使用原生 `button` 元素实现，天然支持键盘触发和禁用态。
- `native-type` 可直接用于表单提交、重置等原生按钮场景。
- `loading` 状态下会补充 `aria-busy="true"`，并通过禁用交互避免重复提交。
- `tag="a"` 且带 `href` 时会保留链接语义；其他非 `button` 标签会自动补 `role="button"` 和键盘触发能力。
- `tag` 不是 `button` 时，会改用 `aria-disabled` 表达不可用状态，而不是输出无效的 `disabled` 属性。
- 纯图标按钮，尤其是 `circle` 按钮，应显式补上 `aria-label`，例如 `<xy-button circle icon="mdi:plus" aria-label="新增" />`。
