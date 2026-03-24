<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SchedulerScene from "./components/SchedulerScene.vue";
import type {
  SchedulerDateClickPayload,
  SchedulerEvent,
  SchedulerEventChangePayload,
  SchedulerEventClickPayload,
  SchedulerView,
  UploadFileItem
} from "xiaoye-components";

interface MemberRow {
  id: number;
  name: string;
  owner: string;
  role: string;
  status: string;
  updatedAt: string;
}

interface FormInstance {
  validate: () => Promise<boolean>;
  resetFields: (props?: string | string[]) => void;
}

interface ActionItem {
  key: string;
  label: string;
}

const currentScene =
  typeof window !== "undefined"
    ? (new URLSearchParams(window.location.search).get("scene") ?? "")
    : "";
const isSchedulerScene = currentScene === "scheduler";

const modalOpen = ref(false);
const drawerOpen = ref(false);
const activeTab = ref("members");
const formRef = ref<FormInstance | null>(null);
const saveFeedback = ref("待提交");
const activeRow = ref<MemberRow | null>(null);
const drawerDraft = reactive({
  name: "",
  role: "",
  dueDate: "",
  attachments: [] as UploadFileItem[]
});

const filters = reactive({
  keyword: "",
  role: null as string | null
});

const memberForm = reactive({
  name: "",
  role: null as string | null,
  startDate: null as string | null,
  attachments: [] as UploadFileItem[]
});

const schedulerDate = ref("2026-03-24");
const schedulerView = ref<SchedulerView>("week");
const schedulerFeedback = ref("拖拽排期后，这里会回写最新结果");
const schedulerEvents = ref<SchedulerEvent[]>([
  {
    id: "kickoff",
    title: "Kickoff",
    start: "2026-03-24T10:00:00",
    end: "2026-03-24T11:00:00"
  },
  {
    id: "standup",
    title: "工作日站会",
    start: "2026-03-23T09:30:00",
    rrule: {
      freq: "weekly",
      byweekday: ["mo", "tu", "we", "th", "fr"],
      dtstart: "2026-03-23T09:30:00"
    },
    duration: "00:15"
  }
]);

const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }],
  startDate: [{ required: true, message: "请选择开始日期", trigger: "change" as const }]
};

const rows = ref<MemberRow[]>([
  {
    id: 1,
    name: "Billing Console",
    owner: "Xiaoye",
    role: "admin",
    status: "开发中",
    updatedAt: "2026-03-21"
  },
  {
    id: 2,
    name: "Sales Admin",
    owner: "Alice",
    role: "member",
    status: "已上线",
    updatedAt: "2026-03-20"
  },
  {
    id: 3,
    name: "Support Hub",
    owner: "Bob",
    role: "guest",
    status: "设计中",
    updatedAt: "2026-03-19"
  }
]);

const roleOptions = [
  { label: "管理员", value: "admin" },
  { label: "成员", value: "member" },
  { label: "访客", value: "guest" }
];

const rowActionItems = [
  { key: "view", label: "查看详情", description: "在侧边抽屉里查看和编辑" },
  { key: "copy", label: "复制链接", description: "复制当前成员页面链接" },
  { key: "disable", label: "停用账号", disabled: true, description: "演示禁用项行为" },
  { key: "delete", label: "删除成员", danger: true }
];

const filteredRows = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase();

  return rows.value.filter((row) => {
    const matchedKeyword =
      !keyword ||
      row.name.toLowerCase().includes(keyword) ||
      row.owner.toLowerCase().includes(keyword);
    const matchedRole = !filters.role || row.role === filters.role;

    return matchedKeyword && matchedRole;
  });
});

const tableColumns = [
  { key: "name", title: "项目名称", dataIndex: "name" },
  { key: "owner", title: "负责人", dataIndex: "owner" },
  { key: "role", title: "角色", dataIndex: "role" },
  { key: "status", title: "状态", dataIndex: "status" },
  { key: "actions", title: "操作", slot: "actions", align: "right" as const, width: 180 }
];

function syncDrawerDraft(row: MemberRow) {
  drawerDraft.name = row.name;
  drawerDraft.role = row.role;
  drawerDraft.dueDate = row.updatedAt;
  drawerDraft.attachments = [];
}

function handleOpenCreate() {
  modalOpen.value = true;
  saveFeedback.value = "请填写成员信息";
}

function handleRowClick(row: MemberRow) {
  activeRow.value = row;
  syncDrawerDraft(row);
}

function openDrawerForRow(row: MemberRow, intent = "查看详情") {
  activeRow.value = row;
  syncDrawerDraft(row);
  drawerOpen.value = true;
  saveFeedback.value = `${intent}：${row.name}`;
}

function handleRowAction(action: { key: string; label: string }, row: MemberRow) {
  switch (action.key) {
    case "view":
      openDrawerForRow(row, "查看成员");
      break;
    case "copy":
      saveFeedback.value = `已模拟复制链接：${row.name}`;
      break;
    case "delete":
      saveFeedback.value = `已标记危险操作：${row.name}`;
      break;
    default:
      saveFeedback.value = `已触发操作：${action.label}`;
      break;
  }
}

function handleToolbarAction(item: ActionItem) {
  saveFeedback.value = `工具栏操作：${item.label}`;
}

function handleSaveDrawer() {
  if (!activeRow.value) {
    drawerOpen.value = false;
    return;
  }

  rows.value = rows.value.map((row) =>
    row.id === activeRow.value?.id
      ? {
          ...row,
          name: drawerDraft.name,
          role: drawerDraft.role || row.role,
          updatedAt: "2026-03-22"
        }
      : row
  );

  const updated = rows.value.find((row) => row.id === activeRow.value?.id);

  if (updated) {
    activeRow.value = updated;
    syncDrawerDraft(updated);
    saveFeedback.value = `已从侧边抽屉更新：${updated.name}`;
  }

  drawerOpen.value = false;
}

function rowClassName(row: MemberRow) {
  return activeRow.value?.id === row.id ? "playground-row-active" : "";
}

function resetFilters() {
  filters.keyword = "";
  filters.role = null;
  activeRow.value = null;
}

function handleSchedulerChange(payload: SchedulerEventChangePayload) {
  schedulerFeedback.value = `${payload.event.title} 已调整到 ${payload.event.start}`;
  schedulerEvents.value = schedulerEvents.value.map((item) =>
    item.id === payload.event.id ? payload.event : item
  );
}

function handleSchedulerDateClick(payload: SchedulerDateClickPayload) {
  schedulerFeedback.value = `点击日期：${payload.date}（${payload.view} 视图）`;
}

function handleSchedulerEventClick(payload: SchedulerEventClickPayload) {
  schedulerFeedback.value = `查看事件：${payload.event.title}`;
}

async function handleSave() {
  const valid = await formRef.value?.validate();

  if (!valid) {
    saveFeedback.value = "校验未通过，请检查必填项";
    return;
  }

  const nextRow: MemberRow = {
    id: Date.now(),
    name: memberForm.name,
    owner: "Xiaoye",
    role: memberForm.role ?? "member",
    status: "待启用",
    updatedAt: memberForm.startDate ?? "2026-03-22"
  };

  rows.value = [nextRow, ...rows.value];
  activeRow.value = nextRow;
  syncDrawerDraft(nextRow);
  saveFeedback.value = `已创建成员：${memberForm.name}`;
  modalOpen.value = false;
  formRef.value?.resetFields();
}
</script>

<template>
  <xy-config-provider>
    <SchedulerScene v-if="isSchedulerScene" />
    <main v-else class="page-shell">
      <section class="panel hero-panel">
        <div>
          <xy-tag status="primary">MVP Playground</xy-tag>
          <h1>把中后台高频交互收敛成一个稳定的 Vue 3 组件库基线</h1>
          <p>
            这里不只展示组件长什么样，还用真实页面把 `Tabs / Select / Table / Modal / Drawer /
            Dropdown / Popover / Tooltip` 串成回归样板。
          </p>
        </div>
        <xy-space wrap>
          <xy-tooltip content="打开弹窗后，焦点会自动进入弹窗；按 Escape 可关闭并返回触发按钮。">
            <xy-button type="primary" @click="handleOpenCreate">新建成员</xy-button>
          </xy-tooltip>
          <xy-dropdown
            :items="[
              { key: 'export', label: '导出当前视图' },
              { key: 'archive', label: '归档筛选条件', description: '演示说明型菜单项' },
              { key: 'danger', label: '危险操作', danger: true }
            ]"
            @select="handleToolbarAction"
          >
            <xy-button plain>更多操作</xy-button>
          </xy-dropdown>
        </xy-space>
      </section>

      <section class="panel">
        <div class="status-strip">
          <xy-tag status="success">当前页签：{{ activeTab }}</xy-tag>
          <xy-tag :status="activeRow ? 'primary' : 'neutral'">
            当前行：{{ activeRow ? activeRow.name : "未选择" }}
          </xy-tag>
          <xy-tag :status="drawerOpen ? 'warning' : 'neutral'">
            抽屉：{{ drawerOpen ? "打开中" : "未打开" }}
          </xy-tag>
          <xy-tag :status="saveFeedback.includes('已') ? 'success' : 'warning'">
            {{ saveFeedback }}
          </xy-tag>
        </div>

        <xy-tabs
          v-model="activeTab"
          :items="[
            { key: 'members', label: '成员' },
            { key: 'projects', label: '项目' },
            { key: 'settings', label: '设置' }
          ]"
        >
          <template #default>
            <div class="stack">
              <xy-space wrap>
                <xy-input v-model="filters.keyword" placeholder="搜索成员 / 项目" clearable />
                <xy-select
                  v-model="filters.role"
                  searchable
                  clearable
                  placeholder="角色筛选"
                  no-match-text="没有符合条件的角色"
                  :options="roleOptions"
                />
                <xy-popover title="筛选说明">
                  <template #trigger>
                    <xy-button plain>筛选说明</xy-button>
                  </template>
                  <div class="popover-stack">
                    <p>角色筛选会和关键字搜索一起生效。</p>
                    <p>Popover 适合承载多段说明，而不是只有一句提示。</p>
                    <xy-button text @click="resetFilters">顺手重置筛选</xy-button>
                  </div>
                </xy-popover>
                <xy-button plain @click="resetFilters">重置筛选</xy-button>
              </xy-space>

              <xy-table
                :columns="tableColumns"
                :data="filteredRows"
                row-key="id"
                :row-class-name="rowClassName"
                striped
                @row-click="handleRowClick"
              >
                <template #cell-actions="{ row }">
                  <xy-space align="center">
                    <xy-button text @click.stop="openDrawerForRow(row, '查看成员')">
                      查看
                    </xy-button>
                    <xy-dropdown
                      :items="rowActionItems"
                      @select="(item: ActionItem) => handleRowAction(item, row)"
                    >
                      <xy-button text>更多</xy-button>
                    </xy-dropdown>
                  </xy-space>
                </template>

                <template #empty>
                  <xy-empty title="没有匹配成员" description="换个关键字或重置筛选试试">
                    <xy-button plain @click="resetFilters">恢复默认数据</xy-button>
                  </xy-empty>
                </template>
              </xy-table>

              <xy-pagination :total="filteredRows.length * 10" />
            </div>
          </template>
        </xy-tabs>
      </section>

      <section class="panel">
        <div class="scheduler-header">
          <div class="stack">
            <xy-tag status="primary">Scheduler 联调</xy-tag>
            <p class="scheduler-caption">
              这里演示 `xy-scheduler` 的周视图、重复规则和拖拽改期。顶部导航和月 / 周 /
              日切换都走组件自己的公共 API。
            </p>
          </div>

          <div class="status-strip">
            <xy-tag status="success">视图：{{ schedulerView }}</xy-tag>
            <xy-tag status="warning">焦点日期：{{ schedulerDate }}</xy-tag>
            <xy-tag status="neutral">{{ schedulerFeedback }}</xy-tag>
          </div>
        </div>

        <xy-scheduler
          v-model="schedulerDate"
          v-model:view="schedulerView"
          editable
          :events="schedulerEvents"
          height="680px"
          @date-click="handleSchedulerDateClick"
          @event-click="handleSchedulerEventClick"
          @event-change="handleSchedulerChange"
        >
          <template #event-content="{ event, timeText }">
            <div class="scheduler-event-card">
              <strong>{{ event.title }}</strong>
              <span v-if="timeText">{{ timeText }}</span>
            </div>
          </template>
        </xy-scheduler>
      </section>

      <xy-modal v-model="modalOpen" title="新建成员">
        <xy-form ref="formRef" :model="memberForm" :rules="rules">
          <xy-form-item label="成员名称" prop="name" help="失焦时会触发名称校验">
            <xy-input v-model="memberForm.name" placeholder="请输入成员名称" />
          </xy-form-item>
          <xy-form-item label="角色" prop="role">
            <xy-select
              v-model="memberForm.role"
              searchable
              no-match-text="没有符合条件的角色"
              :options="roleOptions"
            />
          </xy-form-item>
          <xy-form-item label="开始日期" prop="startDate">
            <xy-date-picker
              v-model="memberForm.startDate"
              clearable
              min="2026-03-01"
              max="2026-12-31"
            ></xy-date-picker>
          </xy-form-item>
          <xy-form-item label="附件">
            <xy-upload
              v-model="memberForm.attachments"
              drag
              multiple
              :max-count="2"
              tip="支持拖拽上传，最多 2 个附件"
            ></xy-upload>
          </xy-form-item>
        </xy-form>

        <template #footer>
          <xy-space>
            <xy-button plain @click="modalOpen = false">取消</xy-button>
            <xy-button type="primary" @click="handleSave">保存</xy-button>
          </xy-space>
        </template>
      </xy-modal>

      <xy-drawer v-model="drawerOpen" title="侧边编辑成员">
        <div class="drawer-stack">
          <xy-tag :status="activeRow ? 'primary' : 'neutral'">
            当前编辑：{{ activeRow ? activeRow.name : "未选择成员" }}
          </xy-tag>
          <xy-input v-model="drawerDraft.name" placeholder="成员名称" />
          <xy-select
            v-model="drawerDraft.role"
            searchable
            clearable
            no-match-text="没有符合条件的角色"
            :options="roleOptions"
            placeholder="角色"
          />
          <xy-date-picker
            v-model="drawerDraft.dueDate"
            clearable
            min="2026-03-01"
            max="2026-12-31"
          ></xy-date-picker>
          <xy-upload
            v-model="drawerDraft.attachments"
            :max-count="3"
            drag
            tip="侧边编辑里也可以补充附件"
          ></xy-upload>
          <xy-popover title="为什么这里用 Drawer">
            <template #trigger>
              <xy-button plain>查看编辑说明</xy-button>
            </template>
            <div class="popover-stack">
              <p>Drawer 更适合保留列表上下文，同时承载更长的编辑表单。</p>
              <p>它和 Modal 共用同一套焦点与 Escape 关闭基线。</p>
            </div>
          </xy-popover>
        </div>
        <template #footer>
          <xy-space>
            <xy-button plain @click="drawerOpen = false">取消</xy-button>
            <xy-button type="primary" @click="handleSaveDrawer">保存抽屉修改</xy-button>
          </xy-space>
        </template>
      </xy-drawer>
    </main>
  </xy-config-provider>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fafc, #eef2ff);
}

.panel {
  max-width: 1080px;
  margin: 0 auto 24px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 28px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.hero-panel h1 {
  margin: 16px 0 8px;
  font-size: 36px;
  line-height: 1.1;
}

.hero-panel p {
  margin: 0;
  color: #64748b;
}

.status-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.stack,
.drawer-stack,
.popover-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scheduler-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.scheduler-caption {
  margin: 0;
  color: #64748b;
}

.scheduler-event-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.scheduler-event-card span {
  opacity: 0.86;
  font-size: 12px;
}

.popover-stack p {
  margin: 0;
  color: #64748b;
}

:deep(.playground-row-active td) {
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}

@media (max-width: 900px) {
  .page-shell {
    padding: 16px;
  }

  .hero-panel {
    flex-direction: column;
    align-items: flex-start;
  }

  .scheduler-header {
    flex-direction: column;
  }
}
</style>
