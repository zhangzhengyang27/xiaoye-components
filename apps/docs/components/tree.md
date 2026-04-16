---
title: Tree 树形控件
description: 数据驱动树形控件，覆盖勾选联动、过滤、懒加载、节点路径和拖拽编排。
outline: deep
---

# Tree 树形控件

`xy-tree` 用于展示带层级关系的数据。当前版本优先覆盖后台系统最常见的“资源目录 / 菜单权限 / 组织结构 / 分类树 / 菜单编排”场景，补齐了 `checkbox / filter / lazy / current / path / drag` 这一轮高频能力。

## 先看业务场景

如果你正在把 `Tree` 接进真实后台页面，建议先从下面 3 个业务场景开始，再回头查 API。

### 权限树回显与批量勾选

:::demo 适合角色权限编辑器。示例会演示角色预设回显、半选状态读取，以及批量清空/切换勾选结果。
tree/permission-batch
:::

### 组织树懒加载与禁用节点

:::demo 适合组织结构同步、部门选择或人员归属配置。示例会演示懒加载部门、提前声明叶子、禁用封存组织，以及当前节点定位。
tree/org-lazy-disabled
:::

### 菜单树右键菜单与拖拽编排

:::demo 适合后台菜单编辑器。示例把 `node-contextmenu`、`draggable` 和 `node-drop detail` 组合起来，直接演示菜单编排操作。
tree/menu-editor
:::

## 再看基础能力

### 基础用法

:::demo 默认是纯展示树，点击节点可以切换当前节点，`highlight-current` 用于在后台导航和详情联动里强化当前项。
tree/basic
:::

### 勾选联动

:::demo 开启 `show-checkbox` 后，父子节点默认联动勾选。适合权限树、资源选择和批量发布范围配置。
tree/checkbox
:::

### 默认展开、默认勾选与当前节点

:::demo `default-expanded-keys / default-checked-keys / current-node-key` 都依赖 `node-key`，适合回显已有配置。
tree/default-state
:::

### 节点过滤

:::demo 调用实例方法 `filter()` 时，需要同时提供 `filter-node-method`。过滤命中子节点时，会自动保留祖先链路，键盘导航也只会在当前可见节点之间移动。
tree/filtering
:::

### 懒加载节点

:::demo `lazy + load` 适合按需拉取大规模节点数据。当前版本支持失败后显示节点级错误提示，并在再次点击时重试。
tree/lazy
:::

### 节点类名

:::demo `props.class / props.contentClass` 适合对关键分支、风险节点或叶子节点做额外视觉强调，不需要重写整块节点模板。
tree/custom-class
:::

### 右键节点事件

:::demo `node-contextmenu` 适合接菜单树、资源树里的快捷操作面板，页面层通常会自己接业务菜单。
tree/contextmenu
:::

### 懒加载叶子与 `checkDescendants`

:::demo `props.isLeaf` 可以提前声明叶子节点，`check-descendants` 适合控制“勾选未加载父节点时，是否继续把状态向后代传播”。
tree/lazy-strategy
:::

### 自定义节点内容

:::demo 默认插槽和 `render-content` 都可以自定义节点内容，适合补充状态标签、操作按钮和摘要信息。
tree/custom-content
:::

### 实例方法控制

:::demo 通过 `setCurrentKey / setCheckedKeys / append / remove` 等方法，可以把 Tree 接进权限编辑器和资源编排面板。
tree/methods
:::

### 节点路径读取

:::demo `getNodePath()` 适合做面包屑回显、祖先链展示或外部面板联动。
tree/path
:::

### 基础拖拽

:::demo 开启 `draggable` 后，支持节点的 `before / inner / after` 三种落点，并会派发拖拽事件。
tree/draggable
:::

### 拖拽约束

:::demo `allow-drag / allow-drop` 用来限制哪些节点允许拖动、哪些落点允许放置。
tree/drag-guards
:::

## 何时使用

- 菜单、权限、组织结构、分类目录这类天然分层的数据展示。
- 需要“当前节点 + 勾选联动 + 懒加载 + 过滤 + 拖拽”组合能力的后台配置界面。
- 需要通过实例方法动态增删节点、设置当前节点、读取祖先路径或回显勾选状态的业务面板。
- 需要拖拽重排目录、菜单或分类层级的后台编排界面。

## 使用建议

- `render-after-expand=false` 适合首屏就需要稳定结构的导航树或需要提前挂载子节点内容的场景；默认值 `true` 更适合按需渲染。
- `props.children / label / disabled / isLeaf / class / contentClass` 建议成组看待，真实业务里往往不是只改一个字段映射。
- `empty` 插槽适合承接更完整的空态，而 `empty-text` 更适合只改一句描述文案。
- 未开启 `show-checkbox` 时，节点点击仍然只表达“当前节点”与“展开状态”，不应把它理解为勾选行为。

## API

### Tree Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 树节点数据 | `Array<Record<string, any>>` | `[]` |
| `empty-text` | 默认空态描述文案 | `string` | `'暂无数据'` |
| `node-key` | 节点唯一 key 字段名；涉及 key 的回显和方法时必填 | `string` | `undefined` |
| `props` | 节点字段映射 | `{ children?, label?, disabled?, isLeaf?, class?, contentClass? }` | `{ children: 'children', label: 'label', disabled: 'disabled' }` |
| `render-after-expand` | 是否首次展开后再渲染子节点 | `boolean` | `true` |
| `highlight-current` | 是否高亮当前节点 | `boolean` | `false` |
| `default-expand-all` | 是否默认展开全部节点 | `boolean` | `false` |
| `expand-on-click-node` | 点击节点内容时是否触发展开/收起 | `boolean` | `true` |
| `show-checkbox` | 是否显示勾选框 | `boolean` | `false` |
| `check-strictly` | 勾选时是否取消父子联动 | `boolean` | `false` |
| `check-descendants` | 懒加载节点勾选时是否继续把勾选状态传播到后代 | `boolean` | `false` |
| `check-on-click-node` | 点击节点时是否直接切换勾选状态 | `boolean` | `false` |
| `check-on-click-leaf` | 点击叶子节点时是否直接切换勾选状态 | `boolean` | `true` |
| `default-checked-keys` | 默认勾选节点 key 列表 | `Array<string \| number>` | `undefined` |
| `default-expanded-keys` | 默认展开节点 key 列表 | `Array<string \| number>` | `undefined` |
| `current-node-key` | 当前节点 key，受控回显 | `string \| number \| null` | `undefined` |
| `filter-node-method` | 节点过滤函数 | `(value, data, node) => boolean` | `undefined` |
| `lazy` | 是否启用懒加载节点 | `boolean` | `false` |
| `load` | 懒加载回调 | `(node, resolve, reject) => void` | `undefined` |
| `draggable` | 是否启用节点拖拽 | `boolean` | `false` |
| `allow-drag` | 控制节点是否允许被拖动 | `(node) => boolean` | `undefined` |
| `allow-drop` | 控制目标节点的 `prev / inner / next` 三种落点是否允许放置 | `(draggingNode, dropNode, type) => boolean` | `undefined` |
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
| `node-drag-start` | 节点开始拖拽时触发 | `(draggingNode, event)` |
| `node-drag-enter` | 拖拽节点进入目标节点时触发 | `(draggingNode, dropNode, event)` |
| `node-drag-leave` | 拖拽节点离开目标节点时触发 | `(draggingNode, dropNode, event)` |
| `node-drag-over` | 拖拽节点在目标节点上移动时触发 | `(draggingNode, dropNode, event)` |
| `node-drag-end` | 拖拽结束时触发，即使没有成功放置也会触发 | `(draggingNode, dropNode \| null, dropType, event, detail)` |
| `node-drop` | 节点成功放置后触发 | `(draggingNode, dropNode, dropType, event, detail)` |
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
| `getNodePath` | 获取某个节点从根到当前项的路径，依赖 `node-key` | `(dataOrKey) => TreeNodeData[]` |
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
| `contentClass` | 自定义节点内容区 class 或 class 计算函数 | `string \| Record<string, boolean> \| (data, node) => string \| Record<string, boolean>` | `undefined` |

## 行为说明

- 开发环境下如果检测到重复 `node-key`，组件会输出一次告警，提示你修正数据源。
- `filter()` 只会过滤当前已存在的节点树，不会为了匹配结果主动拉取未加载的远程分支。
- `check-descendants` 只在 `show-checkbox` 且 `check-strictly=false` 的场景下有意义。
- `lazy` 节点加载失败后会在节点尾部显示“加载失败，点击重试”，再次点击仍会按同一条 `load` 链路重试。
- `node-drag-end` 总会触发；只有 `dropType` 不是 `none` 时才会继续触发 `node-drop`。
- 拖拽事件里的 `detail` 额外提供 `oldParent / newParent / oldIndex / newIndex`，适合直接回写页面层的数据排序结果。
- 当前只提供 `getNodePath()` 这一条通用路径能力；如果你需要 key 路径或 label 路径，建议基于返回结果在业务层自行映射，避免组件层过早扩张派生 API。
