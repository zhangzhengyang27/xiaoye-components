---
title: Icon 图标
---

# Icon 图标

用于渲染基于 Iconify 的图标标识，适合搭配按钮、提示和状态说明使用。

## 基础用法

<xy-space>
  <xy-icon icon="mdi:magnify" />
  <xy-icon icon="mdi:information-outline" />
  <xy-icon icon="mdi:close" />
  <xy-icon icon="mdi:chevron-down" />
  <xy-icon icon="mdi:loading" spin />
</xy-space>

```vue
<xy-icon icon="mdi:magnify" />
<xy-icon icon="mdi:loading" spin />
```

## 使用说明

- `icon` 需要传入 Iconify 图标标识，例如 `mdi:magnify`。
- 当前文档示例统一使用 `mdi` 图标集。
- 默认方案依赖客户端渲染，不在本次范围内处理 SSR 首屏 SVG、离线图标包和严格 CSP 场景。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `icon` | Iconify 图标标识 | `string` | - |
| `size` | 图标尺寸 | `number \| string` | `16` |
| `rotate` | 旋转角度 | `number` | `0` |
| `spin` | 是否旋转动画 | `boolean` | `false` |
