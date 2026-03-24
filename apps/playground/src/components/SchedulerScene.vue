<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import type {
  SchedulerDateClickPayload,
  SchedulerDateSelectPayload,
  SchedulerDropPayload,
  SchedulerEvent,
  SchedulerEventChangePayload,
  SchedulerEventClickPayload,
  SchedulerEventReceivePayload,
  SchedulerView
} from "xiaoye-components";
import { mapSchedulerEvents } from "../../../../packages/components/scheduler/src/scheduler";
import { Draggable } from "@fullcalendar/interaction";

const initialFocusDate = "2026-03-24";
const initialView: SchedulerView = "month";
const initialSelection = "还没有框选日期区间";
const initialLatestAction = "点击日期、事件或拖拽后，这里会显示最新动作";

const focusDate = ref(initialFocusDate);
const view = ref<SchedulerView>(initialView);
const selection = ref(initialSelection);
const latestAction = ref(initialLatestAction);
const selectedEventId = ref<string | null>(null);
const selectedOccurrenceStart = ref<string | null>(null);
const creatorOpen = ref(false);
const pendingSelection = ref<SchedulerDateSelectPayload | null>(null);
const removeTemplateAfterDrop = ref(true);
const creatorDraft = reactive({
  title: "",
  allDay: true,
  startDate: "",
  endDate: "",
  startTime: "09:00",
  endTime: "10:00",
  eventId: "",
  mode: "create" as "create" | "edit"
});
const externalPoolRef = ref<HTMLElement | null>(null);
let externalDraggable: Draggable | null = null;

const initialExternalTemplates = [
  {
    id: "template-standup",
    title: "外部待办：站会",
    duration: "00:30",
    allDay: false
  },
  {
    id: "template-review",
    title: "外部待办：评审",
    duration: "01:00",
    allDay: false
  },
  {
    id: "template-all-day",
    title: "外部待办：全天安排",
    duration: "",
    allDay: true
  }
];
const externalTemplates = ref(initialExternalTemplates.map((item) => ({ ...item })));

const initialEvents: SchedulerEvent[] = [
  {
    id: "all-day",
    title: "全天事项",
    start: "2026-03-01",
    allDay: true
  },
  {
    id: "long-event",
    title: "跨天项目排期",
    start: "2026-03-10",
    end: "2026-03-13",
    allDay: true
  },
  {
    id: "external",
    title: "外部跳转事项",
    start: "2026-03-14",
    allDay: true
  },
  {
    id: "conference",
    title: "大会日程",
    start: "2026-03-18",
    end: "2026-03-20",
    allDay: true
  },
  {
    id: "meeting-1",
    title: "10:30 会议",
    start: "2026-03-24T10:30:00",
    end: "2026-03-24T11:30:00",
    editable: true
  },
  {
    id: "lunch",
    title: "12:00 午餐",
    start: "2026-03-24T12:00:00",
    end: "2026-03-24T13:00:00",
    editable: true
  },
  {
    id: "meeting-2",
    title: "14:30 复盘",
    start: "2026-03-24T14:30:00",
    end: "2026-03-24T15:30:00",
    editable: true
  },
  {
    id: "happy-hour",
    title: "17:30 团建",
    start: "2026-03-24T17:30:00",
    end: "2026-03-24T18:30:00",
    editable: true
  },
  {
    id: "birthday",
    title: "07:00 生日会",
    start: "2026-03-25T07:00:00",
    end: "2026-03-25T08:00:00"
  }
];

function cloneSchedulerEvents(source: SchedulerEvent[]) {
  return source.map((event) => ({
    ...event,
    className: Array.isArray(event.className) ? [...event.className] : event.className,
    extendedProps: event.extendedProps ? { ...event.extendedProps } : undefined
  }));
}

function cloneExternalTemplatePool() {
  return initialExternalTemplates.map((item) => ({ ...item }));
}

const events = ref<SchedulerEvent[]>(cloneSchedulerEvents(initialEvents));

const totalEvents = computed(() => events.value.length);
const visibleEvents = computed(() =>
  mapSchedulerEvents(events.value, {
    anchorDate: focusDate.value,
    view: view.value,
    weekStart: 1,
    rootEditable: true
  }).map((event) => {
    const extendedProps = (event.extendedProps ?? {}) as Record<string, unknown>;

    return {
      id: String(event.id),
      sourceId:
        typeof extendedProps.schedulerSourceId === "string"
          ? extendedProps.schedulerSourceId
          : String(event.id),
      occurrenceStart:
        typeof extendedProps.schedulerOccurrenceStart === "string"
          ? extendedProps.schedulerOccurrenceStart
          : String(event.start ?? ""),
      title: String(event.title ?? ""),
      start: String(event.start ?? ""),
      end: event.end ? String(event.end) : "",
      allDay: Boolean(event.allDay)
    };
  })
);
const selectedVisibleEvent = computed(() => {
  if (!selectedEventId.value) {
    return null;
  }

  if (selectedOccurrenceStart.value) {
    const matchedOccurrence = visibleEvents.value.find(
      (event) =>
        event.sourceId === selectedEventId.value &&
        event.occurrenceStart === selectedOccurrenceStart.value
    );

    if (matchedOccurrence) {
      return matchedOccurrence;
    }
  }

  return visibleEvents.value.find((event) => event.sourceId === selectedEventId.value) ?? null;
});
const viewOptions: SchedulerView[] = ["month", "week", "day"];
const creatorErrors = computed(() => {
  const errors: string[] = [];

  if (!creatorDraft.title.trim()) {
    errors.push("请输入事件标题。");
  }

  if (!creatorDraft.startDate) {
    errors.push("请选择开始日期。");
  }

  if (!creatorDraft.endDate) {
    errors.push("请选择结束日期。");
  }

  if (!creatorDraft.startDate || !creatorDraft.endDate) {
    return errors;
  }

  const startDate = new Date(creatorDraft.startDate);
  const endDate = new Date(creatorDraft.endDate);

  if (endDate.getTime() < startDate.getTime()) {
    errors.push("结束日期不能早于开始日期。");
  }

  if (!creatorDraft.allDay) {
    const startValue = `${creatorDraft.startDate}T${creatorDraft.startTime}:00`;
    const endValue = `${creatorDraft.endDate}T${creatorDraft.endTime}:00`;
    const start = new Date(startValue);
    const end = new Date(endValue);

    if (end.getTime() <= start.getTime()) {
      errors.push("结束时间必须晚于开始时间。");
    }
  }

  return errors;
});
const canSaveCreator = computed(() => creatorErrors.value.length === 0);
const creatorSummaryText = computed(() => {
  if (creatorDraft.mode === "create" && pendingSelection.value) {
    return formatSelectionSummary(pendingSelection.value);
  }

  if (!creatorDraft.startDate) {
    return "还没有框选日期区间";
  }

  const start = creatorDraft.allDay
    ? creatorDraft.startDate
    : `${creatorDraft.startDate}T${creatorDraft.startTime}:00`;
  const endDate = creatorDraft.endDate || creatorDraft.startDate;
  const end = creatorDraft.allDay ? endDate : `${endDate}T${creatorDraft.endTime}:00`;

  return `${start} -> ${end}（${view.value} 视图）`;
});
const creatorTypeLabel = computed(() => (creatorDraft.allDay ? "全天事件" : "定时事件"));

function normalizeDateLabel(value: SchedulerEvent["start"]) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function formatSelectionSummary(selection: SchedulerDateSelectPayload | null) {
  if (!selection) {
    return "还没有框选日期区间";
  }

  return `${selection.start} -> ${selection.end}（${selection.view} 视图）`;
}

function setDemoDate(date: string, nextView?: SchedulerView) {
  focusDate.value = date;

  if (nextView) {
    view.value = nextView;
  }
}

function focusEvent(event: {
  id: string;
  sourceId: string;
  occurrenceStart: string;
  start: string;
  end?: string;
  title: string;
  allDay: boolean;
}) {
  selectedEventId.value = event.sourceId;
  selectedOccurrenceStart.value = event.occurrenceStart;
  focusDate.value = normalizeDateLabel(event.start);
  view.value = event.allDay ? "month" : "day";
  latestAction.value = `定位事件：${event.title}`;
}

function createEventId() {
  return `scene-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resetCreator() {
  creatorDraft.title = "";
  creatorDraft.allDay = true;
  creatorDraft.startDate = "";
  creatorDraft.endDate = "";
  creatorDraft.startTime = "09:00";
  creatorDraft.endTime = "10:00";
  creatorDraft.eventId = "";
  creatorDraft.mode = "create";
  creatorOpen.value = false;
  pendingSelection.value = null;
}

function resetScene() {
  resetCreator();
  focusDate.value = initialFocusDate;
  view.value = initialView;
  selection.value = initialSelection;
  latestAction.value = "已恢复演示场景。";
  selectedEventId.value = null;
  selectedOccurrenceStart.value = null;
  removeTemplateAfterDrop.value = true;
  externalTemplates.value = cloneExternalTemplatePool();
  events.value = cloneSchedulerEvents(initialEvents);
}

function toEventStartValue() {
  if (creatorDraft.allDay) {
    return creatorDraft.startDate;
  }

  return `${creatorDraft.startDate}T${creatorDraft.startTime}:00`;
}

function toEventEndValue() {
  if (creatorDraft.allDay) {
    return creatorDraft.endDate && creatorDraft.endDate !== creatorDraft.startDate
      ? creatorDraft.endDate
      : undefined;
  }

  return `${creatorDraft.endDate}T${creatorDraft.endTime}:00`;
}

function openCreator(
  mode: "create" | "edit",
  payload: {
    title?: string;
    allDay: boolean;
    start: string;
    end?: string;
    eventId?: string;
  }
) {
  creatorDraft.mode = mode;
  creatorDraft.title = payload.title ?? (payload.allDay ? "新建全天排期" : "新建时间排期");
  creatorDraft.allDay = payload.allDay;
  creatorDraft.eventId = payload.eventId ?? "";

  const [startDate, startTime = "09:00"] = payload.start.split("T");
  const [endDate, endTime = payload.allDay ? "00:00" : "10:00"] = (
    payload.end ?? payload.start
  ).split("T");

  creatorDraft.startDate = startDate;
  creatorDraft.endDate = endDate;
  creatorDraft.startTime = startTime.slice(0, 5);
  creatorDraft.endTime = endTime.slice(0, 5);
  creatorOpen.value = true;
}

function handleDateClick(payload: SchedulerDateClickPayload) {
  latestAction.value = `点击日期：${payload.date}（${payload.view} 视图）`;
}

function handleDateSelect(payload: SchedulerDateSelectPayload) {
  pendingSelection.value = payload;
  selection.value = formatSelectionSummary(payload);
  selectedEventId.value = null;
  selectedOccurrenceStart.value = null;
  latestAction.value = "已框选日期区间，请在右侧面板里完善标题后保存。";
  openCreator("create", {
    allDay: payload.allDay,
    start: payload.start,
    end: payload.end
  });
}

function handleEventClick(payload: SchedulerEventClickPayload) {
  selectedEventId.value = payload.event.sourceId ?? payload.event.id;
  selectedOccurrenceStart.value = String(payload.event.occurrenceStart ?? payload.event.start);
  latestAction.value = `点击事件：${payload.event.title}`;
  openCreator("edit", {
    title: payload.event.title,
    allDay: Boolean(payload.event.allDay),
    start: String(payload.event.occurrenceStart ?? payload.event.start),
    end: payload.event.end ? String(payload.event.end) : undefined,
    eventId: payload.event.sourceId ?? payload.event.id
  });
}

function handleEventChange(payload: SchedulerEventChangePayload) {
  events.value = events.value.map((event) =>
    event.id === payload.event.id ? payload.event : event
  );
  selectedEventId.value = payload.event.sourceId ?? payload.event.id;
  selectedOccurrenceStart.value = String(payload.event.occurrenceStart ?? payload.event.start);
  latestAction.value = `拖拽更新：${payload.event.title} -> ${payload.event.start}`;
}

function saveCreatedEvent() {
  if (
    !creatorDraft.title.trim() ||
    !creatorDraft.startDate ||
    !creatorDraft.endDate ||
    creatorErrors.value.length
  ) {
    return;
  }

  const title = creatorDraft.title.trim();
  const nextEvent: SchedulerEvent = {
    id:
      creatorDraft.mode === "edit" && creatorDraft.eventId ? creatorDraft.eventId : createEventId(),
    title,
    start: toEventStartValue(),
    end: toEventEndValue(),
    allDay: creatorDraft.allDay,
    editable: true
  };

  if (creatorDraft.mode === "edit" && creatorDraft.eventId) {
    events.value = events.value.map((event) =>
      event.id === creatorDraft.eventId ? { ...event, ...nextEvent } : event
    );
    latestAction.value = `已更新事件：${title}`;
  } else {
    events.value = [...events.value, nextEvent];
    latestAction.value = `已创建事件：${title}`;
  }

  selectedEventId.value = nextEvent.id;
  selectedOccurrenceStart.value = String(nextEvent.start);
  focusDate.value = normalizeDateLabel(nextEvent.start);
  resetCreator();
}

function deleteCurrentEvent() {
  if (!creatorDraft.eventId) {
    return;
  }

  events.value = events.value.filter((event) => event.id !== creatorDraft.eventId);
  latestAction.value = `已删除事件：${creatorDraft.title || creatorDraft.eventId}`;
  selectedEventId.value = null;
  selectedOccurrenceStart.value = null;
  resetCreator();
}

function handleDrop(payload: SchedulerDropPayload) {
  latestAction.value = `外部事件已落到 ${payload.date}`;
}

function handleEventReceive(payload: SchedulerEventReceivePayload) {
  const normalized = payload.event;
  const duplicated = events.value.some((event) => event.id === normalized.id);

  if (!duplicated) {
    events.value = [...events.value, { ...normalized, editable: true }];
  }

  const templateId =
    typeof normalized.extendedProps?.externalTemplateId === "string"
      ? normalized.extendedProps.externalTemplateId
      : null;

  if (removeTemplateAfterDrop.value && templateId) {
    externalTemplates.value = externalTemplates.value.filter((item) => item.id !== templateId);
  }

  selectedEventId.value = normalized.sourceId ?? normalized.id;
  selectedOccurrenceStart.value = String(normalized.occurrenceStart ?? normalized.start);
  latestAction.value = `已接收外部事件：${normalized.title}`;
}

function resetExternalTemplates() {
  externalTemplates.value = initialExternalTemplates.map((item) => ({ ...item }));
  latestAction.value = "已重置外部事件池。";
}

onMounted(() => {
  if (!externalPoolRef.value) {
    return;
  }

  externalDraggable = new Draggable(externalPoolRef.value, {
    itemSelector: ".scheduler-scene__template",
    eventData: (element) => ({
      title: element.getAttribute("data-title") ?? "",
      duration: element.getAttribute("data-duration") || undefined,
      allDay: element.getAttribute("data-all-day") === "true",
      extendedProps: {
        externalTemplateId: element.getAttribute("data-template-id") ?? ""
      },
      create: true
    })
  });
});

onBeforeUnmount(() => {
  externalDraggable?.destroy();
  externalDraggable = null;
});
</script>

<template>
  <main class="scheduler-scene">
    <aside class="scheduler-scene__sidebar">
      <xy-tag status="primary">Scheduler Lab</xy-tag>
      <h1>独立交互页</h1>
      <p>
        这页单独承载 `xy-scheduler`，不经过文档内联 demo
        容器。适合看完整月视图、切换视图、框选日期和拖拽事件。
      </p>

      <div class="scheduler-scene__tips">
        <h3>推荐操作</h3>
        <ul>
          <li>先在月视图看完整日历网格和事件密度。</li>
          <li>切到周 / 日视图查看时间栅格。</li>
          <li>在空白日期区拖出一段选区，打开右侧新建事件面板。</li>
          <li>拖拽 3 月 24 日的定时事件，观察 `event-change`。</li>
          <li>把左侧外部事件卡片拖进日历，观察 `event-receive`。</li>
        </ul>
      </div>

      <div class="scheduler-scene__tips">
        <h3>外部事件池</h3>
        <div class="scheduler-scene__template-controls">
          <xy-space wrap>
            <span>拖入后移除模板</span>
            <xy-switch v-model="removeTemplateAfterDrop" />
            <xy-button plain @click="resetExternalTemplates">重置模板</xy-button>
          </xy-space>
        </div>
        <div ref="externalPoolRef" class="scheduler-scene__template-list">
          <button
            v-for="item in externalTemplates"
            :key="item.id"
            type="button"
            class="scheduler-scene__template"
            :data-template-id="item.id"
            :data-title="item.title"
            :data-duration="item.duration"
            :data-all-day="item.allDay ? 'true' : 'false'"
          >
            <strong>{{ item.title }}</strong>
            <span>{{ item.allDay ? "拖入后生成为全天事件" : `默认时长 ${item.duration}` }}</span>
          </button>
        </div>
      </div>

      <div class="scheduler-scene__tips">
        <h3>快捷操作</h3>
        <xy-space wrap>
          <xy-button
            v-for="option in viewOptions"
            :key="option"
            :type="view === option ? 'primary' : 'default'"
            @click="view = option"
          >
            {{ option }}
          </xy-button>
          <xy-button plain @click="setDemoDate('2026-03-24', 'month')">回到演示月</xy-button>
          <xy-button plain @click="setDemoDate('2026-03-24', 'week')">查看演示周</xy-button>
          <xy-button plain @click="setDemoDate('2026-03-24', 'day')">查看演示日</xy-button>
          <xy-button plain @click="resetScene">恢复初始状态</xy-button>
        </xy-space>
      </div>

      <div class="scheduler-scene__stats">
        <div>
          <strong>{{ view }}</strong>
          <span>当前视图</span>
        </div>
        <div>
          <strong>{{ focusDate }}</strong>
          <span>焦点日期</span>
        </div>
        <div>
          <strong>{{ totalEvents }}</strong>
          <span>源事件数量</span>
        </div>
        <div>
          <strong>{{ visibleEvents.length }}</strong>
          <span>当前视图可见事件</span>
        </div>
      </div>

      <div class="scheduler-scene__tips">
        <h3>当前视图可见事件</h3>
        <ul class="scheduler-scene__event-list">
          <li v-for="event in visibleEvents" :key="event.id">
            <button
              type="button"
              class="scheduler-scene__event-button"
              :class="selectedEventId === event.sourceId ? 'is-active' : ''"
              @click="focusEvent(event)"
            >
              <b>{{ event.start }}</b>
              <span>{{ event.title }}</span>
              <small>{{ event.allDay ? "全天事件" : "定时事件" }}</small>
            </button>
          </li>
        </ul>
      </div>

      <div class="scheduler-scene__tips">
        <h3>当前选中事件</h3>
        <div v-if="selectedVisibleEvent" class="scheduler-scene__detail">
          <div class="scheduler-scene__detail-row">
            <strong>标题</strong>
            <span>{{ selectedVisibleEvent.title }}</span>
          </div>
          <div class="scheduler-scene__detail-row">
            <strong>实例 id</strong>
            <span>{{ selectedVisibleEvent.id }}</span>
          </div>
          <div class="scheduler-scene__detail-row">
            <strong>源事件 id</strong>
            <span>{{ selectedVisibleEvent.sourceId }}</span>
          </div>
          <div class="scheduler-scene__detail-row">
            <strong>开始时间</strong>
            <span>{{ selectedVisibleEvent.start }}</span>
          </div>
          <div class="scheduler-scene__detail-row">
            <strong>结束时间</strong>
            <span>{{ selectedVisibleEvent.end || "—" }}</span>
          </div>
          <div class="scheduler-scene__detail-row">
            <strong>occurrenceStart</strong>
            <span>{{ selectedVisibleEvent.occurrenceStart }}</span>
          </div>
          <div class="scheduler-scene__detail-row">
            <strong>事件类型</strong>
            <span>{{ selectedVisibleEvent.allDay ? "全天事件" : "定时事件" }}</span>
          </div>
        </div>
        <p v-else class="scheduler-scene__detail-empty">
          点击日历中的事件块，或点击左侧事件列表项后，这里会显示当前实例信息。
        </p>
      </div>

      <xy-tag status="success">{{ selection }}</xy-tag>
      <xy-tag status="warning">{{ latestAction }}</xy-tag>
    </aside>

    <section class="scheduler-scene__main">
      <xy-scheduler
        v-model="focusDate"
        v-model:view="view"
        :events="events"
        editable
        droppable
        selectable
        height="auto"
        @date-click="handleDateClick"
        @date-select="handleDateSelect"
        @drop="handleDrop"
        @event-click="handleEventClick"
        @event-change="handleEventChange"
        @event-receive="handleEventReceive"
      />
    </section>

    <xy-drawer
      v-model="creatorOpen"
      :title="creatorDraft.mode === 'edit' ? '编辑事件' : '新建事件'"
      placement="right"
      :size="420"
    >
      <div class="scheduler-scene__drawer">
        <xy-tag status="primary">轻量创建链路</xy-tag>
        <p class="scheduler-scene__drawer-lead">
          用组件库自己的抽屉和输入组件承接 `date-select`，替换系统
          `prompt`，并支持继续编辑和删除事件。
        </p>

        <div class="scheduler-scene__drawer-summary">
          <strong>选中区间</strong>
          <span>{{ creatorSummaryText }}</span>
        </div>

        <xy-input v-model="creatorDraft.title" placeholder="请输入事件标题" />

        <div class="scheduler-scene__drawer-summary">
          <strong>全天事件</strong>
          <xy-switch v-model="creatorDraft.allDay" />
        </div>

        <div class="scheduler-scene__drawer-grid">
          <label>
            <span>开始日期</span>
            <input v-model="creatorDraft.startDate" type="date" />
          </label>
          <label>
            <span>结束日期</span>
            <input v-model="creatorDraft.endDate" type="date" />
          </label>
          <label v-if="!creatorDraft.allDay">
            <span>开始时间</span>
            <input v-model="creatorDraft.startTime" type="time" />
          </label>
          <label v-if="!creatorDraft.allDay">
            <span>结束时间</span>
            <input v-model="creatorDraft.endTime" type="time" />
          </label>
        </div>

        <div class="scheduler-scene__drawer-summary">
          <strong>事件类型</strong>
          <span>{{ creatorTypeLabel }}</span>
        </div>

        <div v-if="creatorErrors.length" class="scheduler-scene__drawer-errors">
          <strong>保存前请先处理这些问题：</strong>
          <ul>
            <li v-for="error in creatorErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <xy-space>
          <xy-button
            v-if="creatorDraft.mode === 'edit'"
            plain
            type="danger"
            @click="deleteCurrentEvent"
          >
            删除事件
          </xy-button>
          <xy-button plain @click="resetCreator">取消</xy-button>
          <xy-button type="primary" :disabled="!canSaveCreator" @click="saveCreatedEvent">
            {{ creatorDraft.mode === "edit" ? "保存修改" : "保存事件" }}
          </xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </main>
</template>

<style scoped>
.scheduler-scene {
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 24px;
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 30%),
    linear-gradient(180deg, #f8fafc, #eef2ff);
}

.scheduler-scene__sidebar,
.scheduler-scene__main {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
}

.scheduler-scene__sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
}

.scheduler-scene__sidebar h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
}

.scheduler-scene__sidebar p,
.scheduler-scene__tips li,
.scheduler-scene__stats span {
  color: #64748b;
}

.scheduler-scene__tips h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.scheduler-scene__tips ul {
  margin: 0;
  padding-left: 18px;
}

.scheduler-scene__template-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scheduler-scene__template-controls {
  margin-bottom: 10px;
}

.scheduler-scene__template {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  background: linear-gradient(180deg, #eff6ff, #dbeafe);
  text-align: left;
  cursor: grab;
}

.scheduler-scene__template:active {
  cursor: grabbing;
}

.scheduler-scene__template strong {
  color: #1e3a8a;
}

.scheduler-scene__template span {
  color: #475569;
}

.scheduler-scene__tips li + li {
  margin-top: 8px;
}

.scheduler-scene__event-list {
  padding-left: 18px;
}

.scheduler-scene__event-list li {
  list-style: none;
  padding: 0;
}

.scheduler-scene__event-button {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  text-align: left;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s ease;
}

.scheduler-scene__event-button:hover {
  border-color: rgba(37, 99, 235, 0.24);
  background: #eff6ff;
  transform: translateY(-1px);
}

.scheduler-scene__event-button.is-active {
  border-color: #2563eb;
  background: #dbeafe;
}

.scheduler-scene__event-list b {
  color: #1e293b;
  font-weight: 700;
}

.scheduler-scene__event-list span {
  color: #334155;
}

.scheduler-scene__event-list small {
  color: #64748b;
}

.scheduler-scene__detail {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.92);
}

.scheduler-scene__detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scheduler-scene__detail-row strong {
  color: #1e293b;
  font-size: 13px;
}

.scheduler-scene__detail-row span,
.scheduler-scene__detail-empty {
  color: #64748b;
}

.scheduler-scene__detail-empty {
  margin: 0;
}

.scheduler-scene__stats {
  display: grid;
  gap: 12px;
}

.scheduler-scene__stats > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.9);
}

.scheduler-scene__stats strong {
  font-size: 18px;
  line-height: 1.2;
  color: #1e293b;
}

.scheduler-scene__main {
  padding: 24px;
}

.scheduler-scene__drawer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scheduler-scene__drawer-lead {
  margin: 0;
  color: #64748b;
}

.scheduler-scene__drawer-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.92);
}

.scheduler-scene__drawer-summary strong {
  color: #1e293b;
}

.scheduler-scene__drawer-summary span {
  color: #64748b;
}

.scheduler-scene__drawer-errors {
  padding: 12px 14px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  background: rgba(254, 242, 242, 0.96);
}

.scheduler-scene__drawer-errors strong {
  display: block;
  margin-bottom: 6px;
  color: #b91c1c;
}

.scheduler-scene__drawer-errors ul {
  margin: 0;
  padding-left: 18px;
  color: #7f1d1d;
}

.scheduler-scene__drawer-grid {
  display: grid;
  gap: 12px;
}

.scheduler-scene__drawer-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.scheduler-scene__drawer-grid span {
  color: #1e293b;
  font-weight: 600;
}

.scheduler-scene__drawer-grid input {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.32);
  border-radius: 12px;
  background: #fff;
  color: #1e293b;
}

@media (max-width: 960px) {
  .scheduler-scene {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
