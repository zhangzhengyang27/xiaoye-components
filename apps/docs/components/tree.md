---
title: Tree 树形控件
description: 参考 Element Plus 普通 Tree 的数据驱动树形控件，覆盖勾选联动、过滤、懒加载和实例方法。
outline: deep
---

# Tree 树形控件

`xy-tree` 用于展示带层级关系的数据。当前版本优先覆盖后台系统最常见的“资源目录 / 菜单权限 / 组织结构 / 分类树”场景，补齐了 `checkbox / filter / lazy / current / methods` 这一轮高频能力。

## 基础用法

:::demo 默认是纯展示树，点击节点可以切换当前节点，`highlight-current` 用于在后台导航和详情联动里强化当前项。
tree/basic
:::

## 勾选联动

:::demo 开启 `show-checkbox` 后，父子节点默认联动勾选。适合权限树、资源选择和批量发布范围配置。
tree/checkbox
:::

## 默认展开、默认勾选与当前节点

:::demo `default-expanded-keys / default-checked-keys / current-node-key` 都依赖 `node-key`，适合回显已有配置。
tree/default-state
:::

## 节点过滤

:::demo 调用实例方法 `filter()` 时，需要同时提供 `filter-node-method`。过滤命中子节点时，会自动保留祖先链路。
tree/filtering
:::

## 懒加载节点

:::demo `lazy + load` 适合按需拉取大规模节点数据。当前版本支持失败后再次点击重试。
tree/lazy
:::

## 自定义节点内容

:::demo 默认插槽和 `render-content` 都可以自定义节点内容，适合补充状态标签、操作按钮和摘要信息。
tree/custom-content
:::

## 实例方法控制

:::demo 通过 `setCurrentKey / setCheckedKeys / append / remove` 等方法，可以把 Tree 接进权限编辑器和资源编排面板。
tree/methods
:::

## 何时使用

- 菜单、权限、组织结构、分类目录这类天然分层的数据展示。
- 需要“当前节点 + 勾选联动 + 懒加载 + 过滤”组合能力的后台配置界面。
- 需要通过实例方法动态增删节点、设置当前节点或回显勾选状态的业务面板。

## API

### Tree Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 树节点数据 | `Array<Record<string, any>>` | `[]` |
| `empty-text` | 默认空态描述文案 | `string` | `'暂无数据'` |
| `node-key` | 节点唯一 key 字段名；涉及 key 的回显和方法时必填 | `string` | `undefined` |
| `props` | 节点字段映射 | `{ children?, label?, disabled?, isLeaf?, class? }` | `{ children: 'children', label: 'label', disabled: 'disabled' }` |
| `render-after-expand` | 是否首次展开后再渲染子节点 | `boolean` | `true` |
| `highlight-current` | 是否高亮当前节点 | `boolean` | `false` |
| `default-expand-all` | 是否默认展开全部节点 | `boolean` | `false` |
| `expand-on-click-node` | 点击节点内容时是否触发展开/收起 | `boolean` | `true` |
| `show-checkbox` | 是否显示勾选框 | `boolean` | `false` |
| `check-strictly` | 勾选时是否取消父子联动 | `boolean` | `false` |
| `check-on-click-node` | 点击节点时是否直接切换勾选状态 | `boolean` | `false` |
| `check-on-click-leaf` | 点击叶子节点时是否直接切换勾选状态 | `boolean` | `true` |
| `default-checked-keys` | 默认勾选节点 key 列表 | `Array<string \| number>` | `undefined` |
| `default-expanded-keys` | 默认展开节点 key 列表 | `Array<string \| number>` | `undefined` |
| `current-node-key` | 当前节点 key，受控回显 | `string \| number \| null` | `undefined` |
| `filter-node-method` | 节点过滤函数 | `(value, data, node) => boolean` | `undefined` |
| `lazy` | 是否启用懒加载节点 | `boolean` | `false` |
| `load` | 懒加载回调 | `(node, resolve, reject) => void` | `undefined` |
| `accordion` | 是否同级只保留一个展开节点 | `boolean` | `false` |
| `indent` | 相邻层级缩进宽度 | `number` | `18` |
| `icon` | 自定义展开图标 | `string \| Component` | `'mdi:chevron-right'` |
| `render-content` | 渲染函数形式的节点内容自定义 | `(h, { node, data, store }) => VNode \| VNode[]` | `undefined` |

### Tree Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `node-click` | 点击节点内容时触发 | `(data, node, nodeInstance, event)` |
| `node-contextmenu` | 右键节点时触发 | `(event, data, node, nodeInstance)` |
| `current-change` | 当前节点变化时触发 | `(data, node)` |
| `node-expand` | 节点展开时触发 | `(data, node, nodeInstance)` |
| `node-collapse` | 节点收起时触发 | `(data, node, nodeInstance)` |
| `check-change` | 单个节点勾选状态变化时触发 | `(data, checked, indeterminate)` |
| `check` | 点击勾选框后触发 | `(data, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys })` |

### Tree Slots

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| `default` | 自定义节点内容 | `{ node, data }` |
| `empty` | 自定义空态内容 | — |

### Tree Methods

| 方法 | 说明 | 签名 |
| --- | --- | --- |
| `filter` | 过滤全部节点 | `(value) => void` |
| `updateKeyChildren` | 替换某个节点的直接子节点，依赖 `node-key` | `(key, data) => void` |
| `getCheckedNodes` | 获取勾选节点数据 | `(leafOnly?, includeHalfChecked?) => TreeNodeData[]` |
| `setCheckedNodes` | 按节点数据设置勾选状态 | `(nodes, leafOnly?) => void` |
| `getCheckedKeys` | 获取勾选节点 key | `(leafOnly?) => Array<string \| number>` |
| `setCheckedKeys` | 按 key 设置勾选状态，依赖 `node-key` | `(keys, leafOnly?) => void` |
| `setChecked` | 设置单个节点勾选状态 | `(dataOrKey, checked, deep) => void` |
| `getHalfCheckedNodes` | 获取半选节点数据 | `() => TreeNodeData[]` |
| `getHalfCheckedKeys` | 获取半选节点 key | `() => Array<string \| number>` |
| `getCurrentKey` | 获取当前节点 key | `() => string \| number \| null` |
| `getCurrentNode` | 获取当前节点数据 | `() => TreeNodeData \| null` |
| `setCurrentKey` | 按 key 设置当前节点 | `(key, shouldAutoExpandParent?) => void` |
| `setCurrentNode` | 按节点数据或节点实例设置当前节点 | `(node, shouldAutoExpandParent?) => void` |
| `getNode` | 根据 key 或节点数据获取节点实例 | `(dataOrKey) => Node \| null` |
| `remove` | 删除节点 | `(dataOrNode) => void` |
| `append` | 追加子节点 | `(data, parentNode?) => void` |
| `insertBefore` | 在指定节点前插入新节点 | `(data, refNode) => void` |
| `insertAfter` | 在指定节点后插入新节点 | `(data, refNode) => void` |

### props 字段映射

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `children` | 子节点字段名 | `string` | `'children'` |
| `label` | 节点文案字段名或读取函数 | `string \| (data, node) => string` | `'label'` |
| `disabled` | 禁用状态字段名或读取函数 | `string \| (data, node) => boolean` | `'disabled'` |
| `isLeaf` | 叶子节点字段名或读取函数，仅懒加载时特别有用 | `string \| (data, node) => boolean` | `undefined` |
| `class` | 自定义节点 class 或 class 计算函数 | `string \| Record<string, boolean> \| (data, node) => string \| Record<string, boolean>` | `undefined` |
