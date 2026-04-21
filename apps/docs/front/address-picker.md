---
title: AddressPicker 地址选择器
description: 中国省市区三级联动地址选择器
outline: deep
---

# AddressPicker 地址选择器

中国省市区三级联动地址选择器，支持搜索、常用地址和详细地址输入。

## 基础用法

:::demo address-picker/basic
basic
:::

## 完整地址

:::demo address-picker/full
full
:::

## 常用地址

:::demo address-picker/recent
recent
:::

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 选中的地址 | `AddressValue` | `{}` |
| `placeholder` | 占位文本 | `string` | `"请选择省/市/区"` |
| `display-format` | 显示格式 | `'text' \| 'full'` | `'text'` |
| `show-street` | 显示详细地址输入 | `boolean` | `true` |
| `recent-addresses` | 常用地址列表 | `RecentAddress[]` | `[]` |
| `disabled` | 禁用选择器 | `boolean` | `false` |
| `clearable` | 显示清除按钮 | `boolean` | `true` |
| `size` | 输入框尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |

### AddressValue 类型

```ts
interface AddressValue {
  province?: string;  // 省份
  city?: string;      // 城市
  district?: string;  // 区县
  street?: string;    // 详细地址
  postalCode?: string; // 邮政编码
}
```

### RecentAddress 类型

```ts
interface RecentAddress {
  label: string;           // 显示标签
  value: AddressValue;     // 地址值
}
```

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 地址变化 | `(value: AddressValue)` |
| `change` | 地址变化 | `(value: AddressValue)` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| `recent-item` | 自定义常用地址项 | `{ address, select }` |

### 依赖

此组件内部使用了以下 xiaoye-components 组件：

- `xy-icon` - 图标
- `xy-input` - 输入框
