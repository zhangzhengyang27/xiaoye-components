<script setup lang="ts">
import { ref } from "vue";

interface MemberRow {
  id: number;
  name: string;
  role: string;
  status: "值班中" | "已下线";
}

const rows: MemberRow[] = [
  { id: 1, name: "王新宇", role: "运营负责人", status: "值班中" },
  { id: 2, name: "林星河", role: "交付经理", status: "值班中" },
  { id: 3, name: "沈知行", role: "财务审核", status: "已下线" }
];
const onlineCount = rows.filter((row) => row.status === "值班中").length;

const moreActions = [
  { key: "copy", label: "复制成员信息" },
  { key: "archive", label: "归档账号", danger: true }
];
const lastAction = ref("等待指令");

function handleQuickAction(row: MemberRow, action: string) {
  lastAction.value = `${row.name}：${action}`;
}

function handleMoreAction(row: MemberRow, item: { label: string }) {
  lastAction.value = `${row.name}：${item.label}`;
}
</script>

<template>
  <div class="xy-doc-stack xy-table-doc-scene">
    <div class="xy-table-doc-scene__hero">
      <div class="xy-table-doc-scene__intro">
        <div class="xy-table-doc-scene__eyebrow">Action Column</div>
        <div class="xy-table-doc-scene__title">值班成员操作台</div>
        <p class="xy-table-doc-scene__description">
          行尾工具区适合承接轻操作和二级菜单，让列表保持节奏感，而不是堆满同权重按钮。
        </p>
      </div>

      <div class="xy-table-doc-scene__meta">
        <div class="xy-table-doc-chip">
          <span>成员数</span>
          <strong>{{ rows.length }}</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>在线值班</span>
          <strong>{{ onlineCount }}</strong>
        </div>
        <div class="xy-table-doc-chip">
          <span>工具区</span>
          <strong>Text + More</strong>
        </div>
      </div>
    </div>

    <div class="xy-table-doc-scene__surface">
      <xy-table :data="rows" row-key="id" border>
        <xy-table-column prop="name" label="姓名" min-width="150">
          <template #default="{ row, value }">
            <div class="xy-table-doc-person">
              <span class="xy-table-doc-avatar">{{ String(value ?? "").slice(0, 1) }}</span>
              <div class="xy-table-doc-person__meta">
                <strong>{{ row?.name ?? value ?? "--" }}</strong>
                <span
                  >值班账号 #{{ row?.id != null ? String(row.id).padStart(2, "0") : "--" }}</span
                >
              </div>
            </div>
          </template>
        </xy-table-column>
        <xy-table-column prop="role" label="岗位" width="110" />
        <xy-table-column prop="status" label="状态" width="100">
          <template #default="{ value }">
            <xy-tag :status="value === '值班中' ? 'success' : 'neutral'">{{ value }}</xy-tag>
          </template>
        </xy-table-column>
        <xy-table-column label="操作" align="right" width="184">
          <template #default="{ row }">
            <div class="xy-table-doc-actions">
              <xy-button
                text
                bg
                type="primary"
                size="sm"
                @click="handleQuickAction(row, '查看详情')"
              >
                查看
              </xy-button>
              <xy-button text size="sm" @click="handleQuickAction(row, '编辑角色')">编辑</xy-button>
              <xy-dropdown :items="moreActions" @select="handleMoreAction(row, $event)">
                <xy-button text size="sm">更多</xy-button>
              </xy-dropdown>
            </div>
          </template>
        </xy-table-column>
      </xy-table>
    </div>

    <div class="xy-table-doc-scene__footer">
      <div class="xy-table-doc-scene__summary">
        <div class="xy-table-doc-scene__label">Recent Action</div>
        <div class="xy-table-doc-scene__value">{{ lastAction }}</div>
      </div>
      <div class="xy-table-doc-scene__hint">
        行 hover 时再强调操作区，能让整行更像一组完整工具条。
      </div>
    </div>
  </div>
</template>

<style scoped>
.xy-table-doc-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: nowrap;
  min-width: 0;
  white-space: nowrap;
}
</style>
