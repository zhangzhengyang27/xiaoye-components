<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { AutoCompleteOption } from "xiaoye-components";
import type {
  AuditTimelineEntry,
  OverlayFormSubmitPayload,
  ProTableColumn,
  ProTableInstance,
  SearchFormField
} from "xiaoye-pro-components";

type WorkbenchTrack = "members" | "billing" | "risk";
type WorkbenchStatus = "待处理" | "审核中" | "已完成";
type WorkbenchPriority = "P0" | "P1" | "P2";

interface WorkbenchRecord {
  id: number;
  track: WorkbenchTrack;
  name: string;
  owner: string;
  status: WorkbenchStatus;
  priority: WorkbenchPriority;
  updatedAt: string;
  summary: string;
  timeline: AuditTimelineEntry[];
}

interface WorkbenchBatchAction {
  key: "review" | "finish" | "rollback";
  label: string;
  type?: "primary";
  danger?: boolean;
}

const trackLabelMap: Record<WorkbenchTrack, string> = {
  members: "成员台账",
  billing: "账单链路",
  risk: "风控排查"
};

const trackSceneMap: Record<WorkbenchTrack, string> = {
  members: "成员档案、角色和归属关系",
  billing: "对账、结算和发票跟进",
  risk: "异常回退、操作复盘和风控说明"
};

const statusTagMap: Record<WorkbenchStatus, "warning" | "primary" | "success"> = {
  待处理: "warning",
  审核中: "primary",
  已完成: "success"
};

const priorityTagMap: Record<WorkbenchPriority, "danger" | "warning" | "primary"> = {
  P0: "danger",
  P1: "warning",
  P2: "primary"
};

function createTimelineEntry(
  id: string,
  title: string,
  operator: string,
  timestamp: string,
  status: AuditTimelineEntry["status"],
  description: string,
  remark?: string
): AuditTimelineEntry {
  return {
    id,
    title,
    operator,
    timestamp,
    status,
    description,
    remark
  };
}

function createRecord(record: Omit<WorkbenchRecord, "timeline"> & { timeline: AuditTimelineEntry[] }) {
  return record;
}

const records = ref<WorkbenchRecord[]>([
  createRecord({
    id: 101,
    track: "members",
    name: "成员主档补录",
    owner: "小叶",
    status: "待处理",
    priority: "P1",
    updatedAt: "2026-03-27",
    summary: "补齐成员档案字段、组织归属和角色初始配置。",
    timeline: [
      createTimelineEntry(
        "101-created",
        "任务创建",
        "系统",
        "2026-03-24 09:30",
        "success",
        "成员主档补录任务已生成。"
      ),
      createTimelineEntry(
        "101-review",
        "待业务确认",
        "运营负责人",
        "2026-03-26 14:10",
        "warning",
        "仍缺少 2 个成员的归属团队说明。",
        "补齐归属团队后再提交复核。"
      )
    ]
  }),
  createRecord({
    id: 102,
    track: "members",
    name: "权限矩阵更新",
    owner: "小星",
    status: "审核中",
    priority: "P0",
    updatedAt: "2026-03-28",
    summary: "调整成员角色矩阵并同步权限模板。",
    timeline: [
      createTimelineEntry(
        "102-created",
        "变更发起",
        "小星",
        "2026-03-26 10:00",
        "processing",
        "已发起权限矩阵更新。"
      ),
      createTimelineEntry(
        "102-qa",
        "预发布校验",
        "测试同学",
        "2026-03-27 18:40",
        "success",
        "预发布环境校验通过。"
      )
    ]
  }),
  createRecord({
    id: 103,
    track: "members",
    name: "离职成员归档",
    owner: "小南",
    status: "已完成",
    priority: "P2",
    updatedAt: "2026-03-26",
    summary: "归档离职成员的角色和历史归属记录。",
    timeline: [
      createTimelineEntry(
        "103-close",
        "归档完成",
        "小南",
        "2026-03-26 17:20",
        "success",
        "成员记录与历史权限已归档。"
      )
    ]
  }),
  createRecord({
    id: 201,
    track: "billing",
    name: "供应商账单核对",
    owner: "Mavis",
    status: "审核中",
    priority: "P0",
    updatedAt: "2026-03-28",
    summary: "核对 3 月供应商账单差异并提交复核。",
    timeline: [
      createTimelineEntry(
        "201-created",
        "发起对账",
        "Mavis",
        "2026-03-25 11:12",
        "processing",
        "开始核对供应商对账单。"
      ),
      createTimelineEntry(
        "201-note",
        "补充说明",
        "财务复核",
        "2026-03-27 09:08",
        "warning",
        "发现 3 条金额差异，待补充说明。",
        "需同步供应商侧确认结果。"
      )
    ]
  }),
  createRecord({
    id: 202,
    track: "billing",
    name: "发票回传跟进",
    owner: "Xiaoye",
    status: "待处理",
    priority: "P1",
    updatedAt: "2026-03-27",
    summary: "跟进入账发票回传进度并补齐附件。",
    timeline: [
      createTimelineEntry(
        "202-created",
        "任务登记",
        "系统",
        "2026-03-25 15:40",
        "success",
        "发票回传任务已登记。"
      )
    ]
  }),
  createRecord({
    id: 203,
    track: "billing",
    name: "结算单归档",
    owner: "小叶",
    status: "已完成",
    priority: "P2",
    updatedAt: "2026-03-25",
    summary: "归档已结算的对账单与邮件附件。",
    timeline: [
      createTimelineEntry(
        "203-done",
        "归档完成",
        "小叶",
        "2026-03-25 18:12",
        "success",
        "结算单及邮件附件已归档。"
      )
    ]
  }),
  createRecord({
    id: 301,
    track: "risk",
    name: "异常操作复盘",
    owner: "Annie",
    status: "待处理",
    priority: "P0",
    updatedAt: "2026-03-28",
    summary: "复盘异常权限操作并补充审计说明。",
    timeline: [
      createTimelineEntry(
        "301-created",
        "复盘任务创建",
        "系统",
        "2026-03-28 08:16",
        "warning",
        "检测到异常权限变更，已生成复盘任务。"
      )
    ]
  }),
  createRecord({
    id: 302,
    track: "risk",
    name: "高危权限回退",
    owner: "小星",
    status: "审核中",
    priority: "P0",
    updatedAt: "2026-03-28",
    summary: "回退高危权限并确认影响范围。",
    timeline: [
      createTimelineEntry(
        "302-rollback",
        "回退执行",
        "小星",
        "2026-03-28 10:42",
        "processing",
        "高危权限已回退，等待业务确认。"
      )
    ]
  }),
  createRecord({
    id: 303,
    track: "risk",
    name: "操作记录补录",
    owner: "Mavis",
    status: "已完成",
    priority: "P1",
    updatedAt: "2026-03-26",
    summary: "补录遗失的风控操作记录与附件说明。",
    timeline: [
      createTimelineEntry(
        "303-done",
        "补录完成",
        "Mavis",
        "2026-03-26 13:55",
        "success",
        "操作记录和附件已补齐。"
      )
    ]
  })
]);

const tabItems = [
  { key: "members", label: "成员台账" },
  { key: "billing", label: "账单链路" },
  { key: "risk", label: "风控排查" }
] as const;

const ownerOptions: AutoCompleteOption<string>[] = [
  { label: "小叶", value: "小叶" },
  { label: "小星", value: "小星" },
  { label: "小南", value: "小南" },
  { label: "Mavis", value: "Mavis" },
  { label: "Xiaoye", value: "Xiaoye" },
  { label: "Annie", value: "Annie" }
];

const searchModel = reactive({
  keyword: "",
  status: "all",
  priority: "all"
});

const appliedFilters = ref({
  keyword: "",
  status: "all",
  priority: "all"
});

const activeTab = ref<WorkbenchTrack>("members");
const currentPage = ref(1);
const pageSize = ref(5);
const tableRef = ref<ProTableInstance<WorkbenchRecord> | null>(null);
const selectedRows = ref<WorkbenchRecord[]>([]);
const drawerOpen = ref(false);
const drawerMode = ref<"create" | "edit">("create");
const detailOpen = ref(false);
const editingId = ref<number | null>(null);
const detailId = ref<number | null>(null);
const submitting = ref(false);
const activityLog = ref("顶部筛选、列表、详情、编辑、批量操作和历史记录已串成一条闭环。");

const formModel = reactive({
  track: "members" as WorkbenchTrack,
  name: "",
  owner: "",
  status: "待处理" as WorkbenchStatus,
  priority: "P1" as WorkbenchPriority,
  summary: ""
});

const formRules = {
  track: [
    {
      required: true,
      message: "请选择所属工作台",
      trigger: "change"
    }
  ],
  name: [
    {
      required: true,
      message: "请输入任务名称",
      trigger: "blur"
    }
  ],
  owner: [
    {
      required: true,
      message: "请输入负责人",
      trigger: "change"
    }
  ],
  summary: [
    {
      required: true,
      message: "请输入任务说明",
      trigger: "blur"
    }
  ]
} as const;

const searchFields: SearchFormField[] = [
  {
    prop: "keyword",
    label: "关键词",
    component: "input",
    componentProps: {
      placeholder: "按任务名称、负责人搜索"
    },
    span: 2
  },
  {
    prop: "status",
    label: "状态",
    component: "select",
    options: [
      { label: "全部状态", value: "all" },
      { label: "待处理", value: "待处理" },
      { label: "审核中", value: "审核中" },
      { label: "已完成", value: "已完成" }
    ]
  },
  {
    prop: "priority",
    label: "优先级",
    component: "select",
    options: [
      { label: "全部优先级", value: "all" },
      { label: "P0", value: "P0" },
      { label: "P1", value: "P1" },
      { label: "P2", value: "P2" }
    ],
    collapsible: true
  }
];

const columns: ProTableColumn<WorkbenchRecord>[] = [
  {
    type: "selection",
    width: 52
  },
  {
    prop: "name",
    label: "任务名称",
    minWidth: 220
  },
  {
    prop: "owner",
    label: "负责人",
    minWidth: 120
  },
  {
    prop: "priority",
    label: "优先级",
    slot: "priority",
    minWidth: 96
  },
  {
    prop: "status",
    label: "状态",
    slot: "status",
    minWidth: 110
  },
  {
    prop: "updatedAt",
    label: "最近更新",
    minWidth: 120
  },
  {
    key: "actions",
    label: "操作",
    slot: "actions",
    width: 148,
    align: "right",
    fixed: "right"
  }
];

const toolbarActions = [
  { key: "create", label: "新建事项", type: "primary" },
  { key: "export", label: "导出视图", plain: true }
] as const;

const batchActions: WorkbenchBatchAction[] = [
  {
    key: "review",
    label: "批量转审核中",
    type: "primary"
  },
  {
    key: "finish",
    label: "批量完成"
  },
  {
    key: "rollback",
    label: "批量回退",
    danger: true
  }
];

const currentTrackTitle = computed(() => trackLabelMap[activeTab.value]);
const summaryItems = computed(() => {
  const currentRecords = records.value.filter((record) => record.track === activeTab.value);

  return [
    {
      key: "all",
      label: "当前视图任务数",
      value: currentRecords.length,
      description: `视图：${currentTrackTitle.value}`,
      status: "primary" as const
    },
    {
      key: "processing",
      label: "处理中 / 审核中",
      value: currentRecords.filter((record) => record.status === "审核中").length,
      description: "适合接审批流和任务看板",
      status: "warning" as const
    },
    {
      key: "priority",
      label: "P0 高优先级",
      value: currentRecords.filter((record) => record.priority === "P0").length,
      description: "高优先级事项需要优先回看",
      status: "danger" as const
    }
  ];
});
const savedViewItems = computed(() =>
  tabItems.map((item) => ({
    key: item.key,
    label: item.label,
    count: records.value.filter((record) => record.track === item.key).length
  }))
);
const filteredRecords = computed(() => {
  const keyword = appliedFilters.value.keyword.trim().toLowerCase();

  return records.value.filter((record) => {
    if (record.track !== activeTab.value) {
      return false;
    }

    if (
      keyword &&
      ![record.name, record.owner, record.summary].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    ) {
      return false;
    }

    if (
      appliedFilters.value.status !== "all" &&
      record.status !== appliedFilters.value.status
    ) {
      return false;
    }

    if (
      appliedFilters.value.priority !== "all" &&
      record.priority !== appliedFilters.value.priority
    ) {
      return false;
    }

    return true;
  });
});

const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRecords.value.slice(start, start + pageSize.value);
});

const detailRecord = computed(() => records.value.find((record) => record.id === detailId.value) ?? null);

const footerSummary = computed(
  () =>
    `当前在 ${currentTrackTitle.value} 视图下，共命中 ${filteredRecords.value.length} 条记录。`
);

function nowLabel() {
  return new Date().toLocaleString("zh-CN", {
    hour12: false
  });
}

function buildTimelineRecord(
  record: WorkbenchRecord,
  title: string,
  status: AuditTimelineEntry["status"],
  description: string,
  operator = "演示操作者"
) {
  return createTimelineEntry(
    `${record.id}-${Date.now()}`,
    title,
    operator,
    nowLabel(),
    status,
    description
  );
}

function clearSelection() {
  tableRef.value?.clearSelection();
  selectedRows.value = [];
}

function handleTabChange() {
  currentPage.value = 1;
  clearSelection();
  activityLog.value = `已切换到 ${currentTrackTitle.value} 视图，筛选条件保持不变。`;
}

function handleViewChange(value: string) {
  activeTab.value = value as WorkbenchTrack;
  handleTabChange();
}

function handleSearch(payload: Record<string, unknown>) {
  appliedFilters.value = {
    keyword: String(payload.keyword ?? ""),
    status: String(payload.status ?? "all"),
    priority: String(payload.priority ?? "all")
  };
  currentPage.value = 1;
  clearSelection();
  activityLog.value = `已按当前筛选条件刷新 ${currentTrackTitle.value} 列表。`;
}

function handleToolbarAction(action: { key: string }) {
  if (action.key === "create") {
    drawerMode.value = "create";
    editingId.value = null;
    Object.assign(formModel, {
      track: activeTab.value,
      name: "",
      owner: "",
      status: "待处理",
      priority: "P1",
      summary: ""
    });
    drawerOpen.value = true;
    activityLog.value = `已打开 ${currentTrackTitle.value} 的新建抽屉。`;
    return;
  }

  if (action.key === "export") {
    activityLog.value = `已触发 ${currentTrackTitle.value} 视图的导出动作。`;
  }
}

function handleSelectionChange(selection: WorkbenchRecord[]) {
  selectedRows.value = selection;
}

function openDetail(record: WorkbenchRecord) {
  detailId.value = record.id;
  detailOpen.value = true;
  activityLog.value = `已打开「${record.name}」的详情抽屉。`;
}

function openEdit(record: WorkbenchRecord) {
  drawerMode.value = "edit";
  editingId.value = record.id;
  Object.assign(formModel, {
    track: record.track,
    name: record.name,
    owner: record.owner,
    status: record.status,
    priority: record.priority,
    summary: record.summary
  });
  drawerOpen.value = true;
  activityLog.value = `已打开「${record.name}」的编辑抽屉。`;
}

async function handleSubmit(payload: OverlayFormSubmitPayload) {
  submitting.value = true;

  const nextRecord = {
    track: payload.model.track as WorkbenchTrack,
    name: String(payload.model.name ?? ""),
    owner: String(payload.model.owner ?? ""),
    status: payload.model.status as WorkbenchStatus,
    priority: payload.model.priority as WorkbenchPriority,
    summary: String(payload.model.summary ?? "")
  };

  if (payload.mode === "create") {
    records.value = [
      {
        id: Date.now(),
        updatedAt: nowLabel().slice(0, 10),
        timeline: [
          createTimelineEntry(
            `new-${Date.now()}`,
            "事项创建",
            nextRecord.owner || "演示操作者",
            nowLabel(),
            "success",
            `已创建「${nextRecord.name}」并加入 ${trackLabelMap[nextRecord.track]}。`
          )
        ],
        ...nextRecord
      },
      ...records.value
    ];
    activityLog.value = `已新建「${nextRecord.name}」。`;
  } else if (editingId.value !== null) {
    records.value = records.value.map((record) =>
      record.id === editingId.value
        ? {
            ...record,
            ...nextRecord,
            updatedAt: nowLabel().slice(0, 10),
            timeline: [
              buildTimelineRecord(
                record,
                "内容更新",
                "processing",
                `已更新负责人、状态或说明信息。`,
                nextRecord.owner || "演示操作者"
              ),
              ...record.timeline
            ]
          }
        : record
    );
    activityLog.value = `已保存「${nextRecord.name}」的编辑结果。`;
  }

  currentPage.value = 1;
  submitting.value = false;
  drawerOpen.value = false;
}

function applyBatchStatus(action: WorkbenchBatchAction) {
  const selectedIds = new Set(selectedRows.value.map((record) => record.id));

  records.value = records.value.map((record) => {
    if (!selectedIds.has(record.id)) {
      return record;
    }

    let nextStatus: WorkbenchStatus = record.status;
    let nextTitle = "批量操作";
    let nextDetail = "已执行批量操作。";
    let nextTimelineStatus: AuditTimelineEntry["status"] = "processing";

    if (action.key === "review") {
      nextStatus = "审核中";
      nextTitle = "批量转审核中";
      nextDetail = "已加入审核中队列。";
      nextTimelineStatus = "processing";
    } else if (action.key === "finish") {
      nextStatus = "已完成";
      nextTitle = "批量完成";
      nextDetail = "已标记为完成。";
      nextTimelineStatus = "success";
    } else if (action.key === "rollback") {
      nextStatus = "待处理";
      nextTitle = "批量回退";
      nextDetail = "已回退到待处理状态。";
      nextTimelineStatus = "danger";
    }

    return {
      ...record,
      status: nextStatus,
      updatedAt: nowLabel().slice(0, 10),
      timeline: [
        buildTimelineRecord(record, nextTitle, nextTimelineStatus, nextDetail),
        ...record.timeline
      ]
    };
  });

  activityLog.value = `已对 ${selectedRows.value.length} 条记录执行「${action.label}」。`;
  clearSelection();
}

function editFromDetail(close: () => void) {
  if (!detailRecord.value) {
    return;
  }

  close();
  openEdit(detailRecord.value);
}
</script>

<template>
  <div class="demo-card admin-pro-demo">
    <div class="admin-pro-demo__hero">
      <div class="admin-pro-demo__hero-main">
        <p class="admin-pro-demo__eyebrow">完整后台闭环</p>
        <h3>增强层已经不只是筛选和列表，而是编辑、详情、批量和历史记录一起工作。</h3>
        <p>
          这个示例把
          <code>SearchForm</code>、<code>ProTable</code>、<code>OverlayForm</code>、<code>DetailPanel</code>、批量动作私有块
          和 <code>AuditTimeline</code> 放回同一个单页后台场景里。
        </p>
      </div>
      <div class="admin-pro-demo__hero-side">
        <xy-tag status="primary">增强层闭环已接通</xy-tag>
        <p>{{ activityLog }}</p>
      </div>
    </div>

    <div class="admin-pro-demo__summary-grid">
      <xy-card
        v-for="item in summaryItems"
        :key="item.key"
        class="admin-pro-demo__summary-card"
        shadow="hover"
      >
        <div class="admin-pro-demo__summary-head">
          <span>{{ item.label }}</span>
          <xy-tag size="sm" :status="item.status">{{ item.status }}</xy-tag>
        </div>
        <strong class="admin-pro-demo__summary-value">{{ item.value }}</strong>
        <p class="admin-pro-demo__summary-description">{{ item.description }}</p>
      </xy-card>
    </div>

    <xy-saved-view-tabs
      :items="savedViewItems"
      :active-key="activeTab"
      @update:active-key="handleViewChange"
    >
      <div class="xy-doc-stack admin-pro-demo__stack">
          <xy-search-form
            :model="searchModel"
            :fields="searchFields"
            :columns="3"
            @search="handleSearch"
          >
            <template #meta>
              <span>{{ currentTrackTitle }}：{{ trackSceneMap[activeTab] }}</span>
            </template>
          </xy-search-form>

          <div v-if="selectedRows.length > 0" class="admin-pro-demo__batch-strip">
            <div class="admin-pro-demo__batch-copy">
              当前在 {{ currentTrackTitle }} 视图中选中了 {{ selectedRows.length }} 条记录，批量动作会同步写入历史记录。
            </div>
            <div class="admin-pro-demo__batch-actions">
              <xy-button
                v-for="action in batchActions"
                :key="action.key"
                :type="action.type"
                :plain="!action.type && !action.danger"
                :danger="action.danger"
                @click="applyBatchStatus(action)"
              >
                {{ action.label }}
              </xy-button>
              <xy-button text @click="clearSelection">清空选择</xy-button>
            </div>
          </div>

          <xy-pro-table
            ref="tableRef"
            :data="pagedRecords"
            :columns="columns"
            :total="filteredRecords.length"
            :current-page="currentPage"
            :page-size="pageSize"
            :toolbar-actions="toolbarActions"
            :table-props="{ rowKey: 'id' }"
            title="事项列表"
            description="筛选后的记录进入列表主干，再接详情抽屉、编辑抽屉和批量动作。"
            @toolbar-action="handleToolbarAction"
            @selection-change="handleSelectionChange"
            @update:current-page="currentPage = $event"
            @update:page-size="pageSize = $event"
          >
            <template #toolbar-left>
              <xy-tag :status="statusTagMap['审核中']">当前视图：{{ currentTrackTitle }}</xy-tag>
            </template>

            <template #priority="{ row }">
              <xy-tag :status="priorityTagMap[row.priority]">{{ row.priority }}</xy-tag>
            </template>

            <template #status="{ row }">
              <xy-tag :status="statusTagMap[row.status]">{{ row.status }}</xy-tag>
            </template>

            <template #actions="{ row }">
              <div class="admin-pro-demo__actions">
                <xy-button text @click="openDetail(row)">查看</xy-button>
                <xy-button text @click="openEdit(row)">编辑</xy-button>
              </div>
            </template>

            <template #footer-meta>
              <span>{{ footerSummary }}</span>
            </template>
          </xy-pro-table>
      </div>
    </xy-saved-view-tabs>

    <xy-overlay-form
      v-model:open="drawerOpen"
      container="drawer"
      :mode="drawerMode"
      :model="formModel"
      :rules="formRules"
      :submitting="submitting"
      title="侧边事项表单"
      @submit="handleSubmit"
    >
      <xy-form-item label="所属工作台" prop="track">
        <xy-select
          v-model="formModel.track"
          :options="[
            { label: '成员台账', value: 'members' },
            { label: '账单链路', value: 'billing' },
            { label: '风控排查', value: 'risk' }
          ]"
        />
      </xy-form-item>
      <xy-form-item label="事项名称" prop="name">
        <xy-input v-model="formModel.name" placeholder="请输入事项名称" />
      </xy-form-item>
      <xy-form-item label="负责人" prop="owner">
        <xy-auto-complete
          v-model="formModel.owner"
          :options="ownerOptions"
          clearable
          placeholder="输入或选择负责人"
        />
      </xy-form-item>
      <xy-form-item label="状态" prop="status">
        <xy-select
          v-model="formModel.status"
          :options="[
            { label: '待处理', value: '待处理' },
            { label: '审核中', value: '审核中' },
            { label: '已完成', value: '已完成' }
          ]"
        />
      </xy-form-item>
      <xy-form-item label="优先级" prop="priority">
        <xy-select
          v-model="formModel.priority"
          :options="[
            { label: 'P0', value: 'P0' },
            { label: 'P1', value: 'P1' },
            { label: 'P2', value: 'P2' }
          ]"
        />
      </xy-form-item>
      <xy-form-item label="任务说明" prop="summary">
        <xy-input
          v-model="formModel.summary"
          type="textarea"
          :rows="4"
          placeholder="请输入这条事项的处理说明"
        />
      </xy-form-item>
    </xy-overlay-form>

    <xy-detail-panel
      v-model:open="detailOpen"
      container="drawer"
      :title="detailRecord?.name ?? '事项详情'"
      description="详情和编辑拆开后，历史记录、状态说明和操作区都更稳定。"
    >
      <template #meta>
        <xy-tag :status="detailRecord ? statusTagMap[detailRecord.status] : 'warning'">
          {{ detailRecord?.status ?? "待处理" }}
        </xy-tag>
      </template>

      <xy-card header="事项概览">
        <xy-descriptions :column="2" border>
          <xy-descriptions-item label="所属工作台">
            {{ detailRecord ? trackLabelMap[detailRecord.track] : "-" }}
          </xy-descriptions-item>
          <xy-descriptions-item label="负责人">
            {{ detailRecord?.owner ?? "-" }}
          </xy-descriptions-item>
          <xy-descriptions-item label="优先级">
            {{ detailRecord?.priority ?? "-" }}
          </xy-descriptions-item>
          <xy-descriptions-item label="最近更新">
            {{ detailRecord?.updatedAt ?? "-" }}
          </xy-descriptions-item>
          <xy-descriptions-item label="任务说明" :span="2">
            {{ detailRecord?.summary ?? "-" }}
          </xy-descriptions-item>
        </xy-descriptions>
      </xy-card>

      <template #timeline>
        <xy-card header="操作记录">
          <p class="admin-pro-demo__timeline-note">
            每次详情查看、编辑和批量动作都应该能沉淀成稳定的时间线。
          </p>
          <xy-audit-timeline :items="detailRecord?.timeline ?? []" compact />
        </xy-card>
      </template>

      <template #actions="{ close }">
        <xy-button @click="close()">关闭</xy-button>
        <xy-button type="primary" @click="editFromDetail(close)">编辑当前项</xy-button>
      </template>
    </xy-detail-panel>
  </div>
</template>

<style scoped>
.admin-pro-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-pro-demo__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);
  gap: 16px;
  padding: 4px 2px 6px;
}

.admin-pro-demo__hero-main,
.admin-pro-demo__hero-side {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-pro-demo__hero-main h3 {
  margin: 0;
}

.admin-pro-demo__hero-main p,
.admin-pro-demo__hero-side p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.admin-pro-demo__eyebrow {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-pro-demo__hero-side {
  padding: 16px;
  border: 1px solid rgba(37, 99, 235, 0.12);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.08), rgba(255, 255, 255, 0.72));
}

.admin-pro-demo__stack {
  gap: 18px;
}

.admin-pro-demo__summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.admin-pro-demo__summary-card {
  min-height: 120px;
}

.admin-pro-demo__summary-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.admin-pro-demo__summary-value {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  line-height: 1;
}

.admin-pro-demo__summary-description {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.admin-pro-demo__batch-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(245, 158, 11, 0.24);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.08), rgba(255, 255, 255, 0.72));
}

.admin-pro-demo__batch-copy {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.admin-pro-demo__batch-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.admin-pro-demo__actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.admin-pro-demo__timeline-note {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

@media (max-width: 960px) {
  .admin-pro-demo__hero {
    grid-template-columns: 1fr;
  }

  .admin-pro-demo__summary-grid {
    grid-template-columns: 1fr;
  }

  .admin-pro-demo__batch-strip {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-pro-demo__batch-actions {
    justify-content: flex-start;
  }
}
</style>
