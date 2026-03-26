---
title: Alert 提示
description: 用于页面内承接重要提示、风险提醒和状态说明的非浮层反馈组件。
outline: deep
---

# Alert 提示

`xy-alert` 参考 Element Plus 的 `Alert` 设计，用来在页面中直接展示重要提示，而不是弹出额外浮层。它不会自动消失，适合权限提醒、发布风险、配置警告和成功回执这类需要用户明确看到的反馈。

这一版除了组件直接渲染，也补了顶部横幅队列式的全局服务 `XyAlertService`，适合页面切换、保存成功和全局风险广播这类需要“随处触发、统一展示”的场景。

## 基础用法

:::demo `type` 决定提示的语义色，默认值为 `info`。适合放在表单顶部、列表筛选区和详情页头部做即时提醒。
alert/basic
:::

## 主题风格

:::demo `effect` 支持 `light` 和 `dark` 两套风格。`light` 更适合嵌入页面内容区，`dark` 更适合强调风险或操作前提醒。
alert/theme
:::

## 自定义关闭按钮

:::demo `closable` 可以控制是否允许关闭，`close-text` 可以把默认关闭图标替换成文案按钮。
alert/close-button
:::

## 带图标

:::demo 打开 `show-icon` 后会按当前 `type` 渲染默认图标；如果你希望更贴近业务语义，可以使用 `icon` 插槽覆盖。
alert/icon
:::

## 内容居中

:::demo `center` 适合审批页头、看板摘要区或需要更强视觉聚焦的横幅式提示。
alert/center
:::

## 带描述

:::demo `description` 用于承接更完整的说明文案。只要存在 `description` 属性或默认插槽中的有效内容，就会渲染描述区。
alert/description
:::

## 带图标和描述

:::demo 在风险提示、发布校验和批量操作确认里，通常会同时使用图标和描述，让提示更容易被快速扫读。
alert/icon-description
:::

## 受控显隐

:::demo 传入 `v-model` 后，Alert 的显示状态会交给父组件控制，适合和页面筛选、请求结果或统一状态管理联动。
alert/controlled
:::

## 自动关闭

:::demo `duration` 单位为毫秒，`0` 表示不自动关闭。和 `v-model` 搭配时，自动关闭会同步回写外部状态。
alert/auto-close
:::

## 操作区

:::demo 通过 `actions` 插槽补充按钮、链接或轻操作，让提示不仅说明问题，也能承接下一步动作。
alert/actions
:::

## 尺寸

:::demo `size` 支持 `sm / md / lg`，未传时会跟随 `xy-config-provider` 的全局尺寸。
alert/size
:::

## 变体

:::demo `variant` 用于扩展布局形态。`banner` 更适合横幅式提醒，`card` 更适合块级反馈容器。
alert/variants
:::

## 关闭拦截

:::demo `before-close` 沿用当前库的 `done(cancel?)` 风格。适合在关闭前补确认、保存校验或异步检查。
alert/close-control
:::

## Hover 暂停自动关闭

:::demo 打开 `pause-on-hover` 后，鼠标悬停在提示上会暂停自动关闭计时，离开后再继续剩余时间。现在也支持通过 `pause-on-focus` 和 `pause-on-page-hidden` 扩展暂停时机。
alert/pause-hover
:::

## 聚焦与页面隐藏暂停

:::demo `pause-on-focus` 适合键盘操作或操作区较多的场景；`pause-on-page-hidden` 则更适合用户可能频繁切出标签页的长流程页面。
alert/pause-advanced
:::

## 折叠描述

:::demo `collapsible` 适合承接更长的说明文字。现在可以通过 `line-clamp`、`expand-text` 和 `collapse-text` 进一步调整折叠体验。
alert/collapsible
:::

## 全局服务

:::demo `XyAlertService.open()` 适合在任意位置直接触发顶部横幅提示，并返回一个可更新和关闭的句柄。
alert/service
:::

## 队列与清空

:::demo 服务化提示采用顶部横幅 FIFO 队列，同一时刻只显示一条。可以通过 `closeAll()` 一次性清空当前项和等待队列。
alert/service-queue
:::

## 队列上限与状态快照

:::demo 通过 `maxQueue` 和 `overflowStrategy` 可以约束等待队列长度；`getState()` 则适合把当前项、等待数量和总量接进页面状态面板。
alert/service-state
:::

## 服务去重

:::demo 为服务提示传入相同的 `groupKey` 后，重复触发不会继续入队，而是直接合并更新当前项或等待项。
alert/service-dedupe
:::

## 行为说明

- 未传 `modelValue` 时，`xy-alert` 会维持当前自管理显隐模式，点击关闭后立即隐藏自身，并触发 `close` 事件。
- 传入 `modelValue` 后会进入受控模式，显示状态以外部值为准，并通过 `update:modelValue` 回写。
- `duration > 0` 时会在组件可见后启动自动关闭定时器，触发时发出 `auto-close`。
- `beforeClose` 只拦截手动关闭路径，不拦截自动关闭。
- `pauseOnHover`、`pauseOnFocus` 和 `pauseOnPageHidden` 只在 `duration > 0` 时生效；页面隐藏暂停基于 `visibilitychange`。
- `collapsible` 只作用于描述区；`lineClamp` 默认值为 `2`，可通过 `expandText` / `collapseText` 自定义触发文案，不提供受控 `expanded` 模式。
- `XyAlertService` 固定使用顶部横幅队列展示，不支持插槽或 `actions`；复杂内容仍建议直接渲染组件。
- 相同 `groupKey` 的服务提示不会重复入队，而是合并更新已有项。
- 服务提示可通过 `appendTo` 改挂到指定 DOM 节点，适合微前端、局部壳子或定制层级场景。
- `maxQueue` 控制等待队列的最大长度，不包含当前展示项；命中上限时按 `overflowStrategy` 处理溢出项。
- 服务项关闭时可通过 `onClosed(reason)` 收到 `manual`、`auto`、`close-all`、`overflow` 四类原因。
- 服务队列清空后会自动销毁挂到 `body` 的服务宿主。

## API

### Alert Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 受控显示状态 | `boolean` | `undefined` |
| `title` | 提示标题 | `string` | `''` |
| `description` | 描述文案 | `string` | `''` |
| `type` | 提示类型 | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'info'` |
| `closable` | 是否可关闭 | `boolean` | `true` |
| `close-text` | 自定义关闭文案 | `string` | `''` |
| `show-icon` | 是否显示图标 | `boolean` | `false` |
| `center` | 是否居中显示内容 | `boolean` | `false` |
| `effect` | 主题风格 | `'light' \| 'dark'` | `'light'` |
| `duration` | 自动关闭时长，单位毫秒，`0` 表示不自动关闭 | `number` | `0` |
| `size` | 组件尺寸，未传时跟随全局配置 | `'sm' \| 'md' \| 'lg'` | `全局 size / 'md'` |
| `variant` | 布局变体 | `'default' \| 'banner' \| 'card'` | `'default'` |
| `before-close` | 手动关闭前拦截函数 | `(done: (cancel?: boolean) => void) => void \| Promise<void>` | `undefined` |
| `pause-on-hover` | 自动关闭时悬停是否暂停计时 | `boolean` | `false` |
| `pause-on-focus` | 自动关闭时聚焦内部元素是否暂停计时 | `boolean` | `false` |
| `pause-on-page-hidden` | 页面隐藏时是否暂停自动关闭计时 | `boolean` | `false` |
| `collapsible` | 是否允许折叠描述区 | `boolean` | `false` |
| `default-expanded` | 折叠描述是否默认展开 | `boolean` | `false` |
| `line-clamp` | 折叠描述时的裁切行数 | `number` | `2` |
| `expand-text` | 折叠态触发器文案 | `string` | `'展开详情'` |
| `collapse-text` | 展开态触发器文案 | `string` | `'收起详情'` |

### Alert Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `close` | 手动关闭提示时触发 | `(event: MouseEvent) => void` |
| `update:modelValue` | 受控模式下同步显示状态 | `(value: boolean) => void` |
| `auto-close` | 自动关闭定时器触发时发出 | `() => void` |

### Alert Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 描述区内容 |
| `title` | 标题内容 |
| `icon` | 图标内容 |
| `actions` | 操作区内容 |

### Alert Service

```ts
import { XyAlertService } from "xiaoye-components";

const handle = XyAlertService.open({
  groupKey: "publish-sync",
  appendTo: "#workspace-shell",
  maxQueue: 3,
  overflowStrategy: "drop-oldest",
  title: "保存成功",
  type: "success",
  duration: 2400,
  showIcon: true,
  onClosed(reason) {
    console.log("alert closed because:", reason);
  }
});

handle.update({
  title: "已同步到草稿箱"
});

handle.close();

XyAlertService.closeAll();

const snapshot = XyAlertService.getState();

console.log(snapshot.queueLength, snapshot.total);
```

### Alert Service Options

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `title` | 提示标题 | `string` |
| `description` | 描述文案 | `string` |
| `type` | 提示类型 | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` |
| `closable` | 是否可关闭 | `boolean` |
| `closeText` | 自定义关闭文案 | `string` |
| `showIcon` | 是否显示图标 | `boolean` |
| `center` | 是否居中显示内容 | `boolean` |
| `effect` | 主题风格 | `'light' \| 'dark'` |
| `duration` | 自动关闭时长 | `number` |
| `size` | 组件尺寸 | `'sm' \| 'md' \| 'lg'` |
| `groupKey` | 服务提示分组键；相同键会合并更新已有项而不是重复入队 | `string` |
| `appendTo` | 服务宿主挂载目标，支持 CSS 选择器或 HTMLElement | `string \| HTMLElement` |
| `maxQueue` | 等待队列最大长度，不包含当前展示项 | `number` |
| `overflowStrategy` | 队列超限时的处理策略 | `'drop-oldest' \| 'drop-newest'` |
| `onClosed` | 服务项关闭后的回调，可收到关闭原因 | `(reason: 'manual' \| 'auto' \| 'close-all' \| 'overflow') => void` |
| `beforeClose` | 手动关闭前拦截函数 | `(done: (cancel?: boolean) => void) => void \| Promise<void>` |
| `pauseOnHover` | 自动关闭时悬停是否暂停计时 | `boolean` |
| `pauseOnFocus` | 自动关闭时聚焦内部元素是否暂停计时 | `boolean` |
| `pauseOnPageHidden` | 页面隐藏时是否暂停自动关闭计时 | `boolean` |
| `collapsible` | 是否允许折叠描述区 | `boolean` |
| `defaultExpanded` | 折叠描述是否默认展开 | `boolean` |
| `lineClamp` | 折叠描述时的裁切行数 | `number` |
| `expandText` | 折叠态触发器文案 | `string` |
| `collapseText` | 展开态触发器文案 | `string` |

### Alert Service Handle

| 方法 | 说明 | 签名 |
| --- | --- | --- |
| `close` | 手动关闭当前服务提示 | `() => void` |
| `update` | 更新当前项或排队项的配置 | `(patch: Partial<AlertServiceOptions>) => void` |

### Alert Service Methods

| 方法 | 说明 | 签名 |
| --- | --- | --- |
| `open` | 打开顶部横幅服务提示 | `(options: AlertServiceOptions) => AlertServiceHandle` |
| `getState` | 获取当前服务状态的只读快照 | `() => { current: AlertServiceSnapshotEntry \| null; queue: AlertServiceSnapshotEntry[]; queueLength: number; total: number }` |
| `closeAll` | 清空当前项和等待队列 | `() => void` |

### Alert CSS Variables

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| `--xy-alert-padding` | 容器内边距 | `10px 16px` |
| `--xy-alert-border-radius` | 圆角 | `var(--xy-radius-md)` |
| `--xy-alert-gap` | 图标、内容和操作区间距 | `12px` |
| `--xy-alert-content-gap` | 标题与描述间距 | `4px` |
| `--xy-alert-actions-gap` | 操作项间距 | `12px` |
| `--xy-alert-title-font-size` | 标题字号 | `var(--xy-font-size-md)` |
| `--xy-alert-title-with-description-font-size` | 带描述时标题字号 | `var(--xy-font-size-lg)` |
| `--xy-alert-description-font-size` | 描述字号 | `13px` |
| `--xy-alert-icon-size` | 默认图标尺寸 | `16px` |
| `--xy-alert-icon-large-size` | 描述态图标尺寸 | `28px` |
| `--xy-alert-close-font-size` | 关闭图标字号 | `14px` |
| `--xy-alert-close-customed-font-size` | 自定义关闭文案字号 | `13px` |
| `--xy-alert-toggle-font-size` | 展开/收起触发器字号 | `12px` |
| `--xy-alert-text-color` | 当前提示主色 | `var(--xy-color-info)` |
| `--xy-alert-bg-color` | 当前提示背景色 | `color-mix(in srgb, var(--xy-color-info) 12%, white)` |
| `--xy-alert-description-color` | 描述文字颜色 | `var(--xy-alert-text-color)` |
| `--xy-alert-close-color` | 关闭按钮颜色 | `var(--xy-text-color-muted)` |
| `--xy-alert-toggle-color` | 展开/收起触发器颜色 | `color-mix(in srgb, var(--xy-alert-text-color) 88%, white)` |
| `--xy-alert-card-border-color` | 卡片变体边框色 | `color-mix(in srgb, var(--xy-border-color) 92%, white)` |
| `--xy-alert-card-background` | 卡片变体背景色 | `color-mix(in srgb, var(--xy-bg-color) 95%, var(--xy-bg-color-muted))` |
| `--xy-alert-card-shadow` | 卡片变体阴影 | `0 14px 36px rgba(15, 23, 42, 0.06)` |
| `--xy-alert-banner-background` | 横幅变体背景 | `linear-gradient(...)` |
| `--xy-alert-service-top` | 全局服务距离顶部的偏移 | `16px` |
| `--xy-alert-service-max-width` | 全局服务最大宽度 | `960px` |
| `--xy-alert-service-z-index` | 全局服务层级 | `2100` |
