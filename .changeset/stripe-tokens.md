---
"xiaoye-components": minor
"xiaoye-pro-components": minor
"xiaoye-primitives": minor
---

重构设计令牌体系：以 Stripe 设计语言为蓝本（design.hagicode.com 收录的 Stripe DESIGN.md 及官方亮/暗 token 目录），建立基元/语义/刻度三层架构。

- tokens.css 全面重写：六族数字标度色板（gray/purple/green/amber/red/blue，锚点取 Stripe 官方值）、语义角色统一命名（text-/bg-/border-/brand-、状态色六件套）、五级蓝调海拔、单调递增 z-index 阶梯（修复 dropdown 高于 modal 的倒挂）、九档无坍缩字号、Stripe 圆角刻度（2/4/5/6/8px）、字体族/字重/行高令牌
- 暗色主题采用官方暗色值：靛黑页面底 #0e0f2e、提亮品牌色 #665efd、白色透明度边框、黑色主导阴影
- 全仓 3444 处旧变量名迁移到新命名；旧名（--xy-color-primary、--xy-text-color-* 等）通过 tokens.css 末尾 @deprecated 兼容层继续生效，存量自定义主题不受影响，兼容层将在下个 major 移除
- packages/tokens TS 常量层改为由 scripts/generate-tokens.mjs 从 tokens.css 生成（新增 pnpm generate:tokens），消除双份手工维护的漂移
- 删除未被任何构建入口引用的前台主题死代码（packages/theme/src/front，--xyu-* 体系）
- 组件视觉随新令牌整体更新：主色 #5b76fe → #533afd、标题/正文切换为深海军蓝/石板灰层级、按钮圆角 2px → 4px、浮层海拔按 Stripe 五级重新分配
