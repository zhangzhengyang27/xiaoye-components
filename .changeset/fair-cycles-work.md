---
"xiaoye-components": minor
---

发布首个可对外试用的 `v0` 基础版本，并补强中后台高频交互链路。

- 将根构建工具链升级到 `Vite 8.0.1`，同步对齐 `@vitejs/plugin-vue` 与 `vitest` 的兼容版本。
- 增强 `Select` 的交互边界，补充键盘导航、活动项高亮、搜索态焦点处理、空结果文案和更完整的 `aria` 属性。
- 增强 `Form` 的字段级操作能力，`validateField`、`resetFields`、`clearValidate` 支持字段集合，表单项错误信息与输入控件建立描述关联。
- 增强 `Table` 的行级交互能力，支持稳定的 `rowKey`、行点击事件、键盘触发行操作，以及 `loading` / `empty` 插槽扩展。
