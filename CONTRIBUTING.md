# 贡献指南

感谢你有意为 xiaoye-components 贡献代码！本指南将帮助你了解项目结构、开发流程和代码规范。

## 开发环境要求

- **Node.js**: >= 20.x
- **包管理**: pnpm >= 9.x
- **操作系统**: macOS / Windows / Linux

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/xiaoye-components/xiaoye-components.git
cd xiaoye-components

# 2. 安装依赖
pnpm install

# 3. 启动文档站开发
pnpm dev:docs

# 4. 运行测试
pnpm test
```

## 项目结构

```
xiaoye-components/
├── apps/
│   ├── docs/           # VitePress 文档站
│   └── playground/     # 本地联调 playground
├── packages/
│   ├── components/     # 组件源码
│   ├── theme/          # 组件样式
│   ├── tokens/         # 设计令牌
│   ├── xiaoye-primitives/  # 基础组合式函数
│   └── xiaoye-pro-components/  # 增强组件
├── tests/
│   └── types/          # 类型测试夹具
└── scripts/            # 构建脚本
```

## 组件开发规范

### 新增组件

1. 在 `packages/components/` 下创建组件目录
2. 遵循目录结构约定：
   ```
   packages/components/<component-name>/
   ├── index.ts              # 组件入口
   ├── src/
   │   └── <component>.vue   # 组件源码
   ├── __tests__/
   │   └── <component>.spec.ts
   └── package.json (如有需要)
   ```

3. 更新 `packages/components/component-manifest.json`
4. 在 `packages/components/index.ts` 中导出
5. 添加样式到 `packages/theme/src/components/<component>.css`
6. 添加样式导入到 `packages/theme/index.css`
7. 创建文档页 `apps/docs/components/<component>.md`
8. 添加示例 `apps/docs/examples/<component>/`

### 命名规范

- **组件目录**: kebab-case (如 `select`, `date-picker`)
- **Vue 组件名**: PascalCase (如 `XySelect`, `XyDatePicker`)
- **模板标签**: kebab-case (如 `xy-select`, `xy-date-picker`)
- **CSS 类名**: BEM 或 kebab-case

### Props 规范

- 使用 TypeScript 定义 Props 类型
- boolean 类型 props 使用 `disabled`、`loading`、`loading` 等命名
- 默认值为 `undefined` 而非 `null`
- 必填 props 放在前面，可选 props 放在后面

```typescript
interface Props {
  // 必填
  modelValue: string | number;
  // 可选
  disabled?: boolean;
  placeholder?: string;
}
```

### 事件规范

- 使用 Vue 推荐的 emit 格式
- 支持 v-model 双向绑定
- 事件名使用 camelCase

```typescript
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
  'focus': [event: FocusEvent];
}>();
```

### 插槽规范

- 使用作用域插槽时提供合理的 slot props
- 插槽名使用 kebab-case

```vue
<slot name="prefix" :disabled="disabled" />
<slot :row="row" :index="index" />
```

## 代码风格

### TypeScript

- 启用严格模式
- 避免使用 `any`，使用 `unknown` 替代
- 优先使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型和别名

### Vue 组件

- 使用 `<script setup>` 语法
- 组件逻辑尽量使用组合式函数
- 避免在模板中使用复杂表达式
- 大型组件考虑拆分

### CSS

- 使用 CSS 变量而非硬编码值
- 遵循样式隔离原则
- 使用 scoped styles 或 CSS Modules

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Type 类型

| Type | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构（不是功能也不是修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

### 示例

```
feat(button): add new size variant 'xs'
fix(select): fixed multiple selection not working in lazy mode
docs(menu): add keyboard navigation example
style(input): format code with prettier
```

## 提交前检查

在提交 PR 之前，请确保：

```bash
# 1. 代码检查
pnpm lint

# 2. 类型检查
pnpm typecheck

# 3. 运行测试
pnpm test

# 4. 构建验证
pnpm build
```

## Pull Request 流程

1. **Fork 仓库** 并从 main 分支创建新分支
2. **遵循代码规范** 进行开发
3. **添加/更新测试** 确保测试通过
4. **更新文档** 如有 API 变更
5. **提交代码** 并遵循 commit 规范
6. **创建 PR** 并填写 PR 模板
7. **等待审核** 并根据反馈进行修改

## PR 模板说明

在创建 PR 时，请填写：

- **描述**: 简要说明改动内容和动机
- **类型**: 选择功能/修复/文档/重构等
- **关联 Issue**: 如有相关 Issue 请关联
- **测试说明**: 说明如何测试这些改动
- **截图**: UI 变更请提供截图

## 报告问题

### Bug 报告

请包含以下信息：

1. **问题描述**: 清晰描述问题
2. **复现步骤**: 详细的复现步骤
3. **预期行为**: 应该是什么样子
4. **实际行为**: 实际发生了什么
5. **环境信息**: Node 版本、操作系统、浏览器版本等
6. **代码片段**: 复现代码（可选但有帮助）

### 功能请求

请包含：

1. **使用场景**: 描述你的业务场景
2. **API 提案**: 你期望的 API 设计
3. **参考**: 如有其他组件库的参考，请提供

## 行为准则

请阅读 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) 了解社区行为规范。

## 许可证

通过贡献代码，你同意你的代码将按照 MIT 许可证发布。

## 联系方式

- **GitHub Issues**: https://github.com/xiaoye-components/xiaoye-components/issues
- **Discussions**: https://github.com/xiaoye-components/xiaoye-components/discussions

## 致谢

感谢所有为 xiaoye-components 做出贡献的开发者！
