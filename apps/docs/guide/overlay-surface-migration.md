---
title: 浮层收口指南
description: 面向后台项目的浮层与覆盖层迁移清单，优先减少全局根类和内部类名覆盖。
outline: deep
---

# 浮层收口指南

这页只解决一类问题：后台项目里的弹窗、抽屉、气泡卡片、确认浮层和操作菜单，应该优先如何回到组件库公开入口，而不是继续在页面层或全局样式里改 `.xy-*` 根类和内部结构类名。

如果你还没看过总迁移策略，先读 [后台迁移指南](/guide/backend-migration)。如果你这轮主要在处理筛选条、日期面板和输入浮层，再配合 [筛选面板收口指南](/guide/filter-surface-migration) 一起看。

## 先判断这是不是组件库层问题

下面这些现象，默认都先判断为“组件库公开 contract 没被正确使用”或“历史全局覆盖还没回收”，而不是先回业务页补更多样式：

- `dialog / drawer / tooltip / popconfirm / popover / dropdown` 在亮暗主题下像两套风格。
- 页面或全局样式里还在大量命中 `.xy-dialog`、`.xy-drawer`、`.xy-tooltip`、`.xy-popconfirm`、`.xy-popover`、`.xy-dropdown`。
- 页面继续 deep 到 `__panel / __header / __body / __footer / __content / __arrow` 这类内部类名，只是为了改背景、边框、阴影、圆角或 padding。
- 浮层触发器不显示，或者浮层本体根本没打开，但页面第一反应是继续补样式。

一句话判断：

- 如果你改的是“背景、边框、阴影、层次、圆角、padding、宽度、位置、主题接轨”，优先回到组件库实例级入口。
- 如果你改的是“业务流程、弹窗字段布局、详情区块排版、操作按钮顺序”，那才更可能属于业务页。

## 后台项目这轮联调的关键结论

这轮不是只看组件库文档页，而是对后台项目做了只读审计。当前和浮层直接相关的结论如下：

- 已验证为可保留的模式：
  - `XyDialog` 通过 `width` 控制不同业务弹窗宽度
  - `XyDrawer` 通过 `size` 控制详情抽屉宽度
  - `Popconfirm` 通过 `#reference` 显式声明触发器
  - `body-class`、`header-class` 这类实例级 class 入口
  - 页面 wrapper 上接少量 `--xy-*` token
- 已确认仍值得继续收口的残留：
  - `src/style/index.scss` 里中屏和移动端下的全局 `.xy-dialog { ... }`
  - 同文件里小屏下的全局 `.xy-table { display: block; overflow-x: auto; }`

补一条非常具体的当前事实：

- 这次后台项目当前代码里，`panel-class`、`popper-class` 还没有成为主流落地方式。
- 这不代表这些入口没用，而是说明下一批迁移更适合先把“全局 `.xy-dialog` / `.xy-table` 根类覆盖”迁走，再按需要引入实例级面板 class。

这里最重要的判断不是“后台项目写了样式就都该删”，而是要区分：

- 命中公开入口和 token 的，是组件库允许的实例级定制。
- 直接命中组件根类或内部结构类名的，才是下一批应继续回收的历史覆盖。

## 推荐收口入口

| 组件 | 优先入口 | 不建议继续 deep 的位置 |
| --- | --- | --- |
| `dialog` | `width`、`panel-class`、`header-class`、`body-class`、`footer-class` | `.xy-dialog`、`__header / __body / __footer / __panel` |
| `drawer` | `size`、`direction`、原生 `class`（`custom-class` 已废弃）、`header-class`、`body-class`、`footer-class` | `.xy-drawer`、`__header / __body / __footer / __panel` |
| `tooltip` | `effect`、`popper-class`、`popper-style` | `.xy-tooltip`、`__content / __arrow` |
| `popconfirm` | `#reference`、`content`、`popper-class`、`iconColor` | `.xy-popconfirm`、`__panel / __content / __actions` |
| `popover` | `popper-class`、`popper-style`、`width` | `.xy-popover`、`__panel / __header / __body` |
| `dropdown` | `trigger`、`popper-class`、`popper-style` | `.xy-dropdown`、`__panel / __item / __divider` |

## 高优先级 contract 提醒

这条迁移线里，最容易被误判成“样式没生效”的，通常不是视觉变量，而是 trigger 和 slot contract 用错了。

### `Popconfirm` 的旧触发写法兼容边界

- 当前组件已经兼容一类历史写法：
  - 没有 `reference` 插槽
  - 且没有传 `content`
  - 此时默认插槽会被视为 trigger
- 这用于兼容旧页面里直接把按钮写在默认插槽的场景，避免“删除 / 清空按钮直接消失”。
- 但如果页面同时把默认插槽当 trigger，又想把正文也塞进默认插槽，这仍然是歧义写法，应该显式拆成 `#reference` 和正文内容。

推荐写法：

```vue
<xy-popconfirm title="确认删除">
  <template #reference>
    <xy-button text type="danger">删除</xy-button>
  </template>
  删除后将无法恢复
</xy-popconfirm>
```

### `Dialog / Drawer` 优先先看实例 contract，再看样式

如果页面里看到“弹窗已经开了，但尺寸、padding、内容区节奏不对”，判断顺序应该是：

1. 先看 `width` / `size` / `direction` 是否已经实例级声明。
2. 再看 `panel-class / body-class / header-class / footer-class` 是否已经挂上。
3. 最后才决定是否还需要少量局部 token。

`Drawer` 再补一条实现边界：

- 当前 `XyDrawer` 没有 `panel-class`，它公开的是原生 `class`，再配合 `header-class / body-class / footer-class`。
- `custom-class` 已废弃，改用组件原生 `class` 即可。
- 如果有人按 `Dialog` 的心智去给 `Drawer` 传 `panel-class`，这不是”样式没生效”，而是 contract 用错了。

不要直接从全局 `.xy-dialog` 或 `.xy-drawer` 开始修，这会把所有弹窗和抽屉一起绑死。

## 后台项目里可以保留的模式

这轮只读审计里，浮层链路已经能确认下面这些用法属于可接受的实例级 contract：

- `XyDialog` 直接通过 `width` 控制不同业务弹窗宽度
- `XyDrawer` 直接通过 `size` 控制详情抽屉宽度
- `XyPopconfirm` 通过 `#reference` 显式提供触发器
- `XyCard` 等组件上的 `body-class`、`header-class`

这些都不属于“旧 deep 补丁”，因为它们没有反向依赖组件内部 DOM 结构。

### 当前后台项目里真实已经采用的实例方式

这轮只读审计拿到的真实样本主要是下面这些：

- `system/user`：
  - 列表删除按钮已经显式使用 `Popconfirm -> #reference`
  - 用户编辑弹窗直接用 `XyDialog` 默认基线，没有再额外挂全局内部类名
- `system/role`：
  - 角色编辑弹窗和权限配置弹窗分别使用 `width="560px"`、`width="680px"`
- `business/order`：
  - 订单详情使用 `XyDrawer :size="600"`
- `layout/Header`：
  - 顶部用户菜单使用 `XyDropdown trigger="click"`

这组证据说明，后台项目已经在使用一部分健康的实例 contract，但“实例级 panel/popper 定制”还没有成为主路径，所以当前最优先的工作仍然是收走全局根类覆盖，而不是先在业务页大面积补 `panel-class`。

## 后台项目里下一批应继续收口的残留

这轮最值得继续清理的不是页面实例，而是全局根类覆盖：

- 全局 `.xy-dialog`：
  - 当前后台项目在中屏和移动端下统一改了 `max-width`、`margin`、`border-radius`、`overflow-y`
  - 这类规则会让所有弹窗共享同一套设备响应策略，优先级应该低于实例 `width`、`panel-class` 和页面容器 class
- 全局 `.xy-table`：
  - 当前后台项目在小屏下直接改成 `display: block` 和 `overflow-x: auto`
  - 这类规则虽然不是浮层，但和同一批“全局根类直改组件表现”的历史模式属于同类问题，应继续迁到 wrapper 或更明确的业务壳类

把这两类覆盖再往下拆一层，当前更可落地的替代方式是：

- `.xy-dialog { max-width: 90vw; margin: 20px auto; }`
  - 优先迁到具体业务弹窗实例的 `width`
  - 如果是某一类弹窗共享约束，再落到页面壳类或 `panel-class`
- `.xy-dialog { border-radius: ...; max-height: 85vh; overflow-y: auto; }`
  - 优先迁到页面壳类或 `panel-class`
  - `Drawer` 则对应迁到原生 `class`
- `.xy-table { display: block; overflow-x: auto; }`
  - 优先迁到 `table-shell` 这类 wrapper，而不是继续直接命中组件根类

一句话总结：

- 公开入口和 token 是保留项。
- 全局根类和内部结构类名覆盖，是下一批继续收口项。

## 可直接替换的迁移示例

下面这两段不是抽象建议，而是针对后台项目当前残留的全局 `.xy-dialog` / `.xy-table` 覆盖，给出的可直接落地替代方式。

### 把全局 `.xy-dialog` 迁到实例 `width` + 页面壳类

如果旧代码是这种全局覆盖：

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

优先迁成页面实例约束，而不是继续命中所有 dialog：

```vue
<template>
  <xy-dialog
    v-model="visible"
    title="编辑用户"
    width="560px"
    panel-class="user-dialog-panel"
  >
    <!-- content -->
  </xy-dialog>
</template>

<style scoped>
@media screen and (max-width: 1024px) and (min-width: 769px) {
  :deep(.user-dialog-panel) {
    max-width: 90vw;
    margin: 20px auto;
  }
}

@media screen and (max-width: 768px) {
  :deep(.user-dialog-panel) {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
```

迁移判断规则：

- `width` 负责业务弹窗默认宽度。
- `panel-class` 只命中当前这一类 dialog，不再全局绑死所有弹窗。
- 如果多个同类弹窗共享同一套移动端规则，也优先抽成页面壳类或业务级公共 class，不要重新回到 `.xy-dialog` 根类。

### 把全局 `.xy-table` 横向滚动迁到 wrapper

如果旧代码是这种全局覆盖：

```scss
@media screen and (max-width: 480px) {
  .xy-table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

优先迁成表格 wrapper，而不是直接改组件根类：

```vue
<template>
  <div class="table-shell table-shell--mobile-scroll">
    <xy-table :data="rows" row-key="id">
      <!-- columns -->
    </xy-table>
  </div>
</template>

<style scoped>
@media screen and (max-width: 480px) {
  .table-shell--mobile-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table-shell--mobile-scroll :deep(.xy-table) {
    min-width: 640px;
  }
}
</style>
```

迁移判断规则：

- 横向滚动属于页面容器策略，优先挂在 wrapper。
- `xy-table` 本身只保留 table token、`overview` 和列配置语义。
- 如果只是想压缩移动端节奏，先用 wrapper token 或 `overview`，不要把 `display: block` 继续写到全局 `.xy-table`。

## 推荐迁移顺序

1. 先删 `tooltip / popconfirm / popover / dropdown` 的内部类名覆盖。
2. 再收 `dialog / drawer` 的全局根类覆盖。
3. 如果页面确实还需要局部浮层差异，再按需引入 `panel-class / popper-class`。
4. 最后才处理仍然和页面布局强相关的局部样式。

不建议的顺序是：

1. 先保留全局 `.xy-dialog`
2. 再叠一层 `panel-class`
3. 最后分不清到底哪一层在控制弹窗外观

## 常见替代

| 旧写法 | 推荐替代 |
| --- | --- |
| `.xy-dialog { max-width: ... }` | 组件实例 `width` 或页面壳类约束 |
| `.xy-dialog__header / __body / __footer` | `header-class / body-class / footer-class` |
| `.xy-drawer { ... }` | 原生 `class` + 页面壳类约束 |
| `.xy-drawer__body { padding: ... }` | `body-class` + 局部 token |
| `.xy-tooltip__content / .xy-popconfirm__panel` | `popper-class` + 对应 token |
| `.xy-popover__panel / .xy-dropdown__panel` | `popper-class` + 对应 token |
| 继续把 trigger 和正文都塞进 `Popconfirm` 默认插槽 | 显式拆成 `#reference` 和正文内容 |

## 联调时怎么判断算收口成功

满足下面几点，通常说明这批浮层已经基本回到组件库层：

- 亮暗主题切换后，`dialog / drawer / tooltip / popconfirm / popover / dropdown` 看起来属于同一套背景、边框和阴影体系。
- 页面不再依赖全局 `.xy-dialog` 或内部 `__panel / __body / __header` 去修浮层视觉。
- 页面仍可保留少量实例级 class 或 wrapper token，但不再反向绑定组件内部结构。
- 触发器、标题、正文和操作区都优先按公开 contract 组织，而不是先靠样式兜底。
