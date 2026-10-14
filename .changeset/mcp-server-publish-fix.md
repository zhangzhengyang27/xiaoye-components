---
"xiaoye-mcp-server": patch
---

修复发布后无法启动的问题：

- API 数据改为随包发布的内置模块（`dist/api-schema.js`），不再依赖运行时读取仓库内 `scripts/.llm-cache/api-schema.json`（该路径被 gitignore 且不在 npm 包内，此前安装后启动会直接 `process.exit(1)`）
- 修正工具描述与输出中的错误包名（`@xiaoye/components` → `xiaoye-components`、`@xiaoye/pro-components` → `xiaoye-pro-components`）
- 新增 README（工具说明与 Cursor / Claude Desktop 配置示例）；包构建已挂入 `pnpm build:lib` 发布链，数据生成物由 `pnpm check:llms` 漂移守卫覆盖
