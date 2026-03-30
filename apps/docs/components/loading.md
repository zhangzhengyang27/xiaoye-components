---
title: Loading 加载
description: 用于容器内或全屏态的数据加载遮罩，支持 directive、service 和全量安装后的 $loading。
outline: deep
---

# Loading 加载

`Loading` 在当前库里不是公开的 `<xy-loading />` 标签，而是一组插件式能力：`v-loading` 指令、`XyLoadingService()` / `XyLoading.service()`，以及全量安装后的 `this.$loading()`。指令配套属性统一使用 `xy-loading-*` 前缀。

## 容器内加载

:::demo 最常见的场景是卡片、表格、分区面板内的局部加载。默认遮罩会直接挂到使用 directive 的元素上。
loading/basic
:::

## 自定义文案、背景和 SVG

:::demo `xy-loading-text`、`xy-loading-background`、`xy-loading-svg` 和 `xy-loading-custom-class` 可以组合出更贴近业务语境的加载态。
loading/customization
:::

## Fullscreen 与锁滚动

:::demo `v-loading.fullscreen.lock` 适合全页初始化、批量导入和短暂的阻断式流程。
loading/fullscreen
:::

## Service 调用

:::demo `XyLoadingService()` 默认会创建 fullscreen loading，并返回一个可更新文案、可关闭的实例。
loading/service
:::

## 延迟显示与最短展示时长

:::demo `delay` 可以避免请求太快时的遮罩闪烁，`minDuration` 会从“真正显示出来”的时刻开始计时，保证可见时长稳定。
loading/delay-min-duration
:::

## groupKey 复用与 closeAll

:::demo 同一个 `groupKey` 会复用现有 service 实例，并只合并可更新字段；`closeAll()` 可以一次性关闭当前所有 service loading。
loading/service-group-key
:::

## service.with() 包装异步任务

:::demo `XyLoadingService.with()` 适合直接包裹 Promise 或异步函数，任务完成或抛错后都会自动关闭 loading。
loading/service-with
:::

## ConfigProvider 默认项

:::demo `ConfigProvider.loading` 可以统一独立 Loading 的默认文案、背景、spinner 和时序参数；`Dialog / Table / Select` 只会复用其中的视觉默认项。
loading/config-provider
:::

## target 与 body 跟随目标区域

:::demo `target` 可以让 service 覆盖指定元素；`body: true` 会把遮罩挂到 `document.body`，并在滚动、缩放和目标尺寸变化时持续跟随目标区域。
loading/target-body
:::

## 使用建议

- 页面中只需要局部遮罩时，优先使用 `v-loading`，模板最直观。
- 需要在组合函数、异步请求链路或 store 里随处触发时，优先使用 `XyLoadingService()`。
- 需要把 loading 生命周期和异步任务严格绑定时，优先使用 `XyLoadingService.with()`，避免漏关。
- 默认 fullscreen service 是单例；局部 target service 不做全局去重。
- `groupKey` 只做 service 级复用，同 key 下不会改写既有实例的 `target / body / fullscreen / lock` 作用域。
- 如果只是静态占位而不是交互阻断，优先考虑 `xy-skeleton`。

## 无障碍说明

- 独立 Loading 遮罩的状态节点会带 `role="status"` 与 `aria-live="polite"`。
- directive 作用元素和 service 的目标元素在 loading 期间会自动加上 `aria-busy="true"`，关闭后移除。
- `Dialog / Table / Select` 的内建 loading 也会同步标记 `aria-busy`，但各自仍保留原本的 DOM 语义。

## 安全提示

:::warning XSS 风险
`xy-loading-svg` 和 `svg` 选项会把传入字符串作为 SVG 片段渲染。不要把用户提交的原始内容直接塞进这些字段，否则可能引入 XSS 风险。
:::

## 用法

### 指令

```vue
<template>
  <div
    v-loading="loading"
    xy-loading-text="正在同步数据..."
    xy-loading-background="rgba(255, 255, 255, 0.82)"
  />
</template>
```

### Service

```ts
import { XyLoadingService } from "xiaoye-components";

const loading = XyLoadingService({
  text: "正在发布版本...",
  lock: true
});

loading.setText("正在刷新缓存...");
loading.close();
```

### 全量安装后的 $loading

```ts
app.use(XiaoyeComponents);

app.config.globalProperties.$loading({
  text: "正在初始化工作台..."
});
```

## API

### Loading Options

| 字段          | 说明                                              | 类型                         | 默认值          |
| ------------- | ------------------------------------------------- | ---------------------------- | --------------- |
| `target`      | 要覆盖的目标元素，支持 CSS 选择器或 `HTMLElement` | `string \| HTMLElement`      | `document.body` |
| `body`        | 是否把遮罩挂到 `document.body`                    | `boolean`                    | `false`         |
| `fullscreen`  | 是否使用 fullscreen 形态                          | `boolean`                    | `true`          |
| `lock`        | fullscreen 时是否锁定 body 滚动                   | `boolean`                    | `false`         |
| `text`        | 加载文案                                          | `string \| VNode \| VNode[]` | `''`            |
| `spinner`     | 自定义 spinner class                              | `string`                     | `''`            |
| `background`  | 自定义遮罩背景色                                  | `string`                     | `''`            |
| `customClass` | 遮罩自定义 class                                  | `string`                     | `''`            |
| `svg`         | 自定义 SVG 片段                                   | `string`                     | `''`            |
| `svgViewBox`  | 自定义 SVG 的 `viewBox`                           | `string`                     | `'0 0 50 50'`   |
| `visible`     | 初始显示状态                                      | `boolean`                    | `true`          |
| `delay`       | 延迟显示时长，单位毫秒                            | `number`                     | `0`             |
| `minDuration` | 实际显示后的最短可见时长，单位毫秒                | `number`                     | `0`             |
| `groupKey`    | service 复用键；相同 key 会复用已有实例           | `string`                     | `undefined`     |
| `beforeClose` | 关闭前拦截；返回 `false` 会阻止关闭               | `() => boolean`              | `undefined`     |
| `closed`      | 完全关闭并卸载后触发                              | `() => void`                 | `undefined`     |

### Directive

| 项            | 说明                                                 |
| ------------- | ---------------------------------------------------- |
| `v-loading`   | 绑定 `boolean` 或 `LoadingOptions`，控制加载遮罩显示 |
| `.body`       | 把遮罩挂到 `document.body`                           |
| `.fullscreen` | 使用 fullscreen 加载                                 |
| `.lock`       | fullscreen 时锁定 body 滚动                          |

### Directive Attributes

| 属性                      | 说明                    | 类型     |
| ------------------------- | ----------------------- | -------- |
| `xy-loading-text`         | 加载文案                | `string` |
| `xy-loading-spinner`      | 自定义 spinner class    | `string` |
| `xy-loading-svg`          | 自定义 SVG 片段         | `string` |
| `xy-loading-svg-view-box` | 自定义 SVG 的 `viewBox` | `string` |
| `xy-loading-background`   | 遮罩背景色              | `string` |
| `xy-loading-custom-class` | 遮罩自定义 class        | `string` |

### Loading Instance

| 方法      | 说明                      | 签名                                         |
| --------- | ------------------------- | -------------------------------------------- |
| `close`   | 关闭并卸载 loading        | `() => void`                                 |
| `setText` | 更新加载文案              | `(text: string \| VNode \| VNode[]) => void` |
| `update`  | 更新运行中的 loading 配置 | `(patch: Partial<LoadingOptions>) => void`   |

### Loading Service

| 方法                                   | 说明                           | 签名                                                                                                                     |
| -------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `XyLoadingService(options?, context?)` | 创建一个 loading 实例          | `(options?: LoadingOptions, context?: AppContext \| null) => LoadingInstance`                                            |
| `closeAll()`                           | 关闭当前所有 service loading   | `() => void`                                                                                                             |
| `with(task, options?, context?)`       | 包裹异步任务并在结束后自动关闭 | `<T>(task: Promise<T> \| (() => T \| Promise<T>), options?: LoadingOptions, context?: AppContext \| null) => Promise<T>` |

### Loading Global Config

`ConfigProvider.loading` 的类型如下：

```ts
interface LoadingGlobalConfig {
  text?: string;
  background?: string;
  spinner?: string;
  svg?: string;
  svgViewBox?: string;
  delay?: number;
  minDuration?: number;
  fullscreen?: boolean;
  lock?: boolean;
}
```

- 独立 `v-loading` 与 `XyLoadingService()` 会完整读取这组默认值。
- `Dialog / Table / Select` 只消费视觉类默认项：`text / spinner / svg / svgViewBox / background`。
- 局部 options 优先级始终高于 `ConfigProvider.loading`。

### 全量安装导出

```ts
import {
  XyLoading,
  XyLoadingDirective,
  XyLoadingService,
  vLoading,
  type LoadingBinding,
  type LoadingGlobalConfig,
  type LoadingInstance,
  type LoadingOptions
} from "xiaoye-components";
```
