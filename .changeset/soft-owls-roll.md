---
"xiaoye-components": patch
---
构建产物依赖对齐：`dayjs` 不再内联进产物（与 `dependencies` 声明一致，`vue-router`/`rrule` 补充 external 防御），单文件产物体积下降，消费者不会再重复安装已被内联的依赖。

---
"xiaoye-pro-components": minor
---
修复 `xiaoye-components` 基础库被整体内联进增强库产物的问题：源码引用统一为 npm 包名 `xiaoye-components`，构建时将其 external，并在 `peerDependencies` 中声明 `xiaoye-components: ^1.0.0`。升级后安装本包需同时安装基础库，不再出现组件代码双份。
