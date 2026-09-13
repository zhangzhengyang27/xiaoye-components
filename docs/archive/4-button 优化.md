## Button 对齐 Element Plus，且不再兼容旧风格 API

### Summary

- 目标是把当前 `XyButton` 升级为接近 Element Plus 的按钮体系，但继续使用你自己的设计 token、类名前缀和 Iconify 字符串图标方案。
- 本次不再兼容旧风格 API：彻底移除 `variant` 和 `status`，不做映射、不做别名、不保留迁移兼容层。
- 保留当前仓库里仍然有价值、且不冲突的能力：`size`、`disabled`、`loading`、`block`、`nativeType`、`prefix/suffix`。
- 新体系主推 `type/plain/text/link/round/circle/icon/loadingIcon/tag`，并一起补基础 `XyButtonGroup`。
- 默认按钮视觉改为中性按钮，文档和 playground 全量迁移到新 API。

### Key Changes

- Button 公共 API 重构：
  - 删除 `variant`、`status` 类型与实现。
  - 新增 `type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'`。
  - 新增 `plain`、`text`、`link`、`bg`、`round`、`circle`、`autofocus`、`tag`。
  - 新增 `icon?: string`、`loadingIcon?: string`，都使用 Iconify 字符串。
  - 保留 `size`、`disabled`、`loading`、`block`、`nativeType`。
- Button 渲染与行为统一：
  - 把 props/type/emit 拆到独立 `button.ts`，组件仅负责渲染。
  - 抽 `use-button` composable，统一处理 class、原生属性、禁用/loading 阻断、tag 差异、form reset 行为。
  - 默认标签为 `button`；`tag !== 'button'` 时不注入 `type/disabled/autofocus`，改用 `aria-disabled` 和 class。
  - `loading` 或 `disabled` 时阻止点击派发。
  - `nativeType="reset"` 且存在 `XyForm` 上下文时，调用表单 `resetFields()`；否则保留原生 reset 行为。
  - `defineExpose` 暴露按钮实例引用和归一化后的 `size/type/disabled`。
- 插槽与图标规则：
  - 新增 `icon` 插槽与 `loading` 插槽。
  - 渲染优先级固定：
    - loading 态：`loading` 插槽 > `loadingIcon` prop > 默认 loading 图标
    - 非 loading 态前置图标：`icon` prop > `icon` 插槽 > `prefix`
    - `suffix` 继续保留为尾部扩展槽
  - `prefix/suffix` 不删除，但文档不再主推。
- ButtonGroup 一起落地：
  - 新增 `XyButtonGroup` 组件与导出。
  - Group props：`size?`、`type?`、`direction?: 'horizontal' | 'vertical'`。
  - 只做 `size/type` 继承，不扩展到 `plain/text/link/round/circle`。
  - 维持独立导出 `XyButtonGroup`，不做 `XyButton.ButtonGroup` 复合挂载。
- Form / Config 集成范围：
  - 扩展 `FormContext`，向 Button 暴露最小 `resetFields()` 能力，支持 reset 语义集成。
  - 不引入 Element Plus 那套全局 `button` config；`ConfigProvider` 仍只提供通用 `size`，Button 只继承 `size`。
- 样式体系明确调整：
  - Button 样式改为 `type` 主导：默认中性、primary、success、warning、danger。
  - 增加 plain、text、link、round、circle、icon 容器、loading 容器、group 横/纵向布局样式。
  - 保留 `block`。
  - 旧 `.xy-button--solid/outline/ghost/text`、`.xy-button--primary/success/...` 这一整套旧类名删除，不保留兼容样式。
- 文档、示例与迁移：
  - 所有 Button 文档、组合页、首页、playground、示例页统一改为新 API。
  - 旧写法全部替换，不再保留迁移并列示例。
  - 具体迁移规则固定：
    - 默认主按钮 `<xy-button>` 改为 `<xy-button type="primary">`
    - `variant="outline"` 改为 `plain`
    - `variant="text"` 改为 `text`
    - `status="success|warning|danger"` 改为对应 `type`
    - `status="neutral"` 改为 `type="default"` 或省略 `type`
    - `ghost` 不再提供，旧用法统一改写为 `plain` 或 `text`，按场景择其一：带边框次级操作用 `plain`，纯文本弱操作用 `text`
  - Button 文档主示例必须覆盖：type、plain/text/link、round/circle、icon、loading、group。
- 类型与导出同步：
  - 更新 `ButtonProps`、`ButtonType`、`ButtonNativeType`、`ButtonGroupProps` 等导出。
  - 删除所有 `variant/status` 相关类型测试和文档表述。
  - 新增 ButtonGroup 出口到组件聚合与发布入口。

### Test Plan

- 单元测试覆盖以下行为：
  - 默认中性按钮类、不同 `type` 类
  - `plain/text/link/round/circle/block` 类名
  - `icon`、`loadingIcon`、`icon` 插槽、`loading` 插槽的优先级
  - `loading/disabled` 阻止 click
  - `tag="a"` 等非 button 标签的属性分流和 `aria-disabled`
  - `nativeType="reset"` 与 `XyForm` 的 `resetFields()` 联动
  - `XyButtonGroup` 的 `size/type/direction` 继承
  - 全局注册 `<xy-button>`、`<xy-button-group>` 可直接使用
- 类型测试覆盖：
  - `type` 联合类型合法值通过，非法值失败
  - `icon/loadingIcon` 仅接受 `string`
  - `variant/status` 明确报错
  - `ButtonGroupProps` 的 `direction`、`type`、`size` 正确推断
- 验收命令：
  - `pnpm exec vue-tsc -p tsconfig/packages.json --noEmit`
  - `pnpm exec vue-tsc -p tests/types/tsconfig.json --noEmit`
  - `pnpm exec vitest run packages/components/button/__tests__/button.spec.ts`
  - `pnpm exec vitest run`
  - `pnpm build`

### Assumptions

- 本次不复制 Element Plus 全量 Button 能力；明确不做 `color`、`dark`、`dashed`、`autoInsertSpace`、全局 button config。
- `variant/status` 是唯一被彻底删除的旧 Button 风格 API；`block`、`prefix/suffix` 继续保留。
- 图标统一使用 Iconify 字符串，不支持传图标组件。
- 默认按钮由当前主按钮改为中性按钮，这属于有意的视觉变更；所有文档和示例将显式写 `type`，避免依赖默认值。
- `ghost` 不保留兼容层，代码、文档和示例中所有旧 `ghost` 用法都必须迁移掉。
