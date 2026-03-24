---
title: Upload 上传
description: 附件上传、图片上传和补充材料提交组件。
outline: deep
---

# Upload 上传

`xy-upload` 适合附件上传、图片上传和补充材料提交。当前版本的接口和行为向 `element-plus Upload` 对齐，主绑定方式推荐使用 `v-model:file-list`。

## 基础用法

:::demo 默认模式适合普通附件上传场景，用户点击触发区后选择本地文件。
upload/basic
:::

## 拖拽上传

:::demo `drag` 适合补充材料、附件批量提交这类更重的上传场景。
upload/drag
:::

## 图片列表

:::demo `list-type="picture"` 适合封面、设计稿和截图回显。
upload/picture
:::

## 图片卡片

:::demo `list-type="picture-card"` 会把上传入口直接嵌入卡片列表末尾。
upload/picture-card
:::

## 超限反馈

:::demo 通过 `limit` 和 `exceed` 事件，把超限文件直接反馈给用户。
upload/exceed
:::

## 手动上传

:::demo 关闭 `auto-upload` 后，可以先把文件加入列表，再通过组件暴露的 `submit()` 手动发起上传。
upload/manual
:::

## 上传前校验

:::demo `before-upload` 返回 `false` 时，文件不会进入上传流程。
upload/before-upload
:::

## 自定义请求

:::demo 通过 `http-request` 可以接入自定义上传 SDK、签名直传或网关封装。
upload/custom-request
:::

## 自定义触发器与说明

:::demo 通过 `trigger` 和 `tip` 插槽，可以把上传入口接入项目自己的按钮体系。
upload/trigger-tip
:::

## 自定义文件项

:::demo `file` 插槽适合把文件列表渲染成更贴近业务的样式。
upload/custom-file
:::

## 文件类型限制

:::demo 通过 `accept` 给出浏览器侧的文件类型过滤提示，适合合同、截图和设计稿补传场景。
upload/drag-accept
:::

## 编辑态回显与继续补传

:::demo 通过 `v-model:file-list` 传入现有文件列表，适合编辑态回显和继续补充上传。
upload/list
:::

## 行为约定

- 上传触发区支持 `Enter / Space` 打开文件选择。
- `limit` 用来限制最终可保留的文件数量。
- `auto-upload="false"` 时，文件会先进入 `ready` 状态，等待手动调用 `submit()`。
- `before-upload` 返回 `false` 或 rejected Promise 时，会阻止该文件进入上传流程。
- `list-type="picture"` 和 `picture-card` 会优先使用 `url` 或本地图像对象 URL 渲染缩略图。
- 在表单中会把校验消息关联到上传触发区。

## API

### Upload Attributes

| 属性               | 说明                     | 类型                                                            | 默认值       |
| ------------------ | ------------------------ | --------------------------------------------------------------- | ------------ |
| `file-list`        | 当前文件列表             | `UploadFileItem[]`                                              | `[]`         |
| `action`           | 上传地址                 | `string`                                                        | `'#'`        |
| `headers`          | 请求头                   | `Record<string, string \| number \| boolean \| null \| undefined>` | `{}`      |
| `method`           | 上传方法                 | `string`                                                        | `'post'`     |
| `data`             | 额外上传参数             | `Record<string, unknown> \| (file) => Record<string, unknown>` | `{}`         |
| `name`             | 文件字段名               | `string`                                                        | `'file'`     |
| `accept`           | 原生文件类型限制         | `string`                                                        | `''`         |
| `multiple`         | 是否支持多选             | `boolean`                                                       | `false`      |
| `limit`            | 最大文件数量             | `number`                                                        | `undefined`  |
| `disabled`         | 是否禁用                 | `boolean`                                                       | `false`      |
| `drag`             | 是否启用拖拽上传         | `boolean`                                                       | `false`      |
| `tip`              | 上传提示文案             | `string`                                                        | `''`         |
| `size`             | 组件尺寸                 | `'sm' \| 'md' \| 'lg'`                                          | 跟随全局配置 |
| `auto-upload`      | 是否自动上传             | `boolean`                                                       | `true`       |
| `show-file-list`   | 是否显示文件列表         | `boolean`                                                       | `true`       |
| `with-credentials` | 是否携带 cookie          | `boolean`                                                       | `false`      |
| `list-type`        | 文件列表展示类型         | `'text' \| 'picture' \| 'picture-card'`                         | `'text'`     |
| `before-upload`    | 上传前钩子               | `(file) => boolean \| Promise<boolean \| File \| Blob \| void>` | `undefined` |
| `before-remove`    | 删除前钩子               | `(file, files) => boolean \| Promise<boolean>`                  | `undefined` |
| `on-change`        | 文件选择或状态变化钩子   | `(file, files) => void`                                         | `undefined` |
| `on-remove`        | 删除文件钩子             | `(file, files) => void`                                         | `undefined` |
| `on-preview`       | 点击预览钩子             | `(file) => void`                                                | `undefined` |
| `on-success`       | 上传成功钩子             | `(response, file, files) => void`                               | `undefined` |
| `on-progress`      | 上传进度钩子             | `(event, file, files) => void`                                  | `undefined` |
| `on-error`         | 上传失败钩子             | `(error, file, files) => void`                                  | `undefined` |
| `on-exceed`        | 超限钩子                 | `(files, fileList) => void`                                     | `undefined` |
| `http-request`     | 自定义上传请求实现       | `(options) => XMLHttpRequest \| Promise<unknown> \| void`       | `undefined` |

### UploadFileItem

| 字段         | 说明           | 类型                                      |
| ------------ | -------------- | ----------------------------------------- |
| `uid`        | 文件唯一标识   | `string`                                  |
| `name`       | 文件名         | `string`                                  |
| `size`       | 文件大小       | `number`                                  |
| `type`       | MIME 类型      | `string`                                  |
| `status`     | 当前状态       | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| `percentage` | 上传进度       | `number`                                  |
| `response`   | 上传响应       | `unknown`                                 |
| `url`        | 文件地址       | `string`                                  |
| `raw`        | 原始文件对象   | `UploadRawFile`                           |

### Upload Events

| 事件                 | 说明                 | 参数                                   |
| -------------------- | -------------------- | -------------------------------------- |
| `update:fileList`    | 更新文件列表         | `UploadFileItem[]`                     |

### Upload Exposes

| 暴露项       | 说明             | 类型                              |
| ------------ | ---------------- | --------------------------------- |
| `submit`     | 手动上传待上传项 | `() => Promise<void>`             |
| `abort`      | 取消上传         | `(file?: UploadFileItem) => void` |
| `clearFiles` | 清空当前文件列表 | `() => Promise<void>`             |

### Upload Slots

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 默认上传区内容           |
| `trigger` | 自定义上传触发器         |
| `tip`     | 自定义提示文案           |
| `file`    | 自定义文件项渲染         |
