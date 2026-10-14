# xiaoye-mcp-server

面向 AI 工具的 [MCP](https://modelcontextprotocol.io) Server：把 `xiaoye-components`（72 个基础组件）与 `xiaoye-pro-components`（31 个增强组件）的完整 API（Props / Events / Slots / Exposes）暴露给 Cursor、Claude Desktop 等 MCP 客户端，让 AI 助手在写代码时能直接查询组件的真实 API，而不是凭训练记忆猜。

## 提供的工具

| 工具 | 说明 |
| --- | --- |
| `list_components` | 列出全部组件（名称、标签、层级 base/pro、简介），支持按层过滤 |
| `get_component_api` | 查询单个组件的完整 API 表格（Props / Events / Slots / Exposes） |
| `search_components` | 按关键词搜索组件（匹配名称、标题、描述、标签、导出名） |

## 运行

包内自带全量 API 数据（随包发布的 `dist/api-schema.js`），不需要克隆仓库或预先生成缓存：

```bash
# 直接运行（已全局/局部安装时）
npx xiaoye-mcp-server

# 或在仓库内运行
node packages/mcp-server/dist/index.js
```

启动后通过 stdio 与 MCP 客户端通信，stderr 会输出已加载的组件数量。

## 客户端配置

### Cursor

在 `.cursor/mcp.json` 中加入：

```json
{
  "mcpServers": {
    "xiaoye-components": {
      "command": "npx",
      "args": ["-y", "xiaoye-mcp-server"]
    }
  }
}
```

### Claude Desktop

在 `claude_desktop_config.json` 中加入：

```json
{
  "mcpServers": {
    "xiaoye-components": {
      "command": "npx",
      "args": ["-y", "xiaoye-mcp-server"]
    }
  }
}
```

更多说明见文档站指南《LLM 集成》：`apps/docs/guide/llm-integration.md`。

## 数据来源与更新

API 数据由 `pnpm generate:llm` 从 `component-manifest` 与文档站内容生成，产物为 `src/api-schema.ts`（提交进仓库、编译进 dist）。修改组件文档或清单后重新生成即可；`pnpm check:llms` 会校验该生成物未漂移。
