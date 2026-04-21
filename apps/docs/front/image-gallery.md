---
title: ImageGallery 图片画廊
description: 商品图片展示组件，支持缩略图切换和大图预览
outline: deep
---

# ImageGallery 图片画廊

商品图片展示组件，支持多图缩略图切换、大图预览和灯箱模式。

## 基础用法

:::demo image-gallery/basic
basic
:::

## 缩略图位置

:::demo image-gallery/thumbnail-position
thumbnail-position
:::

## 隐藏缩略图

:::demo image-gallery/no-thumbnails
no-thumbnails
:::

## 隐藏计数器

:::demo image-gallery/no-counter
no-counter
:::

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `images` | 图片列表 | `ImageGalleryImage[]` | `[]` |
| `initial-index` | 初始显示索引 | `number` | `0` |
| `show-thumbnails` | 显示缩略图 | `boolean` | `true` |
| `thumbnail-position` | 缩略图位置 | `'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `thumbnail-width` | 缩略图宽度 | `number` | `80` |
| `thumbnail-height` | 缩略图高度 | `number` | `80` |
| `zoomable` | 启用缩放 | `boolean` | `true` |
| `rotatable` | 启用旋转 | `boolean` | `true` |
| `show-counter` | 显示计数器 | `boolean` | `true` |

### ImageGalleryImage 类型

```ts
interface ImageGalleryImage {
  src: string;       // 图片地址
  thumbnail?: string; // 缩略图地址（可选，默认使用 src）
  alt?: string;      // 图片描述
}
```

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `change` | 切换图片时触发 | `(index: number)` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| `thumbnail` | 自定义缩略图 | `{ image, index, active }` |
| `overlay` | 自定义图片覆盖层 | `{ image, index }` |

### 依赖

此组件内部使用了以下 xiaoye-components 组件：

- `xy-image` - 图片展示
- `xy-icon` - 图标
- `xy-image-viewer` - 图片预览器
