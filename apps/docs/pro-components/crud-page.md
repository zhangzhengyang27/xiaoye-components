---
title: CrudPage 增删改查页面
description: 统一列表、表单编辑和详情查看的页面级容器。
outline: deep
---

# CrudPage 增删改查页面

`xy-crud-page` 用来把 `ListPage + OverlayForm + DetailPanel` 收成统一的增删改查页面骨架。

## 何时使用

- 需要标准 CRUD 页面：列表 → 新增/编辑（弹窗或抽屉） → 查看详情。
- 需要统一管理列表、表单编辑和详情查看的页面级闭环。
- 需要减少重复的页面骨架代码，聚焦业务逻辑。

## 何时不使用

- 只需要列表展示时，优先使用 `xy-list-page`。
- 需要完全自定义页面布局时，优先使用 `xy-page-container` 自由组合。
- 表单编辑流程复杂（如分步表单）时，优先使用 `xy-steps-form` 单独实现。

## 与基础组件的关系

```
CrudPage
├── ListPage（列表区）        ← 继承 ListPage 的全部能力
│   ├── SearchForm
│   ├── ProTable
│   └── BatchActionBar
├── OverlayForm（编辑区）     ← 弹窗/抽屉表单
│   ├── DialogForm            ← 弹窗模式
│   └── DrawerForm            ← 抽屉模式
└── DetailPanel（详情区）     ← 详情查看面板
    └── Descriptions          ← 基于 xy-descriptions 或 detailSchema
```

**核心区别**：`xy-list-page` 只管列表，`xy-crud-page` 在其之上增加了编辑和详情的完整闭环。

## 最佳实践

### 选择编辑模式

- **弹窗模式 (DialogForm)**：适合字段少、编辑简单的场景，用户不需要离开列表页。
- **抽屉模式 (DrawerForm)**：适合字段较多、需要更大编辑空间的场景。
- **新页面模式**：适合编辑流程复杂、需要独立页面空间的场景，此时不使用 CrudPage 的内置编辑。

### detailSchema 驱动详情

当详情字段有稳定的 schema 时，推荐使用 `detailSchema` 替代手写模板：

```ts
const detailSchema = [
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'status', value_type: 'tag', options: statusOptions },
  { label: '创建时间', prop: 'createdAt', value_type: 'datetime' },
]
```

### 数据流

```
用户操作 → CrudPage 事件 → 业务处理 → 刷新列表
  │
  ├── 新增 → onAdd → DialogForm/DrawerForm → 提交 → reload()
  ├── 编辑 → onEdit(row) → DialogForm/DrawerForm → 提交 → reload()
  ├── 删除 → onDelete(row) → 确认 → API → reload()
  └── 查看 → onView(row) → DetailPanel → 展示
```

## 基础用法

:::demo 适合中后台标准 CRUD 页面。
pro/crud-page/basic
:::

## 当前定位

- 承接标准 CRUD 页面骨架。
- 表单和详情内容继续通过插槽承接，不做低代码页面设计器。
- 当详情字段已经有稳定 schema 时，也可以直接使用 `detailSchema` 驱动详情面板，不必继续重复写模板卡片。
