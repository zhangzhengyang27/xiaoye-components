---
title: Breadcrumb 面包屑
description: 支持字符或图标分隔、链接跳转和当前页语义的面包屑组件。
outline: deep
---

# Breadcrumb 面包屑

`xy-breadcrumb` 用来表达页面层级和当前位置，适合详情页、后台多级目录、抽屉页和设置流程顶部。采用父子拆分结构，同时补了 `href / target / disabled / ariaLabel`，同时保留 `to / replace` 兼容口。

## 基础用法

:::demo 默认使用字符分隔符，最后一项表示当前页，不参与跳转。
breadcrumb/basic
:::

## 图标分隔符

:::demo 当页面本身视觉更强调流程感时，可以直接把分隔符切成图标。
breadcrumb/icon-separator
:::

## 后台页面路径

:::demo 这类场景最常见于后台详情页、对账页和运营页顶部，用来快速表达当前页面所处的业务层级。
breadcrumb/admin-path
:::

## 声明式 items

:::demo 当层级数据本身就来自路由元信息或接口返回时，可以直接传 `items` 数组。
breadcrumb/items
:::

## 链接与禁用态

:::demo `href / target / disabled` 适合纯链接导航；`to / replace` 兼容 Vue Router 风格，但需要宿主项目提供 `$router`。
breadcrumb/navigation
:::

## 使用提示

- 最后一项默认表示当前页，会自动带上 `aria-current="page"`，同时不参与跳转。
- `separatorIcon` 使用当前仓库统一的字符串图标名，例如 `mdi:chevron-right`；存在时会覆盖字符 `separator`。
- `to / replace` 只在宿主项目已注入 `$router` 时生效；没有 router 时建议优先使用 `href`。
- `disabled` 会移除可点击语义并输出 `aria-disabled="true"`。

## API

### Breadcrumb Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `separator` | 字符分隔符 | `string` | `'/'` |
| `separator-icon` | 图标分隔符 | `string` | `''` |
| `aria-label` | 导航区无障碍标签 | `string` | `'面包屑'` |
| `items` | 声明式面包屑项数组 | `BreadcrumbItemData[]` | `[]` |

### Breadcrumb Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 面包屑项列表，通常传入 `xy-breadcrumb-item` |

### BreadcrumbItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `to` | 路由目标，宿主项目存在 `$router` 时优先走路由导航 | `string \| Record<string, unknown>` | `''` |
| `replace` | 路由跳转时是否替换历史记录 | `boolean` | `false` |
| `href` | 原生链接地址 | `string` | `''` |
| `target` | 原生链接目标 | `LinkTarget` | `'_self'` |
| `disabled` | 是否禁用当前项 | `boolean` | `false` |

### BreadcrumbItem Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 面包屑文案 |

### CSS Variables

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| `--xy-breadcrumb-font-size` | 组件字号 | `14px` |
| `--xy-breadcrumb-color` | 普通项颜色 | `var(--xy-text-color-secondary)` |
| `--xy-breadcrumb-link-color` | 可点击项颜色 | `color-mix(in srgb, var(--xy-color-primary) 92%, black)` |
| `--xy-breadcrumb-current-color` | 当前页颜色 | `var(--xy-text-color)` |
| `--xy-breadcrumb-separator-gap` | 分隔符左右间距 | `10px` |
| `--xy-breadcrumb-separator-color` | 分隔符颜色 | `color-mix(in srgb, var(--xy-text-color-secondary) 68%, white)` |
