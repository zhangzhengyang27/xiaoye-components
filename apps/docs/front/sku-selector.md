---
title: SkuSelector SKU选择器
description: 商品SKU规格选择器组件
outline: deep
---

# SkuSelector SKU选择器

商品SKU规格选择器，支持颜色、尺寸、图片等多种规格类型，根据库存矩阵自动计算可选规格。

## 基础用法

:::demo sku-selector/basic
basic
:::

## 颜色规格

:::demo sku-selector/color
color
:::

## 图片规格

:::demo sku-selector/image
image
:::

## 库存联动

:::demo sku-selector/stock
stock
:::

## 自定义插槽

:::demo sku-selector/slots
slots
:::

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `dimensions` | 规格维度列表 | `SkuDimension[]` | `[]` |
| `v-model` | 选中的规格值 | `Record<string, string>` | `{}` |
| `matrix` | SKU库存矩阵 | `SkuMatrix` | `{}` |
| `show-stock` | 显示库存信息 | `boolean` | `true` |
| `disabled` | 禁用选择器 | `boolean` | `false` |

### SkuDimension 类型

```ts
interface SkuDimension {
  name: string;                    // 规格名称
  type: 'color' | 'size' | 'image' | 'text'; // 规格类型
  options: SkuOption[];             // 规格选项
}
```

### SkuOption 类型

```ts
interface SkuOption {
  value: string;      // 选项值
  label?: string;     // 显示文本
  color?: string;     // 颜色值（type=color时）
  image?: string;     // 图片地址（type=image时）
  disabled?: boolean;  // 是否禁用
}
```

### SkuMatrix 类型

```ts
interface SkuMatrix {
  [key: string]: {
    stock: number;    // 库存数量
    price?: number;   // 价格（可选）
  };
}
```

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化 | `(value: Record<string, string>)` |
| `change` | 选中值变化 | `(value: Record<string, string>)` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| `dimension-label` | 自定义规格名称 | `{ dimension: SkuDimension }` |
| `option` | 自定义选项内容 | `{ option, active, disabled }` |
| `stock` | 自定义库存显示 | `{ totalStock, available }` |
