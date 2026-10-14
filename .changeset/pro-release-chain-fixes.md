---
"xiaoye-pro-components": patch
---

修复发布产物的依赖链缺陷：

- Excel 导出依赖 `xlsx` 不再被内联进发布产物，改为可选 peer 依赖（`peerDependenciesMeta.optional`）；未安装时导出动作给出安装指引并静默中止，消费者可自行安装或在安全审计要求下选择其他发行版
- 补齐 `xiaoye-primitives` 的 peerDependencies 声明（此前 50+ 处 import 却未声明，单独安装本包时可能模块解析失败）
