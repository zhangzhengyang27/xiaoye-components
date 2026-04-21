# Plus Pro Components 质量迁移清单

## 目标

这份文档不讨论“是否直接集成 `plus-pro-components` 包”，而是限定在当前仓库边界下回答一个更具体的问题：

- 参考本地 `plus-pro-components-dev` 源码时，哪些能力值得引入到 `xiaoye-components` / `xiaoye-pro-components`
- 引入时应该落到基础层还是增强层
- 判断依据以实现质量为主，不以组件数量多少为主

适用前提：

- 底层组件仍然只使用当前仓库的 `packages/components`
- 不引入 `element-plus`
- 不破坏当前 `packages/pro-components` 的显式根导出、manifest 主源和类型白名单边界

## 评估维度

本清单的“质量”主要按以下维度判断：

- 架构边界：是否把基础控件、schema 协议、页面容器、请求链路混在同一层
- API 清晰度：组件的职责是否单一，是否存在重复抽象或命名重叠
- 类型收敛：对外暴露的协议是否稳定，是否容易把实现细节泄露到包根
- 可迁移性：脱离 `element-plus` 和 plus 自身基础设施后，是否还能低成本复用
- 测试可信度：测试更偏行为契约，还是只验证某些 DOM 是否出现
- 与当前仓库适配度：是否符合当前 base/pro 分层和 manifest 驱动治理方式

## 总结结论

按质量看，`plus-pro-components-dev` 的优势主要在“业务 schema 表达力”和“显示/渲染闭环”上，不在整体架构纯度上。

按质量看，当前 `xiaoye-components` 仓库的优势主要在：

- base / pro 分层更清晰
- 根入口白名单和类型边界更克制
- 组件职责更收敛
- 测试更贴近对外行为契约

因此迁移策略不应该是“把 plus 的主干组件搬过来”，而应该是：

- 保留当前仓库的架构骨架
- 只吸收 plus 中真正成熟、但不会破坏边界的那部分能力
- 对高价值但高耦合的实现做“重写式吸收”，而不是源码搬运

## 第一档：可直接引入

这类能力独立性强，迁入后不会把 plus 的 schema、hooks、locale、Element Plus 语义一并带进来。

### `check-card`

建议落位：

- `packages/components/check-card`

质量判断：

- 职责单一，就是卡片式单选/勾选承载
- API 可读性较好，`avatar / title / description / extra` 都是直观的内容位
- 与表格、表单、请求链路没有强绑定
- 适合沉到基础层，再由 pro 场景复用

迁移时要改的点：

- 用 `XyCard`、`XyAvatar`、`XyTag` 等当前组件替代 `ElAvatar`
- `size`、状态类名、主题 token 改成当前仓库语义
- 保留 `v-model` / `change` / `extra` 这组核心交互，不照搬 Element Plus 的尺寸体系

### `check-card-group`

建议落位：

- `packages/components/check-card-group`

质量判断：

- 对 `check-card` 的组合封装清晰
- 单选 / 多选行为明确
- 可作为基础层“结构化选择器”，对中后台场景很有价值

迁移时要改的点：

- 继续以当前组件库的 `ComponentSize`、事件命名和样式规范为准
- 插槽命名可以保留 plus 的“统一插槽 + 按 value 个性化插槽”思路

## 第二档：可重写吸收

这类能力有明显价值，但 plus 当前实现耦合太重，直接搬运会把错误的层级关系一起带进来。正确做法是吸收能力模型，在当前仓库里重建。

### `display-item`

建议落位：

- `packages/pro-components` 内部基础设施
- 不建议一开始就作为根入口公开组件

质量判断：

- 这是 plus 真正成熟的一块，解决的是后台场景中最难统一的“展示态渲染”问题
- 统一承接了：
  - `render`
  - `renderHTML`
  - slot cell
  - `valueType` 到显示组件的映射
  - 复制态
  - 状态色 badge
  - 局部编辑态
- 对业务表达力提升很大

当前问题：

- 组件承担了太多职责：显示态、编辑态、字段 props 计算、slot 分发、options 处理全揉在一起
- 深度依赖 plus 自己的 `PlusForm`、`PlusRender`、`hooks`、`constants`、`utils`
- 直接迁入会把 `valueType` 协议、字段协议和表格协议一起耦死

迁移建议：

- 不创建 `XyDisplayItem` 公开组件作为第一步
- 先在 `packages/pro-components` 内部建立：
  - `display-value-type.ts`
  - `display-renderer.ts`
  - `display-component-map.ts`
- 先服务于 `XyProTable` 的 cell 展示
- 等协议稳定后，再决定是否提升为公开子入口

### `render`

建议落位：

- `packages/pro-components` 内部基础设施

质量判断：

- plus 的 `render` 组件解决了“render 回调既能返回 VNode，又能做表单态回填”这个问题，方向是对的
- 但它本质上只是 `display-item` / `form` 闭环中的一个零件，不适合孤立照搬

迁移建议：

- 不直接公开 `XyRender`
- 先抽象当前仓库自己的 `renderField` / `renderCell` 协议
- 只保留最小必要能力：
  - 回调拿到当前值
  - 回调拿到上下文
  - 能安全回写 `modelValue`

### `schema valueType` 显示映射

建议落位：

- `packages/pro-components/core.ts`
- `packages/pro-components/field-schema.ts`
- `packages/pro-components/pro-table`

质量判断：

- plus 在 `valueType` 这套协议上已经走得比较深，说明“统一字段协议”确实有价值
- 当前仓库在 schema 层更干净，但还没把显示层协议长出来

迁移建议：

- 不复制 plus 的整套字段模型
- 在当前 `ProFieldSchema` / `ProTableColumn` 上逐步补：
  - `valueType`
  - `formatter`
  - `render`
  - `renderHTML`
  - `emptyValue`
- 先让 `XyProTable` 消化这套协议，再决定是否让 `XyDetailPanel`、`XyDetailPage` 复用

## 第三档：只借 API，不搬实现

这类能力当前仓库已经覆盖主体能力，plus 的价值更多在命名和使用方式上，而不是实现本身。

### `dialog-form`

建议落位：

- `packages/pro-components/dialog-form`

质量判断：

- plus 的 `dialog-form` 使用体验直观，但实现本质是“Dialog + Form”的拼装
- 当前仓库已有更高层次的统一抽象 `overlay-form`

迁移建议：

- 不迁 plus 的源码实现
- 只补一个薄封装 `XyDialogForm`
- 内部直接代理到 `XyOverlayForm`，固定 `container="modal"`
- 目标是改善使用心智，不新增第二套逻辑

### `drawer-form`

建议落位：

- `packages/pro-components/drawer-form`

质量判断：

- 和 `dialog-form` 一样，价值主要在 facade，而不在内部实现
- 当前 `XyOverlayForm` 已经统一了 drawer / modal 两种容器，抽象层次比 plus 更干净

迁移建议：

- 只做薄封装 `XyDrawerForm`
- 内部代理 `XyOverlayForm`，固定 `container="drawer"`
- 不复制 plus 的状态同步、校验提示、footer 逻辑

### `descriptions` 与 detail 表达

质量判断：

- plus 里 `descriptions` 更偏“字段展示”
- 当前仓库已经有 `XyDescriptions` 基础组件，以及 `XyDetailPanel` / `XyDetailPage` 页面级承载

迁移建议：

- 不迁 plus 的 `descriptions`
- 只吸收“字段展示走 schema/valueType 协议”的思路

## 第四档：明确不迁

这类能力要么已经被当前仓库更合理地覆盖，要么位于错误层级，不值得引入。

### `search`

不迁原因：

- plus 的 `search` 复用 `PlusColumn`，把搜索字段和表格列协议绑定在一起
- 当前 `XySearchForm` 的单独字段协议更利于长期维护
- plus 的实现虽然成熟，但耦合了表格列级配置，不适合作为当前仓库的主方案

### `table`

不迁原因：

- plus 的 `table` 功能很全，但同时混合了：
  - title bar
  - action bar
  - selection / radio / expand / drag
  - pagination
  - inline edit
  - display-item
- 它更像“大一统业务表格内核”，不适合直接塞进当前 `XyProTable`
- 当前 `XyProTable` 虽然还有可增强空间，但骨架和边界更清楚

### `form`

不迁原因：

- plus 的 `form` 是它自己整套 schema 系统的核心
- 当前仓库已有 `XyProForm` 和 `XySearchForm` 两条分工清楚的路径
- 强行合并会把表单、搜索、表格列协议又重新揉回一起

### `page / layout / header / sidebar`

不迁原因：

- 当前仓库已有 `XyPageHeader`、`XyPageContainer`、`XyListPage`、`XySplitLayoutPage` 等更符合自身体系的承载组件
- plus 这批更像基于 Element Plus 场景的页面装配件，不是质量上明显优于当前仓库的部分

### `pagination / radio / date-picker / input-tag / popover / breadcrumb`

不迁原因：

- 这批本质是基础层控件或基础层包装
- 当前仓库已有对应基础组件，不应从对方 pro 库回灌

## 关键质量判断

### 当前仓库优于 plus 的地方

- 搜索字段协议更独立，不把表格列模型强绑到搜索表单上
- `overlay-form` 抽象层次更高，避免了 `dialog-form` / `drawer-form` 两套近似实现并存
- 根导出和类型白名单更克制，不容易把细节类型抬到包根
- 测试更偏行为契约，而不是只验某个 Element Plus DOM 是否存在

### plus 优于当前仓库的地方

- `display-item` 这类展示层基础设施更成熟
- 对 `valueType` 驱动的展示表达更完整
- 表格单元格的“显示态 + 局部编辑态”闭环已经成型

### 综合判断

- 如果目标是“维持当前仓库的工程质量”，应保留当前架构骨架
- 如果目标是“提升中后台场景表达力”，应优先吸收 plus 的显示层和 schema 渲染模型
- 不应为了引能力而把 plus 的层级耦合一并引入

## 推荐实施顺序

### 第一批

- `check-card`
- `check-card-group`

原因：

- 独立
- 风险低
- 迁入后立即可用

### 第二批

- `dialog-form` facade
- `drawer-form` facade

原因：

- 对外心智更直观
- 只是在现有 `overlay-form` 上补薄封装

### 第三批

- `valueType`
- `display renderer`
- `render` 协议

原因：

- 这是质量收益最大的部分
- 但会动到 `core.ts`、`field-schema.ts`、`pro-table`，需要成套设计和验证

## 当前建议

如果下一轮要正式开始迁，我建议直接从第一批开始，不要从 `search` / `table` 主体入手。

优先顺序：

1. 新增 `packages/components/check-card`
2. 新增 `packages/components/check-card-group`
3. 同步更新基础层 manifest、聚合导出、theme、docs、tests
4. 验证通过后，再决定是否做 `XyDialogForm` / `XyDrawerForm`

这样做的原因不是保守，而是因为它最符合当前仓库的质量基线：先引入高价值、低耦合能力，再逐步处理高价值、高耦合的 schema 渲染能力。
