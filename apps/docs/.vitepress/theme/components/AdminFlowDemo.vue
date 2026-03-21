<script setup lang="ts">
import { ref } from "vue";

const drawerOpen = ref(false);
</script>

<template>
  <div class="demo-card">
    <xy-tabs
      :items="[
        { key: 'overview', label: '概览' },
        { key: 'members', label: '成员' },
        { key: 'billing', label: '账单' }
      ]"
    >
      <template #default>
        <div class="xy-doc-stack">
          <xy-space wrap>
            <xy-input placeholder="搜索成员 / 项目" clearable></xy-input>
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
            ></xy-select>
            <xy-tooltip content="这里适合放一句话提示">
              <xy-button variant="outline">Tooltip 提示</xy-button>
            </xy-tooltip>
            <xy-popover title="筛选说明">
              <p>如果你需要解释筛选逻辑、权限差异或数据范围，Popover 比 Tooltip 更合适。</p>
            </xy-popover>
            <xy-dropdown
              :items="[
                { key: 'export', label: '导出当前视图' },
                {
                  key: 'archive',
                  label: '归档筛选条件',
                  disabled: true,
                  description: '当前条件不可归档'
                }
              ]"
            ></xy-dropdown>
            <xy-button @click="drawerOpen = true">新建成员</xy-button>
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
          ></xy-table>

          <xy-pagination :total="42"></xy-pagination>
        </div>
      </template>
    </xy-tabs>

    <xy-drawer v-model="drawerOpen" title="侧边编辑成员">
      <div class="xy-doc-stack">
        <xy-input placeholder="成员名称"></xy-input>
        <xy-select
          :options="[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' }
          ]"
          placeholder="角色"
        ></xy-select>
        <xy-space>
          <xy-button variant="outline" @click="drawerOpen = false">取消</xy-button>
          <xy-button @click="drawerOpen = false">保存</xy-button>
        </xy-space>
      </div>
    </xy-drawer>
  </div>
</template>
