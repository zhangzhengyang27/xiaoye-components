<script setup lang="ts">
import { computed, ref } from "vue";
import type { AuditTimelineEntry } from "@xiaoye/pro-components";

interface TaskRow {
  id: number;
  title: string;
  owner: string;
  status: "待审核" | "上线中" | "已完成";
  summary: string;
}

const rows: TaskRow[] = [
  {
    id: 101,
    title: "二季度账单核对",
    owner: "小叶",
    status: "待审核",
    summary: "核对供应商账单、补齐差异备注并提交复核。"
  },
  {
    id: 102,
    title: "成员权限盘点",
    owner: "小星",
    status: "上线中",
    summary: "更新成员角色矩阵并同步到新权限模板。"
  }
];

const drawerOpen = ref(false);
const dialogOpen = ref(false);
const currentTask = ref<TaskRow | null>(null);

const timelineMap: Record<number, AuditTimelineEntry[]> = {
  101: [
    {
      id: "101-created",
      title: "任务创建",
      operator: "系统",
      timestamp: "2026-03-22 09:30",
      status: "success",
      description: "自动生成二季度账单核对任务。"
    }
  ],
  102: [
    {
      id: "102-start",
      title: "开始处理",
      operator: "小星",
      timestamp: "2026-03-25 10:10",
      status: "processing",
      description: "开始整理成员权限矩阵。"
    }
  ]
};

const currentTimeline = computed(() => {
  if (!currentTask.value) {
    return [];
  }

  return timelineMap[currentTask.value.id] ?? [];
});

function openDrawer(row: TaskRow) {
  currentTask.value = row;
  drawerOpen.value = true;
}

function openDialog(row: TaskRow) {
  currentTask.value = row;
  dialogOpen.value = true;
}

function resolveStatusTag(status?: TaskRow["status"]) {
  if (status === "已完成") return "success";
  if (status === "上线中") return "primary";
  return "warning";
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="收口后的理解方式">
      <p>
        这里把“抽屉查看”和“弹窗查看”统一理解为详情面板。
      </p>
      <p>
        详情内容的核心不是容器，而是只读信息、状态标记和历史记录如何被稳定承接。
      </p>
    </xy-card>

    <xy-pro-table
      title="发布任务"
      description="同一份任务详情，可以按上下文需求用抽屉或弹窗承接。"
      :data="rows"
      :columns="[
        { prop: 'title', label: '任务名称', minWidth: 220 },
        { prop: 'owner', label: '负责人', minWidth: 120 },
        { prop: 'status', label: '状态', slot: 'status', minWidth: 120 },
        { key: 'actions', label: '查看方式', slot: 'actions', width: 220, align: 'right' }
      ]"
      :pagination="false"
      :table-props="{ rowKey: 'id' }"
    >
      <template #status="{ row }">
        <xy-tag :status="resolveStatusTag(row.status)">
          {{ row.status }}
        </xy-tag>
      </template>

      <template #actions="{ row }">
        <xy-space>
          <xy-button text @click="openDrawer(row)">抽屉查看</xy-button>
          <xy-button text @click="openDialog(row)">弹窗查看</xy-button>
        </xy-space>
      </template>
    </xy-pro-table>

    <xy-detail-panel
      v-model:open="drawerOpen"
      container="drawer"
      :title="currentTask?.title ?? '任务详情'"
      description="当前更适合保留列表上下文时，优先使用抽屉。"
    >
      <template #meta>
        <xy-tag :status="resolveStatusTag(currentTask?.status)">
          {{ currentTask?.status ?? "待审核" }}
        </xy-tag>
      </template>

      <xy-card header="任务概览">
        <xy-descriptions :column="2" border>
          <xy-descriptions-item label="负责人">{{ currentTask?.owner ?? "-" }}</xy-descriptions-item>
          <xy-descriptions-item label="任务编号">{{ currentTask?.id ?? "-" }}</xy-descriptions-item>
          <xy-descriptions-item label="说明" :span="2">
            {{ currentTask?.summary ?? "-" }}
          </xy-descriptions-item>
        </xy-descriptions>
      </xy-card>

      <template #timeline>
        <xy-card header="操作记录">
          <xy-audit-timeline :items="currentTimeline" compact />
        </xy-card>
      </template>
    </xy-detail-panel>

    <xy-detail-panel
      v-model:open="dialogOpen"
      container="dialog"
      :title="currentTask?.title ?? '任务详情'"
      description="当前只需要快速确认关键信息时，优先使用弹窗。"
    >
      <xy-card header="任务信息">
        <xy-descriptions :column="2" border>
          <xy-descriptions-item label="负责人">{{ currentTask?.owner ?? "-" }}</xy-descriptions-item>
          <xy-descriptions-item label="状态">{{ currentTask?.status ?? "-" }}</xy-descriptions-item>
          <xy-descriptions-item label="说明" :span="2">
            {{ currentTask?.summary ?? "-" }}
          </xy-descriptions-item>
        </xy-descriptions>
      </xy-card>

      <template #timeline>
        <xy-card header="最近记录">
          <xy-audit-timeline :items="currentTimeline" compact />
        </xy-card>
      </template>
    </xy-detail-panel>
  </div>
</template>
