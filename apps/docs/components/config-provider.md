---
title: Config Provider 全局配置
description: 统一默认尺寸、命名空间、弹层层级和函数式能力默认项的根配置组件。
outline: deep
---

# Config Provider 全局配置

`xy-config-provider` 用来在应用根部统一设置默认尺寸、命名空间、弹层层级，以及 `Dialog / Loading / Message / Notification` 这类全局能力的默认项。它更像是一个“全局上下文入口”，而不是一个独立展示组件。

## 基础用法

:::demo 最常见的用法是在应用根节点包一层，统一按钮、输入框、标签等组件的默认尺寸。
config-provider/basic
:::

## 局部覆盖

:::demo Config Provider 支持按区域覆盖默认值，适合管理后台里局部模块有不同尺寸策略的场景。
config-provider/nested
:::

## Message 默认配置

:::demo `ConfigProvider.message` 可以给函数式 `XyMessage` 统一默认的 `placement`、`duration`、`showClose`、`grouping` 和 `max`，适合工作台壳子或微前端容器统一消息策略。
config-provider/message
:::

## Loading 默认配置

`ConfigProvider.loading` 适合统一整站的 loading 视觉和时序策略：

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

- 独立 `v-loading`、`XyLoadingService()` 和 `$loading()` 会完整读取这组默认值。
- `Dialog / Table / Select` 只消费视觉类默认项：`text / spinner / svg / svgViewBox / background`。
- 组件自身传入的 props 或 service options 优先级更高。

## 何时使用

- 你想统一整套表单组件的默认尺寸。
- 你需要给弹层组件统一一个更高的起始层级。
- 你想给 `Loading` 统一默认文案、背景、spinner 或避免闪烁的时序参数。
- 你想给 `XyMessage` 统一消息位置、关闭策略和数量上限。
- 你准备在同一页面里托管多套命名空间样式。

## API

### ConfigProvider Attributes

| 属性           | 说明                             | 类型                       | 默认值 |
| -------------- | -------------------------------- | -------------------------- | ------ |
| `namespace`    | 全局命名空间前缀                 | `string`                   | `'xy'` |
| `locale`       | 全局文案对象，会透传到配置上下文 | `Record<string, string>`   | `{}`   |
| `z-index`      | 弹层类组件的基础层级             | `number`                   | `2000` |
| `size`         | 默认尺寸                         | `'sm' \| 'md' \| 'lg'`     | `'md'` |
| `dialog`       | Dialog 服务和组件的全局默认配置  | `DialogGlobalConfig`       | `{}`   |
| `loading`      | Loading 的全局默认配置           | `LoadingGlobalConfig`      | `{}`   |
| `message`      | Message 的全局默认配置           | `MessageGlobalConfig`      | `{}`   |
| `notification` | Notification 的全局默认配置      | `NotificationGlobalConfig` | `{}`   |

### ConfigProvider Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 包裹的应用内容 |
