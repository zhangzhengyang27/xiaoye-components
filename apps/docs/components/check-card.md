---
title: Check Card 选择卡片
description: 用卡片式信息块承接单选、多选和方案切换。
outline: deep
---

# Check Card 选择卡片

`xy-check-card` 和 `xy-check-card-group` 适合把“选项”渲染成更完整的信息块。比普通单选更适合套餐切换、场景入口选择、模板挑选和后台工作台导航。

## 单卡片

:::demo 单个 `xy-check-card` 适合承接启用/停用这类布尔切换，也可以作为更重的功能入口卡片。
check-card/basic
:::

## 单选卡片组

:::demo `xy-check-card-group` 默认是单选模式，再次点击当前项会取消选中。
check-card/group
:::

## 多选卡片组

:::demo 开启 `multiple` 后，适合权限模块、导出维度和展示能力组合选择。
check-card/multiple
:::

## 插槽自定义

:::demo 支持统一插槽，也支持 `title-值`、`avatar-值`、`extra-值` 这类按 value 定向覆盖。
check-card/slots
:::

## API

### CheckCard Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 是否选中 | `boolean` | `false` |
| `size` | 卡片尺寸 | `ComponentSize` | 跟随全局配置 |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `title` | 标题文本 | `string` | `''` |
| `description` | 描述文本 | `string` | `''` |
| `extra` | 右上角轻操作文案 | `string` | `''` |
| `avatar` | 头像配置 | `CheckCardAvatar` | — |
| `tag` | 标题旁标签 | `string \| CheckCardTag` | — |
| `aria-label` | 无障碍标签 | `string` | `''` |

### CheckCard Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中状态变化时触发 | `(checked: boolean) => void` |
| `change` | 选中状态变化时触发 | `(checked: boolean) => void` |
| `extra` | 点击右上角操作区时触发 | `() => void` |

### CheckCard Slots

| 插槽 | 说明 |
| --- | --- |
| `avatar` | 自定义头像区 |
| `title` | 自定义标题区 |
| `tag` | 自定义标签区 |
| `description` | 自定义描述区 |
| `extra` | 自定义右上角轻操作区 |

### CheckCardAvatar

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `text` | 默认文字头像内容 | `string` |
| `icon` | 图标头像图标名 | `string` |
| `src` | 图片头像地址 | `string` |
| `alt` | 图片替代文本 | `string` |
| `src-set` | 图片 `srcset` | `string` |
| `fit` | 图片裁切方式 | `AvatarFit` |
| `shape` | 头像形状 | `AvatarShape` |
| `size` | 头像尺寸 | `number \| ComponentSize` |

### CheckCardGroup Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前值 | `CheckCardSingleValue \| CheckCardValue[]` | — |
| `options` | 卡片组数据 | `CheckCardGroupOption[]` | `[]` |
| `size` | 组内默认尺寸 | `ComponentSize` | — |
| `disabled` | 是否整组禁用 | `boolean` | `false` |
| `multiple` | 是否多选 | `boolean` | `false` |
| `aria-label` | 无障碍标签 | `string` | `''` |

### CheckCardGroup Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 当前值变化时触发 | `(value: CheckCardSingleValue \| CheckCardValue[]) => void` |
| `change` | 当前值变化时触发 | `(value: CheckCardSingleValue \| CheckCardValue[]) => void` |
| `extra` | 某一项操作区被点击时触发 | `(option: CheckCardGroupOption) => void` |

### CheckCardGroup Slots

| 插槽 | 说明 |
| --- | --- |
| `avatar` | 所有项共用头像插槽 |
| `title` | 所有项共用标题插槽 |
| `tag` | 所有项共用标签插槽 |
| `description` | 所有项共用描述插槽 |
| `extra` | 所有项共用操作区插槽 |

额外说明：

- 支持按值定向插槽覆盖，例如 `title-dashboard`、`avatar-report`、`extra-export`
- 当同一位置同时存在通用插槽和按值插槽时，按值插槽优先
