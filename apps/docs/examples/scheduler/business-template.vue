<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type {
  SchedulerDateSelectPayload,
  SchedulerEvent,
  SchedulerEventChangePayload,
  SchedulerEventClickPayload
} from "xiaoye-components";

type RepeatRule = {
  freq: "weekly";
  byweekday: string[];
  dtstart: string;
};

interface ScheduleApiRow {
  id: string;
  subject: string;
  startAt: string;
  endAt?: string;
  isAllDay: boolean;
  owner: string;
  category: "meeting" | "delivery" | "support";
  repeat?: RepeatRule;
}

const rows = ref<ScheduleApiRow[]>([
  {
    id: "api-kickoff",
    subject: "项目 Kickoff",
    startAt: "2026-03-24T10:00:00",
    endAt: "2026-03-24T11:00:00",
    isAllDay: false,
    owner: "Xiaoye",
    category: "meeting"
  },
  {
    id: "api-handover",
    subject: "交付排期",
    startAt: "2026-03-25",
    endAt: "2026-03-27",
    isAllDay: true,
    owner: "Alice",
    category: "delivery"
  },
  {
    id: "api-standup",
    subject: "工作日站会",
    startAt: "2026-03-23T09:30:00",
    isAllDay: false,
    owner: "Team A",
    category: "meeting",
    repeat: {
      freq: "weekly",
      byweekday: ["mo", "tu", "we", "th", "fr"],
      dtstart: "2026-03-23T09:30:00"
    }
  }
]);

const focusDate = ref("2026-03-24");
const latestAction = ref("这里会显示最近一次映射、创建或改期操作。");
const lastPersistPayload = ref("{}");
const editorOpen = ref(false);
const editorDraft = reactive({
  id: "",
  subject: "",
  owner: "",
  category: "meeting" as ScheduleApiRow["category"],
  isAllDay: false,
  startAt: "",
  endAt: ""
});

const schedulerEvents = computed<SchedulerEvent[]>(() =>
  rows.value.map((row) => {
    const event: SchedulerEvent = {
      id: row.id,
      title: row.subject,
      start: row.startAt,
      end: row.endAt,
      allDay: row.isAllDay,
      editable: !row.repeat,
      extendedProps: {
        owner: row.owner,
        category: row.category
      }
    };

    if (row.repeat) {
      event.rrule = row.repeat;
      event.duration = "00:30";
    }

    return event;
  })
);

const rowPreview = computed(() => JSON.stringify(rows.value, null, 2));
const eventPreview = computed(() => JSON.stringify(schedulerEvents.value, null, 2));
const canSaveDraft = computed(() => Boolean(editorDraft.subject.trim() && editorDraft.startAt));

function formatDateOnly(value: string) {
  return value.slice(0, 10);
}

function formatDateTimeLocal(value?: string) {
  return value ? value.slice(0, 16) : "";
}

function normalizeDraftDateTime(value: string, allDay: boolean) {
  if (!value) {
    return "";
  }

  if (allDay) {
    return formatDateOnly(value);
  }

  return value.length === 16 ? `${value}:00` : value;
}

function openEditor(payload?: Partial<ScheduleApiRow>) {
  editorDraft.id = payload?.id ?? "";
  editorDraft.subject = payload?.subject ?? "";
  editorDraft.owner = payload?.owner ?? "当前值班人";
  editorDraft.category = payload?.category ?? "meeting";
  editorDraft.isAllDay = payload?.isAllDay ?? false;
  editorDraft.startAt = editorDraft.isAllDay
    ? formatDateOnly(payload?.startAt ?? "")
    : formatDateTimeLocal(payload?.startAt);
  editorDraft.endAt = editorDraft.isAllDay
    ? formatDateOnly(payload?.endAt ?? "")
    : formatDateTimeLocal(payload?.endAt);
  editorOpen.value = true;
}

function handleDateSelect(payload: SchedulerDateSelectPayload) {
  openEditor({
    isAllDay: payload.allDay,
    startAt: payload.allDay ? formatDateOnly(payload.start) : payload.start,
    endAt: payload.allDay ? formatDateOnly(payload.end) : payload.end
  });
  latestAction.value = `已根据 date-select 打开编辑面板：${payload.start} -> ${payload.end}`;
}

function handleEventClick(payload: SchedulerEventClickPayload) {
  const sourceId = payload.event.sourceId ?? payload.event.id;
  const matched = rows.value.find((row) => row.id === sourceId);

  if (!matched) {
    return;
  }

  openEditor(matched);
  latestAction.value = `已读取源数据并打开编辑面板：${matched.subject}`;
}

function syncPayloadPreview() {
  lastPersistPayload.value = JSON.stringify(
    {
      id: editorDraft.id || "new-row",
      subject: editorDraft.subject.trim(),
      startAt: editorDraft.startAt,
      endAt: editorDraft.endAt || undefined,
      isAllDay: editorDraft.isAllDay,
      owner: editorDraft.owner,
      category: editorDraft.category
    },
    null,
    2
  );
}

function saveDraft() {
  if (!canSaveDraft.value) {
    return;
  }

  const nextRow: ScheduleApiRow = {
    id: editorDraft.id || `api-${Date.now()}`,
    subject: editorDraft.subject.trim(),
    startAt: normalizeDraftDateTime(editorDraft.startAt, editorDraft.isAllDay),
    endAt: editorDraft.endAt
      ? normalizeDraftDateTime(editorDraft.endAt, editorDraft.isAllDay)
      : undefined,
    isAllDay: editorDraft.isAllDay,
    owner: editorDraft.owner,
    category: editorDraft.category
  };

  if (editorDraft.id) {
    rows.value = rows.value.map((row) => (row.id === editorDraft.id ? nextRow : row));
    latestAction.value = `已按业务模型更新：${nextRow.subject}`;
  } else {
    rows.value = [...rows.value, nextRow];
    latestAction.value = `已按业务模型创建：${nextRow.subject}`;
  }

  syncPayloadPreview();
  editorOpen.value = false;
}

function handleEventChange(payload: SchedulerEventChangePayload) {
  const sourceId = payload.event.sourceId ?? payload.event.id;

  rows.value = rows.value.map((row) =>
    row.id === sourceId
      ? {
          ...row,
          startAt: String(payload.event.start),
          endAt: payload.event.end ? String(payload.event.end) : undefined,
          isAllDay: Boolean(payload.event.allDay)
        }
      : row
  );

  lastPersistPayload.value = JSON.stringify(payload.event, null, 2);
  latestAction.value = `已根据 event-change 回写源数据：${payload.event.title}`;
}
</script>

<template>
  <div class="scheduler-template">
    <div class="scheduler-template__panel">
      <xy-tag status="primary">接口数据</xy-tag>
      <p class="scheduler-template__panel-description">
        左侧保留业务原始行数据，右侧 `xy-scheduler` 只消费映射后的 `events`。
      </p>
      <pre class="scheduler-template__panel-preview">{{ rowPreview }}</pre>
    </div>

    <div class="scheduler-template__calendar">
      <xy-scheduler
        v-model="focusDate"
        :events="schedulerEvents"
        selectable
        editable
        @date-select="handleDateSelect"
        @event-click="handleEventClick"
        @event-change="handleEventChange"
      />
    </div>

    <div class="scheduler-template__panel">
      <xy-tag status="success">映射后 events</xy-tag>
      <p class="scheduler-template__panel-description">
        这里展示传给 `xy-scheduler` 的事件数组，以及最近一次准备提交的 payload。
      </p>
      <pre class="scheduler-template__panel-preview">{{ eventPreview }}</pre>
      <xy-tag status="warning">{{ latestAction }}</xy-tag>
      <pre class="scheduler-template__panel-preview">{{ lastPersistPayload }}</pre>
    </div>

    <xy-drawer v-model="editorOpen" title="业务编辑面板" placement="right" :size="420">
      <div class="scheduler-template__drawer">
        <xy-input v-model="editorDraft.subject" placeholder="事件标题 / 业务主题" />
        <xy-input v-model="editorDraft.owner" placeholder="负责人 / 值班人" />
        <xy-select
          v-model="editorDraft.category"
          :options="[
            { label: '会议', value: 'meeting' },
            { label: '交付', value: 'delivery' },
            { label: '支持', value: 'support' }
          ]"
          placeholder="事件分类"
        />
        <div class="scheduler-template__switch-row">
          <strong class="scheduler-template__switch-title">全天事件</strong>
          <xy-switch v-model="editorDraft.isAllDay" />
        </div>
        <label class="scheduler-template__field">
          <span>开始时间</span>
          <input
            class="scheduler-template__field-input"
            v-model="editorDraft.startAt"
            :type="editorDraft.isAllDay ? 'date' : 'datetime-local'"
          />
        </label>
        <label class="scheduler-template__field">
          <span>结束时间</span>
          <input
            class="scheduler-template__field-input"
            v-model="editorDraft.endAt"
            :type="editorDraft.isAllDay ? 'date' : 'datetime-local'"
          />
        </label>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="editorOpen = false">取消</xy-button>
          <xy-button type="primary" :disabled="!canSaveDraft" @click="saveDraft">
            保存到业务模型
          </xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>

<style scoped>
.scheduler-template {
  display: grid;
  gap: 16px;
}

.scheduler-template__panel,
.scheduler-template__calendar {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-xs);
}

.scheduler-template__panel-description {
  margin: 8px 0 12px;
  color: var(--xy-text-color-secondary);
}

.scheduler-template__panel-preview {
  overflow: auto;
  margin: 12px 0 0;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
  color: var(--xy-text-color);
  font-size: 12px;
  line-height: 1.5;
}

.scheduler-template__drawer {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.scheduler-template__switch-row,
.scheduler-template__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.scheduler-template__field span,
.scheduler-template__switch-title {
  color: var(--xy-text-color-heading);
  font-weight: 600;
}

.scheduler-template__field-input {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-surface-raised);
  color: var(--xy-text-color);
}
</style>
