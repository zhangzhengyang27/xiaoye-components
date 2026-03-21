---
title: Config Provider 全局配置
---

# Config Provider 全局配置

用于在应用根部统一设置默认尺寸、命名空间和弹层层级。

## 基础用法

```vue
<template>
  <xy-config-provider size="sm" :z-index="3000">
    <app />
  </xy-config-provider>
</template>
```

## 它适合解决什么问题

- 统一一整套表单组件的默认尺寸。
- 为多套样式并存的场景切换命名空间。
- 统一弹层类组件的基础层级。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `namespace` | 全局命名空间 | `string` | `'xy'` |
| `locale` | 全局文案对象 | `Record<string, string>` | `{}` |
| `z-index` | 基础层级 | `number` | `2000` |
| `size` | 默认尺寸 | `ComponentSize` | `'md'` |
