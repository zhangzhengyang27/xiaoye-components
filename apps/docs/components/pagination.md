---
title: Pagination 分页
---

<script setup lang="ts">
import { ref } from "vue";

const currentPage = ref(1);
const pageSize = ref(10);
</script>

# Pagination 分页

用于列表页分页切换，支持当前页、每页条数和总条数联动。

## 基础用法

<xy-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="86"
/>

```vue
<xy-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="86"
/>
```

## 适合放在哪

- 列表页底部。
- 查询结果页的内容区域下方。
- 与 `xy-table` 组合成后台列表闭环。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `current-page` | 当前页码 | `number` | `1` |
| `page-size` | 每页条数 | `number` | `10` |
| `total` | 总条数 | `number` | — |
| `page-sizes` | 可选每页条数 | `number[]` | `[10, 20, 50]` |
| `disabled` | 是否禁用分页操作 | `boolean` | `false` |

## 事件

| 事件 | 说明 |
| --- | --- |
| `update:currentPage` | 当前页变化时触发 |
| `update:pageSize` | 每页条数变化时触发 |
| `change` | 页码或页大小变化时统一触发 |
