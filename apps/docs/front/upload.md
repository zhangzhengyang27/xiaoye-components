---
title: Upload 上传
description: 上传组件，用于文件上传。
outline: deep
---

# Upload 上传

`xyu-upload` 是前台组件库的上传组件，支持多种上传方式和文件展示。

## 基础用法

:::demo 基础上传用法。
upload/basic
:::

## 拖拽上传

:::demo 使用 `drag` 属性启用拖拽上传。
upload/drag
:::

## 图片上传

:::demo 使用 `accept` 属性限制上传文件类型。
upload/picture
:::

## 上传列表

:::demo 使用 `list-type` 属性设置列表展示方式。
upload/list
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用上传。
upload/disabled
:::

## API

### Upload Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `action` | 上传地址 | `string` | - |
| `headers` | 请求头 | `Record<string, string>` | `{}` |
| `data` | 上传附带的额外参数 | `Record<string, unknown>` | `{}` |
| `name` | 上传的文件字段名 | `string` | `'file'` |
| `with-credentials` | 是否携带 cookie | `boolean` | `false` |
| `accept` | 接受上传的文件类型 | `string` | - |
| `drag` | 是否启用拖拽上传 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `multiple` | 是否支持多选 | `boolean` | `false` |
| `max-size` | 最大文件大小（MB） | `number` | - |
| `list-type` | 文件列表类型 | `'text' \| 'picture' \| 'picture-card'` | `'text'` |
| `auto-upload` | 是否自动上传 | `boolean` | `true` |

### Upload Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `change` | 文件状态变化时触发 | `(file: FileItem, fileList: FileItem[])` |
| `success` | 上传成功时触发 | `(response: unknown, file: FileItem)` |
| `error` | 上传失败时触发 | `(error: Error, file: FileItem)` |
| `progress` | 上传进度变化时触发 | `(percentage: number, file: FileItem)` |
| `exceed` | 文件数量超限时触发 | `(files: File[], fileList: FileItem[])` |

### Upload Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发器内容 |
| `tip` | 上传提示文字 |
