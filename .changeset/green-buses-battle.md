---
"xiaoye-components": minor
---

将 `xy-icon` 切换为基于 Iconify 的图标方案。

- 移除 `name` 属性，改为必填的 `icon` 字符串标识
- 移除 `BuiltinIconName` 类型导出和内建图标集合
- `xy-icon` 继续保留 `size`、`rotate`、`spin` 包装能力
