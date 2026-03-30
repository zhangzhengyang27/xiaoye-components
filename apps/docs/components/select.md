---
title: Select 选择器
description: 单选下拉、搜索过滤和中后台筛选栏的基础选择器。
outline: deep
---

# Select 选择器

`xy-select` 用于后台筛选栏和表单枚举值录入。当前版本已经统一为一套通用枚举选择器，支持单选、多选、远程搜索、创建项、清空和键盘导航。

## 基础用法

:::demo 最基础的用法是传入 `options`，再用 `v-model` 接住当前选中值。
select/basic
:::

## 搜索、清空与描述文案

:::demo 选项支持 `description` 字段，适合在后台场景里补充状态解释或二级信息。
select/search
:::

## 多选与标签折叠

:::demo 开启 `multiple` 后，Select 会输出数组值；`collapse-tags` 和 `max-tag-count` 适合在筛选条里控制标签密度。
select/multiple-create
:::

## 禁用态

:::demo 既可以整体禁用 Select，也可以只禁用部分选项。禁用项适合表达“当前条件下不可选”的状态。
select/disabled
:::

## 分组选项

:::demo 当枚举值很多时，可以把选项按业务域或角色域分组，降低认知负担。
select/grouped
:::

## 面板插槽与加载态

:::demo `header / footer / empty / option` 适合把 Select 下拉面板变成更完整的业务选择面板。
select/panel-slots
:::

## 独立加载态

:::demo 如果你只需要标准加载态，而不想自定义整块面板，可以直接使用 `loading / loading-text`。
select/loading
:::

## 远程搜索

:::demo `remote` 模式下组件只派发 `search-change`，外部根据关键词更新 `options` 和 `loading` 即可。
select/remote
:::

Select 这一轮仍然保持“状态项 loading”，不会改成遮罩。默认加载项的 spinner 和文案已对齐独立 `Loading`，并会读取 `ConfigProvider.loading` 的 `text / spinner / svg / svgViewBox / background` 作为视觉默认项；如果传入 `loading-text` 或自定义 `loading` 插槽，局部定义依然优先。

## 表单场景

:::demo 放在 `xy-form-item` 内部时，Select 会自动关联错误消息并参与 `change / blur` 校验。
select/form
:::

## 方法控制

:::demo 通过 expose 的 `focus / blur / open / close`，可以把 Select 接进更复杂的筛选条或快捷操作面板。
select/methods
:::

## 键盘与行为约定

- `ArrowDown / ArrowUp` 在可选项之间移动。
- `Enter / Space` 选择当前高亮项。
- `Escape` 关闭下拉，并把焦点还给触发器。
- `multiple` 适合标签型筛选，`collapse-tags` 用于压缩触发器内容。
- `remote` 打开后，组件不会再做本地过滤，只展示外部传入选项。
- `allow-create` 适合轻量自定义枚举录入，仍然遵循当前选项值类型。

## API

### Select Attributes

| 属性                 | 说明                         | 类型                                          | 默认值               |
| -------------------- | ---------------------------- | --------------------------------------------- | -------------------- |
| `model-value`        | 当前选中值                   | `string \| number \| Array<string \| number> \| null` | `null` |
| `options`            | 选项列表                     | `(SelectOption<T> \| SelectOptionGroup<T>)[]` | —                    |
| `placeholder`        | 未选择时的占位提示           | `string`                                      | `'请选择'`           |
| `disabled`           | 是否禁用                     | `boolean`                                     | `false`              |
| `clearable`          | 是否允许清空当前选中值       | `boolean`                                     | `false`              |
| `searchable`         | 是否启用搜索输入             | `boolean`                                     | `false`              |
| `multiple`           | 是否开启多选                 | `boolean`                                     | `false`              |
| `collapse-tags`      | 多选时是否折叠标签           | `boolean`                                     | `false`              |
| `max-tag-count`      | 折叠前最多展示的标签数       | `number`                                      | `undefined`          |
| `remote`             | 是否启用远程搜索             | `boolean`                                     | `false`              |
| `allow-create`       | 是否允许按搜索词创建新项     | `boolean`                                     | `false`              |
| `size`               | 组件尺寸                     | `'sm' \| 'md' \| 'lg'`                        | 跟随全局配置         |
| `no-data-text`       | 无选项时的文案               | `string`                                      | `'暂无选项'`         |
| `no-match-text`      | 搜索无结果时的文案           | `string`                                      | `'没有匹配项'`       |
| `loading`            | 是否处于加载态               | `boolean`                                     | `false`              |
| `loading-text`       | 加载态文案                   | `string`                                      | `'加载中'`           |
| `search-placeholder` | 搜索输入占位文案             | `string`                                      | `'搜索选项'`         |
| `create-text`        | 创建项前缀文案               | `string`                                      | `'创建'`             |
| `prefix-icon`        | 触发器前置图标               | `string`                                      | `''`                 |
| `suffix-icon`        | 触发器后置图标               | `string`                                      | `'mdi:chevron-down'` |
| `clear-icon`         | 清空图标                     | `string`                                      | `'mdi:close-circle'` |
| `teleported`         | 是否把下拉面板传送到 `body`  | `boolean`                                     | `true`               |
| `append-to`          | 下拉面板挂载目标             | `string \| HTMLElement`                       | `'body'`             |
| `placement`          | 下拉面板弹出位置             | `Placement`                                   | `'bottom-start'`     |
| `offset`             | 下拉面板偏移量               | `number`                                      | `12`                 |
| `popper-class`       | 下拉面板自定义类名           | `string`                                      | `''`                 |
| `popper-style`       | 下拉面板自定义样式           | `StyleValue`                                  | `''`                 |
| `fit-input-width`    | 是否让下拉面板跟随触发器宽度 | `boolean`                                     | `true`               |
| `dropdown-min-width` | 下拉面板最小宽度             | `string \| number`                            | —                    |
| `dropdown-max-width` | 下拉面板最大宽度             | `string \| number`                            | —                    |

### Select Events

| 事件                 | 说明                 | 参数                       |
| -------------------- | -------------------- | -------------------------- |
| `update:model-value` | 选中值变化时触发     | `string \| number \| null` |
| `change`             | 选中值确认变化时触发 | `string \| number \| null` |
| `clear`              | 点击清空按钮时触发   | —                          |
| `visible-change`     | 下拉打开或关闭时触发 | `boolean`                  |
| `focus`              | 下拉打开时触发       | —                          |
| `blur`               | 下拉关闭时触发       | —                          |
| `search-change`      | 搜索关键字变化时触发 | `string`                   |

### Select Option

| 字段          | 说明           | 类型               | 默认值      |
| ------------- | -------------- | ------------------ | ----------- |
| `label`       | 选项展示文案   | `string`           | —           |
| `value`       | 选项值         | `string \| number` | —           |
| `disabled`    | 是否禁用该选项 | `boolean`          | `false`     |
| `description` | 辅助描述信息   | `string`           | `undefined` |

### Select Option Group

| 字段       | 说明         | 类型                | 默认值  |
| ---------- | ------------ | ------------------- | ------- |
| `label`    | 分组标题     | `string`            | —       |
| `options`  | 分组下的选项 | `SelectOption<T>[]` | —       |
| `disabled` | 是否禁用整组 | `boolean`           | `false` |

### Select Slots

| 插槽      | 说明                                                |
| --------- | --------------------------------------------------- |
| `prefix`  | 触发器前缀内容                                      |
| `suffix`  | 自定义触发器后缀图标                                |
| `header`  | 下拉面板头部内容                                    |
| `footer`  | 下拉面板底部内容                                    |
| `loading` | 自定义加载态内容                                    |
| `empty`   | 自定义空态内容                                      |
| `option`  | 自定义选项内容，接收 `{ option, selected, active }` |

### Select Exposes

| 暴露项  | 说明               | 类型                  |
| ------- | ------------------ | --------------------- |
| `focus` | 聚焦触发器         | `() => void`          |
| `blur`  | 关闭并让触发器失焦 | `() => Promise<void>` |
| `open`  | 打开下拉面板       | `() => Promise<void>` |
| `close` | 关闭下拉面板       | `() => Promise<void>` |
