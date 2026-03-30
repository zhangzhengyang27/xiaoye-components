---
title: Menu 菜单
description: 支持横向、纵向、折叠、受控状态和 items 数据驱动的声明式导航菜单。
outline: deep
---

# Menu 菜单

`xy-menu` 用于承接站点主导航、后台侧栏、工作台模块切换和资源入口列表。采用 `xy-menu / xy-sub-menu / xy-menu-item / xy-menu-item-group` 的插槽式子组件结构，并支持受控状态和 `items` 数据驱动能力。

> 可通过自定义样式类覆写 `--xy-menu-horizontal-height` 来调整横向菜单高度，例如：
>
> ```css
> .your-menu-shell .xy-menu--horizontal {
>   --xy-menu-horizontal-height: 64px;
> }
> ```

## 顶部横向菜单

:::demo 顶部导航适合搭配工作台、订单、设置等一级入口。横向模式下支持 hover 或 click 打开子菜单。
menu/basic
:::

## 左右分区导航

:::demo 不新增组件 prop，只通过示例级样式把品牌入口固定在左侧，把工作区和操作入口推到右侧。
menu/left-and-right
:::

## 侧栏纵向菜单

:::demo 纵向模式适合后台侧栏。默认激活项会自动展开它的祖先路径，菜单分组也适合做模块内的功能分区。
menu/vertical
:::

## 折叠菜单

:::demo 折叠只在纵向模式下生效。折叠后一级菜单会缩成图标列，子菜单通过弹出层呈现。
menu/collapse
:::

## 受控状态

:::demo 通过 `active-index`、`opened-menus` 和对应的 `update:*` 事件，可以把菜单状态交给外部业务层维护。
menu/controlled
:::

## items 数据驱动菜单树

:::demo `items` 适合后台业务直接从配置生成菜单树。若同时传 `items` 和默认插槽，会优先渲染默认插槽，并在开发环境给出提示。
menu/items
:::

## 横向溢出与 Popper Offset

:::demo 当横向菜单宽度不足时，会把超出的一级项收进“更多”入口。这个示例也演示了菜单级和子菜单级的 `popper-offset`。
menu/overflow-offset
:::

## 何时使用

- 需要一套声明式导航结构，而不是把导航树手写成普通列表。
- 需要在纵向模式里管理展开状态、唯一展开和默认激活项。
- 需要在横向模式下承接一级导航与二级弹出菜单。
- 需要在业务层直接控制激活项、展开项，或者从配置数据动态生成导航树。

## Menu API

### Menu Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `mode` | 菜单展示模式 | `'horizontal' \| 'vertical'` | `'vertical'` |
| `default-active` | 初始激活项 `index` | `string` | `''` |
| `default-openeds` | 初始展开的子菜单索引集合 | `string[]` | `[]` |
| `active-index` | 受控激活项 `index` | `string` | `undefined` |
| `opened-menus` | 受控展开的子菜单索引集合 | `string[]` | `undefined` |
| `unique-opened` | 是否同一层只允许展开一个子菜单 | `boolean` | `false` |
| `router` | 是否启用路由模式 | `boolean` | `false` |
| `menu-trigger` | 横向模式下子菜单触发方式 | `'hover' \| 'click'` | `'hover'` |
| `collapse` | 是否折叠，仅纵向模式生效 | `boolean` | `false` |
| `items` | 数据驱动菜单树，和默认插槽二选一 | `MenuDataItem[]` | `undefined` |
| `permission-checker` | `items` 模式下的权限判定函数 | `(permission, item) => boolean` | `undefined` |
| `ellipsis` | 横向模式宽度不足时是否启用收纳 | `boolean` | `true` |
| `popper-offset` | 所有弹出子菜单的偏移量 | `number` | `6` |
| `ellipsis-icon` | 横向收纳入口图标 | `string \| Component` | `'mdi:dots-horizontal'` |
| `popper-effect` | 弹出菜单主题 | `'dark' \| 'light' \| string` | `'dark'` |
| `popper-class` | 弹出菜单自定义类名 | `string` | `''` |
| `popper-style` | 弹出菜单自定义样式 | `StyleValue` | `undefined` |
| `show-timeout` | 弹出菜单显示延迟 | `number` | `300` |
| `hide-timeout` | 弹出菜单隐藏延迟 | `number` | `300` |
| `close-on-click-outside` | 点击外部时是否关闭已展开菜单 | `boolean` | `false` |
| `collapse-transition` | 是否启用纵向折叠过渡 | `boolean` | `true` |
| `persistent` | 关闭后是否保留弹出菜单 DOM | `boolean` | `true` |
| `background-color` | 菜单背景色兼容属性 | `string` | `''` |
| `text-color` | 菜单文字色兼容属性 | `string` | `''` |
| `active-text-color` | 激活项文字色兼容属性 | `string` | `''` |

### Menu Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `select` | 菜单项被选中时触发 | `(index, indexPath, item, routerResult?)` |
| `open` | 子菜单展开时触发 | `(index, indexPath)` |
| `close` | 子菜单收起时触发 | `(index, indexPath)` |
| `update:activeIndex` | 受控模式下激活项变化时触发 | `(index)` |
| `update:openedMenus` | 受控模式下展开项集合变化时触发 | `(indexes)` |

### Menu Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 放置 `xy-menu-item`、`xy-sub-menu`、`xy-menu-item-group`；若同时传 `items`，默认插槽优先 |

### Menu Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `open` | 主动展开指定子菜单 | `(index: string) => void` |
| `close` | 主动收起指定子菜单 | `(index: string) => void` |
| `handleResize` | 手动重新计算横向溢出状态 | `() => void` |
| `updateActiveIndex` | 主动更新当前激活项 | `(index: string) => void` |

## SubMenu API

### SubMenu Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `index` | 子菜单唯一标识 | `string` | — |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `teleported` | 弹出菜单是否 Teleport 到 body | `boolean` | `undefined` |
| `popper-offset` | 当前子菜单弹出偏移量 | `number` | `undefined` |
| `popper-class` | 当前子菜单弹出类名 | `string` | `''` |
| `popper-style` | 当前子菜单弹出样式 | `StyleValue` | `undefined` |
| `show-timeout` | 当前子菜单显示延迟 | `number` | `undefined` |
| `hide-timeout` | 当前子菜单隐藏延迟 | `number` | `undefined` |
| `expand-close-icon` | 展开模式关闭图标 | `string \| Component` | `undefined` |
| `expand-open-icon` | 展开模式打开图标 | `string \| Component` | `undefined` |
| `collapse-close-icon` | 折叠模式关闭图标 | `string \| Component` | `undefined` |
| `collapse-open-icon` | 折叠模式打开图标 | `string \| Component` | `undefined` |

### SubMenu Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 子菜单标题 |
| `default` | 子菜单内容 |

## MenuItem API

### MenuItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `index` | 菜单项唯一标识 | `string` | — |
| `route` | 路由模式下的跳转目标 | `RouteLocationRaw` | `undefined` |
| `disabled` | 是否禁用 | `boolean` | `false` |

### MenuItem Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 点击菜单项时触发 | `(item: MenuItemRegistered) => void` |

### MenuItem Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 菜单项前置内容，常用于图标 |
| `title` | 菜单项正文；在折叠态一级菜单项中会自动作为 Tooltip 内容 |

## MenuItemGroup API

### MenuItemGroup Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 分组标题 | `string` | `''` |

### MenuItemGroup Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 分组标题 |
| `default` | 分组内容 |

## MenuDataItem API

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `index` | 节点唯一标识 | `string` |
| `label` | 节点显示文案 | `string` |
| `type` | 节点类型 | `'item' \| 'submenu' \| 'group'` |
| `children` | 子节点列表 | `MenuDataItem[]` |
| `disabled` | 是否禁用 | `boolean` |
| `route` | 路由模式下的跳转目标 | `RouteLocationRaw` |
| `icon` | 前置图标 | `string \| Component` |
| `badge` | 徽标文案 | `string \| number` |
| `extraText` | 右侧附加信息 | `string` |
| `hidden` | 是否直接裁剪节点 | `boolean` |
| `permission` | 权限标识，交给 `permission-checker` 决定是否可见 | `string \| string[]` |
