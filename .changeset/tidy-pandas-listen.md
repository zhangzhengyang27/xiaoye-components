---
"xiaoye-components": minor
---

Table 类型增强：`rowKey` 的 `TablePath` 派生现在支持可选属性的深层路径（如 `meta.identity.id`）；从包根补齐导出 `TableRowClassNameContext`、`TableHeaderRowContext`、`TableHeaderCellContext` 三个回调上下文类型。同时 `tests/types` 类型夹具全量挂载进 `typecheck:types`（原 105 个夹具中约 78 个未参与检查）。
