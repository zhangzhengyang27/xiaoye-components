# 组件库收口任务背景 — 2026-05-23 最终快照

> 本文档是"从后台项目暴露的问题倒查组件库根因并持续收口"这条主线的完整背景。
> **五条收口优先级已全部完成。**

---

## 一、主线定位

这不是"全仓优化"，而是**组件库层收口**——解决后台项目暴露出来的、靠业务页局部 patch 无法长期兜底的问题。

**五条收口优先级（全部已完成）：**

1. ~~组件契约兼容问题~~ — **已完成**
2. ~~浮层体系默认视觉基线统一~~ — **已完成**
3. ~~表格主题 token 收口~~ — **已完成**
4. ~~更适合 dashboard 概览场景的轻量密度能力~~ — **已完成**
5. ~~组件库 docs 契约与迁移指引收口~~ — **已完成**

---

## 二、已完成的代码层工作

### 2.1 XyPopconfirm 兼容旧 trigger 写法 ✅

**文件：** `packages/components/popconfirm/src/popconfirm.vue`

**已完成：**
- 没有 `reference` 插槽且没有 `content` 时，将 `default` 插槽视为 trigger
- 避免把默认插槽误当成 body
- 默认 `iconColor` 从硬编码改成 `var(--xy-warning)`

### 2.2 Popconfirm 回归测试 ✅

**文件：** `packages/components/popconfirm/__tests__/popconfirm.spec.ts`

**已完成：**
- 补"未提供 `reference` 插槽时，默认插槽作为触发器"的兼容测试（12 项测试全部通过）

### 2.3 XyTable 主题 token 收口 ✅

**文件：** `packages/theme/src/components/table.css`

**已完成：**
- 表头背景改 token
- 表头文字色改 token
- 页脚背景改 token
- hover 背景改 token 混合
- stripe 背景改 token 混合
- border 改 token
- 固定列左右阴影/分隔线改 token

### 2.4 XyTable 轻量概览能力 ✅

**文件：**
- `packages/components/table/src/table.ts` — 已新增 `overview?: boolean`
- `packages/components/table/src/table.vue` — overview 场景下的样式切换
- `packages/theme/src/components/table.css` — `.xy-table.is-overview` 样式覆盖

**设计决策（不要反向改）：**
- 走兼容式补能力方案，不是粗暴全局缩小 spacing
- 默认 `size="md"` 不动
- overview 只影响概览场景，不误伤列表页默认密度
- overview 覆盖项：font-size、line-height、cell padding、gap、hover/stripe/current 背景（更淡）、expanded content、append wrapper、loading、empty state
- virtual 滚动下 overview 自动缩小 itemSize（0.875 倍，最小 40px）

### 2.5 浮层 CSS token 收口 ✅

**文件与状态：**
- `packages/theme/src/components/dialog.css` — 已用 token，无硬编码 hex 色值
- `packages/theme/src/components/drawer.css` — 已用 token，无硬编码 hex 色值
- `packages/theme/src/components/tooltip.css` — 已用 token，无硬编码 hex 色值
- `packages/theme/src/components/popconfirm.css` — 已用 token，无硬编码 hex 色值

**浮层视觉基线统一确认：**
- 背景色：所有浮层统一走 `--xy-dialog-bg → --xy-bg-raised → color-mix(floating 96%, subtle)` 三级 fallback
- 边框色：dialog/drawer 统一 `color-mix(subtle 84%, border)`；tooltip/popconfirm 统一走 `--xy-popper-border-color`
- 阴影：dialog/drawer 用 12px 32px 7%（大型浮层）；tooltip/popconfirm 用 8px 20px 7%（小浮层）
- padding：dialog/drawer 各区域 10px 16px（更克制）；tooltip 6px 10px；popconfirm 9px 12px 10px——层级递减
- 字号：dialog/drawer title 约 17px 600；tooltip/popconfirm 用 13px——小浮层用小字
- 圆角：dialog/drawer 用 radius-xl；popconfirm 用 radius-lg；tooltip 用 radius-md——层级递减

### 2.6 Docs 契约收口 ✅

**已稳定的 docs 页（不要无意义重写）：**
- 所有浮层/输入/选择类：tooltip, popover, popconfirm, select, dropdown, tree-select, auto-complete, date-picker, cascader, time-picker, time-select — 与源码完全一致
- 所有数据展示类：descriptions, statistic, steps, progress, rate, pagination, tabs, collapse, badge, tag, text — 与源码完全一致
- 所有反馈/通用类：alert, message, notification, result, loading, empty, divider, link, button, card, check-card — 与源码完全一致
- 所有其他类：avatar, breadcrumb, checkbox, radio, skeleton, splitter, menu, image — 与源码完全一致
- 表单/输入类：form, input（补了 `containerRole`）, input-number（补了 `id`）, slider, switch, upload — 与源码完全一致
- `apps/docs/components/table.md` — overview 文档完整，含 API、demo、迁移指引、token 列表

---

## 三、已核过的源码对表事实

### 3.1 DatePicker

**源码：** `packages/components/date-picker/src/date-picker.ts`

**真实 props：**
`modelValue` · `type` · `placeholder` · `disabled` · `clearable` · `size` · `min` · `max` · `format` · `valueFormat` · `shortcuts` · `disabledDate` · `separator` · `prefixIcon` · `suffixIcon` · `clearIcon` · `editable` · `teleported` · `popperClass` · `popperStyle` · `appendTo` · `placement` · `modelModifiers`

**真实 emits：**
`update:modelValue` · `change` · `clear` · `visibleChange` · `focus` · `blur`

**明确不存在的旧错误 contract：**
`startPlaceholder` · `endPlaceholder` · `cellClass` · `readonly` · `range` · `unlinkPanels` · `calendarChange` · `panelChange`

### 3.2 Cascader

**源码：** `packages/components/cascader/src/cascader.ts`

**真实 props：**
`modelValue` · `options` · `props` · `placeholder` · `disabled` · `clearable` · `filterable` · `lazy` · `load` · `size` · `searchPlaceholder` · `teleported` · `appendTo` · `placement` · `offset` · `popperClass` · `popperStyle`

**真实 emits：**
`update:modelValue` · `change` · `clear` · `visibleChange` · `focus` · `blur` · `searchChange`

### 3.3 TimePicker

**源码：** `packages/components/time-picker/src/time-picker.ts`

**真实 props：**
`modelValue` · `placeholder` · `startPlaceholder` · `endPlaceholder` · `disabled` · `clearable` · `size` · `format` · `isRange` · `validateEvent` · `teleported` · `appendTo` · `placement` · `popperClass` · `popperStyle` · `disabledHours` · `disabledMinutes` · `disabledSeconds`

**真实 emits：**
`update:modelValue` · `change` · `clear` · `visibleChange` · `focus` · `blur`

### 3.4 TimeSelect

**源码：** `packages/components/time-select/src/time-select.ts`

**真实 props：**
`modelValue` · `placeholder` · `disabled` · `clearable` · `size` · `start` · `end` · `step` · `minTime` · `maxTime` · `includeEndTime` · `format` · `validateEvent` · `teleported` · `appendTo` · `placement` · `popperClass` · `popperStyle`

**真实 emits：**
`update:modelValue` · `change` · `clear` · `visibleChange` · `focus` · `blur`

### 3.5 其他已核过的组件

`AutoComplete` · `TreeSelect` · `Select` · `Dropdown` — 均已核过，docs 与源码大体一致。

---

## 四、已通过的验证事实

- `pnpm vitest run packages/components/popconfirm/__tests__/popconfirm.spec.ts` — 12 项测试全部通过（1.78s）
- `pnpm run build:lib:base` — 通过（6.69s）
- `pnpm run build:docs` — 通过（37.32s）
- `git diff --check` — 无空白问题
- 已知 warning（非 blocker）：Sass legacy JS API deprecation、chunk size warning

---

## 五、边界与注意事项

- **不要回业务页打补丁**
- **不要重新做全仓熟悉或泛化分析**
- **不要恢复无关删除文件**（admin-template 的删除与此轮主线无关）
- **不要回滚无关改动**
- **优先从组件库、theme、docs、tests 层解决问题**
- **默认用中文输出**
- **用户偏好大任务整批推进，不要拆很多零碎小任务**

---

## 六、任务模板

已沉淀的委派模板文件：`/Users/xiaoye/Desktop/script/templates/xiaoye-components-task-template.md`

可直接复用，不需要关注执行细节。

---

## 七、后续可能的方向（非当前主线）

五条收口优先级已全部完成。以下是可能的新方向，但不是当前主线：

1. **后台项目侧的实际迁移验证** — 用组件库收口后的能力替换后台项目的 deep 覆盖和局部 patch
2. **更多组件的 docs 契约对表** — 逐个组件确认 docs 与源码完全一致
3. **主题系统整体测试** — 浅色/深色模式下所有浮层、表格、表单组件的视觉效果验证
4. **overview demo 的实际效果验证** — 启动 dev 站点，在真实 dashboard 场景下确认

---

## 2026-09-14 快照：组件库工程化收口与发布准备（已全部完成）

本节是 2026-09-14 的工作快照，接续上方 2026-05-23 的旧主线（其内容仍有效但已过时，以下为最新状态）。

### 已完成的四批工作（12+ 个提交，未推送）

1. **类型防线恢复**：`tests/types/tsconfig.json` 全量挂载 105 个夹具；修复 `TablePath` 可选属性深层路径；补导出 table 三个回调 context 类型。
2. **发布链路复活**：`release.yml` 改 changesets/action 标准流程（push main 自动开 Version Packages PR，合并后构建发布）；四包 CHANGELOG 从 git tag 重建；`.changeset/config.json` 仓库地址修正。**发布前须确认 GitHub 已配置 NPM_TOKEN secret**。
3. **依赖治理**：base/pro/primitives 三层 external 化 + `workspace:^` 协议；产物类型断链从 1.0.0 的约 200 处清零；primitives 类型根入口（原 `export {}`）修复；pro 依赖清理到实际所需。
4. **AI 上下文与文档**：AGENTS.md 移除已废弃的 xiaoye-ui 章节（组件清单以 manifest 72/31 为准）；llms.txt 修正组件数与 npm 包名（装包用 `xiaoye-components`，不是 `@xiaoye/components`）；过期规划归档至 `docs/archive/`；21 个 pro 组件文档补齐 API 表格（103/103 覆盖）。

### 新增工程能力

- `pnpm audit:visual`：双主题视觉巡检（103 页 × 浅/暗两主题截图 + pixelmatch 像素对比基线 + 画廊报告，输出 `output/visual-audit/`）。`--save-baseline` 保存基线；存在基线时差异超 0.5% 退出码 1。
- e2e 已接入 CI（`pnpm test:e2e`，独立 e2e job）。

### 审计报告状态

P0/P1/P2 全部闭环。P2 的 8 项逻辑问题中 2 项真修（浮层 isLeaveAnimating 守卫、table 列注册断言收窄），6 项经复核确认已在历史版本修复或描述不适用（均补单测佐证）。px/z-index 硬编码：z-index 已被 useOverlayStack 替代；px 已做刻度内等值替换（59 处，像素级零回归验证），非标刻度值保留待设计决策。

### 验证基线

typecheck 0 错误、990/990 单测、lint 0 error、e2e 4/4、产物类型断链 0、像素对比 1064/1064 一致。

### 注意事项

- `@xiaoye/components`、`@xiaoye/primitives` 等是仓库内部 alias，**npm 包名**是 `xiaoye-components`、`xiaoye-primitives`、`xiaoye-pro-components`。
- 不要手工改 `packages/*/package.json` 版本号；发变更用 `pnpm changeset`。
- 不要恢复 `packages/xiaoye-ui`（已终止的前台层方向，规划文档在 `docs/archive/`）。
