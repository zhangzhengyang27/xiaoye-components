---
title: Notification 通知
description: 用于承接可并行阅读的系统反馈、任务广播和全局操作结果提示。
outline: deep
---

# Notification 通知

`xy-notification` 面向“需要被看见，但不应该阻断当前流程”的反馈场景。它和 `Alert` 的区别在于：Notification 更适合浮层式的全局广播；和 `Dialog` 的区别在于：它不会中断用户当前操作。

这一版对外统一以组件 `XyNotification` + 服务入口 `XyNotificationService` / `$notify` 为准。适合覆盖发布结果、后台任务状态、风险预警和跨页面反馈。

## 基础组件

:::demo 当通知需要跟随页面布局、参与局部滚动区，或与业务区块一同显隐时，可以直接使用 `XyNotification` 组件。
notification/basic
:::

## 标题与操作区插槽

:::demo `title` 和 `actions` 插槽适合把 Notification 变成更完整的轻交互卡片，同时仍保持它“非阻断反馈”的定位。
notification/actions-slots
:::

## Service 基础

:::demo `XyNotificationService.open()` 适合在任意业务模块直接触发浮层通知，并返回一个可继续 `close()` 的句柄。
notification/service-basic
:::

## Typed Shortcuts

:::demo 与 `message` 一样，Notification 也提供类型快捷方法，适合在业务代码里直接表达语义。
notification/typed-shortcuts
:::

## 四个位置

:::demo `position` 固定为四个角：`top-left`、`top-right`、`bottom-left`、`bottom-right`。推荐优先使用右上角作为默认全局反馈入口。
notification/placements
:::

## VNode / 渲染函数

:::demo `message` 既可以是字符串，也可以是 `VNode` 或渲染函数，适合承接更复杂的布局、链接和操作提示。
notification/vnode-render
:::

## 自定义 HTML

:::demo `dangerouslyUseHTMLString` 只应用在受信任内容上。来自用户输入、接口原始富文本的内容不应直接透传。
notification/html
:::

## groupKey 去重

:::demo 当业务会高频重复触发同一类通知时，可通过 `groupKey` 把重复事件折叠成一条，并持续更新内容。
notification/group-key
:::

## handle.update()

:::demo 二期开始，`open()` 返回的 handle 支持 `update(patch)`，适合在同一条通知上增量更新状态，而不是反复新建实例。
notification/service-update
:::

## max 与 overflowStrategy

:::demo 通知服务支持限制单个位置的最大堆叠数；到达上限后，可通过 `overflowStrategy` 指定是淘汰最旧项还是忽略最新项。
notification/max-overflow
:::

## closeAll(filter) / getState(filter)

:::demo `closeAll(filter)` 和 `getState(filter)` 共享同一套过滤条件，适合做位置级、分组级或容器级的统一管理。
notification/service-state
:::

## ConfigProvider 默认配置

:::demo `ConfigProvider.notification` 可统一下发通知的默认 `duration`、`position`、`showClose`、`max` 等行为，显式传参仍然优先。
notification/config-provider
:::

## App Context 与 withContext

:::demo 当你需要把通知能力继续传给 composable、store 或 service 时，可以用 `withContext(appContext)` 固定当前 app 的调用入口。单一 `ConfigProvider` 下，普通 `open()` 和 `withContext()` 会继承同一套默认配置；多 app 或多套 Provider 并存时，建议显式绑定。
notification/with-context
:::

## 上下文隔离与 withContext

当页面里同时存在多个应用实例、多个 `ConfigProvider.notification`，或你在封装层手里已经拿到了 `appContext` 时，建议显式绑定上下文。

```ts
import { XyNotificationService } from "xiaoye-components";

const scopedNotify = XyNotificationService.withContext(appContext);

scopedNotify.success({
  title: "来自指定上下文",
  message: "会读取该 app 下 ConfigProvider.notification 的默认配置。"
});

// 等价的显式传参写法
XyNotificationService.open(
  {
    title: "直接传入 appContext",
    message: "适合在 service / store / composable 里桥接调用。"
  },
  appContext
);
```

完整安装后，`$notify` 已经默认绑定当前 app context；如需再次显式拿到 scoped API，也可以继续调用 `$notify.withContext()`。

## 何时使用

- 保存成功、发布完成、同步结束等全局操作结果提示。
- 后台任务、异步批处理、审批流状态变更等不需要阻断页面的广播反馈。
- 风险预警或系统状态提醒，但用户仍需要继续浏览当前页面。
- 跨路由触发、由 store 或 service 层统一发起的通知型反馈。

:::tip 使用建议
如果提示需要嵌在页面正文里长期存在，优先使用 `xy-alert`。如果用户必须立刻处理当前任务，再改用 `xy-dialog`。
:::

## 行为说明

- `XyNotification` 是单条通知卡片组件；多条堆叠、四角定位、去重和超限处理都由 `XyNotificationService` / `$notify` 负责。
- `XyNotificationService.open()` 返回的 handle 现在包含 `id`、`close(reason?)`、`update(patch)`。
- 完整安装组件库后，`$notify` 与 `XyNotificationService` 保持同一套调用签名和 typed shortcuts。
- 通过 `app.use(XyNotificationService)` 注入的 `$notify` 会自动继承当前 app 的 `ConfigProvider.notification` 上下文；`$notify.withContext()` 默认也会绑定当前 app。
- `XyNotificationService.withContext(appContext)` 适合在多 app、微前端、或跨模块 service 调用中显式指定通知配置来源。
- 若页面中同时存在多个 `ConfigProvider.notification`，裸调用 `XyNotificationService.open(...)` / `XyNotificationService.success(...)` 会输出一次告警，并回退到默认通知配置。
- `success()`、`info()`、`warning()`、`error()`、`primary()` 会自动填充 `type`，其余配置与 `open()` 一致。
- `position` 只支持四个角，不提供居中 placement，避免和 `message` 的使用边界混淆。
- `message` 支持 `string`、`VNode` 和 `() => VNodeChild`；`dangerouslyUseHTMLString` 仅对字符串正文生效。
- `title` 插槽优先于 `title` 属性；`default` 插槽优先于 `message`；`actions` 插槽独立渲染在内容区之后。
- `actions` 的存在不会改变自动关闭逻辑，是否自动关闭仍只由 `duration` 决定。
- 相同 `groupKey` 的通知只会在同一个 `appendTo + position` 桶内复用，不会跨桶迁移。
- `max` 只限制单个堆叠桶中的并发可见数量；命中上限时按 `overflowStrategy` 处理。
- `closeAll(filter?)` 和 `getState(filter?)` 支持按 `type`、`position`、`target`、`targetKey`、`groupKey` 过滤。
- `appendTo` 支持 `HTMLElement` 或 CSS 选择器字符串，适合微前端宿主、局部工作台和自定义层级容器。

## API

### 基础签名

```ts
import { XyNotification, XyNotificationService } from "xiaoye-components";
import { h } from "vue";

const handle = XyNotificationService.open({
  title: "批量发布完成",
  message: () => h("span", "3 个菜单已同步到预发环境。"),
  type: "success",
  position: "top-right",
  groupKey: "publish-sync",
  max: 3,
  overflowStrategy: "drop-oldest"
});

handle.update({
  title: "批量发布完成（已归档）",
  position: "bottom-right"
});

handle.close("programmatic");
```

```ts
const scopedNotify = XyNotificationService.withContext(appContext);

scopedNotify.info({
  title: "作用域通知",
  message: "显式复用某个 app 的 ConfigProvider.notification。"
});
```

### 全局注入

```ts
app.config.globalProperties.$notify({
  title: "草稿已保存",
  message: "你可以继续编辑，或稍后再提交审核。"
});

$notify.error({
  title: "同步失败",
  message: "请稍后重试。"
});

const scopedNotify = $notify.withContext();

scopedNotify.success({
  title: "继续沿用当前 app 上下文",
  message: "适合把 $notify 继续传给业务模块后再调用。"
});
```

### Notification Attributes

| 属性                          | 说明                                               | 类型                                                             | 默认值        |
| ----------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- | ------------- |
| `model-value`                 | 受控显示状态                                       | `boolean`                                                        | `undefined`   |
| `title`                       | 通知标题                                           | `string`                                                         | `''`          |
| `message`                     | 通知正文，支持字符串、VNode 或渲染函数             | `string \| VNode \| (() => VNodeChild)`                          | `''`          |
| `type`                        | 通知类型                                           | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error' \| ''` | `''`          |
| `duration`                    | 自动关闭时长，单位毫秒，`0` 表示不自动关闭         | `number`                                                         | `4500`        |
| `show-close`                  | 是否显示关闭按钮                                   | `boolean`                                                        | `true`        |
| `custom-class`                | 自定义 class                                       | `string`                                                         | `''`          |
| `icon`                        | 自定义图标名称；当 `type` 有值时会优先使用类型图标 | `string`                                                         | `''`          |
| `close-icon`                  | 自定义关闭图标名称                                 | `string`                                                         | `'mdi:close'` |
| `dangerously-use-html-string` | 是否把字符串正文按 HTML 渲染                       | `boolean`                                                        | `false`       |

### Notification Events

| 事件                | 说明                   | 参数                                                                 |
| ------------------- | ---------------------- | -------------------------------------------------------------------- |
| `update:modelValue` | 受控模式下同步显示状态 | `(value: boolean) => void`                                           |
| `close`             | 通知开始关闭时触发     | `(reason: 'manual' \| 'auto' \| 'escape' \| 'programmatic') => void` |
| `closed`            | 通知完成关闭后触发     | `(reason: 'manual' \| 'auto' \| 'escape' \| 'programmatic') => void` |
| `click`             | 点击通知主体时触发     | `(event: MouseEvent) => void`                                        |

### Notification Slots

| 插槽      | 说明       |
| --------- | ---------- |
| `title`   | 标题区内容 |
| `default` | 正文内容   |
| `actions` | 操作区内容 |

### Notification Service Options

| 字段                       | 说明                                                    | 类型                                                                                              |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `title`                    | 通知标题                                                | `string`                                                                                          |
| `message`                  | 通知正文，支持字符串、VNode 或渲染函数                  | `string \| VNode \| (() => VNodeChild)`                                                           |
| `type`                     | 通知类型                                                | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'`                                        |
| `duration`                 | 自动关闭时长                                            | `number`                                                                                          |
| `position`                 | 通知位置                                                | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`                                    |
| `offset`                   | 当前堆叠桶首条通知的起始偏移量，会在内部再叠加 16px gap | `number`                                                                                          |
| `showClose`                | 是否显示关闭按钮                                        | `boolean`                                                                                         |
| `customClass`              | 自定义 class                                            | `string`                                                                                          |
| `icon`                     | 自定义图标名称                                          | `string`                                                                                          |
| `closeIcon`                | 自定义关闭图标名称                                      | `string`                                                                                          |
| `zIndex`                   | 自定义层级                                              | `number`                                                                                          |
| `appendTo`                 | 自定义挂载容器                                          | `string \| HTMLElement`                                                                           |
| `dangerouslyUseHTMLString` | 是否按 HTML 渲染字符串正文                              | `boolean`                                                                                         |
| `groupKey`                 | 通知分组键；相同键会合并更新已有通知                    | `string`                                                                                          |
| `max`                      | 同一位置允许同时显示的最大通知数                        | `number`                                                                                          |
| `overflowStrategy`         | 超出 `max` 时的处理策略                                 | `'drop-oldest' \| 'drop-newest'`                                                                  |
| `onClick`                  | 点击通知主体时回调                                      | `() => void`                                                                                      |
| `onClosed`                 | 关闭完成后的回调                                        | `(reason: 'manual' \| 'auto' \| 'escape' \| 'programmatic' \| 'close-all' \| 'overflow') => void` |

### Notification Close Filter

| 字段        | 说明               | 类型                                                           |
| ----------- | ------------------ | -------------------------------------------------------------- |
| `type`      | 按通知类型过滤     | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'`     |
| `position`  | 按通知位置过滤     | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` |
| `target`    | 按挂载容器过滤     | `string \| HTMLElement`                                        |
| `targetKey` | 按内部容器标识过滤 | `string`                                                       |
| `groupKey`  | 按分组键过滤       | `string`                                                       |

### Notification Global Config

| 字段                       | 说明                           | 类型                                                           |
| -------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `duration`                 | 默认自动关闭时长               | `number`                                                       |
| `position`                 | 默认通知位置                   | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` |
| `offset`                   | 默认首条通知偏移               | `number`                                                       |
| `showClose`                | 默认是否显示关闭按钮           | `boolean`                                                      |
| `zIndex`                   | 默认层级                       | `number`                                                       |
| `max`                      | 默认单桶最大并发数             | `number`                                                       |
| `overflowStrategy`         | 默认超限处理策略               | `'drop-oldest' \| 'drop-newest'`                               |
| `appendTo`                 | 默认挂载容器                   | `string \| HTMLElement`                                        |
| `dangerouslyUseHTMLString` | 默认是否按 HTML 渲染字符串正文 | `boolean`                                                      |

### Notification Handle

| 字段             | 说明             | 类型                                                                  |
| ---------------- | ---------------- | --------------------------------------------------------------------- |
| `id`             | 当前通知实例标识 | `string`                                                              |
| `close(reason?)` | 主动关闭当前通知 | `(reason?: 'manual' \| 'auto' \| 'escape' \| 'programmatic') => void` |
| `update(patch)`  | 更新当前通知配置 | `(patch: Partial<NotificationServiceOptions>) => void`                |

### Service Methods

| 方法                                              | 说明                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `XyNotificationService.open(options)`             | 打开一条通知并返回 handle                                                                 |
| `XyNotificationService.open(options, appContext)` | 显式使用指定 app context 打开通知                                                         |
| `XyNotificationService.closeAll(filter?)`         | 关闭全部通知，或仅关闭命中过滤条件的通知                                                  |
| `XyNotificationService.getState(filter?)`         | 获取当前通知快照，支持按过滤条件裁剪                                                      |
| `XyNotificationService.updateOffsets(position?)`  | 重新计算指定位置通知的偏移                                                                |
| `XyNotificationService.withContext(appContext?)`  | 返回一个绑定指定上下文的通知 API；对 `$notify.withContext()` 来说，缺省参数会继承当前 app |

### Typed Shortcuts

| 方法                                     | 说明                        |
| ---------------------------------------- | --------------------------- |
| `XyNotificationService.primary(options)` | 打开 primary 通知           |
| `XyNotificationService.success(options)` | 打开 success 通知           |
| `XyNotificationService.info(options)`    | 打开 info 通知              |
| `XyNotificationService.warning(options)` | 打开 warning 通知           |
| `XyNotificationService.error(options)`   | 打开 error 通知             |
| `$notify.primary(options)`               | 全局注入的 primary 快捷方法 |
| `$notify.success(options)`               | 全局注入的 success 快捷方法 |
| `$notify.info(options)`                  | 全局注入的 info 快捷方法    |
| `$notify.warning(options)`               | 全局注入的 warning 快捷方法 |
| `$notify.error(options)`                 | 全局注入的 error 快捷方法   |
