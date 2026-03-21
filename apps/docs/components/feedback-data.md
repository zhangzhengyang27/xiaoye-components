<script setup lang="ts">
import { computed, ref } from "vue";

const tableLoading = ref(false);
const showEmpty = ref(false);
const activeRowId = ref<number | null>(null);
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
</script>

# 反馈与数据展示

## Tooltip

<xy-tooltip content="这个按钮会立即提交当前表单，也支持 focus 打开和 Escape 关闭">
  <xy-button variant="outline">Hover / Focus 查看提示</xy-button>
</xy-tooltip>

当前版本里的 Tooltip 不只服务鼠标悬停，也覆盖了键盘用户的高频路径：

- Focus 进入触发区域时打开
- `Escape` 关闭提示
- `enterable` 允许光标进入提示层时保持显示

## Empty

<xy-empty title="暂无工单" description="当前筛选条件下没有找到结果">
  <xy-button variant="outline">重置筛选</xy-button>
</xy-empty>

## Table + Pagination

<div class="xy-doc-stack">
  <xy-space wrap>
    <xy-button variant="outline" @click="tableLoading = !tableLoading">
      {{ tableLoading ? '关闭加载态' : '开启加载态' }}
    </xy-button>
    <xy-button variant="outline" @click="showEmpty = !showEmpty">
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
    loadingText="正在加载项目列表"
    rowKey="id"
    :rowClassName="rowClassName"
    @rowClick="handleRowClick"
  >
    <template #loading>
      正在同步项目数据，请稍候...
    </template>
    <template #empty>
      <xy-empty title="暂无项目" description="当前筛选条件没有返回结果">
        <xy-button variant="outline" @click="showEmpty = false">恢复数据</xy-button>
      </xy-empty>
    </template>
  </xy-table>

  <xy-pagination :total="86" />
</div>

这一组能力对应的是后台列表页最常见的交互需求：

- `rowKey` 保证行标识稳定
- `rowClick` 适合联动详情面板或状态栏
- `rowClassName` 适合选中行高亮
- `empty / loading` 插槽让空态和加载态更贴近业务语境

```vue
<xy-table
  rowKey="id"
  :rowClassName="rowClassName"
  @rowClick="handleRowClick"
>
  <template #empty>
    <xy-empty title="暂无项目" />
  </template>
</xy-table>
```

<style>
.doc-row-active td {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}
</style>
