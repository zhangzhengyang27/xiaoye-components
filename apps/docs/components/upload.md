---
title: Upload 上传
description: 附件上传、图片上传和补充材料提交组件。
outline: deep
---

# Upload 上传

`xy-upload` 适合附件上传、图片上传和补充材料提交。当前版本关注的是“本地文件选择 + 文件列表回显 + 数量限制 + 拖拽上传”这条基础链路。

## 基础用法

:::demo 默认模式适合普通附件上传场景，用户点击触发区后选择本地文件。
upload/basic
:::

## 拖拽上传

:::demo `drag` 适合补充材料、附件批量提交这类更重的上传场景。
upload/drag
:::

## 文件列表回显

:::demo 通过 `v-model` 传入现有文件列表，适合编辑态回显和继续补充上传。
upload/list
:::

## 行为约定

- 上传触发区支持 `Enter / Space` 打开文件选择。
- `max-count` 用来限制最终可保留的文件数量。
- 在表单中会把校验消息关联到上传触发区。

## API

### Upload Attributes

| 属性         | 说明                   | 类型                  | 默认值         |
| ------------ | ---------------------- | --------------------- | -------------- |
| `model-value`| 当前文件列表           | `UploadFileItem[]`    | `[]`           |
| `accept`     | 原生文件类型限制       | `string`              | `''`           |
| `multiple`   | 是否支持多选           | `boolean`             | `false`        |
| `max-count`  | 最大文件数量           | `number`              | `undefined`    |
| `disabled`   | 是否禁用               | `boolean`             | `false`        |
| `drag`       | 是否启用拖拽上传       | `boolean`             | `false`        |
| `tip`        | 上传提示文案           | `string`              | `''`           |
| `size`       | 组件尺寸               | `'sm' \| 'md' \| 'lg'`| 跟随全局配置   |

### UploadFileItem

| 字段     | 说明         | 类型        |
| -------- | ------------ | ----------- |
| `uid`    | 文件唯一标识 | `string`    |
| `name`   | 文件名       | `string`    |
| `size`   | 文件大小     | `number`    |
| `type`   | MIME 类型    | `string`    |
| `status` | 当前状态     | `'ready'`   |
| `raw`    | 原始文件对象 | `File`      |

### Upload Events

| 事件                 | 说明                 | 参数                 |
| -------------------- | -------------------- | -------------------- |
| `update:model-value` | 更新文件列表         | `UploadFileItem[]`   |
| `change`             | 文件列表变化         | `UploadFileItem[]`   |
| `remove`             | 删除文件             | `UploadFileItem`     |
| `exceed`             | 超过数量限制时触发   | `File[]`             |
