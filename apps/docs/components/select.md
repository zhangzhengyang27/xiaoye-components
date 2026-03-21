---
title: Select 选择器
description: 单选下拉、搜索过滤和中后台筛选栏的基础选择器。
outline: deep
---

<script setup lang="ts">
import { ref } from "vue";

const basicValue = ref<string | number | null>("active");
const searchValue = ref<string | number | null>(null);
const options = [
  { label: "全部状态", value: "all" },
  { label: "已启用", value: "active", description: "可继续执行后续操作" },
  { label: "已停用", value: "inactive", description: "当前不可被选择" },
  { label: "已归档", value: "archived", disabled: true, description: "历史数据，不允许修改" }
];
</script>

# Select 选择器

<p class="xy-doc-lead">
  `xy-select` 用于单值选择，当前版本优先覆盖后台筛选栏和表单枚举值录入，重点是“单选 + 搜索 + 清空 + 键盘导航”。
</p>

## 基础用法

<div class="xy-doc-stack">
  <xy-select
    v-model="basicValue"
    :options="options"
    placeholder="请选择状态"
  />
  <xy-tag status="primary">当前值：{{ basicValue ?? "未选择" }}</xy-tag>
</div>

```vue
<xy-select
  v-model="status"
  :options="options"
  placeholder="请选择状态"
/>
```

## 搜索、清空与描述文案

<div class="xy-doc-stack">
  <xy-select
    v-model="searchValue"
    :options="options"
    searchable
    clearable
    placeholder="角色筛选"
    no-match-text="没有符合条件的选项"
  />
  <xy-tag :status="searchValue ? 'success' : 'neutral'">
    当前筛选：{{ searchValue ?? "未选择" }}
  </xy-tag>
</div>

选项对象支持 `description` 字段，适合在后台场景里补充状态解释或二级信息。

## 键盘与表单行为

- `ArrowDown / ArrowUp` 在可选项之间移动。
- `Enter / Space` 选择当前高亮项。
- `Escape` 关闭下拉，并把焦点还给触发器。
- 放在 `xy-form-item` 内部时，会自动关联错误信息并参与 `blur / change` 校验。

## 何时使用

- 筛选栏的状态、角色、类型筛选。
- 表单中的固定枚举值选择。
- 需要保留键盘操作和清空动作的后台选择场景。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前选中值 | `string \| number \| null` | `null` |
| `options` | 选项列表 | `SelectOption<T>[]` | — |
| `placeholder` | 未选择时的占位提示 | `string` | `'请选择'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否允许清空当前选中值 | `boolean` | `false` |
| `searchable` | 是否启用搜索输入 | `boolean` | `false` |
| `size` | 组件尺寸 | `'sm' \| 'md' \| 'lg'` | 跟随全局配置 |
| `no-data-text` | 无选项时的文案 | `string` | `'暂无选项'` |
| `no-match-text` | 搜索无结果时的文案 | `string` | `'没有匹配项'` |

## 事件

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 选中值变化时触发 | `string \| number \| null` |
| `change` | 选中值确认变化时触发 | `string \| number \| null` |
| `clear` | 点击清空按钮时触发 | — |
| `visible-change` | 下拉打开或关闭时触发 | `boolean` |
| `focus` | 下拉打开时触发 | — |
| `blur` | 下拉关闭时触发 | — |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| — | 当前版本无公开插槽，选项展示通过 `options` 的 `label / description / disabled` 字段控制 |

## 选项结构

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 选项展示文案 | `string` | — |
| `value` | 选项值 | `string \| number` | — |
| `disabled` | 是否禁用该选项 | `boolean` | `false` |
| `description` | 辅助描述信息 | `string` | `undefined` |

## 可访问性与行为约定

- 使用 `combobox / listbox / option` 语义。
- 当前高亮项会通过 `aria-activedescendant` 关联到触发器。
- 当组件位于 `xy-form-item` 内部时，会自动关联 `aria-describedby` 和错误状态。
