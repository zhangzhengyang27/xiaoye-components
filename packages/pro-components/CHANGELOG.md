# xiaoye-pro-components

## 2.0.0

### Minor Changes

- 7645d5c: 重构设计令牌体系：以 Stripe 设计语言为蓝本（design.hagicode.com 收录的 Stripe DESIGN.md 及官方亮/暗 token 目录），建立基元/语义/刻度三层架构。
  - tokens.css 全面重写：六族数字标度色板（gray/purple/green/amber/red/blue，锚点取 Stripe 官方值）、语义角色统一命名（text-/bg-/border-/brand-、状态色六件套）、五级蓝调海拔、单调递增 z-index 阶梯（修复 dropdown 高于 modal 的倒挂）、九档无坍缩字号、Stripe 圆角刻度（2/4/5/6/8px）、字体族/字重/行高令牌
  - 暗色主题采用官方暗色值：靛黑页面底 #0e0f2e、提亮品牌色 #665efd、白色透明度边框、黑色主导阴影
  - 全仓 3444 处旧变量名迁移到新命名；旧名（--xy-color-primary、--xy-text-color-\* 等）通过 tokens.css 末尾 @deprecated 兼容层继续生效，存量自定义主题不受影响，兼容层将在下个 major 移除
  - packages/tokens TS 常量层改为由 scripts/generate-tokens.mjs 从 tokens.css 生成（新增 pnpm generate:tokens），消除双份手工维护的漂移
  - 删除未被任何构建入口引用的前台主题死代码（packages/theme/src/front，--xyu-\* 体系）
  - 组件视觉随新令牌整体更新：主色 #5b76fe → #533afd、标题/正文切换为深海军蓝/石板灰层级、按钮圆角 2px → 4px、浮层海拔按 Stripe 五级重新分配

### Patch Changes

- Updated dependencies [fd863e4]
- Updated dependencies [7645d5c]
- Updated dependencies [fd863e4]
  - xiaoye-components@1.1.0

## 0.2.0

### Minor Changes

- 新增 pro 组件并增强表单与表格能力
- feat add watermark component
- 新增反馈导航组件并以 dialog 替换 modal
- 增强 table carousel 并补齐展示数据组件
- 新增展示组件并增强浮层与分页交互
- 补齐展示与交互组件并增强 tabs upload 能力
- 新增表单组件并增强 input select 能力
- 完善组件导出与文档站展示体系
- 完善按钮体系并补齐基础组件文档
- 扩展 overlay 组件并完善文档体系

### Patch Changes

- fix docs examples and table interactions

## 0.3.0

### Minor Changes

- integrate admin component capabilities

## 0.3.1

### Minor Changes

- 收口组件公开边界并准备发布
- 重构设计令牌系统并新增 frontline 组件模块

### Patch Changes

- 修复 @iconify/vue mock 缺少 addCollection 导致测试失败

## 0.3.2

### Minor Changes

- 实现深色/浅色主题切换功能
- enhance login functionality and adjust 3D card tilt effect
- add comprehensive admin template and enhance component APIs
- 完善前台组件库文档与组件优化
- 完成 Phase 3 组件补全
- 完成前台基础组件库 Phase 1 + Phase 2 核心组件
- 增强标签组件样式与测试覆盖
- 增强图表组件并新增示例

### Patch Changes

- 修复构建链路的 TypeScript 类型错误和 SSR 兼容性问题
- 修复 style.css 入口文件输出
- 修复级联选择器下拉宽度自适应

## 1.0.0

首个开源稳定版本。自 0.5.1 以来的核心变化：

- **主题系统 token 化**：全量组件 CSS 收口到设计令牌，消除硬编码色值，暗色模式补齐 47 个变量
- **浮层视觉基线统一**：dialog / drawer / tooltip / popconfirm 的背景、边框、阴影、圆角按层级收敛到统一基线
- **Table 增强**：主题 token 收口，新增 dashboard 场景的 `overview` 轻量密度能力
- **契约收口**：修复组件源码契约兼容问题，文档与源码对表一致
- **工程配套**：补齐迁移指引、popper 示例与 28 个组件测试用例适配

### Minor Changes

- 全量组件 CSS token 化，消除硬编码色值

### Patch Changes

- 修复文档站暗黑模式切换不完整
- 修复组件源码契约问题和增强浮层能力
- 收口组件契约兼容、浮层视觉基线、table token/overview 和 docs 契约一致性
