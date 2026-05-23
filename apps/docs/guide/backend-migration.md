---
title: 后台迁移指南
description: 面向后台项目的组件库样式迁移清单，优先收口浮层、通知和表格的页面级覆盖。
outline: deep
---

# 后台迁移指南

这页只放执行清单。目标很直接：把后台项目里分散在页面层的浮层、通知和表格样式，尽量收回到组件实例 token 和组件库默认基线。

如果你这轮主要在收弹窗、抽屉、提示和操作菜单，建议先配合 [浮层收口指南](/guide/overlay-surface-migration) 一起看。如果你这轮主要在收筛选条和输入浮层，再看 [筛选面板收口指南](/guide/filter-surface-migration)。后两页会把实例级入口、可保留模式和应继续回收的历史覆盖分别串起来。

## 当前已经吸收进组件库的范围

这条迁移线不是抽象建议，下面这些组件的默认视觉基线已经做过组件库层收口，业务项目应该优先尝试删除旧的页面级覆盖：

- 浮层与覆盖层：`dialog / drawer / tooltip / popconfirm / popover / dropdown / menu`
- 表格：`table` 的 header / border / hover / stripe / fixed shadow 已 token 化，且已补 `overview`
- 反馈与通知：`alert / message / notification / result / statistic`
- 基础交互：`button / badge / input / select / link / checkbox / radio / switch / slider / input-number / rate`
- 基础展示与布局：`card / pagination / tag / avatar / image / skeleton / breadcrumb / divider / backtop / tabs / splitter / upload / descriptions`
- 筛选区高频组件：`auto-complete / cascader / tree-select / date-picker / time-picker / time-select`

如果业务项目里这些组件仍然大量依赖 `:deep(.xy-*)` 改背景、边框、阴影、padding、hover 或 selected 态，默认先判断为“历史覆盖未回收”，而不是继续在页面层补更多样式。

## 本轮联调结论

这轮不是只看组件库自己的文档页，而是把本地组件库构建产物接到后台项目里做了真实页面联调。当前结论如下：

- `popconfirm` 的旧触发 contract 兼容已经在业务页真实生效：
  - 用户管理、角色管理、文件管理这些列表页里的“删除”按钮都能真实显示。
  - 点击后会弹出真实可见的确认浮层，而不是只剩 DOM 或占位节点。
- `table` 的主题 token 收口已经在暗色主题下真实生效：
  - 表格正文、表头和 hover 区不再回退成整片白底。
  - 表格背景、表头背景、边框和 fixed surface 会优先跟随 table token。
- `dialog / drawer / tooltip / popconfirm` 的背景、边框、阴影主基线已经来自组件库：
  - 如果联调里看到底色和阴影已经对了，但 header/body/footer padding 还是旧节奏，优先判断为“业务项目历史覆盖仍在”，不要直接回退成“组件库默认态没生效”。

一句话总结：这轮之后，最常见的问题不再是“组件库没能力”，而是“业务页还留着上一轮 deep 补丁没删”。

## 后台项目里已经验证过的保留项

这次只读联调里，也确认了几类“看起来像覆盖、但实际上是合理迁移结果”的模式。它们不应该和旧的内部类名补丁一起被误删：

- `table-shell` 这类页面 wrapper token：
  - 例如后台项目全局 `src/style/index.scss` 里的 `.table-shell { --xy-table-* }`
  - 这类属于推荐模式，因为它是在页面壳层接 table token，而不是 deep 到 cell / row / header 内部结构。
- 页面局部的 table token 微调：
  - 例如 `system/user`、`system/role` 页里的 `--xy-table-body-cell-padding-*`
  - 这类属于“页面密度接轨”，不是旧式内部类补丁。
- `body-class` 搭配自定义类名的局部样式：
  - 例如 `body-class="table-card__body"`，再在 scoped 样式里写 `:deep(.table-card__body)`
  - 这类命中的是业务自定义 class，不是组件内部私有类名，属于可接受的 contract 用法。
- `App.vue` 里针对 Vditor 富文本表格的注入修复：
  - 这类修的是第三方内容把表格条纹重新刷白的问题
  - 它不是组件库默认态缺失，当前应视为保留项，而不是迁移脏补丁

一句话判断：

- 命中 `--xy-*` token、`body-class / panel-class / popper-class` 这类公开入口的，默认先归为“保留项”。
- 直接命中 `.xy-xxx__cell / __option / __panel / __header / __body` 这类内部结构类名的，默认再归为“继续收口项”。

## 后台项目里下一批应优先继续收口的残留

这次联调里真正还值得继续清理的，是“全局根类直改组件外观”的旧模式，而不是页面 wrapper token。浮层类的细化判断和替代入口，已经另外整理到 [浮层收口指南](/guide/overlay-surface-migration)：

- 全局 `.xy-dialog` 覆盖：
  - 后台项目 `src/style/index.scss` 里仍有移动端和中屏设备下的 `.xy-dialog { ... }`
  - 这类会把所有弹窗一起绑死在同一套 max-width、radius、overflow 规则上，优先级应该低于实例 `width`、`panel-class`、`body-class`。
- 全局 `.xy-table` 根类覆盖：
  - 例如移动端下直接写 `.xy-table { display: block; overflow-x: auto; ... }`
  - 这类不是 cell 级 deep 覆盖，但仍然属于“全局改组件根节点表现”，后续应优先评估是否能迁到 wrapper 或更明确的页面容器 class。

这两类模式当前还不能简单算作“已经迁到组件库层”，它们更像是下一批应该继续压缩的全局历史覆盖。

## 下一批可直接按文件推进的任务簇

这条迁移线已经不适合再用“全局搜到什么就改什么”的方式推进。按当前后台项目真实页面分型，更适合拆成下面几批：

### 批次 A：标准表单型 Dialog

这批页面的共同点是：

- 都在用 `XyDialog`
- 主要承载表单录入、编辑、发布、上传、配置
- 优先入口是实例 `width`，必要时再补 `panel-class / body-class / footer-class`

当前可直接归到这批的页面有：

- `src/views/system/user/index.vue`
- `src/views/system/role/index.vue`
- `src/views/system/announcement/index.vue`
- `src/views/system/task/index.vue`
- `src/views/system/file/index.vue`
- `src/views/content/article/index.vue`
- `src/views/content/category/index.vue`
- `src/views/business/product/index.vue`
- `src/views/system/menu/index.vue`

这批的迁移目标很明确：

- 先保留每个页面已经声明的 `width`
- 把全局 `.xy-dialog` 的响应式规则迁到页面实例 `panel-class`
- 不要再继续把移动端 radius、max-height、overflow 写在全局 `.xy-dialog`

继续往下拆，当前这批 `Dialog` 已经能按宽度和用途再分成几类公共壳层：

| 壳层类型 | 建议 `panel-class` | 典型宽度 | 适用页面 |
| --- | --- | --- | --- |
| 窄表单型 | `dialog-shell--narrow` | 默认宽度或 `500px` 左右 | `system/task`、`system/file`、`content/category`、`system/menu`、`system/user` |
| 标准表单型 | `dialog-shell--form` | `560px - 600px` | `system/role`、`system/announcement`、`business/product` |
| 中宽配置型 | `dialog-shell--config` | `680px` 左右 | `system/role` 的权限配置 |
| 宽内容型 | `dialog-shell--wide` | `800px` 左右 | `content/article` |

当前可直接参考的页面归类：

- `dialog-shell--narrow`
  - `src/views/system/task/index.vue`
  - `src/views/system/file/index.vue`
  - `src/views/content/category/index.vue`
  - `src/views/system/menu/index.vue`
  - `src/views/system/user/index.vue`
- `dialog-shell--form`
  - `src/views/system/role/index.vue`
  - `src/views/system/announcement/index.vue`
  - `src/views/business/product/index.vue`
- `dialog-shell--config`
  - `src/views/system/role/index.vue` 的权限配置弹窗
- `dialog-shell--wide`
  - `src/views/content/article/index.vue`

这层分型的意义不是先把 class 写死到组件库里，而是给后续业务项目迁移一个稳定命名面：

- 同一类 `Dialog` 先共用一套 `panel-class` 名称
- 再把中屏/移动端的 radius、max-height、overflow 规则收敛到这些壳层
- 避免每个页面单独发明一套 `user-dialog-panel / role-dialog-panel / file-dialog-panel`

建议的执行顺序：

1. 先拿 `dialog-shell--narrow` 做第一批验证，因为页面最多、风险最低。
2. 再收 `dialog-shell--form`。
3. `dialog-shell--config` 和 `dialog-shell--wide` 单独验收，不和表单弹窗混改。

建议的壳层样式骨架可以先统一成下面这套，再按页面细节微调：

```scss
.dialog-shell--narrow,
.dialog-shell--form,
.dialog-shell--config,
.dialog-shell--wide {
  --xy-dialog-header-padding-y: 10px;
  --xy-dialog-header-padding-x: 16px;
  --xy-dialog-body-padding-y: 10px;
  --xy-dialog-body-padding-x: 16px;
  --xy-dialog-footer-padding-y: 10px;
  --xy-dialog-footer-padding-x: 16px;
}

.dialog-shell--narrow {
  max-width: min(520px, calc(100vw - 32px));
}

.dialog-shell--form {
  max-width: min(600px, calc(100vw - 32px));
}

.dialog-shell--config {
  max-width: min(680px, calc(100vw - 32px));
}

.dialog-shell--wide {
  max-width: min(800px, calc(100vw - 32px));
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .dialog-shell--narrow,
  .dialog-shell--form,
  .dialog-shell--config,
  .dialog-shell--wide {
    max-width: 90vw;
    margin: 20px auto;
  }
}

@media screen and (max-width: 768px) {
  .dialog-shell--narrow,
  .dialog-shell--form,
  .dialog-shell--config,
  .dialog-shell--wide {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

如果页面只是想统一节奏，优先先改这些公开变量，不要继续 deep 到内部结构：

- `--xy-dialog-header-padding-y/x`
- `--xy-dialog-body-padding-y/x`
- `--xy-dialog-footer-padding-y/x`
- `--xy-dialog-bg`
- `--xy-dialog-title-color`

只有当某一页确实需要特殊布局时，才在这些公共壳层之上再叠业务局部 class。

### 批次 B：详情型 Drawer

这批当前样本很少，但边界最清楚：

- `src/views/business/order/index.vue`

当前页面已经使用 `XyDrawer :size="600"`。这类页面默认先保留 `size`，只有确实需要响应式壳层时，再引入原生 `class`（`custom-class` 已废弃），不要误用 `panel-class`。

这批的迁移目标：

- 保留 `size` 作为主尺寸语义
- 如果移动端需要特殊圆角、高度或滚动规则，优先挂到原生 `class`（`custom-class` 已废弃）
- 不要把 `Drawer` 跟 `Dialog` 混成一套全局覆盖

当前这批虽然只有 `business/order` 一个样本，但已经可以先定义统一的壳层命名：

| 壳层类型 | 建议原生 `class` | 典型尺寸 | 适用页面 |
| --- | --- | --- | --- |
| 详情侧栏型 | `drawer-shell--detail` | `600px` 左右 | `business/order` |

建议的壳层样式骨架可以先统一成下面这套，再按具体业务补局部 class：

```scss
.drawer-shell--detail {
  --xy-drawer-header-padding-y: 10px;
  --xy-drawer-header-padding-x: 16px;
  --xy-drawer-body-padding-y: 10px;
  --xy-drawer-body-padding-x: 16px;
  --xy-drawer-footer-padding-y: 10px;
  --xy-drawer-footer-padding-x: 16px;
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .drawer-shell--detail {
    width: min(560px, 90vw) !important;
  }
}

@media screen and (max-width: 768px) {
  .drawer-shell--detail {
    width: 100% !important;
    max-width: 100vw;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
}
```

如果页面只是想统一节奏，优先先改这些公开变量，不要继续 deep 到内部结构：

- `--xy-drawer-header-padding-y/x`
- `--xy-drawer-body-padding-y/x`
- `--xy-drawer-footer-padding-y/x`
- `--xy-drawer-bg`
- `--xy-drawer-title-color`

这批的执行顺序也很直接：

1. 先保留页面现有 `:size="600"` 语义。
2. 再把中屏/移动端的壳层规则收进 `drawer-shell--detail`。
3. 最后才看是否真的需要页面局部的内容布局样式。

## 首批最适合落地的覆盖替换组

这一步不是让业务项目再发明一轮页面补丁，而是把当前已经验证过的组件库 contract 和后台项目残留的全局覆盖，对齐成两组最容易安全落地的替换批次。

选择这两组作为第一批，原因很直接：

- 命中的页面少，风险边界清楚。
- 已经有稳定的实例级入口，不需要继续改组件库实现。
- 可以直接替换后台项目里最典型的全局 `.xy-dialog` 覆盖，而不用先大面积动表格和筛选区。

### 替换组 1：`dialog-shell--narrow`

这组优先处理“窄表单型 Dialog”。它们的共同点是：

- 已经在用 `XyDialog`
- 主要承载新增 / 编辑 / 上传 / 分类维护这类轻量表单
- 默认宽度相近，响应式约束也基本一致

当前建议先纳入这组的后台文件：

- `src/views/system/task/index.vue`
- `src/views/system/file/index.vue`
- `src/views/content/category/index.vue`
- `src/views/system/menu/index.vue`
- `src/views/system/user/index.vue`

这组页面推荐的落地动作：

1. 在对应 `XyDialog` 实例上补统一的 `panel-class="dialog-shell--narrow"`。
2. 保留页面已经声明的 `width`；如果页面当前没写宽度，再按实际内容补 `500px` 左右的实例宽度。
3. 把全局 `.xy-dialog` 上的中屏 / 移动端响应式规则迁到 `dialog-shell--narrow`。
4. 确认没有继续命中 `.xy-dialog__header / __body / __footer` 的历史 deep 覆盖。

建议的替换顺序：

- 先从 `system/task`、`system/file` 开始，因为内容区最轻，最容易验证。
- 再收 `content/category`、`system/menu`。
- `system/user` 最后收，因为它通常还会同时带列表操作和表单校验。

这组对应的旧覆盖，优先从后台项目全局样式里迁走：

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

替换后的推荐写法：

```vue
<xy-dialog
  v-model="visible"
  title="编辑任务"
  width="500px"
  panel-class="dialog-shell--narrow"
>
  <!-- content -->
</xy-dialog>
```

```scss
.dialog-shell--narrow {
  --xy-dialog-header-padding-y: 10px;
  --xy-dialog-header-padding-x: 16px;
  --xy-dialog-body-padding-y: 10px;
  --xy-dialog-body-padding-x: 16px;
  --xy-dialog-footer-padding-y: 10px;
  --xy-dialog-footer-padding-x: 16px;
  max-width: min(520px, calc(100vw - 32px));
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .dialog-shell--narrow {
    max-width: 90vw;
    margin: 20px auto;
  }
}

@media screen and (max-width: 768px) {
  .dialog-shell--narrow {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

这组可以删掉的旧规则类型：

- 全局 `.xy-dialog` 的 `max-width / margin / border-radius / overflow-y`
- 页面里只为了统一 padding 而写的 `.xy-dialog__header / __body / __footer`

这组先别急着删的内容：

- 和具体表单结构耦合的业务排版
- 操作按钮排列、上传区布局、树节点编辑区这类业务内部结构样式

这组的最小验收步骤：

1. 任选 `system/task` 或 `system/file` 先替换一个页面。
2. 验证桌面、中屏、移动端下弹窗宽度和滚动行为是否正常。
3. 确认弹窗 header / body / footer 的背景、边框、阴影仍然跟随组件库默认基线。
4. 再删除对应的全局 `.xy-dialog` 规则，回归一次同组其它页面。

### 替换组 2：`drawer-shell--detail`

这组优先处理“详情型 Drawer”。当前样本虽然少，但 contract 最清楚，也最适合拿来做 `Drawer` 的标准迁移模板。

当前建议先纳入这组的后台文件：

- `src/views/business/order/index.vue`

这组页面推荐的落地动作：

1. 保留实例现有的 `:size="600"` 作为主尺寸语义。
2. 在 `XyDrawer` 上补统一的 `class="drawer-shell--detail"`（`custom-class` 已废弃，改用原生 `class`）。
3. 把中屏 / 移动端下的宽度、圆角和边界规则迁到 `drawer-shell--detail`。
4. 不要误用 `panel-class`；`Drawer` 当前公开的是原生 `class` + `header-class / body-class / footer-class`。

推荐写法：

```vue
<xy-drawer
  v-model="visible"
  :size="600"
  class="drawer-shell--detail"
>
  <!-- content -->
</xy-drawer>
```

```scss
.drawer-shell--detail {
  --xy-drawer-header-padding-y: 10px;
  --xy-drawer-header-padding-x: 16px;
  --xy-drawer-body-padding-y: 10px;
  --xy-drawer-body-padding-x: 16px;
  --xy-drawer-footer-padding-y: 10px;
  --xy-drawer-footer-padding-x: 16px;
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .drawer-shell--detail {
    width: min(560px, 90vw) !important;
  }
}

@media screen and (max-width: 768px) {
  .drawer-shell--detail {
    width: 100% !important;
    max-width: 100vw;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
}
```

这组可以删掉的旧规则类型：

- 为了抽屉响应式尺寸写在全局样式里的 `.xy-drawer` 根类覆盖
- 为了统一 padding 而 deep 到 `.xy-drawer__header / __body / __footer` 的旧规则

这组的最小验收步骤：

1. 验证桌面端 `size=600` 语义不变。
2. 验证平板宽度是否正确收敛到 `min(560px, 90vw)`。
3. 验证移动端是否铺满宽度且圆角只保留顶部。
4. 确认详情区内容布局没有因为抽屉壳层迁移而被误伤。

## 首批替换组的执行原则

这两组落地时，建议统一遵守下面这套顺序，不要边删全局覆盖边同时乱改业务结构：

1. 先给实例补 `panel-class` 或原生 `class`。
2. 再把原来写在全局 `.xy-dialog` 或 `.xy-drawer` 上的响应式规则迁过去。
3. 页面稳定后，再删掉原全局覆盖。
4. 最后才判断是否还需要少量业务局部 class。

一句话原则：

- 先挂实例壳层，再删全局根类。
- 先保留业务宽度语义，再统一响应式边界。
- 先验证 contract 生效，再删 deep 覆盖。

### 批次 C：普通列表页 Table Shell

这批页面的共同点是：

- 基本都已经有 `table-shell`
- 目标不是改表格结构，而是让 header / border / spacing / mobile scroll 回到 wrapper token
- 优先参考 [Table 表格](/components/table) 里的 `list-shell`

当前可直接归到这批的页面有：

- `src/views/system/user/index.vue`
- `src/views/system/role/index.vue`
- `src/views/system/announcement/index.vue`
- `src/views/system/task/index.vue`
- `src/views/system/file/index.vue`
- `src/views/system/log/index.vue`
- `src/views/content/article/index.vue`
- `src/views/business/product/index.vue`
- `src/views/statistics/report/index.vue`
- `src/views/system/monitor/index.vue`

这批的迁移目标：

- 把全局 `.xy-table { display: block; overflow-x: auto; }` 迁到 wrapper
- 普通列表页统一走 `table-shell + --xy-table-*`
- 继续删除 `.xy-table__cell / __header-cell / __append-wrapper` 这类内部结构覆盖

### 批次 D：Dashboard / 概览型 Table

这批页面已经不是普通列表页，应单独看待：

- `src/views/dashboard/index.vue`

当前这个页面已经在使用：

- `overview`
- wrapper token
- overview token，如 `--xy-table-overview-cell-padding-*`

这批页面不应该再和普通列表页共用一套“全局缩小 padding”的思路。后续如果要迁移，优先把它当成概览参考页，而不是列表页模板。

一句话分型：

- `dashboard/index.vue` 是概览参考页。
- 其余大部分 `table-shell` 页面，先按普通列表页批量迁移。

## Table 首批最适合落地的替换组

`table` 这一批不要一上来就全局删样式。现在更适合先把后台项目里的表格迁成两组，分别处理“普通列表页”和“概览表”。

这样分组的原因很明确：

- 两组的目标完全不同，不能共用一套“缩小 padding”的思路。
- 普通列表页更适合迁到 `table-shell + --xy-table-*`。
- 概览表已经有 `overview` 能力，应该优先用组件库 contract，而不是继续写 cell 级 deep 覆盖。

### 替换组 3：`table-shell--list`

这组优先处理“普通列表页 Table”。它们的共同点是：

- 已经有或很容易补 `table-shell` wrapper
- 主要问题是 header / border / hover / stripe / mobile scroll 还残留页面层覆盖
- 不需要引入 `overview`

当前建议先纳入这组的后台文件：

- `src/views/system/user/index.vue`
- `src/views/system/role/index.vue`
- `src/views/system/announcement/index.vue`
- `src/views/system/task/index.vue`
- `src/views/system/file/index.vue`
- `src/views/system/log/index.vue`
- `src/views/content/article/index.vue`
- `src/views/business/product/index.vue`
- `src/views/statistics/report/index.vue`
- `src/views/system/monitor/index.vue`

这组页面推荐的落地动作：

1. 保留默认 `size="md"` 合同，不要为了“轻一点”直接全局缩小 table。
2. 给页面表格统一包一层 `table-shell table-shell--list`。
3. 把 header / border / hover / stripe / spacing 优先迁到 wrapper token。
4. 把小屏横向滚动从全局 `.xy-table` 根类迁到 wrapper。
5. 清理 `.xy-table__cell / __header-cell / __append-wrapper / __empty-block` 这类历史 deep 覆盖。

建议先从下面几页起步：

- `system/user`
- `system/role`
- `system/task`

这几页的代表性最强，也最容易验证“普通列表页 contract 是否足够”。

推荐写法：

```vue
<template>
  <div class="table-shell table-shell--list table-shell--mobile-scroll">
    <xy-table :data="rows" row-key="id">
      <!-- columns -->
    </xy-table>
  </div>
</template>
```

```scss
.table-shell--list {
  --xy-table-header-background: var(--bg-elevated);
  --xy-table-header-text-color: var(--text-secondary);
  --xy-table-border-color: var(--border-default);
  --xy-table-row-hover-background: color-mix(in srgb, var(--bg-elevated) 88%, var(--brand-500) 12%);
  --xy-table-striped-row-background: color-mix(in srgb, var(--bg-surface) 90%, var(--brand-500) 10%);
  --xy-table-body-cell-padding-y: 10px;
  --xy-table-body-cell-padding-x: 12px;
  --xy-table-header-cell-padding-y: 10px;
  --xy-table-header-cell-padding-x: 12px;
}

@media screen and (max-width: 480px) {
  .table-shell--mobile-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table-shell--mobile-scroll :deep(.xy-table) {
    min-width: 640px;
  }
}
```

这组对应的旧覆盖，优先从后台项目全局样式或页面 scoped 样式里迁走：

```scss
@media screen and (max-width: 480px) {
  .xy-table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

:deep(.xy-table__cell) {
  padding: 8px 12px;
}

:deep(.xy-table__header-cell) {
  background: #fafafa;
}
```

这组可以删掉的旧规则类型：

- 全局 `.xy-table { display: block; overflow-x: auto; }`
- 只为了压密度而写的 `.xy-table__cell / __header-cell` padding 覆盖
- 只为了接主题而写的 `.xy-table__row:hover > .xy-table__cell`、header 背景、边框颜色覆盖

这组先别急着删的内容：

- 操作列按钮排列
- 展开行里明显依赖业务结构的内容样式
- 和第三方内容渲染耦合的表格样式

这组的最小验收步骤：

1. 先替换 `system/user` 或 `system/role` 一个页面。
2. 验证亮色 / 暗色主题下 header、body、border、hover、stripe 是否跟随 token。
3. 验证小屏时横向滚动是否只发生在 wrapper，而不是继续命中全局 `.xy-table`。
4. 再回归同组另外 1 到 2 个列表页，确认普通列表页不需要 `overview` 也能保持干净基线。

### 替换组 4：`table-shell--overview`

这组优先处理“Dashboard / 概览型 Table”。这类页面不能再沿用普通列表页的迁移心智。

当前建议先纳入这组的后台文件：

- `src/views/dashboard/index.vue`

这组页面推荐的落地动作：

1. 显式开启 `overview`。
2. 保留 wrapper，但把节奏微调优先放到 `--xy-table-overview-*` token。
3. 不要再靠 `.xy-table__cell`、`.xy-table__expanded-content` 之类内部类名手工压缩。

推荐写法：

```vue
<template>
  <div class="table-shell table-shell--overview">
    <xy-table
      overview
      :data="rows"
      row-key="id"
    >
      <!-- columns -->
    </xy-table>
  </div>
</template>
```

```scss
.table-shell--overview {
  --xy-table-overview-cell-padding-y: 8px;
  --xy-table-overview-cell-padding-x: 12px;
  --xy-table-header-cell-padding-y: 8px;
  --xy-table-header-cell-padding-x: 12px;
  --xy-table-header-color: var(--text-tertiary);
  --xy-table-row-hover-background: color-mix(in srgb, var(--bg-elevated) 90%, var(--brand-500) 10%);
}
```

这组可以删掉的旧规则类型：

- 为了“看起来像 dashboard 卡片表”而手工压缩的 `.xy-table__cell` padding
- 为了弱化 header 而单独写的 `.xy-table__header-cell` 字色 / 背景覆盖
- 为了收轻 hover 而 deep 到 row / cell 的 hover 规则

这组的最小验收步骤：

1. 验证开启 `overview` 后，首屏密度是否明显轻于普通列表页。
2. 验证 header 节奏、cell padding 和 hover 不再依赖页面 deep 覆盖。
3. 验证同页其它普通表格没有被误切成 `overview` 语义。

## Table 首批替换组的执行原则

`table` 这条线建议按下面的顺序推进，不要把列表页和概览页混改：

1. 先判断当前页面是普通列表页还是概览表。
2. 普通列表页先挂 `table-shell--list` 或 `table-shell--mobile-scroll`，优先用 `--xy-table-*`。
3. 概览表先显式开启 `overview`，再用 `--xy-table-overview-*` 微调。
4. 页面稳定后，再删除旧的 `.xy-table` 根类和 `__cell / __header-cell` deep 覆盖。

一句话原则：

- 列表页优先 wrapper token。
- 概览页优先 `overview`。
- 不要再用一套全局 cell padding 去同时解决两类页面。

## 优先顺序

1. 先处理 `dialog / drawer / tooltip / popconfirm / popover / select / dropdown / date-picker / time-select / time-picker / cascader / tree-select / auto-complete`。
2. 再处理 `message / notification / loading`。
3. 最后处理 `table`，普通列表页用 wrapper token，dashboard / 摘要页用 `overview`。

## 迁移 checklist

- 删除页面层对浮层内部面板类名的 `background / border / shadow / padding` 覆盖。
- 优先改成组件实例上的 `popper-class`、`panel-class`、`body-class`，或者直接覆盖对应 `--xy-*` 变量。
- `message / notification / loading` 只保留真正的业务强度差异，不要把它们当普通卡片或遮罩去写页面样式；其中 `loading` 的 directive 层优先改成 `xy-loading-*`，loading service 再用 `customClass / background / text`。
- `table` 普通列表页优先用 wrapper token，不要继续 deep 到 `.xy-table__cell`、`.xy-table__header-cell`、`.xy-table__append-wrapper`。
- `table` 用于 dashboard 首屏、经营看板或摘要区时，优先开启 `overview`。
- 对筛选区组件，优先删掉 trigger / dropdown / option / cell 这些内部类名覆盖，先观察组件库默认基线是否已满足页面。
- 如果页面里的卡片标题或浮层触发器根本没渲染出来，先回头核对组件公开 contract，而不是先补页面样式。

额外判断规则：

- 如果 `Popconfirm` 的按钮已经真实可见，但视觉还是偏重，先删页面层对 `tooltip / popconfirm` 内部面板类名的覆盖，再决定是否需要业务局部 token。
- 如果 `Dialog` 的底色、边框、阴影已经跟上主题，但 body/header padding 还是旧值，优先搜业务页或全局样式里是否还在覆盖 `.xy-dialog__header / .xy-dialog__body / .xy-dialog__footer`。
- 如果表格暗色主题已经不再发白，但 dashboard 仍然像列表页一样偏重，优先切到 `overview`，不要先去全局缩小 `.xy-table th / td`。

## 推荐迁移顺序

建议按“最容易回收页面覆盖”的顺序删，不要一上来全删：

1. 先删浮层和通知类覆盖：
   - `dialog / drawer / tooltip / popconfirm / popover / dropdown / menu / message / notification / loading`
   - 这批现在应优先使用 `popper-class / panel-class / body-class / 原生 class（Drawer） / custom-class（message、notification） / xy-loading-*（loading directive） / customClass（loading service）` 和实例级 token
2. 再删筛选区覆盖：
   - `select / auto-complete / cascader / tree-select / date-picker / time-picker / time-select`
   - 重点回收 trigger、dropdown、option、cell、快捷项这类内部类名覆盖
3. 最后删表格覆盖：
   - 列表页优先迁到 wrapper token
   - dashboard / 摘要区优先迁到 `overview`

## 业务项目删除覆盖时的判断标准

可以删：

- 纯视觉覆盖：`background / border / shadow / border-radius / padding / color / hover / selected`
- 为了主题切换临时写在页面层的亮暗色修补
- 为了压视觉层级写在页面层的“更轻一点 / 更干净一点”覆盖

先别删：

- 真正和页面结构耦合的布局样式，例如操作列按钮排列、业务区块间距、复合卡片内部排版
- 直接依赖业务类名、业务状态类或异步加载链路的结构样式
- 明显属于业务品牌差异，而不是组件默认基线的问题

一句话判断：如果页面覆盖只是在“修组件默认态太重、太亮、太乱”，现在应优先回到组件库层能力。

补充一条联调后的判断规则：

- 如果页面样式命中的是业务 wrapper、自定义 `body-class` 或 `--xy-*` token，先不要把它和旧 deep 补丁混为一类。
- 如果页面样式直接命中 `.xy-dialog`、`.xy-table` 或更深的 `__body / __cell / __option`，再优先判断是否属于应继续收口的历史覆盖。

## 常见替代

| 旧写法 | 推荐替代 |
| --- | --- |
| `.xy-dialog__header { padding: ... }` | `panel-class` / `body-class` / `footer-class` + `--xy-dialog-*` 变量 |
| `.xy-drawer__body { padding: ... }` | `body-class` / `header-class` / `footer-class` + `--xy-drawer-*` 变量 |
| `.xy-popover__panel / .xy-tooltip__content / .xy-popconfirm__panel` | `popper-class` + 对应 `--xy-*` 变量 |
| `.xy-select__dropdown / .xy-dropdown__panel` | `popper-class` + 对应 `--xy-*` 变量 |
| `.xy-message` / `.xy-notification` | 组件级 `type`、`plain`、`custom-class`（service 对应 `customClass`） |
| `.xy-loading`（directive） | `xy-loading-custom-class / xy-loading-background / xy-loading-text` |
| `loading` service / options | `customClass` / `background` / `text` |
| `.xy-table__cell { padding: ... }` | `--xy-table-body-cell-padding-y/x` |
| `.xy-table__header-cell { background: ... }` | `--xy-table-header-background` |
| `.xy-table__row:hover > .xy-table__cell { background: ... }` | `--xy-table-row-hover-background` |
| `.xy-table__expanded-cell / __append-wrapper / __empty-block` | `overview` 或 overview token |

## 高优先级 contract 提醒

这条迁移线里，最容易被误判成“样式没生效”的，其实有两类 contract 问题。它们都应先回到组件公开入口修正，不要继续在页面层打补丁。

### `Popconfirm` 的旧触发写法兼容边界

- 当前组件已经兼容一类旧写法：
  - 未提供 `reference` 插槽
  - 且没有传 `content`
  - 此时 `default` 插槽会被视为 trigger
- 这主要用于兼容历史页面里直接把按钮写在默认插槽的场景，避免“删除 / 清空按钮直接消失”。
- 但如果页面同时把 `default` 当 trigger，又想把正文也塞进默认插槽，这仍然是歧义写法；应显式改成：
  - `#reference` 负责触发器
  - `content` 或默认插槽负责正文

推荐写法：

```vue
<xy-popconfirm title="确认删除">
  <template #reference>
    <xy-button text type="danger">删除</xy-button>
  </template>
  删除后将无法恢复
</xy-popconfirm>
```

### `XyCard` 的公开 contract 不是 `title / #header-extra`

- `XyCard` 当前真实公开 contract 是：
  - `header`
  - `extra`
  - `header-class / body-class / footer-class`
- 不是：
  - `title`
  - `#header-extra`
- 如果页面仍然写 `<XyCard title=\"...\">` 或 `<template #header-extra>`，结果通常不是“header 样式失效”，而是 `xy-card__header` 根本不会渲染。

推荐写法：

```vue
<xy-card
  header="经营分析"
  header-class="dashboard-card__header"
  body-class="dashboard-card__body"
>
  <template #extra>
    <xy-button text>查看全部</xy-button>
  </template>
  <div>卡片内容</div>
</xy-card>
```

判断顺序：

1. 先看 header / trigger 是否真实渲染。
2. 再看 `header-class / body-class / popper-class` 这类公开入口是否已经挂上。
3. 最后才判断是不是还需要业务局部 token。

## 筛选区组件的替代策略

后台项目最容易留下历史 `deep` 覆盖的其实不是按钮，而是筛选区。现在这批组件优先按下面的方式回收：

| 旧覆盖写法 | 推荐替代 |
| --- | --- |
| `.xy-select__trigger / .xy-cascader__trigger / .xy-tree-select__trigger` | 优先删除；仍需轻度调节时，只在业务 wrapper 上覆写对应 `--xy-*trigger*` 或实例级变量 |
| `.xy-select__dropdown / .xy-cascader__dropdown / .xy-tree-select__dropdown` | `popper-class` + 对应 `--xy-*dropdown*` 变量 |
| `.xy-auto-complete__option / .xy-time-select__option` | 先删除页面覆盖，保留组件库默认 option hover / selected 态 |
| `.xy-date-picker__cell / .xy-time-picker__option / __action / __shortcut` | 先回到组件库默认态；只在业务确有品牌差异时，再做实例级轻覆写 |

补充说明：

- `date-picker / time-picker / time-select / select / auto-complete / cascader / tree-select` 这一组现在默认已经按同一套后台输入浮层基线收过一轮，主题切换优先依赖组件库默认态，不建议再在页面层分别压阴影和分区背景。
- 如果业务页面只是想“让筛选条更克制一点”，默认先删页面级 `:deep(.xy-*)`，只保留 wrapper 上的少量全局 token 接轨；不要继续把每个 trigger / dropdown / option 当单独组件修。

推荐的筛选条 wrapper 写法示例：

```vue
<template>
  <div class="filter-shell">
    <xy-select />
    <xy-cascader />
    <xy-date-picker />
    <xy-time-select />
  </div>
</template>

<style scoped>
.filter-shell {
  --xy-bg-color-elevated: var(--bg-elevated);
  --xy-border-color-strong: var(--border-strong);
}
</style>
```

- 这类 wrapper 级变量，只应该做页面主题接轨。
- 不建议继续 deep 到 `__trigger / __dropdown / __option / __cell` 改内部类名。

## 筛选区首批最适合落地的替换组

筛选区这条线不要按单个组件散着修。后台项目更常见的真实问题，是一整条筛选条同时命中了 trigger、dropdown、option、cell 的历史 deep 覆盖。

所以更稳的方式，是按“筛选条场景”而不是按单个组件拆组。

### 替换组 5：`filter-shell--toolbar`

这组优先处理“普通列表页筛选条”。它们的共同点是：

- 组件种类多，但本质都属于后台工具栏筛选区
- 想解决的是整体克制感，而不是单个下拉面板的品牌化视觉
- 最适合优先迁到 wrapper token，再逐步删内部类名覆盖

当前建议优先纳入这组的组件：

- `xy-select`
- `xy-auto-complete`
- `xy-cascader`
- `xy-tree-select`
- `xy-date-picker`
- `xy-time-picker`
- `xy-time-select`

这组推荐的落地动作：

1. 先给页面筛选条统一包一层 `filter-shell filter-shell--toolbar`。
2. 先把背景、边框、elevated surface 这类主题接轨迁到 wrapper token。
3. 再删 trigger / dropdown / option / cell 相关 deep 覆盖。
4. 只有某个实例确实需要特殊面板视觉时，再补 `popper-class`。

推荐写法：

```vue
<template>
  <div class="filter-shell filter-shell--toolbar">
    <xy-select />
    <xy-cascader />
    <xy-tree-select />
    <xy-date-picker />
    <xy-time-select />
  </div>
</template>
```

```scss
.filter-shell--toolbar {
  --xy-bg-color-elevated: var(--bg-elevated);
  --xy-border-color-strong: var(--border-strong);
  --xy-fill-color-light: color-mix(in srgb, var(--bg-elevated) 92%, var(--brand-500) 8%);
  --xy-text-color-secondary: var(--text-secondary);
}
```

这组可以优先删掉的旧规则类型：

- `.xy-select__trigger / .xy-cascader__trigger / .xy-tree-select__trigger`
- `.xy-select__dropdown / .xy-cascader__dropdown / .xy-tree-select__dropdown`
- `.xy-auto-complete__option / .xy-time-select__option`
- `.xy-date-picker__cell / .xy-time-picker__option / __action / __shortcut`

这组先别急着删的内容：

- 只命中业务 wrapper 的间距规则
- 搜索表单栅格布局
- 明显依赖业务状态类的标签或按钮排列

这组的最小验收步骤：

1. 先验证 trigger、placeholder、清空按钮在亮色主题下是否正常。
2. 再验证 dropdown / option / cell 在暗色主题下是否还存在局部发白。
3. 验证 hover、selected、快捷项、日期面板单元格是否已经回到组件库默认基线。
4. 最后再决定是否还有少量实例需要 `popper-class`。

### 替换组 6：`filter-shell--range`

这组优先处理“时间区间 / 组合筛选”这类较重的筛选面板。它们的共同点是：

- 更容易留下 `.xy-date-picker__cell`、`.xy-time-picker__option`、`.xy-time-select__option` 这类深层覆盖
- 经常伴随快捷项、区间输入和复杂 dropdown
- 不适合只靠 trigger 级微调解决

当前建议优先纳入这组的组件：

- `xy-date-picker`
- `xy-time-picker`
- `xy-time-select`
- 以及与其并排出现的 `xy-select / xy-auto-complete`

这组推荐的落地动作：

1. 先保留原页面的业务筛选流程，不先动联动逻辑。
2. 给外层筛选区统一包一层 `filter-shell filter-shell--range`。
3. 优先删日期 / 时间面板里的 cell、option、shortcut、action 纯视觉覆盖。
4. 如果确实还需要个别 dropdown 样式差异，再落到实例 `popper-class`，不要重新回到全局 deep 覆盖。

推荐写法：

```vue
<template>
  <div class="filter-shell filter-shell--range">
    <xy-date-picker type="daterange" />
    <xy-time-select />
    <xy-select />
  </div>
</template>
```

```scss
.filter-shell--range {
  --xy-bg-color-elevated: var(--bg-elevated);
  --xy-border-color-strong: var(--border-strong);
  --xy-fill-color-light: color-mix(in srgb, var(--bg-elevated) 90%, var(--brand-500) 10%);
  --xy-text-color-secondary: var(--text-secondary);
}
```

这组可以优先删掉的旧规则类型：

- `.xy-date-picker__cell`
- `.xy-time-picker__option`
- `.xy-time-select__option`
- `.xy-date-picker__action / __shortcut`
- `.xy-date-picker__panel` 或同类面板上的纯视觉覆盖

这组的最小验收步骤：

1. 验证日期单元格、时间 option、快捷项、操作区在亮色 / 暗色主题下是否都回到统一基线。
2. 验证 range 选择、hover、selected、禁用态没有被误伤。
3. 验证清空、展开、确认等交互仍然正常。

## 筛选区替换组的执行原则

筛选区这条线建议按下面顺序推进，不要先改单个 option 或单个 dropdown：

1. 先给整条筛选区挂 `filter-shell`。
2. 先用 wrapper token 接主题，再删 deep 覆盖。
3. 只有确实需要特殊面板视觉时，才给单个实例补 `popper-class`。
4. 不要再把 trigger、dropdown、option、cell 分别当成独立组件修。

一句话原则：

- 先收整条筛选区。
- 再删内部类名覆盖。
- 最后才做实例级特化。

## 表格迁移策略

`table` 这一项不要和浮层、筛选区混着删，建议单独处理：

- 普通列表页：
  - 先迁到 wrapper token
  - 保留 `size="md"` 默认合同
  - 不要再全局缩小所有 cell padding
- dashboard / 摘要区：
  - 优先启用 `overview`
  - 仍需微调时，再加 `--xy-table-overview-*` 变量

当前推荐组合：

- 普通列表页：`wrapper token + 默认 table`
- 首屏摘要表：`overview + wrapper token`

联调里最常见的两类残留如下：

- 普通列表页残留：
  - 还在页面层或全局样式里写 `.xy-table th / td { padding: ... }`
  - 还在 deep 到 `.xy-table__row:hover > .xy-table__cell`
  - 这类都应先迁到 `.table-shell` 这类 wrapper token
- dashboard 摘要表残留：
  - 已经想要更紧凑的节奏，却仍然只靠 `.xy-table__cell` / `.xy-table__expanded-content` 手工压 padding
  - 这类应先开启 `overview`，再按需补 `--xy-table-overview-*`

如果业务项目已经像 dashboard 一样显式写了 `overview`，但还保留大量 cell 级 deep 覆盖，默认应继续删覆盖，而不是反过来把 `overview` 当成无效能力。

## 浮层迁移策略

浮层类这轮最容易被误判。建议按下面顺序排查：

1. 先确认按钮或 trigger 是否真实可见。
2. 再确认点击后是否弹出真实浮层。
3. 最后才判断视觉层级是不是还要做业务局部微调。

对于已经接入这轮组件库改动的业务项目，下面这些现象通常不该再当成组件库 bug：

- `Popconfirm` 删除按钮消失：
  - 如果页面还在用旧写法，先升级到这轮组件库；正常情况下按钮应恢复可见。
- `Tooltip / Popconfirm` 暗色主题下仍像一块亮白卡片：
  - 优先检查业务页是否自己覆写了 `background / border / shadow`。
- `Dialog / Drawer` 的底色和边框已经对了，但 body/header padding 还是旧值：
  - 优先检查业务全局样式或 scoped deep 覆盖；组件库默认值不应继续替业务页面兜底。

## 迁移完成后的目标状态

当一个后台页面完成迁移后，理想状态应该是：

- 页面层不再维护大块 `.xy-*` 内部类名覆盖
- 页面层只保留业务结构样式和少量 wrapper 级 token
- 浮层、筛选区、通知、表格的亮暗主题切换都主要依赖组件库默认基线
- 新页面默认先用组件库默认态，不再预设“要先补一轮 deep 样式”

## 后台项目覆盖删除顺序清单

真正回后台项目落地时，建议不要“搜到 `.xy-` 就直接删”。现在更稳的方式，是按规则类型和风险分层删除。

### 第 1 层：先删全局根类覆盖

这层优先级最高，因为它最容易把整个后台项目的视觉基线绑死在旧样式上。

优先处理：

- `src/style/index.scss` 里的全局 `.xy-dialog`
- 同文件里小屏下的全局 `.xy-table`

推荐删除顺序：

1. 先给对应页面补上 `dialog-shell--narrow`、`drawer-shell--detail`、`table-shell--mobile-scroll`
2. 再删全局 `.xy-dialog` 的 `max-width / margin / border-radius / overflow-y`
3. 再删全局 `.xy-table` 的 `display: block / overflow-x: auto`

这一层删完后的回归重点：

- `dialog` 在桌面 / 平板 / 移动端是否仍能正常控制宽度和滚动
- `table` 小屏横向滚动是否已经迁到 wrapper，而不是全局根类

### 第 2 层：再删纯视觉 deep 覆盖

这层优先删“背景、边框、阴影、padding、hover、selected”这类只是在修组件默认态的规则。

优先处理的规则类型：

- `.xy-dialog__header / __body / __footer`
- `.xy-drawer__header / __body / __footer`
- `.xy-tooltip__content / .xy-popconfirm__panel / .xy-popover__panel`
- `.xy-table__cell / __header-cell / __row:hover > __cell`
- `.xy-select__dropdown / .xy-date-picker__cell / .xy-time-select__option`

删除判断：

- 如果命中的是组件公开入口已经能承接的内容，优先删
- 如果删掉后页面只是“变回组件库默认视觉”，通常说明这条规则本来就该删

这一层删完后的回归重点：

- 浮层背景、阴影、边框是否仍然统一
- 表格 header、border、hover、stripe 是否仍然跟随 token
- 筛选区 dropdown / option / cell 是否仍然保持克制基线

### 第 3 层：最后再看结构耦合样式

这一层最容易误伤业务页面，不适合和前两层混着删。

暂时先保留：

- 操作列按钮排列
- 复合卡片内部排版
- 上传区、树节点编辑区、展开行内容区布局
- 明显依赖业务状态类或业务 wrapper 的布局规则

判断标准：

- 如果规则改的是“业务内容怎么摆”，先保留
- 如果规则改的是“组件外观该不该更轻、更暗、更克制”，优先回到组件库层

## 按文件推进的推荐删除顺序

如果后续真的回后台项目执行迁移，建议按下面顺序推进，而不是在所有页面里同时删样式。

### 第一批：先收全局入口和最轻页面

建议顺序：

1. `src/style/index.scss`
2. `src/views/system/task/index.vue`
3. `src/views/system/file/index.vue`
4. `src/views/content/category/index.vue`

原因：

- 这些页面最容易承接 `dialog-shell--narrow`
- 内容区轻，回归成本低
- 最适合验证“删全局 `.xy-dialog` 后是否还稳定”

### 第二批：收标准列表页

建议顺序：

1. `src/views/system/user/index.vue`
2. `src/views/system/role/index.vue`
3. `src/views/system/announcement/index.vue`
4. `src/views/system/log/index.vue`

原因：

- 这批能同时验证 `dialog-shell--narrow / form` 和 `table-shell--list`
- 也是后台项目最典型的 CRUD 列表页
- 一旦这批稳定，后续大部分普通后台页面都可以照抄迁移方式

### 第三批：收详情抽屉和概览表

建议顺序：

1. `src/views/business/order/index.vue`
2. `src/views/dashboard/index.vue`

原因：

- `Drawer` 和 `overview table` 都属于单独语义，不适合和普通列表页混改
- 这批页面更适合作为“专项 contract 验证页”

## 每一批删除覆盖时的最小回归顺序

每批落地时，不要只看 DOM 或只看一套主题。建议最少按下面顺序回归：

1. 先看亮色主题桌面端
2. 再看暗色主题桌面端
3. 再看中屏尺寸
4. 最后看移动端或窄屏

每一步至少确认：

- trigger / header / footer 是否真实渲染
- 浮层是否能正常打开
- 背景、边框、阴影、padding 是否回到组件库默认基线
- 没有出现“删了旧覆盖后整个组件发白 / 发亮 / 过重”的回退

## 覆盖删除时的快速决策规则

后续真正删规则时，可以直接按下面的判定走，减少来回讨论：

- 命中 `--xy-*` token：默认保留，除非变量本身已经重复或冲突
- 命中 `panel-class / body-class / custom-class / popper-class`：默认保留
- 命中 `.xy-dialog`、`.xy-table` 这类全局根类：优先迁走
- 命中 `__header / __body / __cell / __option / __panel` 这类内部结构类名：优先评估删除
- 命中业务 wrapper、自定义业务 class：默认先保留，再看是否能进一步抽象

一句话总结：

- 先删全局根类。
- 再删纯视觉 deep 覆盖。
- 结构耦合样式最后处理。

## 参考入口

- [设计令牌](/guide/theming)
- [组件总览](/components/overview)
- [Table 表格](/components/table)
- [Popover 气泡卡片](/components/popover)
- [Tooltip 文字提示](/components/tooltip)
- [Popconfirm 气泡确认框](/components/popconfirm)
