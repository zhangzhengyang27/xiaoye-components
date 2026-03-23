---
title: Config Provider 全局配置
description: 统一默认尺寸、命名空间和弹层层级的根配置组件。
outline: deep
---

# Config Provider 全局配置

`xy-config-provider` 用来在应用根部统一设置默认尺寸、命名空间和弹层层级。它更像是一个“全局上下文入口”，而不是一个独立展示组件。

## 基础用法

:::demo 最常见的用法是在应用根节点包一层，统一按钮、输入框、标签等组件的默认尺寸。
config-provider/basic
:::

## 局部覆盖

:::demo Config Provider 支持按区域覆盖默认值，适合管理后台里局部模块有不同尺寸策略的场景。
config-provider/nested
:::

## 何时使用

- 你想统一整套表单组件的默认尺寸。
- 你需要给弹层组件统一一个更高的起始层级。
- 你准备在同一页面里托管多套命名空间样式。

## API

### ConfigProvider Attributes

| 属性        | 说明                           | 类型                    | 默认值   |
| ----------- | ------------------------------ | ----------------------- | -------- |
| `namespace` | 全局命名空间前缀               | `string`                | `'xy'`   |
| `locale`    | 全局文案对象，会透传到配置上下文 | `Record<string, string>` | `{}`     |
| `z-index`   | 弹层类组件的基础层级           | `number`                | `2000`   |
| `size`      | 默认尺寸                       | `'sm' \| 'md' \| 'lg'`  | `'md'`   |

### ConfigProvider Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 包裹的应用内容 |
