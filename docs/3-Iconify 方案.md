## 将 `xy-icon` 切换为 Iconify 方案

### Summary

- 目标是把当前“5 个内建 SVG path”方案切换为 Iconify 官方 Vue 组件方案，保留 `xy-icon` 这个组件壳，但把图标来源彻底改成 Iconify。
- 本次按你确认的方向执行：`直接切换`、`只保留 icon`、`客户端优先`。
- 技术基线采用 Iconify 官方 Vue 组件方案 [`@iconify/vue`](https://iconify.design/docs/icon-components/vue/)。SSR 约束按 Iconify 官方说明处理：本次不做 SSR 友好默认方案，文档明确说明客户端渲染前提。

### Key Changes

- 公共 API 变更：
  - `xy-icon` 删除 `name`，新增必填 `icon: string`。
  - 保留 `size`、`rotate`、`spin`，行为保持现有语义不变。
  - 删除默认 `info` 回退图标；`icon` 缺失不再兜底旧内建图标。
  - 删除 `BuiltinIconName` 公共类型导出，不再对外暴露内建图标集合。
- 组件实现调整：
  - 将当前本地 `<svg><path /></svg>` 实现替换为 `@iconify/vue` 的 `Icon` 组件包装。
  - 删除 `packages/components/icon/src/icons.ts`，不再维护内建 path 集合。
  - 继续保留 `xy-icon` 包装层、命名空间类名和现有样式入口。
  - `size` 继续映射为宽高样式，`rotate` 继续走 CSS `transform: rotate(deg)`，`spin` 继续沿用组件库自己的旋转类名和动画，不引入额外 Iconify 专属视觉 API。
- 依赖与构建：
  - 在工作区开发依赖中加入 `@iconify/vue`。
  - 在发布包 `packages/xiaoye-components/package.json` 中加入 `@iconify/vue` 运行时依赖。
  - 更新库构建外部依赖配置，使 `@iconify/vue` 与当前其他运行时依赖保持一致的打包策略。
- 文档与示例：
  - 重写 Icon 文档页，不再写“可用内置图标”，改为“基于 Iconify 的图标渲染组件”。
  - 文档示例统一使用 `mdi` 图标集，固定替换为：
    - 搜索：`mdi:magnify`
    - 信息：`mdi:information-outline`
    - 关闭：`mdi:close`
    - 下拉箭头：`mdi:chevron-down`
    - 加载：`mdi:loading`
  - 同步更新 Button、Input、Overview、首页等所有旧 `name="search"` 风格示例。
  - 在 Icon 文档中加入明确说明：默认方案依赖客户端渲染；SSR、离线、严格 CSP 不在本次范围内。
- 规划与发布说明：
  - 更新规划文档和组件说明中关于图标体系的表述，统一成“Iconify 为唯一默认图标方案，不维护内建图标库”。
  - 添加 changeset，明确说明 `xy-icon` 是破坏性 API 变更：`name` 改为 `icon`，移除内建图标名和 `BuiltinIconName`。

### Test Plan

- 单元测试新增 `Icon` 组件覆盖：
  - 传入 `icon="mdi:magnify"` 时能正确渲染包装层。
  - `size` 生效为宽高样式。
  - `rotate` 生效为旋转样式。
  - `spin` 生效为旋转类名。
- 单元测试实现方式：
  - 不在测试里依赖真实网络加载图标。
  - 对 `@iconify/vue` 做组件级 mock，只验证 `xy-icon` 对 props、class、style 的包装和透传。
- 类型测试新增或更新：
  - `icon` 字符串可通过。
  - `name` 不再允许。
  - `BuiltinIconName` 不再可导入。
- 验收命令：
  - `pnpm exec vue-tsc -p tsconfig/packages.json --noEmit`
  - `pnpm exec vue-tsc -p tests/types/tsconfig.json --noEmit`
  - `pnpm exec vitest run`
  - `pnpm build`
- 文档验收：
  - VitePress 与 playground 中所有 `xy-icon` 示例可正常显示。
  - 文档中不再出现“内建图标列表”或旧 `name=` 示例。

### Assumptions

- 本次不提供兼容层，不支持 `name="search"` 旧写法，也不保留旧别名映射。
- 本次只对外支持 `icon: string`，不把 Iconify 图标数据对象作为公开主 API。
- 本次不解决 SSR 首屏 SVG 输出、离线图标包、本地图标预注册等问题；这些后续如果需要，再做第二阶段扩展。
- `xy-icon` 组件名、主题类名和现有 `spin` 动画机制保持不变，避免影响样式体系和现有布局。
