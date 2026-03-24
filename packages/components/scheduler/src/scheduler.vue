<script setup lang="ts">
import { computed, ref, useSlots, watch } from "vue";
import type {
  CalendarApi,
  CalendarOptions,
  DatesSetArg,
  DateSelectArg,
  DayCellContentArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg
} from "@fullcalendar/core";
import zhCnLocale from "@fullcalendar/core/locales/zh-cn";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
  type DropArg,
  type EventReceiveArg
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";
import { useNamespace } from "@xiaoye/composables";
import type {
  SchedulerDateClickPayload,
  SchedulerDropPayload,
  SchedulerDateSelectPayload,
  SchedulerDayCellContentSlotProps,
  SchedulerEventChangePayload,
  SchedulerEventClickPayload,
  SchedulerEventContentSlotProps,
  SchedulerEventReceivePayload,
  SchedulerProps,
  SchedulerView,
  SchedulerViewChangePayload
} from "./scheduler";
import {
  buildSchedulerDateClickPayload,
  buildSchedulerDropPayload,
  buildSchedulerDateSelectPayload,
  buildSchedulerDayCellContentSlotProps,
  buildSchedulerEventChangePayload,
  buildSchedulerEventClickPayload,
  buildSchedulerEventContentSlotProps,
  buildSchedulerEventReceivePayload,
  buildSchedulerViewChangePayload,
  formatSchedulerDate,
  fromFullCalendarView,
  mapSchedulerEvents,
  normalizeSchedulerAnchorDate,
  toFullCalendarView
} from "./scheduler";

defineOptions({
  name: "XyScheduler"
});

const props = withDefaults(defineProps<SchedulerProps>(), {
  modelValue: undefined,
  view: "month",
  views: () => ["month", "week", "day"],
  events: () => [],
  locale: "zh-cn",
  editable: false,
  droppable: false,
  selectable: false,
  selectMirror: true,
  weekStart: 1,
  height: "auto",
  showNowIndicator: true
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:view": [value: SchedulerView];
  "date-click": [payload: SchedulerDateClickPayload];
  drop: [payload: SchedulerDropPayload];
  "date-select": [payload: SchedulerDateSelectPayload];
  "event-click": [payload: SchedulerEventClickPayload];
  "event-change": [payload: SchedulerEventChangePayload];
  "event-receive": [payload: SchedulerEventReceivePayload];
  "view-change": [payload: SchedulerViewChangePayload];
}>();

defineSlots<{
  "event-content"?: (props: SchedulerEventContentSlotProps) => unknown;
  "day-cell-content"?: (props: SchedulerDayCellContentSlotProps) => unknown;
}>();

const slots = useSlots();
const ns = useNamespace("scheduler");
const calendarRef = ref<{ getApi: () => CalendarApi } | null>(null);
const initialized = ref(false);
const currentTitle = ref("排期日历");
const currentDate = ref(props.modelValue ?? "");

const viewLabelMap: Record<SchedulerView, string> = {
  month: "月",
  week: "周",
  day: "日"
};

const resolvedViews = computed<SchedulerView[]>(() => {
  const filtered = props.views.filter(
    (view, index, list): view is SchedulerView =>
      (view === "month" || view === "week" || view === "day") && list.indexOf(view) === index
  );

  return filtered.length ? filtered : ["month", "week", "day"];
});

const resolvedView = computed<SchedulerView>(() =>
  resolvedViews.value.includes(props.view) ? props.view : resolvedViews.value[0]!
);

const currentView = ref<SchedulerView>(resolvedView.value);

const viewButtons = computed(() =>
  resolvedViews.value.map((value) => ({
    label: viewLabelMap[value],
    value
  }))
);

const hasEditableInteractions = computed(
  () => props.editable || props.events.some((event) => Boolean(event.editable))
);

const resolvedLocale = computed(() =>
  props.locale.trim().toLowerCase() === "zh-cn" ? zhCnLocale : props.locale
);

const mappedEvents = computed(() =>
  mapSchedulerEvents(props.events, {
    anchorDate: currentDate.value || props.modelValue,
    view: currentView.value,
    weekStart: props.weekStart,
    rootEditable: props.editable
  })
);

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locales: [zhCnLocale],
  locale: resolvedLocale.value,
  initialView: toFullCalendarView(resolvedView.value),
  initialDate: props.modelValue,
  headerToolbar: false,
  height: props.height,
  firstDay: props.weekStart,
  dayMaxEvents: true,
  moreLinkClick: "popover",
  nowIndicator: props.showNowIndicator,
  editable: hasEditableInteractions.value,
  droppable: props.droppable,
  selectable: props.selectable,
  selectMirror: props.selectMirror,
  eventStartEditable: hasEditableInteractions.value,
  eventDurationEditable: hasEditableInteractions.value,
  eventResizableFromStart: hasEditableInteractions.value,
  events: mappedEvents.value,
  dateClick: handleDateClick,
  drop: handleDrop,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventChange: handleEventChange,
  eventReceive: handleEventReceive,
  datesSet: handleDatesSet
}));

function getCalendarApi() {
  return calendarRef.value?.getApi() ?? null;
}

defineExpose({
  getApi: getCalendarApi
});

function syncViewFromProps(view: SchedulerView) {
  const calendarApi = getCalendarApi();

  if (!calendarApi) {
    return;
  }

  const nextView = resolvedViews.value.includes(view) ? view : resolvedViews.value[0]!;
  const targetView = toFullCalendarView(nextView);

  if (calendarApi.view.type !== targetView) {
    calendarApi.changeView(targetView);
  }
}

function syncDateFromProps(value?: string) {
  const calendarApi = getCalendarApi();

  if (!calendarApi || !value) {
    return;
  }

  const nextDate = normalizeSchedulerAnchorDate(value);
  const currentAnchor = formatSchedulerDate(calendarApi.getDate());

  if (nextDate && currentAnchor !== nextDate) {
    calendarApi.gotoDate(value);
  }
}

function handlePrev() {
  getCalendarApi()?.prev();
}

function handleNext() {
  getCalendarApi()?.next();
}

function handleToday() {
  getCalendarApi()?.today();
}

function handleChangeView(view: SchedulerView) {
  const calendarApi = getCalendarApi();

  if (!calendarApi || currentView.value === view || !resolvedViews.value.includes(view)) {
    return;
  }

  calendarApi.changeView(toFullCalendarView(view));
}

function handleDateClick(arg: DateClickArg) {
  emit("date-click", buildSchedulerDateClickPayload(arg));
}

function handleDateSelect(arg: DateSelectArg) {
  emit("date-select", buildSchedulerDateSelectPayload(arg));
}

function handleDrop(arg: DropArg) {
  emit("drop", buildSchedulerDropPayload(arg));
}

function handleEventClick(arg: EventClickArg) {
  emit("event-click", buildSchedulerEventClickPayload(arg));
}

function handleEventChange(arg: EventChangeArg) {
  emit("event-change", buildSchedulerEventChangePayload(arg, currentView.value));
}

function handleEventReceive(arg: EventReceiveArg) {
  emit("event-receive", buildSchedulerEventReceivePayload(arg));
}

function handleDatesSet(arg: DatesSetArg) {
  const nextView = fromFullCalendarView(arg.view.type);
  const nextDate = formatSchedulerDate(getCalendarApi()?.getDate() ?? arg.start);
  const viewChanged = nextView !== currentView.value;
  const dateChanged = nextDate !== currentDate.value;

  currentTitle.value = arg.view.title;
  currentView.value = nextView;
  currentDate.value = nextDate;

  if (!initialized.value) {
    initialized.value = true;
    return;
  }

  if (viewChanged) {
    emit("update:view", nextView);
  }

  if (dateChanged) {
    emit("update:modelValue", nextDate);
  }

  emit("view-change", buildSchedulerViewChangePayload(arg, nextDate));
}

function getEventContentSlotProps(arg: EventContentArg) {
  return buildSchedulerEventContentSlotProps(arg);
}

function getDayCellContentSlotProps(arg: DayCellContentArg) {
  return buildSchedulerDayCellContentSlotProps(arg);
}

watch(
  () => props.view,
  (value) => {
    syncViewFromProps(value);
  }
);

watch(resolvedViews, (value) => {
  if (value.includes(currentView.value)) {
    return;
  }

  syncViewFromProps(value[0]!);
});

watch(
  () => props.modelValue,
  (value) => {
    syncDateFromProps(value);
  }
);
</script>

<template>
  <div :class="ns.base.value">
    <header class="xy-scheduler__toolbar">
      <div class="xy-scheduler__nav-group">
        <button
          type="button"
          class="xy-scheduler__nav-button"
          aria-label="上一页"
          @click="handlePrev"
        >
          ‹
        </button>
        <button
          type="button"
          class="xy-scheduler__nav-button xy-scheduler__nav-button--today"
          @click="handleToday"
        >
          今天
        </button>
        <button
          type="button"
          class="xy-scheduler__nav-button"
          aria-label="下一页"
          @click="handleNext"
        >
          ›
        </button>
      </div>

      <strong class="xy-scheduler__title">{{ currentTitle }}</strong>

      <div
        v-if="viewButtons.length > 1"
        class="xy-scheduler__view-group"
        role="tablist"
        aria-label="视图切换"
      >
        <button
          v-for="button in viewButtons"
          :key="button.value"
          type="button"
          class="xy-scheduler__view-button"
          :class="button.value === currentView ? 'is-active' : ''"
          :aria-pressed="button.value === currentView"
          @click="handleChangeView(button.value)"
        >
          {{ button.label }}
        </button>
      </div>
    </header>

    <div class="xy-scheduler__surface">
      <FullCalendar ref="calendarRef" class="xy-scheduler__calendar" :options="calendarOptions">
        <template v-if="slots['event-content']" #eventContent="slotProps">
          <slot name="event-content" v-bind="getEventContentSlotProps(slotProps)" />
        </template>

        <template v-if="slots['day-cell-content']" #dayCellContent="slotProps">
          <slot name="day-cell-content" v-bind="getDayCellContentSlotProps(slotProps)" />
        </template>
      </FullCalendar>
    </div>
  </div>
</template>
