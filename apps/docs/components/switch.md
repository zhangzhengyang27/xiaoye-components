---
title: Switch 开关
description: 用于二值状态切换、功能启停和轻量模式切换的基础组件。
outline: deep
---

# Switch 开关

`xy-switch` 适合启用/停用、公开/私密、自动/手动这类二值状态切换场景。和 `radio` 不同，它强调的是当前状态的即时切换，而不是一组互斥选项中的选择。

## 何时使用

- 需要表达"开启/关闭"这类即时生效的二值状态切换。
- 需要在设置面板、权限管理或功能开关中控制启停。
- 需要配合 `before-change` 做异步确认（如关闭功能前弹出确认）。

## 何时不使用

- 需要在多个互斥选项中选择一个时，优先使用 `xy-radio-group`。
- 需要表达多选状态时，优先使用 `xy-checkbox-group`。
- 需要表达"加载中"状态时，优先使用 `xy-button` 的 `loading` 属性。

## 最佳实践

### Switch vs Radio vs Checkbox

| 场景 | 推荐组件 |
|------|----------|
| 即时生效的二值切换（开/关） | `xy-switch` |
| 互斥选项中选一个 | `xy-radio-group` |
| 多选 | `xy-checkbox-group` |

### 异步确认模式

涉及不可逆操作时（如关闭重要功能），建议配合 `before-change` 做二次确认：

```vue
<xy-switch
  v-model="enabled"
  :before-change="handleBeforeChange"
/>

<script setup lang="ts">
async function handleBeforeChange(val: boolean) {
  if (!val) {
    return await confirmDialog('确认关闭此功能？')
  }
  return true
}
</script>
```

### 枚举值绑定

当后端字段不是布尔值时，使用 `active-value` / `inactive-value` 映射：

```vue
<xy-switch
  v-model="status"
  active-value="ENABLED"
  inactive-value="DISABLED"
/>
```

## 基础用法

:::demo 最常见的用法是直接用 `v-model` 绑定布尔值，再通过 `active-text / inactive-text` 说明状态语义。
switch/basic
:::

## 文案、图标和枚举值

:::demo `active-value / inactive-value` 适合和后端枚举值直连，`inline-prompt` 适合空间更紧凑的场景。
switch/text
:::

## 状态插槽

:::demo 当你需要更强的语义表达时，优先使用 `active / inactive / active-action / inactive-action` 插槽，而不是继续堆叠文本属性。
switch/slots
:::

## 方法与可访问性

:::demo `xy-switch` 暴露了 `focus` 和 `checked`，适合接入步骤流、快捷键聚焦和无障碍引导。
switch/methods
:::

## 禁用、加载与切换前校验

:::demo `loading` 会临时锁定交互，`before-change` 适合异步确认或前置校验。
switch/loading
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，`xy-switch` 会在状态变更后参与 `change` 校验。
switch/form
:::

## 行为约定

- 点击组件主体会切换状态。
- `Space` 使用原生 checkbox 语义切换，`Enter` 也支持手动触发切换。
- `loading` 和 `disabled` 都会阻止交互。
- `before-change` 返回 `false`，或返回的 Promise reject 时，不会切换状态。
- 建议在无可见文案时补 `aria-label`，便于读屏和自动化测试识别。

## API

### Switch Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前值 | `SwitchProps["modelValue"]` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否显示加载态并阻止交互 | `boolean` | `false` |
| `size` | 组件尺寸 | `SwitchProps["size"]` | 跟随全局配置 |
| `width` | 自定义轨道宽度 | `string \| number` | `undefined` |
| `inline-prompt` | 是否把状态内容放到轨道内部 | `boolean` | `false` |
| `inactive-action-icon` | 未选中时拇指内图标 | `string` | `''` |
| `active-action-icon` | 选中时拇指内图标 | `string` | `''` |
| `active-icon` | 选中状态图标 | `string` | `''` |
| `inactive-icon` | 未选中状态图标 | `string` | `''` |
| `active-text` | 选中状态文案 | `string` | `''` |
| `inactive-text` | 未选中状态文案 | `string` | `''` |
| `active-value` | 选中状态值 | `SwitchValue` | `true` |
| `inactive-value` | 未选中状态值 | `SwitchValue` | `false` |
| `name` | 原生 `name` | `string` | `undefined` |
| `validate-event` | 是否触发表单校验 | `boolean` | `true` |
| `before-change` | 切换前守卫 | `SwitchProps["beforeChange"]` | `undefined` |
| `id` | 原生 id | `string` | `undefined` |
| `tabindex` | 原生 tabindex | `string \| number` | `undefined` |
| `aria-label` | 原生 aria-label | `string` | `undefined` |

### Switch Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 状态变化时触发 | `SwitchValueChangeHandler` |
| `change` | 用户确认切换后触发 | `SwitchValueChangeHandler` |
| `input` | 状态变化时同步触发 | `SwitchValueChangeHandler` |
| `focus` | 获得焦点时触发 | `SwitchFocusHandler` |
| `blur` | 失去焦点时触发 | `SwitchFocusHandler` |

### Switch Slots

| 插槽 | 说明 |
| --- | --- |
| `active` | 自定义选中状态内容 |
| `inactive` | 自定义未选中状态内容 |
| `active-action` | 自定义选中状态拇指内容 |
| `inactive-action` | 自定义未选中状态拇指内容 |

### Switch Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `focus` | 聚焦开关 | `SwitchInstance["focus"]` |
| `checked` | 当前是否处于选中态 | `SwitchInstance["checked"]` |
