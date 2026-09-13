---
"xiaoye-primitives": patch
---
修复类型产物根入口为空的问题（`dist/types/index.d.ts` 此前输出 `export {}`，消费端无法从包根获得类型）：构建 `entryRoot` 对齐包目录并纳入根入口文件。同时移除无引用方的 `utils/compat/rrule.js` 死代码。

---
"xiaoye-components": patch
---
依赖与类型产物治理：运行时改为外部依赖 `xiaoye-primitives`（`dependencies` 以 `workspace:^` 声明），产物内不再内联基础设施代码；类型产物中对 primitives 的断链相对引用统一改写为 npm 包名（1.0.0 产物存在约 200 处此类断链，被消费端 skipLibCheck 默认值掩盖）；移除未使用的 `rrule`、`sortablejs` 依赖声明。

---
"xiaoye-pro-components": patch
---
依赖与类型产物治理：运行时改为外部依赖 `xiaoye-components` 与 `xiaoye-primitives`（peer/dependencies 以 `workspace:^` 声明），产物内不再内联基础库与基础设施代码；类型产物断链引用同步修复；移除未使用的 `rrule` 依赖声明。
