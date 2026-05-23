---
title: 后台首批落地清单
description: 面向后台项目的第一批真实落地施工单，按文件、按动作、按验收顺序执行。
outline: deep
---

# 后台首批落地清单

这页不是再讲原则，而是把第一批最适合真正回业务项目落地的改动压缩成施工单。

如果你还没看过完整判断逻辑，先读 [后台迁移指南](/guide/backend-migration)。如果你已经确认要开始在后台项目里删历史覆盖，这页可以直接当执行顺序使用。

## 这页解决什么问题

这页只回答四件事：

1. 第一批先改哪些文件
2. 每个文件先加什么 class 或 wrapper
3. 每个文件优先删哪类旧覆盖
4. 每一步删完以后怎么最小回归

一句话目标：

- 先拿最轻页面验证迁移协议
- 再扩大到标准 CRUD 列表页
- 暂时不碰高风险结构样式

## 第一批总顺序

建议先按下面顺序推进，不要同时改太多页面：

1. `src/style/index.scss`
2. `src/views/system/task/index.vue`
3. `src/views/system/file/index.vue`
4. `src/views/content/category/index.vue`
5. `src/views/system/user/index.vue`
6. `src/views/system/role/index.vue`

原因很直接：

- 这几页能优先验证 `dialog-shell--narrow`
- 同时能逐步验证 `table-shell--list`
- 其中 `task / file / category` 的内容复杂度更低，适合先收口

## 文件 1：`src/style/index.scss`

这是第一批必须先动的入口，因为当前很多历史覆盖都还挂在全局样式里。

### 先补什么

这一文件本身不是加 class 的地方，而是先标记“哪些全局规则后续要迁走”：

- 全局 `.xy-dialog`
- 全局 `.xy-table`

### 优先删什么

先删下面这两类：

```scss
@media screen and (max-width: 1024px) and (min-width: 769px) {
  .xy-dialog {
    max-width: 90vw;
    margin: 20px auto;
  }
}

@media screen and (max-width: 768px) {
  .xy-dialog {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

```scss
@media screen and (max-width: 480px) {
  .xy-table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

### 删除前提

删这些全局规则前，必须先确保对应页面已经挂上：

- `dialog-shell--narrow`
- `table-shell--mobile-scroll`

### 最小回归

1. 先看 `task`、`file` 两页弹窗在桌面和移动端是否还能正常滚动
2. 再看至少一个列表页的小屏横向滚动是否已经迁到 wrapper

## 文件 2：`src/views/system/task/index.vue`

这页适合作为第一批起点，因为它通常只承载轻量表单和普通列表。

### 先补什么

- `XyDialog` 补 `panel-class="dialog-shell--narrow"`
- 表格外层补 `table-shell table-shell--list table-shell--mobile-scroll`

### 优先删什么

- 命中 `.xy-dialog__header / __body / __footer` 的纯视觉覆盖
- 命中 `.xy-table__cell / __header-cell / __row:hover > __cell` 的纯视觉覆盖

### 先别删什么

- 操作按钮排列
- 表单字段布局
- 业务状态色块

### 最小回归

1. 亮色桌面端：看弹窗宽度、表头、边框、hover
2. 暗色桌面端：看弹窗背景和表格 header 是否还有局部发白
3. 移动端：看弹窗是否仍能滚动，小屏表格是否仍可横向滚动

## 文件 3：`src/views/system/file/index.vue`

这页和 `task` 很接近，适合作为第二个验证页。

### 先补什么

- `XyDialog` 补 `panel-class="dialog-shell--narrow"`
- 表格外层补 `table-shell table-shell--list table-shell--mobile-scroll`

### 优先删什么

- `.xy-dialog` 内部 header / body / footer 的 padding、背景、边框覆盖
- `.xy-table__cell / __header-cell` 的 padding、背景覆盖

### 最小回归

1. 先看上传或编辑弹窗
2. 再看列表表格的亮暗主题切换
3. 最后看小屏滚动

## 文件 4：`src/views/content/category/index.vue`

这页主要用来补第三个 `dialog-shell--narrow` 验证样本。

### 先补什么

- `XyDialog` 补 `panel-class="dialog-shell--narrow"`

### 优先删什么

- 全局 `.xy-dialog` 已经承接的响应式规则
- 页面里只为了统一 padding / radius / overflow 而写的 deep 覆盖

### 最小回归

1. 看分类维护弹窗在桌面端是否仍保持默认宽度语义
2. 看中屏 / 移动端下是否仍然有正确的 `max-width / overflow`

## 文件 5：`src/views/system/user/index.vue`

这页是第一批里最重要的标准 CRUD 列表页样本。

### 先补什么

- `XyDialog` 补 `panel-class="dialog-shell--narrow"` 或保留现有实例宽度后再挂 class
- 表格外层补 `table-shell table-shell--list table-shell--mobile-scroll`

### 优先删什么

- 只为了压密度而写的 `.xy-table__cell / __header-cell` 覆盖
- 只为了主题接轨而写的 `.xy-table__row:hover > __cell` 覆盖
- `Popconfirm` 如果已经走 `#reference`，优先删它的内部视觉覆盖，不要再改触发 contract

### 最小回归

1. 先看删除按钮和 `Popconfirm` 是否真实可见
2. 再看用户编辑弹窗
3. 最后看列表 header / hover / stripe / 移动端滚动

## 文件 6：`src/views/system/role/index.vue`

这页适合做“标准 CRUD 列表 + 中宽配置弹窗”的第一批边界页。

### 先补什么

- 标准编辑弹窗保留 `width`，再挂对应 `panel-class`
- 权限配置弹窗按 `dialog-shell--config` 处理
- 表格外层补 `table-shell table-shell--list table-shell--mobile-scroll`

### 优先删什么

- 只为了改 header / body / footer padding 而写的 `dialog` deep 规则
- 只为了统一列表节奏而写的 `table` cell 级覆盖

### 最小回归

1. 先看普通编辑弹窗
2. 再看权限配置弹窗
3. 最后看角色列表的 table token 是否已经足够承接

## 每个文件都统一遵守的删除边界

可以优先删：

- `background / border / shadow / border-radius / padding / color / hover / selected`
- 命中 `.xy-dialog`、`.xy-table` 的全局根类
- 命中 `__header / __body / __cell / __option / __panel` 的纯视觉 deep 覆盖

先别删：

- 业务布局
- 操作列排列
- 展开区内容结构
- 上传区、树编辑区、复合卡片内部排版

## 每一步统一验收顺序

每改完一个文件，至少按这个顺序验收一次：

1. 亮色桌面端
2. 暗色桌面端
3. 中屏尺寸
4. 移动端 / 窄屏

每一步统一确认：

- 组件是否真实渲染，不只是 DOM 还在
- trigger / header / footer 是否正常显示
- 浮层是否能打开
- 背景、边框、阴影、padding 是否回到组件库默认基线
- 小屏滚动是否从全局根类迁到 wrapper

## 首批完成后的通过标准

如果下面几条都成立，就说明第一批落地可以继续扩面：

- 全局 `.xy-dialog` 响应式规则已经可以删除
- 全局 `.xy-table` 小屏滚动规则已经可以删除
- `task / file / category / user / role` 这几页不再依赖大块内部类名覆盖
- 亮暗主题切换下，浮层、列表和筛选区都主要依赖组件库默认基线

## 下一页怎么接着做

第一批跑通后，再继续按下面顺序扩面：

1. `system/announcement`
2. `system/log`
3. `business/product`
4. `business/order`
5. `dashboard`

对应关系：

- 普通列表页继续复用 `table-shell--list`
- 详情抽屉走 `drawer-shell--detail`
- 概览表走 `table-shell--overview`

