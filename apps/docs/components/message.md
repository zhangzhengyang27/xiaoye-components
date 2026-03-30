---
title: Message 消息提示
description: 用于承接轻量操作结果、系统反馈和全局提醒的函数式消息提示。
outline: deep
---

# Message 消息提示

`Message` 提供函数式消息提示体验，适合承接"操作已完成""同步中""保存失败"这类短反馈。它不是页面内常驻内容，也不像 `Dialog` 那样阻断流程，而是在任意位置直接调用即可出现。

当前实现导出的是函数式入口 `XyMessage`，完整安装组件库后也会自动注入 `$message`。如果你希望统一消息位置、关闭按钮、暂停策略或数量上限，可以在 [Config Provider 全局配置](/components/config-provider) 上配置 `message` 默认值。

## 基础用法

:::demo 最简单的调用方式就是直接传字符串，它会使用默认 `info` 类型和顶部居中 placement。
message/basic
:::

## 不同类型

:::demo `XyMessage.success()`、`warning()`、`error()` 这类快捷方法适合在业务代码里直接表达语义，不需要额外再传 `type`。
message/different-types
:::

## 手动关闭

:::demo 把 `duration` 设为 `0` 可以让消息保持常驻，再通过 `showClose` 交给用户主动关闭。
message/closable
:::

## 不同位置

:::demo `placement` 支持六个值，适合根据页面布局和工作台壳子决定提示从哪里进入。
message/placement
:::

## render 富内容与 groupKey

:::demo `render` 适合承接更复杂的提示结构，`groupKey` 可以让富内容消息也具备稳定的合并键。
message/render
:::

## 点击行为与关闭原因

:::demo 现在支持 `onClick`、`onClose`、`closeOnClick` 和 `closeOnPressEscape`，方便把消息反馈接回业务链路。
message/interaction
:::

## 外观细化

:::demo `plain`、自定义 `icon`、关闭按钮和移动端宽度都补了一轮，提供完整的消息提示体验。
message/appearance
:::

## 关闭前拦截

:::demo `beforeClose(done, ctx)` 适合在关闭前补异步校验、埋点或额外确认。
message/close-control
:::

## 句柄与状态快照

:::demo `handle.update()` 适合实时更新消息内容；`getState()` 和过滤版 `closeAll()` 适合消息中心、工作台壳子或联动调试。
message/handle
:::

## App Context 与 withContext

:::demo 当你需要把消息能力继续传给 composable、store 或 service 时，可以用 `withContext(appContext)` 固定当前 app 的调用入口。通过插件注入拿到的 `$message.withContext()` 则会默认继承当前 app。
message/with-context
:::

## 上下文说明

如果你通过全量安装拿到的是 `$message`，它会自动继承当前 app 的上下文。  
如果你是局部按需导入 `XyMessage`，并且页面里存在多套 app 或你希望显式继承某个 app 的 `ConfigProvider.message`，推荐使用 `withContext(appContext)`；也可以继续把 `appContext` 作为第二个参数传入：

```ts
import { getCurrentInstance } from "vue";
import { XyMessage } from "xiaoye-components";

const instance = getCurrentInstance();
const scopedMessage = XyMessage.withContext(instance?.appContext ?? null);

scopedMessage({
  message: "局部导入时也能继承当前 app 上下文"
});
```

你也可以直接继续透传 `$message.withContext()`，让业务模块在不知道组件实例的情况下，仍然显式复用当前 app 的消息上下文。

如果同一页面里存在多套 `ConfigProvider.message`，但你又直接调用顶层 `XyMessage(...)` 且没有传 `appContext`，当前实现会告警并回退到默认配置，而不是猜测应该继承哪一套上下文。

## HTML 内容

:::demo `dangerouslyUseHTMLString` 只适合受信任的静态内容，不要直接拼接用户输入。
message/raw-html
:::

## 行为说明

- `XyMessage` 支持 `string`、`VNode`、`() => VNode`、`render` 渲染函数和完整配置对象。
- 默认自动关闭时长为 `3000ms`，默认支持悬停暂停；也可以进一步打开 `pauseOnFocus` 和 `pauseOnPageHidden`。
- `grouping` 当前会优先使用 `groupKey` 做合并；如果没有 `groupKey`，则只对字符串或数字消息做内容合并。
- `closeOnClick`、`closeOnPressEscape` 和 `beforeClose` 共同构成消息关闭策略，`onClose` 会带上最终关闭原因。
- `appendTo` 支持 `HTMLElement` 或选择器字符串，适合微前端壳子和局部宿主。
- `max` / `ConfigProvider.message.max` 控制单个宿主内同一 placement 的并发消息数量；`maxByPlacement` 可给不同位置设置独立上限。
- `$message` 会自动继承当前 app 的默认配置；`$message.withContext()` 默认继续绑定当前 app。
- `XyMessage.withContext(appContext)` 适合在多 app、局部按需导入或 service 层桥接调用时显式指定配置来源。
- `getState()` 返回的是当前消息实例快照，不包含回调和复杂渲染函数本体。

## API

### 基础签名

```ts
import { XyMessage } from "xiaoye-components";

const handle = XyMessage({
  message: "保存成功",
  type: "success",
  placement: "top-right",
  showClose: true,
  onClose(ctx) {
    console.log(ctx.reason);
  }
});

handle.update({
  message: "已同步到草稿箱",
  type: "primary",
  icon: "mdi:check-decagram-outline"
});

handle.close("programmatic");

const snapshot = XyMessage.getState({
  placement: "top-right"
});

XyMessage.closeAll({
  placement: "top-right",
  type: "success"
});
```

### Message Options

| 字段                             | 说明                                       | 类型                                                                                | 默认值              |
| -------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------- |
| `message`                        | 消息内容，支持字符串、VNode 或渲染函数     | `string \| number \| VNode \| (() => VNodeChild)`                                   | `''`                |
| `render`                         | 自定义渲染函数，优先级高于 `message`       | `() => VNodeChild`                                                                  | `undefined`         |
| `type`                           | 消息类型                                   | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'`                          | `'info'`            |
| `plain`                          | 是否使用更轻的外观                         | `boolean`                                                                           | `false`             |
| `icon`                           | 自定义图标名                               | `string`                                                                            | `按 type 自动推导`  |
| `show-icon`                      | 是否显示图标                               | `boolean`                                                                           | `true`              |
| `dangerously-use-h-t-m-l-string` | 是否把字符串按 HTML 渲染                   | `boolean`                                                                           | `false`             |
| `custom-class`                   | 自定义 class                               | `string`                                                                            | `''`                |
| `duration`                       | 自动关闭时长，单位毫秒，`0` 表示不自动关闭 | `number`                                                                            | `3000`              |
| `show-close`                     | 是否显示关闭按钮                           | `boolean`                                                                           | `false`             |
| `offset`                         | 第一条消息距视口的偏移                     | `number`                                                                            | `16`                |
| `placement`                      | 消息出现位置                               | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'`             |
| `append-to`                      | 自定义挂载容器                             | `string \| HTMLElement`                                                             | `document.body`     |
| `grouping`                       | 是否启用消息合并                           | `boolean`                                                                           | `false`             |
| `group-key`                      | 显式指定合并键，适合 VNode / render 消息   | `string`                                                                            | `undefined`         |
| `repeat-num`                     | 当前重复次数，通常由内部合并逻辑维护       | `number`                                                                            | `1`                 |
| `max`                            | 当前宿主下该 placement 的并发消息上限      | `number`                                                                            | `undefined`         |
| `z-index`                        | 自定义层级                                 | `number`                                                                            | `自动递增`          |
| `close-on-click`                 | 点击消息主体时是否关闭                     | `boolean`                                                                           | `false`             |
| `close-on-press-escape`          | 按 `Esc` 时是否关闭                        | `boolean`                                                                           | `true`              |
| `pause-on-hover`                 | 悬停时是否暂停自动关闭                     | `boolean`                                                                           | `true`              |
| `pause-on-focus`                 | 聚焦消息内部元素时是否暂停自动关闭         | `boolean`                                                                           | `false`             |
| `pause-on-page-hidden`           | 页面隐藏时是否暂停自动关闭                 | `boolean`                                                                           | `false`             |
| `reset-on-repeat`                | 合并重复消息时是否重置自动关闭计时         | `boolean`                                                                           | `true`              |
| `transition`                     | 自定义过渡名称                             | `string`                                                                            | `'xy-message-fade'` |
| `before-close`                   | 关闭前拦截                                 | `(done, ctx) => void \| Promise<void>`                                              | `undefined`         |
| `on-click`                       | 点击消息时触发                             | `(ctx) => void`                                                                     | `undefined`         |
| `on-close`                       | 消息开始关闭时触发，带关闭原因             | `(ctx) => void`                                                                     | `undefined`         |
| `on-closed`                      | 消息完全关闭后触发，带关闭原因             | `(ctx) => void`                                                                     | `undefined`         |

### Message Close Reason

| 值             | 说明                  |
| -------------- | --------------------- |
| `manual`       | 点击关闭按钮          |
| `auto`         | 自动关闭计时器触发    |
| `programmatic` | 通过句柄主动关闭      |
| `click`        | 点击消息主体关闭      |
| `escape`       | 按 `Esc` 关闭         |
| `close-all`    | 通过批量关闭 API 关闭 |

### Message Handle

| 字段             | 说明                                           | 类型                                    |
| ---------------- | ---------------------------------------------- | --------------------------------------- |
| `id`             | 当前消息实例 id                                | `string`                                |
| `close(reason?)` | 主动关闭当前消息，可显式指定关闭原因           | `(reason?: MessageCloseReason) => void` |
| `update(patch)`  | 更新当前消息的文案、类型、位置、交互策略等配置 | `(patch: MessageUpdateOptions) => void` |

### 快捷方法

| 方法                                       | 说明                                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `XyMessage.primary(options)`               | 打开 primary 类型消息                                                                        |
| `XyMessage.success(options)`               | 打开 success 类型消息                                                                        |
| `XyMessage.info(options)`                  | 打开 info 类型消息                                                                           |
| `XyMessage.warning(options)`               | 打开 warning 类型消息                                                                        |
| `XyMessage.error(options)`                 | 打开 error 类型消息                                                                          |
| `XyMessage.withContext(appContext?)`       | 返回绑定指定 appContext 的消息 API；对 `$message.withContext()` 来说，缺省参数会继承当前 app |
| `XyMessage.closeAll(typeOrFilter?)`        | 关闭全部消息，支持按类型或过滤对象批量关闭                                                   |
| `XyMessage.closeAllByPlacement(placement)` | 按 placement 批量关闭消息                                                                    |
| `XyMessage.getState(filter?)`              | 获取当前消息实例快照                                                                         |

### ConfigProvider.message

| 字段                 | 说明                         | 类型                                        |
| -------------------- | ---------------------------- | ------------------------------------------- |
| `max`                | 默认并发消息上限             | `number`                                    |
| `maxByPlacement`     | 按 placement 设置独立上限    | `Partial<Record<MessagePlacement, number>>` |
| `grouping`           | 默认是否启用消息合并         | `boolean`                                   |
| `duration`           | 默认自动关闭时长             | `number`                                    |
| `offset`             | 默认偏移量                   | `number`                                    |
| `showClose`          | 默认是否显示关闭按钮         | `boolean`                                   |
| `showIcon`           | 默认是否显示图标             | `boolean`                                   |
| `plain`              | 默认 plain 风格              | `boolean`                                   |
| `placement`          | 默认消息位置                 | `MessagePlacement`                          |
| `closeOnClick`       | 默认是否点击消息关闭         | `boolean`                                   |
| `closeOnPressEscape` | 默认是否响应 `Esc`           | `boolean`                                   |
| `pauseOnHover`       | 默认是否悬停暂停             | `boolean`                                   |
| `pauseOnFocus`       | 默认是否聚焦暂停             | `boolean`                                   |
| `pauseOnPageHidden`  | 默认是否页面隐藏暂停         | `boolean`                                   |
| `transition`         | 默认过渡名称                 | `string`                                    |
| `resetOnRepeat`      | 默认是否在重复合并时重置计时 | `boolean`                                   |
