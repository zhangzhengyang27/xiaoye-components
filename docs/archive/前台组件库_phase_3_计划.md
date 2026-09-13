---
name: 前台组件库 Phase 3 计划
overview: 在 Phase 1 + 2 基础上，Phase 3 补全剩余表单/展示/反馈组件，完善主题系统，建立完整的前台组件文档。
todos:
  - id: phase3-pagination
    content: 实现 XyuPagination 分页组件
    status: completed
  - id: phase3-popover
    content: 实现 XyuPopover 气泡卡片
    status: completed
  - id: phase3-popconfirm
    content: 实现 XyuPopconfirm 气泡确认框
    status: completed
  - id: phase3-upload
    content: 实现 XyuUpload 文件上传
    status: completed
  - id: phase3-cascader
    content: 实现 XyuCascader 级联选择
    status: completed
  - id: phase3-datepicker
    content: 实现 XyuDatePicker / XyuTimePicker 日期时间选择
    status: completed
  - id: phase3-card
    content: 实现 XyuCard 通用卡片
    status: completed
  - id: phase3-messagebox
    content: 实现 XyuMessageBox 消息确认框
    status: completed
  - id: phase3-loading
    content: 实现 XyuLoading 加载状态
    status: completed
  - id: phase3-timeline
    content: 实现 XyuTimeline 时间线
    status: completed
  - id: phase3-result
    content: 实现 XyuResult 结果页
    status: completed
  - id: phase3-remaining
    content: 实现剩余组件（ColorPicker, Backtop, Divider）
    status: completed
  - id: phase3-theme
    content: 完善主题系统（剩余 token 文件 + useTheme 增强）
    status: completed
  - id: phase3-exports
    content: 同步入口文件并测试
    status: completed
isProject: false
---

# 前台基础组件库 Phase 3 计划

## 当前进度

**已完成（Phase 1 + 2 核心）：**
- 30 个前台 UI 组件（button, input, select, checkbox, radio, switch, slider, input-number, input-tag, avatar, image, empty, skeleton, tag, badge, text, link, tabs, dropdown, tooltip, dialog, drawer, message, notification, alert, space, progress, steps, rate, product-card, marketing-modal, image-gallery, sku-selector, address-picker）
- 暗色模式主题变量
- 6 个组件级 token 文件
- useTheme 工具函数

---

## Phase 3 目标

1. 补全 Phase 2 剩余表单组件
2. 补全展示/布局组件
3. 补全反馈/浮层组件
4. 完善主题系统（剩余 token 文件）
5. 建立完整的前台组件文档

---

## 1. 表单组件补全（第二轮剩余）

| 组件 | 优先级 | 说明 |
|------|--------|------|
| `XyuUpload` | 高 | 文件上传，支持拖拽、进度、预览 |
| `XyuCascader` | 中 | 级联选择，多级联动 |
| `XyuDatePicker` | 中 | 日期选择，支持日期/日期时间/年份/月份 |
| `XyuTimePicker` | 中 | 时间选择 |
| `XyuColorPicker` | 低 | 颜色选择器（可选） |

---

## 2. 展示/布局组件补全

| 组件 | 优先级 | 说明 |
|------|--------|------|
| `XyuPagination` | 高 | 分页组件 |
| `XyuCard` | 中 | 通用卡片（与 product-card 形成互补） |
| `XyuTimeline` | 中 | 时间线，支持节点自定义 |
| `XyuResult` | 中 | 结果页（成功/失败/403/404/500 等） |
| `XyuDivider` | 低 | 分隔线（轻量组件） |

---

## 3. 反馈/浮层组件补全

| 组件 | 优先级 | 说明 |
|------|--------|------|
| `XyuPopover` | 高 | 气泡卡片，支持 12 种弹出位置 |
| `XyuPopconfirm` | 中 | 气泡确认框，基于 Popover |
| `XyuMessageBox` | 中 | 消息确认框（alert/confirm/prompt） |
| `XyuLoading` | 中 | 加载状态，支持指令和服务 |
| `XyuBacktop` | 低 | 返回顶部 |

---

## 4. 主题系统完善

### 4.1 剩余组件级 token 文件

```
packages/theme/src/front/themes/
  upload-tokens.css      # upload 专用变量
  cascader-tokens.css   # cascader 专用变量
  date-picker-tokens.css # date-picker 专用变量
  pagination-tokens.css  # pagination 专用变量
  popover-tokens.css     # popover 专用变量
  dialog-tokens.css      # dialog 专用变量
  drawer-tokens.css      # drawer 专用变量
```

### 4.2 useTheme 工具增强

```typescript
// packages/xiaoye-ui/src/composables/useTheme.ts
export function useTheme() {
  // 现有功能...
  
  // 新增：预设主题
  const presets = {
    default: 'front',
    compact: { ... },  // 紧凑模式
    elegant: { ... },  // 优雅模式
  };
  
  // 新增：组件级主题覆盖
  const overrideComponent = (name: string, tokens: Record<string, string>) => { ... };
  
  return { ... };
}
```

---

## 5. 实现顺序

**第一轮（高优先级，核心功能）：**
1. `XyuPagination` — 分页刚需
2. `XyuPopover` — 用量大的浮层组件
3. `XyuPopconfirm` — 基于 Popover
4. `XyuUpload` — 文件上传刚需

**第二轮（中优先级，完善表单）：**
5. `XyuCascader`
6. `XyuDatePicker` / `XyuTimePicker`
7. `XyuCard`

**第三轮（中低优先级，细节完善）：**
8. `XyuMessageBox`
9. `XyuLoading`
10. `XyuTimeline`
11. `XyuResult`
12. `XyuColorPicker`
13. `XyuBacktop`
14. `XyuDivider`

**并行推进：**
- 剩余组件级 token 文件
- useTheme 增强

---

## 6. 目录结构（新增组件）

```
packages/xiaoye-ui/src/front-components/
  upload/
    index.ts
    upload.ts
    upload.vue
    upload-trigger.vue
    upload-list.vue
    upload.css
  cascader/
    index.ts
    cascader.ts
    cascader.vue
    cascader-panel.vue
    cascader.css
  date-picker/
    index.ts
    date-picker.ts
    date-picker.vue
    date-picker-panel.vue
    date-picker.css
  time-picker/
    index.ts
    time-picker.ts
    time-picker.vue
    time-picker.css
  pagination/
    index.ts
    pagination.ts
    pagination.vue
    pager.vue
    pagination.css
  popover/
    index.ts
    popover.ts
    popover.vue
    popover.css
  popconfirm/
    index.ts
    popconfirm.ts
    popconfirm.vue
    popconfirm.css
  message-box/
    index.ts
    message-box.ts
    message-box.vue
    message-box.css
  loading/
    index.ts
    loading.ts
    loading.vue
    loading.css
    directive.ts
    service.ts
  card/
    index.ts
    card.ts
    card.vue
    card.css
  timeline/
    index.ts
    timeline.ts
    timeline.vue
    timeline-item.vue
    timeline.css
  result/
    index.ts
    result.ts
    result.vue
    result.css
  color-picker/
    index.ts
    color-picker.ts
    color-picker.vue
    color-picker.css
  backtop/
    index.ts
    backtop.ts
    backtop.vue
    backtop.css
  divider/
    index.ts
    divider.ts
    divider.vue
    divider.css
```

---

## 7. 入口文件同步

每实现一个组件，需同步更新：
1. `packages/xiaoye-ui/src/front-components/index.ts` — 添加 export
2. `packages/xiaoye-ui/index.ts` — 聚合导出
3. `packages/xiaoye-ui/style.css` — 导入对应 CSS
4. `packages/theme/src/front/themes/<component>-tokens.css` — 组件 token（如需）

---

## 8. 技术要点

- Upload 使用 `<input type="file">` + 拖拽 API
- DatePicker/TimePicker 可基于 day.js 或 date-fns
- Popover 使用 floating-ui 或自定义定位逻辑
- MessageBox 使用 Dialog 的服务模式
- Loading 支持全局指令 `v-xyu-loading` 和 `XyuLoadingService`
- 所有组件遵循 `Xyu*` 前缀规范