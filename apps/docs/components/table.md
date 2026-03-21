---
title: Table 表格
description: 后台列表页的数据展示、行交互和插槽扩展。
outline: deep
---

<script setup lang="ts">
import { ref } from "vue";

const activeRowId = ref<number | null>(null);
const loading = ref(false);

const rows = [
  { id: 1, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 2, name: "Sales Admin", owner: "Alice", status: "已上线" }
];

function rowClassName(row: { id: number }) {
  return row.id === activeRowId.value ? "doc-row-active" : "";
}

function handleRowClick(row: { id: number }) {
  activeRowId.value = row.id;
}
</script>

# Table 表格

<p class="xy-doc-lead">
  `xy-table` 用于后台列表页的数据展示。当前版本优先覆盖“读操作 + 行点击 + 加载态 + 空态 + 基础单元格插槽”这条高频路径。
</p>

## 基础用法

<div class="xy-doc-stack">
  <xy-table
    :columns="[
      { key: 'name', title: '项目名称', dataIndex: 'name' },
      { key: 'owner', title: '负责人', dataIndex: 'owner' },
      { key: 'status', title: '状态', dataIndex: 'status', slot: 'status' }
    ]"
    :data="rows"
    row-key="id"
    :row-class-name="rowClassName"
    clickable
    @row-click="handleRowClick"
  >
    <template #cell-status="{ value }">
      <xy-tag :status="value === '已上线' ? 'success' : 'warning'">
        {{ value }}
      </xy-tag>
    </template>
  </xy-table>

  <xy-tag :status="activeRowId ? 'success' : 'neutral'">
    当前行：{{ activeRowId ?? "未选择" }}
  </xy-tag>
</div>

```vue
<xy-table
  :columns="columns"
  :data="rows"
  row-key="id"
  clickable
  @row-click="handleRowClick"
>
  <template #cell-status="{ value }">
    <xy-tag>{{ value }}</xy-tag>
  </template>
</xy-table>
```

## 加载态与空态

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-button variant="outline" @click="loading = !loading">
      {{ loading ? "关闭加载态" : "开启加载态" }}
    </xy-button>
  </xy-space>

  <xy-table
    :columns="[
      { key: 'name', title: '项目名称', dataIndex: 'name' },
      { key: 'owner', title: '负责人', dataIndex: 'owner' }
    ]"
    :data="loading ? rows : []"
    :loading="loading"
    loading-text="正在加载项目列表"
  >
    <template #loading>
      正在同步项目数据，请稍候...
    </template>
    <template #empty>
      <xy-empty title="暂无项目" description="当前筛选条件没有返回结果" />
    </template>
  </xy-table>
</div>

:::tip 列表页语境
在后台项目里，表格通常不是孤立组件，而是和筛选栏、分页、空态、详情联动一起出现。因此这里优先展示组合行为，而不是只放静态数据。
:::

## 何时使用

- 列表页主数据展示。
- 需要按行点击联动右侧详情或状态栏。
- 希望通过统一的 `loading / empty` 插槽承载业务语义。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `columns` | 列定义数组 | `TableColumn<T>[]` | — |
| `data` | 数据数组 | `T[]` | — |
| `loading` | 是否显示加载态 | `boolean` | `false` |
| `striped` | 是否显示斑马纹 | `boolean` | `false` |
| `bordered` | 是否显示边框风格 | `boolean` | `false` |
| `empty-text` | 默认空态文案 | `string` | `'暂无数据'` |
| `loading-text` | 默认加载文案 | `string` | `'Loading...'` |
| `row-key` | 行唯一键字段或计算函数 | `keyof T \| ((row, rowIndex) => string \| number)` | `rowIndex` |
| `row-class-name` | 行 class 或 class 计算函数 | `string \| ((row, rowIndex) => string)` | `''` |
| `clickable` | 是否开启行聚焦和键盘交互 | `boolean` | `false` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `row-click` | 点击行或通过键盘激活行时触发 | `(row, rowIndex, event)` |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `loading` | 自定义加载态内容 |
| `empty` | 自定义空态内容 |
| `header-${key}` | 自定义指定列的表头内容 |
| `header-${slot}` | 基于 `column.slot` 的表头内容 |
| `cell-${key}` | 自定义指定列的单元格内容 |
| `cell-${slot}` | 基于 `column.slot` 的单元格内容 |

## 列配置

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `key` | 列唯一标识 | `string` | — |
| `title` | 列标题 | `string` | — |
| `dataIndex` | 读取行数据的字段名 | `keyof T` | `column.key` |
| `width` | 列宽 | `string \| number` | `undefined` |
| `align` | 列对齐方式 | `'left' \| 'center' \| 'right'` | `undefined` |
| `slot` | 自定义插槽后缀名 | `string` | `undefined` |
| `formatter` | 自定义格式化函数 | `(row, column, rowIndex) => unknown` | `undefined` |

## 可访问性与行为约定

- 开启 `clickable` 后，数据行会获得键盘焦点能力。
- 在 `clickable` 模式下，`Enter / Space` 会触发行点击逻辑。
- 组件通过 `aria-busy` 表达加载状态。

<style>
.doc-row-active td {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}
</style>
