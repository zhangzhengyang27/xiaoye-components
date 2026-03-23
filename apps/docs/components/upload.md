---
title: Upload 上传
description: 适合附件上传、图片上传和补充材料提交。
---

# Upload 上传

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `UploadFileItem[]` | `[]` | 当前文件列表 |
| `accept` | `string` | `""` | 原生文件类型限制 |
| `multiple` | `boolean` | `false` | 是否支持多选 |
| `maxCount` | `number` | `undefined` | 最大文件数量 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `drag` | `boolean` | `false` | 是否启用拖拽上传 |
| `tip` | `string` | `""` | 上传提示文案 |
| `size` | `"sm" \| "md" \| "lg"` | `继承全局配置` | 组件尺寸 |

`UploadFileItem` 结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `uid` | `string` | 文件唯一标识 |
| `name` | `string` | 文件名 |
| `size` | `number` | 文件大小 |
| `type` | `string` | MIME 类型 |
| `status` | `"ready"` | 当前状态 |
| `raw` | `File` | 原始文件对象 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(files: UploadFileItem[])` | 更新文件列表 |
| `change` | `(files: UploadFileItem[])` | 文件列表变化 |
| `remove` | `(file: UploadFileItem)` | 删除文件 |
| `exceed` | `(files: File[])` | 超过数量限制时触发 |

## 可访问性约定

- 上传触发区支持 `Enter / Space` 打开文件选择。
- 拖拽态和错误态会给出明确视觉反馈。
- 在表单中会把校验消息关联到上传触发区。

