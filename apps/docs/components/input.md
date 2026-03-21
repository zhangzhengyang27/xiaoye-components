---
title: Input 输入框
---

# Input 输入框

用于单行文本录入，适合搜索、名称输入、邮箱输入等轻量表单场景。

## 基础用法

<xy-space wrap>
  <xy-input placeholder="请输入关键字" />
  <xy-input placeholder="支持清空" clearable />
</xy-space>

```vue
<xy-input v-model="keyword" clearable placeholder="请输入关键字" />
```

## 前后缀内容

<xy-space wrap>
  <xy-input placeholder="搜索项目">
    <template #prefix>
      <xy-icon icon="mdi:magnify" />
    </template>
  </xy-input>
  <xy-input placeholder="只读内容" readonly>
    <template #suffix>
      <xy-tag size="sm">只读</xy-tag>
    </template>
  </xy-input>
</xy-space>

## 与表单联动

`xy-input` 在 `xy-form-item` 内部会自动参与校验：

- `change` 时触发 `change` 类规则。
- `blur` 时触发 `blur` 类规则。
- 点击清空按钮时会同步清除当前字段的校验状态。

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前值 | `string \| number` | `''` |
| `placeholder` | 占位文本 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否显示清空按钮 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `type` | 输入类型 | `'text' \| 'password' \| 'email' \| 'search' \| 'number'` | `'text'` |
| `size` | 组件尺寸 | `ComponentSize` | 继承全局配置 |

## 事件

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | 输入值变化时触发 |
| `change` | 原生 `change` 触发时返回当前字符串值 |
| `clear` | 点击清空按钮时触发 |
| `focus` | 获得焦点时触发 |
| `blur` | 失去焦点时触发 |

## 插槽

| 插槽 | 说明 |
| --- | --- |
| `prefix` | 输入框前缀内容 |
| `suffix` | 输入框后缀内容 |
