---
title: 反馈与数据展示
description: Tooltip、Empty、Table、Pagination 在列表页中的常见用法。
outline: deep
---

<script setup lang="ts">
import { computed, ref } from "vue";

const tableLoading = ref(false);
const showEmpty = ref(false);
const activeRowId = ref<number | null>(null);
const dropdownFeedback = ref("尚未触发行操作");
const popoverOpen = ref(false);
const rows = [
  { id: 101, name: "Billing Console", owner: "Xiaoye", status: "开发中" },
  { id: 102, name: "Sales Admin", owner: "Alice", status: "已上线" },
  { id: 103, name: "Support Hub", owner: "Bob", status: "设计中" }
];

const displayRows = computed(() => (showEmpty.value ? [] : rows));

function handleRowClick(row: { id: number }) {
  activeRowId.value = row.id;
}

function rowClassName(row: { id: number }) {
  return row.id === activeRowId.value ? "doc-row-active" : "";
}

function handleDropdownSelect(item: { label: string }) {
  dropdownFeedback.value = `已触发操作：${item.label}`;
}
</script>

# 反馈与数据展示

这部分更接近后台列表页的“查看和反馈”路径：先给提示和空态，再进入表格与分页的组合方式。

:::tip 单组件页
如果你需要查 `row-key`、动态插槽名或更完整的弹窗反馈能力，优先看 [Table 表格](/components/table) 和 [Modal 弹窗](/components/modal)。
:::

## Tooltip 文字提示

文字提示适合解释按钮、副操作或需要延迟出现的附加信息。

### 基础用法

<xy-tooltip content="这个按钮会立即提交当前表单，也支持 focus 打开和 Escape 关闭">
  <xy-button plain>Hover / Focus 查看提示</xy-button>
</xy-tooltip>

当前版本里的 Tooltip 不只服务鼠标悬停，也覆盖了键盘用户的高频路径：

- Focus 进入触发区域时打开。
- `Escape` 关闭提示。
- `enterable` 允许光标进入提示层时保持显示。

### Tooltip API 摘要

| 属性          | 说明                                 | 类型                                     | 默认值  |
| ------------- | ------------------------------------ | ---------------------------------------- | ------- |
| `content`     | 纯文本提示内容                       | `string`                                 | `""`    |
| `placement`   | 浮层方向                             | `'top' \| 'bottom' \| 'left' \| 'right'` | `top`   |
| `disabled`    | 是否禁用提示                         | `boolean`                                | `false` |
| `open-delay`  | 打开延迟，单位毫秒                   | `number`                                 | `80`    |
| `close-delay` | 关闭延迟，单位毫秒                   | `number`                                 | `60`    |
| `enterable`   | 提示层是否允许鼠标进入后继续保持显示 | `boolean`                                | `true`  |

## Popover 气泡卡片

Popover 用来承载比 Tooltip 更重一点的说明或轻交互内容。它不是纯提示，也不需要像 Modal 那样阻断页面。

### Tooltip 和 Popover 的边界

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-tooltip content="这里只放短提示，适合一句话说明">
      <xy-button plain>Tooltip 提示</xy-button>
    </xy-tooltip>

    <xy-popover v-model="popoverOpen" title="为什么这里用 Popover">
      <template #trigger>
        <xy-button plain>Popover 说明</xy-button>
      </template>
      <div class="xy-doc-stack">
        <p>这里可以放多段说明、状态解释，甚至一个轻量按钮。</p>
        <xy-button text @click="popoverOpen = false">知道了</xy-button>
      </div>
    </xy-popover>

  </xy-space>
</div>

- `Tooltip`：短文案、解释性提示、不承载操作。
- `Popover`：多段说明、轻量交互、外部点击和 `Escape` 可关闭。

完整 API 见 [Popover 气泡卡片](/components/popover)。

## Dropdown 下拉菜单

Dropdown 负责“操作菜单”，不是“值选择器”。如果用户是在做操作，而不是在选择枚举值，优先用 Dropdown。

### 行操作菜单示例

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-dropdown
      :items="[
        { key: 'edit', label: '编辑成员' },
        { key: 'disable', label: '停用账号', disabled: true, description: '当前状态不可操作' },
        { key: 'delete', label: '删除成员', danger: true }
      ]"
      @select="handleDropdownSelect"
    >
      <xy-button plain>更多操作</xy-button>
    </xy-dropdown>
    <xy-tag status="primary">{{ dropdownFeedback }}</xy-tag>
  </xy-space>
</div>

键盘约定：

- `ArrowUp / ArrowDown / Home / End` 在菜单项间移动
- `Enter / Space` 选择当前高亮项
- `Escape` 关闭菜单

完整 API 见 [Dropdown 下拉菜单](/components/dropdown)。

## Empty 空状态

空状态用于列表、筛选结果和无数据视图的统一兜底。

### 基础用法

<xy-empty title="暂无工单" description="当前筛选条件下没有找到结果">
  <xy-button plain>重置筛选</xy-button>
</xy-empty>

### Empty API 摘要

| 属性          | 说明     | 类型     | 默认值                   |
| ------------- | -------- | -------- | ------------------------ |
| `title`       | 标题文案 | `string` | `暂无数据`               |
| `description` | 描述文案 | `string` | `这里还没有可展示的内容` |

## Table + Pagination 列表页

表格和分页通常不会单独出现，而是要和加载态、空态、行选中、筛选栏一起工作。

### 基础用法

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-button plain @click="tableLoading = !tableLoading">
      {{ tableLoading ? '关闭加载态' : '开启加载态' }}
    </xy-button>
    <xy-button plain @click="showEmpty = !showEmpty">
      {{ showEmpty ? '恢复数据' : '查看空态' }}
    </xy-button>
    <xy-tag :status="activeRowId ? 'success' : 'neutral'">
      当前行：{{ activeRowId ? `#${activeRowId}` : '未选择' }}
    </xy-tag>
  </xy-space>

  <xy-table
    :columns="[
      { key: 'name', title: '项目名称', dataIndex: 'name' },
      { key: 'owner', title: '负责人', dataIndex: 'owner' },
      { key: 'status', title: '状态', dataIndex: 'status' }
    ]"
    :data="displayRows"
    :loading="tableLoading"
    loading-text="正在加载项目列表"
    row-key="id"
    :row-class-name="rowClassName"
    @row-click="handleRowClick"
  >
    <template #loading>
      正在同步项目数据，请稍候...
    </template>
    <template #empty>
      <xy-empty title="暂无项目" description="当前筛选条件没有返回结果">
        <xy-button plain @click="showEmpty = false">恢复数据</xy-button>
      </xy-empty>
    </template>
  </xy-table>

  <xy-pagination :total="86"></xy-pagination>
</div>

:::tip 列表页组合方式
后台列表页里最常见的需求不是“渲染一张表”，而是“表格需要跟加载态、空态、行选中和翻页联动”。  
因此文档会优先展示组合方式，而不是只放一个静态表格。
:::

### Table API 摘要

| 属性             | 说明                       | 类型                                             | 默认值       |
| ---------------- | -------------------------- | ------------------------------------------------ | ------------ |
| `columns`        | 列配置数组                 | `TableColumn[]`                                  | `[]`         |
| `data`           | 数据源                     | `T[]`                                            | `[]`         |
| `loading`        | 是否显示加载态             | `boolean`                                        | `false`      |
| `striped`        | 是否显示斑马纹             | `boolean`                                        | `false`      |
| `bordered`       | 是否显示边框风格           | `boolean`                                        | `false`      |
| `empty-text`     | 默认空态文案               | `string`                                         | `暂无数据`   |
| `loading-text`   | 默认加载文案               | `string`                                         | `Loading...` |
| `row-key`        | 行唯一标识字段或函数       | `keyof T \| (row, rowIndex) => string \| number` | `undefined`  |
| `row-class-name` | 行 class 或 class 计算函数 | `string \| (row, rowIndex) => string`            | `""`         |
| `clickable`      | 是否开启键盘可聚焦行       | `boolean`                                        | `false`      |

### Table 事件

| 事件        | 说明                   | 参数                     |
| ----------- | ---------------------- | ------------------------ |
| `row-click` | 行点击或键盘触发时派发 | `(row, rowIndex, event)` |

### Table 列配置

| 字段        | 说明               |
| ----------- | ------------------ |
| `key`       | 列唯一标识         |
| `title`     | 列标题             |
| `dataIndex` | 读取行数据的字段名 |
| `width`     | 列宽               |
| `align`     | 对齐方式           |
| `slot`      | 自定义插槽名后缀   |
| `formatter` | 自定义格式化函数   |

更多示例和完整表格见 [Table 表格](/components/table)。

### Pagination API 摘要

| 属性           | 说明               | 类型       | 默认值         |
| -------------- | ------------------ | ---------- | -------------- |
| `current-page` | 当前页码           | `number`   | `1`            |
| `page-size`    | 每页条数           | `number`   | `10`           |
| `total`        | 总条数             | `number`   | —              |
| `page-sizes`   | 可选的每页条数列表 | `number[]` | `[10, 20, 50]` |
| `disabled`     | 是否禁用分页交互   | `boolean`  | `false`        |

### Pagination 事件

| 事件                  | 说明                     | 参数               |
| --------------------- | ------------------------ | ------------------ |
| `update:current-page` | 当前页变化时派发         | `number`           |
| `update:page-size`    | 每页条数变化时派发       | `number`           |
| `change`              | 页码或每页条数变化时派发 | `(page, pageSize)` |

完整表格 API 见 [Table 表格](/components/table)。

<style>
.doc-row-active td {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}
</style>
