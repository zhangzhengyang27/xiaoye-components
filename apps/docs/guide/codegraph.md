---
title: CodeGraph 集成
description: 用语义知识图谱加速代码探索，减少 94% 工具调用
outline: deep
---

# CodeGraph 集成

xiaoye-components 集成了 [CodeGraph](https://github.com/colbymchenry/codegraph)，为 AI 编码助手提供代码语义理解能力。在本项目中，Cursor 已配置好 CodeGraph MCP Server，可以直接使用。

## 什么是 CodeGraph？

CodeGraph 是一个为 AI 编码助手设计的**代码语义知识图谱**工具。它在本地 SQLite 数据库中预先索引代码结构（符号、调用关系、文件结构），让 AI 探索代码时从"扫描文件"变成"图查询"。

```
用户问题 ──→ Explore Agent ──→ CodeGraph MCP ──→ SQLite 图数据库
                              (1次工具调用)        (毫秒级响应)
```

### 基准测试效果

| 场景 | 不使用 CG | 使用 CG | 提升 |
|------|-----------|---------|------|
| 工具调用次数 | 40-52 次 | 1-6 次 | **减少 84-96%** |
| 探索耗时 | 1-2 分钟 | 17-39 秒 | **提速 71-82%** |

## MCP 工具一览

本项目已配置 CodeGraph MCP Server，可使用以下工具：

| 工具 | 用途 |
|------|------|
| `codegraph_search` | 按名称搜索符号（函数、类、组件等） |
| `codegraph_context` | 为任务构建相关代码上下文 |
| `codegraph_callers` | 查找谁调用了某函数 |
| `codegraph_callees` | 查找某函数调用了什么 |
| `codegraph_impact` | 分析变更符号的影响范围 |
| `codegraph_node` | 获取单个符号的详情（可带源码） |
| `codegraph_files` | 获取索引后的文件结构 |
| `codegraph_status` | 检查索引健康状况 |

## 索引状态

本项目已索引：**1,314 个文件，12,298 个节点，25,026 条边**

```
Files:     1,314
Nodes:     12,298
Edges:     25,026
Backend:   native (最优性能)
```

## 使用示例

### 1. 探索组件实现

**问**：XyButton 组件是如何实现的？

**做法**：Spawn 一个 Explore agent，使用 `codegraph_explore` 作为主要工具。

### 2. 追踪调用链

**问**：ProTable 的 submit 方法调用了哪些函数？

**做法**：使用 `codegraph_callees("ProTable")` 追踪。

### 3. 影响分析

**问**：修改 Button 组件会影响哪些地方？

**做法**：使用 `codegraph_impact("XyButton", { depth: 2 })` 分析。

### 4. 快速查找符号

**问**：Dialog 组件在哪里定义？

**做法**：使用 `codegraph_search("Dialog")` 快速定位。

## 项目中的索引配置

索引配置位于 `.codegraph/config.json`：

```json
{
  "version": 1,
  "exclude": ["node_modules/**", "dist/**", "build/**", "*.min.js"],
  "extractDocstrings": true,
  "trackCallSites": true
}
```

## 常用命令

```bash
codegraph status    # 查看索引状态
codegraph sync      # 增量同步（文件变更后自动触发）
codegraph index     # 重新全量索引
codegraph init      # 重新初始化
```

## 自动同步

CodeGraph 监听文件系统变化（macOS FSEvents），文件保存后约 2 秒自动增量同步索引。你无需手动运行 sync 命令。

## 扩展阅读

- [CodeGraph GitHub](https://github.com/colbymchenry/codegraph)
- [LLM 集成文档](./llm-integration)
