---
title: LLM 集成
description: 让大模型读懂你的组件库 — llms.txt、API Schema 和 MCP Server。
outline: deep
---

# LLM 集成

xiaoye-components 提供了一套面向大语言模型（LLM）的集成方案，帮助 Cursor、Claude Code、Copilot 等 AI 工具准确理解组件库的能力边界和 API 细节。

<p class="xy-section-lead">
  如果你正在用 AI 辅助编码，这套方案能让 AI 不再"猜"组件用法，而是按真实 API 生成代码。
</p>

## 整体架构

```
┌─────────────────────────────────────────────────┐
│                 AI 编码工具                       │
│  (Cursor / Claude Code / Copilot / Windsurf)     │
└───────────┬─────────────────┬───────────────────┘
            │                 │
            ▼                 ▼
   ┌────────────────┐  ┌────────────────┐
   │   llms.txt     │  │  MCP Server    │
   │  llms-full.txt │  │  (按需查询)     │
   │  (一次性读取)   │  │                │
   └────────────────┘  └───────┬────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │  API Schema JSON   │
                    │  (结构化组件数据)    │
                    └────────────────────┘
```

| 层级 | 文件 | 用途 |
|------|------|------|
| 发现层 | `llms.txt` | 组件库概览，AI 工具首次读取 |
| 参考层 | `llms-full.txt` | 完整 API 参考，包含每个组件的 Props / Events / Slots / Exposes |
| 数据层 | `api-schema.json` | 结构化 JSON，供脚本和 MCP Server 使用 |
| 查询层 | MCP Server | 按需查询，AI 工具实时调用 |

## llms.txt

`llms.txt` 是 [Answer.AI](https://answer.ai) 提出的 LLM 发现协议，放在项目根目录。AI 工具在读取项目时，会优先查找这个文件来了解组件库全貌。

### 内容概要

- 组件库简介和安装方式
- **组件选择指南**：帮助 AI 判断该用 Dialog 还是 Drawer、该用 Table 还是 ProTable
- 68 个基础组件 + 30 个增强组件的完整清单
- 命名约定和关键规则

### 使用方式

无需任何配置。只要 `llms.txt` 存在于项目根目录，支持该协议的 AI 工具会自动读取。

## llms-full.txt

`llms-full.txt` 是 `llms.txt` 的扩展版，包含每个组件的完整 API 定义。

### 与手写文档的区别

| 特征 | 手写文档 | llms-full.txt |
|------|---------|---------------|
| 类型引用 | `ButtonType`（需跳转查看） | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'`（已展开） |
| 信息密度 | 包含示例、最佳实践等 | 只保留 API 签名，精简紧凑 |
| 格式 | VitePress Markdown + 自定义容器 | 纯 Markdown 表格，无自定义语法 |

### 生成命令

```bash
pnpm generate:llm
```

该命令会同时生成 `llms-full.txt` 和 `api-schema.json`。

## API Schema JSON

`api-schema.json` 是结构化的组件 API 数据，供脚本和 MCP Server 使用。

### 数据格式

```json
{
  "version": "1.0.0",
  "generatedAt": "2026-05-18T12:00:00.000Z",
  "components": [
    {
      "name": "button",
      "title": "Button 按钮",
      "description": "页面主操作、次要操作和轻量文本动作入口。",
      "tags": ["xy-button", "xy-button-group"],
      "exports": ["XyButton", "XyButtonGroup"],
      "layer": "base",
      "props": [
        {
          "name": "type",
          "description": "按钮类型",
          "type": "'default' | 'primary' | 'success' | 'warning' | 'danger'",
          "default": "'default'"
        }
      ],
      "events": [...],
      "slots": [...],
      "exposes": [...]
    }
  ]
}
```

### 文件位置

```
scripts/.llm-cache/api-schema.json
```

该目录已加入 `.gitignore`，属于本地生成产物。

## MCP Server

MCP（Model Context Protocol）是 Anthropic 提出的标准协议，让 AI 工具能实时查询组件库 API。

### 提供的工具

| 工具 | 说明 |
|------|------|
| `list_components` | 列出所有组件，支持按层级过滤（base / pro） |
| `get_component_api` | 获取指定组件的完整 API（Props / Events / Slots / Exposes） |
| `search_components` | 按关键词搜索组件（名称、标题、描述、标签） |

### 安装与构建

```bash
cd packages/mcp-server
npm install
npm run build
```

### 在 Cursor 中配置

打开 Cursor Settings → MCP，添加：

```json
{
  "mcpServers": {
    "xiaoye-components": {
      "command": "node",
      "args": ["/你的绝对路径/xiaoye-components/packages/mcp-server/dist/index.js"]
    }
  }
}
```

### 在 Claude Desktop 中配置

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "xiaoye-components": {
      "command": "node",
      "args": ["/你的绝对路径/xiaoye-components/packages/mcp-server/dist/index.js"]
    }
  }
}
```

### 使用示例

配置完成后，你可以在 AI 对话中直接提问：

- "帮我用 xiaoye-components 写一个用户列表页" → AI 会调用 `search_components("list")` 找到 ListPage
- "xy-dialog 有哪些 props？" → AI 会调用 `get_component_api("dialog")` 返回完整 API
- "表单组件有哪些？" → AI 会调用 `list_components({ layer: "base" })` 过滤基础组件

## 自动化脚本

### generate-llm-files.mjs

该脚本从组件文档和源码中自动提取 API 信息，生成 `llms-full.txt` 和 `api-schema.json`。

```bash
pnpm generate:llm
```

### 工作原理

1. 读取 `component-manifest.json` 获取组件清单
2. 解析 `apps/docs/components/*.md` 中的 API 表格
3. 展开类型引用（如 `ButtonType` → 联合类型字面量）
4. 输出 `llms-full.txt`（人类 + LLM 可读的 Markdown）
5. 输出 `api-schema.json`（机器可读的结构化 JSON）

### 类型展开

脚本内置了 30+ 种常见类型映射，将文档中的类型引用展开为 LLM 可直接理解的字面量：

| 文档中的写法 | 展开后 |
|-------------|--------|
| `ButtonType` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` |
| `ComponentSize` | `'sm' \| 'md' \| 'lg'` |
| `InputType` | `'text' \| 'textarea' \| 'number' \| 'password' \| ...` |
| `TableAlign` | `'left' \| 'center' \| 'right'` |
| `Placement` | `'top' \| 'top-start' \| ... \| 'left-end'` |

### 数据覆盖

| 指标 | 数值 |
|------|------|
| 基础组件总数 | 72 |
| 增强组件总数 | 31 |
| 有 API 数据 | 70 |
| 暂无 API 数据 | 33（增强组件文档尚未创建） |

随着增强组件文档的补齐，运行 `pnpm generate:llm` 即可自动更新。

## 组件选择指南

以下决策树已内置在 `llms.txt` 中，AI 工具会据此推荐合适的组件。

### 弹层与浮层

- **Dialog**：阻断式录入、二次确认、强提示。需要用户显式处理才能继续。
- **Drawer**：侧边滑出，适合详情展示、筛选面板、辅助录入，不阻断主内容。
- **Popover**：轻量气泡卡片，补充说明或简单操作，点击外部关闭。
- **Tooltip**：纯文字提示，不承载交互。
- **Popconfirm**：气泡确认框，适合轻量级删除/停用确认。
- **Message**：全局轻提示，自动消失，不阻断操作。
- **Notification**：全局通知，可手动关闭，适合系统级消息。

### 表单

- **Form + FormItem**：基础表单，手动组织字段和校验。
- **SearchForm**：搜索筛选栏，声明式字段配置，自动折叠/展开。
- **ProForm**：增强表单，JSON Schema 驱动，支持联动和动态字段。
- **DialogForm / DrawerForm**：弹窗/抽屉内的表单，自带打开/关闭和提交逻辑。
- **StepsForm**：分步表单，向导式多步录入。
- **OverlayForm**：浮层表单，适合行内编辑或轻量弹层录入。

### 表格

- **Table + TableColumn**：基础表格，模板声明式列定义。
- **ProTable**：增强表格，JSON 列配置 + 工具栏 + 分页 + 筛选 + 导出 + 可编辑 + 虚拟滚动。

### 页面

- **ListPage**：标准列表页，搜索 + 表格 + 分页一体化。
- **CrudPage**：增删改查页面，内置新增/编辑/删除流程。
- **DetailPage**：详情页面容器。
- **SplitLayoutPage**：左右分栏页面，适合主从结构。
