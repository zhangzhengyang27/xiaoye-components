---
title: Dialog 对话框
description: 用于阻断当前流程的录入、确认和强提示场景。
outline: deep
---

# Dialog 对话框

`xy-dialog` 是当前组件库里唯一的标准对话框入口。当前文档按增强计划整理，覆盖模板能力、工作台级体验增强，以及已经可用的编程式 `DialogService`。

## 基础用法

:::demo 最常见的场景是表单录入或二次确认，并通过 `footer` 插槽放一组操作按钮。
dialog/basic
:::

## 异步确认与提交中态

:::demo 删除、归档和发布这类动作通常不会立即结束，对话框关闭时机应该由异步结果决定。
dialog/async-confirm
:::

## 自定义头部与关闭策略

:::demo 自定义头部时，推荐继续使用 `title` 属性，或者把 `titleId` 透传给实际标题节点，确保屏幕阅读器仍能正确读取对话框标题。
dialog/custom
:::

## 关闭控制与结构裁剪

:::demo `before-close`、`show-close` 和 `lock-scroll` 适合更严格的确认场景；不传 `title` 时则不会渲染默认标题结构。
dialog/close-control
:::

## 嵌套对话框

:::demo 嵌套场景下，内层对话框应开启 `append-to-body`，避免被父层布局和层级影响。
dialog/nested
:::

## 头尾居中

:::demo `center` 只负责头部和底部对齐方式，适合更强调确认动作的居中布局。
dialog/center
:::

## 垂直居中

:::demo `align-center` 会让对话框在视口里同时水平、垂直居中，此时 `top` 不再参与布局。
dialog/align-center
:::

## 按需销毁

:::demo `destroy-on-close` 适合内容较重、首次打开才需要挂载的场景。
dialog/destroy-on-close
:::

## 拖拽与越界

:::demo 开启 `draggable` 后可以拖拽头部，`overflow` 则允许拖出视口。
dialog/draggable
:::

## 全屏与最大化

:::demo 工作台级弹层通常需要全屏和最大化切换；`fullscreen` 和 `maximizable` 已经可以组合成统一的窗口操作体验。
dialog/fullscreen-maximizable
:::

## 遮罩与穿透

:::demo 关闭遮罩后可以继续保留 dialog 容器，`modal-penetrable` 适合做非阻断的浮动工作台。
dialog/modal
:::

## 自定义动画

:::demo `transition` 支持字符串过渡名或 Vue Transition 对象，适合为不同业务氛围定制切入方式。
dialog/custom-transition
:::

## 调整尺寸

:::demo 工作台级 dialog 常常需要拖拽调整尺寸，并配合最小最大边界一起使用。
dialog/resizable
:::

## 固定头尾与长内容滚动

:::demo `sticky-header`、`sticky-footer` 和 `body-max-height` 更适合长表单、对账明细和批量确认场景。
dialog/sticky
:::

## 加载遮罩

:::demo `loading` 和 `loading-text` 适合 body 内部仍在提交或加载时的过渡态。
dialog/loading
:::

Dialog 的默认 loading 视觉已与独立 `Loading` 对齐，会读取 `ConfigProvider.loading` 的 `text / spinner / svg / svgViewBox / background`。如果组件上显式传了 `loading-text`，局部值仍然优先；`delay / minDuration / fullscreen / lock` 不会影响 Dialog 自身的既有交互时序。

## 编程式打开

:::demo `open()` 是通用入口，可承载 `message`、`render` 或 `component` 三类内容来源。
dialog/service-open
:::

## 编程式确认

:::demo `confirm()` 更适合删除、发布、归档这类标准确认场景，返回布尔结果即可驱动业务流程。
dialog/service-confirm
:::

## 编程式输入

:::demo `prompt()` 面向带输入校验的轻量弹框流程，例如命名、备注和二次确认口令。
dialog/service-prompt
:::

## 何时使用

- 阻断式录入，例如新建成员、编辑敏感配置。
- 二次确认，例如删除、停用、归档、发布。
- 强提示或需要用户显式处理的内容阅读。
- 需要保留上下文、同时承载较大工作区时，可以把 Dialog 当作中心工作台面板使用。

:::tip 使用建议
如果内容只是补充说明或轻量交互，不需要阻断主页面时，优先使用 `xy-popover`。只有在需要强制用户处理当前任务时，再使用 `xy-dialog`。
:::

## 无障碍说明

- 使用默认标题时，会自动建立 `aria-labelledby`。
- 自定义 `header` 或兼容 `title` 插槽时，推荐继续保留 `title` 属性，或者把插槽参数里的 `titleId` 绑定到实际标题元素。
- 如果自定义头部完全不使用 `titleId`，组件会回退到 `aria-label=title`。因此在自定义 header 场景里，最好不要省略 `title`。
- `open-auto-focus` 与 `close-auto-focus` 分别对应打开后的自动聚焦和关闭后的焦点恢复，可用来补业务日志或埋点。

## ConfigProvider 默认项

增强计划里，`ConfigProvider` 会为 Dialog 提供全局默认配置段：

```ts
interface ConfigProviderProps {
  dialog?: {
    alignCenter?: boolean;
    draggable?: boolean;
    overflow?: boolean;
    lockScroll?: boolean;
    closeOnClickModal?: boolean;
    closeOnPressEscape?: boolean;
    transition?: string | TransitionProps;
    resizable?: boolean;
    maximizable?: boolean;
    stickyHeader?: boolean;
    stickyFooter?: boolean;
  };
}
```

- `ConfigProvider.dialog` 只负责高频默认值，不覆盖业务本身的内容结构。
- 局部 `Dialog` props 优先级高于全局默认项。
- `DialogService` 也应复用同一套默认值，避免模板式和编程式调用出现行为漂移。

## DialogService 用法

当前可直接使用的导出如下：

```ts
import {
  XyDialogService,
  type DialogServiceHandle,
  type DialogServiceOpenOptions,
  type DialogServiceResult
} from "xiaoye-components";
```

### 通用 open

```ts
const handle = XyDialogService.open({
  title: "批量发布确认",
  message: "当前操作会同步 12 个菜单入口。",
  dialogProps: {
    width: 560,
    closeOnClickModal: false
  }
});

const result = await handle.result;
```

### confirm / alert / prompt

```ts
const confirmed = await XyDialogService.confirm({
  title: "删除成员",
  message: "删除后不可恢复，是否继续？"
});

await XyDialogService.alert({
  title: "发布完成",
  message: "所有变更已同步到生产环境。"
});

const promptResult = await XyDialogService.prompt({
  title: "输入发布口令",
  inputPlaceholder: "请输入口令",
  inputValidator(value) {
    if (!value.trim()) {
      return "口令不能为空";
    }
  }
});
```

### 结果约定

```ts
interface DialogServiceResult {
  action: "confirm" | "cancel" | "close" | "backdrop" | "escape" | "programmatic";
  value?: string;
}
```

- `open()` 返回 `DialogServiceHandle`，包含 `id`、`close()`、`update()`、`result`。
- `alert()` 适合单按钮提示。
- `confirm()` 返回布尔值，适合标准确认流程。
- `prompt()` 返回 `{ confirmed, value }`，适合轻量输入。

## API

### Dialog Attributes

| 属性                    | 说明                                                 | 类型                                                                                      | 默认值             |
| ----------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------ |
| `model-value`           | 是否打开对话框                                       | `boolean`                                                                                 | `false`            |
| `title`                 | 对话框标题                                           | `string`                                                                                  | `''`               |
| `append-to-body`        | 是否 teleport 到 `body`                              | `boolean`                                                                                 | `false`            |
| `append-to`             | teleport 挂载目标                                    | `string \| HTMLElement`                                                                   | `'body'`           |
| `before-close`          | 关闭前拦截函数，仅拦截内建关闭入口，并透出关闭原因   | `(done: (cancel?: boolean) => void, reason?: DialogCloseReason) => void \| Promise<void>` | `undefined`        |
| `destroy-on-close`      | 关闭后是否销毁内容                                   | `boolean`                                                                                 | `false`            |
| `close-on-click-modal`  | 点击遮罩是否关闭                                     | `boolean`                                                                                 | `true`             |
| `close-on-press-escape` | 按下 `Escape` 是否关闭                               | `boolean`                                                                                 | `true`             |
| `lock-scroll`           | 打开时是否锁定 body 滚动                             | `boolean`                                                                                 | `true`             |
| `modal`                 | 是否显示遮罩层                                       | `boolean`                                                                                 | `true`             |
| `modal-class`           | 遮罩容器自定义类名                                   | `string`                                                                                  | `''`               |
| `panel-class`           | 面板容器自定义类名                                   | `string`                                                                                  | `''`               |
| `modal-penetrable`      | 无遮罩时是否允许穿透点击背景                         | `boolean`                                                                                 | `false`            |
| `open-delay`            | 打开延迟，单位毫秒                                   | `number`                                                                                  | `0`                |
| `close-delay`           | 关闭延迟，单位毫秒                                   | `number`                                                                                  | `0`                |
| `top`                   | 非垂直居中时的顶部偏移                               | `string`                                                                                  | `'15vh'`           |
| `width`                 | 对话框宽度                                           | `string \| number`                                                                        | `'50%'`            |
| `z-index`               | 自定义层级                                           | `number`                                                                                  | `undefined`        |
| `center`                | 是否让头部和底部内容居中                             | `boolean`                                                                                 | `false`            |
| `align-center`          | 是否让对话框在视口中垂直居中                         | `boolean`                                                                                 | `false`            |
| `close-icon`            | 自定义关闭图标，增强计划里支持 `string \| Component` | `string \| Component`                                                                     | `'mdi:close'`      |
| `draggable`             | 是否允许通过头部拖拽对话框                           | `boolean`                                                                                 | `false`            |
| `overflow`              | 拖拽时是否允许超出视口                               | `boolean`                                                                                 | `false`            |
| `fullscreen`            | 是否全屏显示                                         | `boolean`                                                                                 | `false`            |
| `maximizable`           | 是否显示最大化/还原按钮                              | `boolean`                                                                                 | `false`            |
| `resizable`             | 是否允许通过右下角手柄调整尺寸                       | `boolean`                                                                                 | `false`            |
| `min-width`             | 调整尺寸时的最小宽度                                 | `string \| number`                                                                        | `undefined`        |
| `max-width`             | 调整尺寸时的最大宽度                                 | `string \| number`                                                                        | `undefined`        |
| `min-height`            | 调整尺寸时的最小高度                                 | `string \| number`                                                                        | `undefined`        |
| `max-height`            | 调整尺寸时的最大高度                                 | `string \| number`                                                                        | `undefined`        |
| `sticky-header`         | 是否固定头部                                         | `boolean`                                                                                 | `false`            |
| `sticky-footer`         | 是否固定底部                                         | `boolean`                                                                                 | `false`            |
| `body-max-height`       | body 区域最大高度                                    | `string \| number`                                                                        | `undefined`        |
| `loading`               | 是否显示 body 内部加载遮罩                           | `boolean`                                                                                 | `false`            |
| `loading-text`          | 加载文案                                             | `string`                                                                                  | `''`               |
| `header-class`          | 头部区域自定义类名                                   | `string`                                                                                  | `''`               |
| `body-class`            | 主体区域自定义类名                                   | `string`                                                                                  | `''`               |
| `footer-class`          | 底部区域自定义类名                                   | `string`                                                                                  | `''`               |
| `show-close`            | 是否显示右上角关闭按钮                               | `boolean`                                                                                 | `true`             |
| `header-aria-level`     | 默认标题的 `aria-level`                              | `string`                                                                                  | `'2'`              |
| `transition`            | 自定义过渡配置，支持过渡名或 Vue Transition 对象     | `string \| TransitionProps`                                                               | `'xy-dialog-fade'` |

### Dialog Events

| 事件                 | 说明                     | 参数                                                 |
| -------------------- | ------------------------ | ---------------------------------------------------- |
| `update:model-value` | 对话框开关状态变化时触发 | `boolean`                                            |
| `update:fullscreen`  | 最大化/还原切换时触发    | `boolean`                                            |
| `open`               | 打开时触发               | —                                                    |
| `opened`             | 进入完成后触发           | —                                                    |
| `close`              | 关闭时触发               | —                                                    |
| `closed`             | 离开完成后触发           | —                                                    |
| `open-auto-focus`    | 打开后完成自动聚焦时触发 | —                                                    |
| `close-auto-focus`   | 关闭后恢复焦点时触发     | —                                                    |
| `maximize`           | 切换到全屏/最大化时触发  | —                                                    |
| `restore`            | 从全屏/最大化恢复时触发  | —                                                    |
| `resize-start`       | 开始调整尺寸时触发       | `(event: MouseEvent, width: number, height: number)` |
| `resize`             | 调整尺寸过程中触发       | `(event: MouseEvent, width: number, height: number)` |
| `resize-end`         | 结束调整尺寸时触发       | `(event: MouseEvent, width: number, height: number)` |

### Dialog Slots

| 插槽      | 说明                                                  |
| --------- | ----------------------------------------------------- |
| `default` | 对话框主体内容                                        |
| `header`  | 自定义头部内容，透出 `close`、`titleId`、`titleClass` |
| `footer`  | 自定义底部操作区                                      |
| `title`   | 与 `header` 兼容的旧式标题插槽，建议仅在迁移期使用    |

### Dialog Exposes

| 名称               | 说明                                     | 类型                                   |
| ------------------ | ---------------------------------------- | -------------------------------------- |
| `visible`          | 当前可见状态                             | `Ref<boolean>`                         |
| `dialogContentRef` | 内容层实例，可继续访问拖拽和尺寸控制方法 | `DialogContentInstance \| null`        |
| `resetPosition`    | 重置拖拽位移                             | `() => void`                           |
| `handleClose`      | 触发内建关闭流程，可显式指定关闭原因     | `(reason?: DialogCloseReason) => void` |
