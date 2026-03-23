---
title: DatePicker 日期选择器
description: 适合中后台筛选栏和表单中的单日期选择。
---

# DatePicker 日期选择器

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `null` | 当前日期，格式为 `YYYY-MM-DD` |
| `placeholder` | `string` | `"请选择日期"` | 占位文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `clearable` | `boolean` | `false` | 是否支持清空 |
| `size` | `"sm" \| "md" \| "lg"` | `继承全局配置` | 组件尺寸 |
| `min` | `string` | `undefined` | 最小可选日期 |
| `max` | `string` | `undefined` | 最大可选日期 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(value: string \| null)` | 更新日期值 |
| `change` | `(value: string \| null)` | 选中值变化 |
| `clear` | `()` | 清空日期 |
| `visibleChange` | `(value: boolean)` | 面板开关状态 |
| `focus` | `()` | 打开面板时触发 |
| `blur` | `()` | 关闭面板时触发 |

## 可访问性约定

- 触发器使用 `combobox` 语义。
- 支持 `Enter / Space / ArrowDown` 打开面板。
- 面板中支持方向键移动日期，`Enter / Space` 选中，`Escape` 关闭。
- 表单场景下会把错误消息关联到 `aria-describedby`。

