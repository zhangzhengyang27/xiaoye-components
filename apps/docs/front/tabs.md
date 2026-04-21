---
title: Tabs 标签页
description: 标签页组件，用于切换内容面板。
outline: deep
---

# Tabs 标签页

`xyu-tabs` 是前台组件库的标签页组件，用于切换不同的内容面板。

## 基础用法

:::demo 基础标签页用法。
tabs/basic
:::

## 卡片风格

:::demo 使用 `type="card"` 设置卡片风格。
tabs/card
:::

## 禁用标签

:::demo 使用 `disabled` 属性禁用某个标签。
tabs/disabled
:::

## 可关闭标签

:::demo 使用 `closable` 属性允许关闭标签。
tabs/closable
:::

## 尺寸

:::demo 使用 `size` 属性设置标签页尺寸。
tabs/size
:::

## API

### Tabs Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 当前激活的标签名 | `string` | - |
| `type` | 标签页风格 | `'line' \| 'card'` | `'line'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `trigger` | 触发方式 | `'click' \| 'hover'` | `'click'` |
| `stretch` | 是否撑开标签 | `boolean` | `false` |

### TabPane Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `name` | 标签名称（唯一标识） | `string` | - |
| `label` | 标签显示文本 | `string` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `closable` | 是否可关闭 | `boolean` | `false` |
| `lazy` | 是否懒加载 | `boolean` | `false` |

### Tabs Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 激活标签变化时触发 | `(value: string)` |
| `change` | 标签变化时触发 | `(value: string)` |
