# Contributing

## 开发要求

- Node：建议 `>= 20`
- 包管理：`pnpm`
- 提交规范：`Conventional Commits`

## 开发流程

1. 安装依赖：`pnpm install`
2. 启动文档站：`pnpm dev:docs`
3. 运行测试：`pnpm test`
4. 运行类型检查：`pnpm typecheck`

## 目录约定

- 新组件放在 `packages/components/<component>`
- 组件样式放在 `packages/theme/src/components`
- 文档页放在 `apps/docs/components`
- 类型测试放在 `tests/types/fixtures`

## 提交前检查

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## 反馈建议

- Bug 请提供复现步骤、预期行为、实际行为和环境信息
- 功能建议请优先说明业务场景和 API 诉求
- 超出项目定位的需求可能会进入长期路线，而不是立即实现

