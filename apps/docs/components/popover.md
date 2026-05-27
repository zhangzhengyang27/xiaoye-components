---
title: Popover 气泡卡片
description: 用于承载轻量说明或交互内容，比 Tooltip 更重，比 Dialog 更轻。
outline: deep
---

# Popover 气泡卡片

`xy-popover` 用来承载比 Tooltip 更重一点的说明或轻交互内容。它不是纯提示，也不需要像 Dialog 那样阻断页面。

## 迁移提示

- 后台项目如果只是想收口 popover 的背景、边框、阴影、宽度或圆角，优先使用：
  - `popper-class`
  - `popper-style`
  - `width`
- 不建议继续在页面层 deep 到 `.xy-popover__panel`、`.xy-popover__header`、`.xy-popover__content` 这类内部结构类名。
- 如果浮层内容已经开始接近确认弹层或小型表单，先判断是否应该升级到 `xy-dialog` 或 `xy-drawer`，不要在业务页继续堆叠局部补丁。

## 基础用法

:::demo 最常见的场景是放一段说明文案和一个轻量按钮，让用户在原地完成理解或确认。
popover/basic
:::

## 自定义头部与宽度

:::demo Popover 支持自定义触发区、头部和内容宽度，适合做一张轻量操作卡片。
popover/custom
:::

## 触发方式与内部关闭

:::demo `trigger`、`content` 和默认插槽暴露的 `close` 方法，适合做 hover 说明卡片或在卡片内部主动关闭。
popover/trigger-close
:::

## 嵌套浮层

:::demo 当轻量说明需要升级成阻断确认时，可以在 Popover 内把处理链路升级到 Dialog。
popover/nested-overlay
:::

## 实例级样式收口

:::demo 当后台项目只想让轻交互卡片更贴近当前主题时，优先通过 `popper-class` 和实例级变量收口，而不是继续 deep 到内部类名。
popover/popper-class
:::

## 浮层边界

- `Tooltip`：短文案、解释性提示，不承载操作。
- `Popover`：多段说明、轻量交互，不是确认弹层。
- `Popconfirm`：确认类交互（删除确认、发布确认），不是一般说明浮层。
- `Dropdown`：菜单/操作列表，不是提示或确认浮层。

## API

### 命名对照

Vue 模板中属性和事件使用 kebab-case，源码 props / emits 使用 camelCase，两者由 Vue 自动转换，无需手动处理。

#### 属性映射

| 模板写法（kebab-case） | 源码 props（camelCase） |
| ---------------------- | ----------------------- |
| `model-value`          | `modelValue`            |
| `close-on-outside`     | `closeOnOutside`        |
| `close-on-esc`         | `closeOnEsc`            |
| `open-delay`           | `openDelay`             |
| `close-delay`          | `closeDelay`            |
| `show-after`           | `showAfter`             |
| `hide-after`           | `hideAfter`             |
| `show-arrow`           | `showArrow`             |
| `append-to`            | `appendTo`              |
| `popper-class`         | `popperClass`           |
| `popper-style`         | `popperStyle`           |

其余属性（`title`、`content`、`placement`、`width`、`disabled`、`trigger`、`enterable`、`offset`、`teleported`、`persistent`）为单词形式，模板与源码写法一致，无需转换。

#### 事件映射

| 模板写法                  | 源码 emit              | 说明 |
| ------------------------- | ---------------------- | ---- |
| `@update:model-value`     | `update:modelValue`    | Vue 将 `modelValue` 自动转为 `model-value`，模板监听时必须写 `@update:model-value` |
| `@open`                   | `open`                 | 单词形式，写法一致 |
| `@close`                  | `close`                | 单词形式，写法一致 |

在 TS 对象、组件 props 类型、JSX / TSX 或手动声明回调函数的场景里传参或取类型，应以 camelCase 名称为准。

### Popover Attributes

| 属性               | 说明              | 类型               | 默认值     |
| ------------------ | ----------------- | ------------------ | ---------- |
| `model-value`      | 是否打开          | `boolean`          | `false`    |
| `title`            | 标题              | `string`           | `''`       |
| `content`          | 纯文本内容        | `string`           | `''`       |
| `placement`        | 浮层位置          | `Placement`        | `'bottom'` |
| `width`            | 面板宽度          | `string \| number` | `320`      |
| `close-on-outside` | 点击外部是否关闭  | `boolean`          | `true`     |
| `close-on-esc`     | `Escape` 是否关闭 | `boolean`          | `true`     |
| `disabled`         | 是否禁用          | `boolean`          | `false`    |
| `trigger`          | 触发方式          | `PopoverTrigger` | `'click'` |
| `open-delay`       | 打开延迟          | `number`           | `80`       |
| `close-delay`      | 关闭延迟          | `number`           | `60`       |
| `show-after`       | 打开延迟别名，优先级高于 `open-delay` | `number` | `undefined` |
| `hide-after`       | 关闭延迟别名，优先级高于 `close-delay` | `number` | `undefined` |
| `enterable`        | 浮层是否允许进入  | `boolean`          | `true`     |
| `offset`           | 浮层偏移量        | `number`           | `10`       |
| `show-arrow`       | 是否显示箭头      | `boolean`          | `true`     |
| `teleported`       | 是否通过 Teleport 挂载到外层容器 | `boolean` | `true` |
| `append-to`        | Teleport 的挂载目标 | `string \| HTMLElement` | `'body'` |
| `persistent`       | 关闭后是否保留 DOM | `boolean` | `false` |
| `popper-class`     | 浮层容器自定义类名 | `string` | `''` |
| `popper-style`     | 浮层容器自定义样式 | `StyleValue` | `undefined` |

### Popover Events

| 事件                 | 说明         | 参数      |
| -------------------- | ------------ | --------- |
| `update:model-value` | 开关状态变化 | `PopoverModelValueChangeHandler` |
| `open`               | 打开时触发   | —         |
| `close`              | 关闭时触发   | —         |

> 事件名映射详见上方[事件映射](#事件映射)。

### Popover Slots

| 插槽        | 说明         |
| ----------- | ------------ |
| `reference` | 推荐的触发区域插槽，新代码优先使用 |
| `trigger`   | 兼容的触发区域插槽，仅当 `reference` 未提供时回退生效 |
| `header`    | 自定义头部   |
| `default`   | 面板主体内容，插槽参数为 `PopoverDefaultSlotProps` |

> 源码回退顺序：`reference` → `trigger` → 默认按钮（"打开说明"）。
