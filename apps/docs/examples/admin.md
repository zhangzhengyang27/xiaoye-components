# Mini Admin Demo

这个页面不是为了“秀组件数量”，而是展示最小闭环是否成立。

键盘体验约定：

- `Tabs` 支持 `ArrowLeft / ArrowRight / Home / End`
- `Select` 支持方向键、`Enter` 和 `Escape`
- `Modal` 打开后会把焦点带入弹窗，关闭后恢复到触发位置

<div class="demo-card">
  <xy-tabs
    :items="[
      { key: 'overview', label: '概览' },
      { key: 'members', label: '成员' },
      { key: 'billing', label: '账单' }
    ]"
  >
    <template #default="{ activeKey }">
      <div class="xy-doc-stack">
        <xy-space>
          <xy-input placeholder="搜索成员 / 项目" clearable />
          <xy-select
            :options="[
              { label: '全部角色', value: 'all' },
              { label: '管理员', value: 'admin' },
              { label: '成员', value: 'member' }
            ]"
            placeholder="角色筛选"
            clearable
            searchable
            no-match-text="没有匹配角色"
          />
          <xy-tooltip content="打开弹窗后，焦点会自动进入弹窗内部">
            <xy-button>新建 {{ activeKey }}</xy-button>
          </xy-tooltip>
        </xy-space>
        <xy-table
          :columns="[
            { key: 'name', title: '名称', dataIndex: 'name' },
            { key: 'owner', title: '负责人', dataIndex: 'owner' },
            { key: 'updatedAt', title: '最近更新', dataIndex: 'updatedAt' }
          ]"
          :data="[
            { id: 1, name: '核心控制台', owner: 'Xiaoye', updatedAt: '2026-03-21' },
            { id: 2, name: '订阅中心', owner: 'Mavis', updatedAt: '2026-03-20' }
          ]"
          row-key="id"
        />
        <xy-pagination :total="42" />
      </div>
    </template>
  </xy-tabs>
</div>
