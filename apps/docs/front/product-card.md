---
title: ProductCard 商品卡片
description: 商品展示卡片组件，支持多图切换、价格展示和多种状态
outline: deep
---

# ProductCard 商品卡片

商品展示卡片组件，适用于电商场景，支持多图切换、价格展示、标签、售罄/下架状态。

## 基础用法

:::demo product-card/basic
basic
:::

## 多图商品

:::demo product-card/multiple
multiple
:::

## 标签展示

:::demo product-card/tags
tags
:::

## 横向布局

:::demo product-card/horizontal
horizontal
:::

## 状态

:::demo product-card/status
status
:::

## 自定义插槽

:::demo product-card/slots
slots
:::

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `image` | 图片地址，支持单图或图片数组 | `string \| string[]` | `""` |
| `title` | 商品标题 | `string` | `""` |
| `description` | 商品描述 | `string` | `""` |
| `price` | 现价 | `number \| string` | `""` |
| `original-price` | 原价（划线价） | `number \| string` | `""` |
| `tags` | 标签列表 | `ProductCardTag[]` | `[]` |
| `stock` | 库存数量 | `number` | `undefined` |
| `status` | 商品状态 | `'online' \| 'offline' \| 'soldout'` | `'online'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `horizontal` | 是否横向布局 | `boolean` | `false` |

### ProductCardTag 类型

```ts
interface ProductCardTag {
  text: string;              // 标签文本
  type?: 'primary' | 'success' | 'warning' | 'danger'; // 标签类型
}
```

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `image` | 自定义图片区域 |
| `header` | 自定义头部区域 |
| `footer` | 自定义底部操作区 |
| `actions` | 自定义操作按钮 |

### 依赖

此组件内部使用了以下 xiaoye-components 组件：

- `xy-image` - 图片展示
- `xy-badge` - 标签展示
- `xy-icon` - 图标
