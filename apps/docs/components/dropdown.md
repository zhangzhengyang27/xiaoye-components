---
title: Dropdown 下拉菜单
description: 用于承载操作菜单，而不是承载值选择。
outline: deep
---

# Dropdown 下拉菜单

`xy-dropdown` 负责“操作菜单”，不是“值选择器”。采用复合组件结构，主路径推荐 `Dropdown + DropdownMenu + DropdownItem`；如果项目里已经在使用旧的 `items` 数组模式，也仍然兼容。

## 基础用法

:::demo 行操作菜单是 Dropdown 最典型的使用场景，适合把弱操作、危险操作和说明文案收进一个菜单里。
dropdown/basic
:::

## 动态位置与箭头

:::demo 在工具栏、表格行操作和卡片角标里，菜单位置往往需要根据页面结构切换，`show-arrow` 适合让浮层关系更清楚。
dropdown/dynamic-placement
:::

## 选择后保持展开

:::demo `hide-on-click` 适合连续操作、辅助说明或“看完再选”的菜单场景。
dropdown/manual-close
:::

## 触发方式与命令派发

:::demo `trigger` 支持数组写法，`trigger-keys` 可以按业务场景收敛成更明确的键盘入口。
dropdown/trigger-command
:::

## Split Button

:::demo 当一个主按钮还需要承接更多延伸操作时，可以切到 `split-button` 形态。
dropdown/split-button
:::

## 实例级样式收口

:::demo 当后台项目只想统一操作菜单的面板气质时，优先通过 `popper-class` 和实例级变量收口，而不是继续 deep 到内部类名。
dropdown/popper-class
:::

## items 兼容模式

:::demo 旧的 `items` 数组模式仍可用，适合渐进迁移；但新功能优先推荐复合组件写法。
dropdown/compatibility
:::

## Dropdown 与其他浮层的边界

- **Tooltip**：纯文案提示，不承载交互，不产出值。
- **Popover**：轻量说明或轻交互卡片，可以承载按钮和简单表单。
- **Popconfirm**：原地确认动作，自带 confirm/cancel 流程和异步 hook。
- **Dropdown**：操作菜单，产出命令（command）而非值（value）；如果你需要筛选枚举，优先用 `xy-select` / `xy-tree-select` / `xy-cascader`。

## 推荐入口与兼容入口

- **主路径（推荐）**：复合组件 `Dropdown + DropdownMenu + DropdownItem`，适合需要 icon、divided、description、自定义插槽的菜单。
- **兼容路径**：`items` 数组模式，适合简单菜单或渐进迁移旧页面；新功能不再以此为主入口。
- 两条路径共用 `command` 派发机制，区别在于复合组件可以逐项定制插槽和样式，`items` 只支持扁平配置。

## `hide-on-click` 与 `close-on-select` 的优先级

- `hide-on-click`：控制"选择菜单项后是否关闭面板"，是当前推荐的主属性。
- `close-on-select`：语义相同，是兼容别名。
- **优先级规则**：如果同时传入 `hide-on-click` 和 `close-on-select`，以 `hide-on-click` 为准。只传 `close-on-select` 时仍然生效，但新代码建议只写 `hide-on-click`。
- 默认行为：两个都不传时，选择后会自动关闭面板。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case） | 源码 / TS 写法（camelCase） |
| ---------------------- | --------------------------- |
| `model-value`          | `modelValue`                |
| `hide-on-click`        | `hideOnClick`               |
| `close-on-select`      | `closeOnSelect`             |
| `split-button`         | `splitButton`               |
| `button-props`         | `buttonProps`               |
| `trigger-keys`         | `triggerKeys`               |
| `open-delay`           | `openDelay`                 |
| `close-delay`          | `closeDelay`                |
| `show-after`           | `showAfter`                 |
| `hide-after`           | `hideAfter`                 |
| `max-height`           | `maxHeight`                 |
| `show-arrow`           | `showArrow`                 |
| `append-to`            | `appendTo`                  |
| `popper-class`         | `popperClass`               |
| `popper-style`         | `popperStyle`               |
| `virtual-ref`          | `virtualRef`                |
| `virtual-triggering`   | `virtualTriggering`         |
| `popper-options`       | `popperOptions`             |

其余属性（`items`、`placement`、`disabled`、`trigger`、`role`、`teleported`、`persistent`、`tabindex`、`loop`）为单词形式，模板与源码写法一致，无需转换。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |

其余事件（`select`、`command`、`click`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## 实例级样式收口

- 后台项目如果只是想收口操作菜单的背景、边框、阴影、宽度或层级，优先使用 `popper-class`、`popper-style` 和 `max-height`。
- 不建议继续在页面层 deep 到 `.xy-dropdown__menu`、`.xy-dropdown__item`、`.xy-dropdown__group` 这类内部结构类名。

## role 与键盘路径

Dropdown 当前支持 roving tabindex 管理焦点，默认以 `menu` 语义渲染；如果是站点导航或快捷入口，也可以切到 `navigation` 语义。

## 键盘与行为约定

- `ArrowUp / ArrowDown / Home / End` 在菜单项之间移动。
- `Enter / Space` 选择当前高亮项；也可以通过 `trigger-keys` 定义触发区的打开键。
- `Escape` 关闭菜单并把焦点还给触发器。
- `Tab` 会关闭菜单；当前高亮项通过 roving tabindex 管理。

## 使用提示

- 推荐优先使用 `DropdownMenu / DropdownItem` 组合式 API，复杂内容和 item 级 icon/divided 都走这条路径。
- 旧的 `close-on-select` 仍然保留为兼容别名；如果同时传了 `hide-on-click`，以后者为准。
- `to / replace` 不属于 DropdownItem 的职责，这一层只负责命令和动作，不负责路由跳转。
- `virtual-ref / virtual-triggering` 和 `popper-options` 适合右键菜单、虚拟触发器和更细粒度的浮层控制。

## API

### Dropdown Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 受控显示状态 | `DropdownProps["modelValue"]` | `false` |
| `items` | 兼容模式下的菜单项列表 | `DropdownItem[]` | `[]` |
| `placement` | 菜单位置 | `Placement` | `'bottom-start'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `hide-on-click` | 选择后是否关闭 | `boolean` | `undefined` |
| `close-on-select` | 兼容别名，若与 `hide-on-click` 同时存在以后者为准 | `boolean` | `true` |
| `role` | 菜单语义 | `DropdownRole` | `'menu'` |
| `trigger` | 触发方式，支持单值或数组 | `DropdownTrigger \| DropdownTrigger[]` | `'hover'` |
| `trigger-keys` | 触发区键盘打开键 | `string[]` | `['Enter','NumpadEnter',' ','ArrowDown']` |
| `open-delay` | hover 打开延迟 | `number` | `80` |
| `close-delay` | hover 关闭延迟 | `number` | `120` |
| `show-after` | 打开延迟别名，优先级高于 `open-delay` | `number` | `undefined` |
| `hide-after` | 关闭延迟别名，优先级高于 `close-delay` | `number` | `undefined` |
| `max-height` | 菜单最大高度 | `string \| number` | `''` |
| `teleported` | 是否通过 Teleport 挂载到外层容器 | `boolean` | `true` |
| `append-to` | Teleport 的挂载目标 | `string \| HTMLElement` | `'body'` |
| `persistent` | 关闭后是否保留 DOM | `boolean` | `false` |
| `popper-class` | 菜单容器自定义类名 | `string` | `''` |
| `popper-style` | 菜单容器自定义样式 | `StyleValue` | `undefined` |
| `show-arrow` | 是否显示浮层箭头 | `boolean` | `true` |
| `virtual-ref` | 虚拟触发引用或虚拟定位引用 | `ReferenceElement \| null` | `null` |
| `virtual-triggering` | 是否启用虚拟触发模式 | `boolean` | `false` |
| `split-button` | 是否切换为分裂按钮 | `boolean` | `false` |
| `button-props` | `split-button` 下透传给按钮的配置 | `Partial<ButtonProps>` | `undefined` |
| `tabindex` | 触发区 tab 索引 | `string \| number` | `0` |
| `loop` | roving tabindex 是否循环 | `boolean` | `true` |
| `popper-options` | 定位兼容配置子集 | `DropdownPopperOptions` | `{}` |

### Dropdown Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 开关状态变化 | `DropdownModelValueChangeHandler` |
| `select` | 选择菜单项 | `DropdownSelectHandler` |
| `command` | 触发命令派发 | `DropdownCommandHandler` |
| `visible-change` | 菜单开关状态变化 | `DropdownVisibleChangeHandler` |
| `click` | `split-button` 主按钮点击 | `DropdownClickHandler` |

### Dropdown Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 触发区域，或 `split-button` 下主按钮内容 |
| `dropdown` | 菜单内容，主路径推荐承接 `xy-dropdown-menu` |

### DropdownMenu Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 菜单项列表，通常传入 `xy-dropdown-item` |

### DropdownItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `command` | 命令值 | `DropdownCommand` | `undefined` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `divided` | 是否在项前显示分割线 | `boolean` | `false` |
| `icon` | 前置图标 | `string` | `''` |
| `danger` | 是否危险操作样式 | `boolean` | `false` |
| `description` | 次级描述 | `string` | `''` |
| `text-value` | 文本值兜底，便于命令派发或未来扩展 | `string` | `''` |

### DropdownItem Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 主内容 |
| `icon` | 自定义前置图标；存在时会覆盖 `icon` prop 的渲染结果 |
| `description` | 自定义次级描述区；存在时会覆盖 `description` prop 的渲染结果 |

### Dropdown 兼容模式 Item

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `key` | 菜单项标识 | `string` | — |
| `label` | 展示文案 | `string` | — |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `danger` | 是否危险操作样式 | `boolean` | `false` |
| `description` | 辅助描述 | `string` | `undefined` |
| `command` | 额外派发值 | `DropdownCommand` | `key` |
| `divided` | 是否分割线 | `boolean` | `false` |
| `icon` | 前置图标 | `string` | `undefined` |
| `textValue` | 文本值兜底 | `string` | `undefined` |
