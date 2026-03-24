import type {
  DatesSetArg,
  DateSelectArg,
  DayCellContentArg,
  EventApi,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
  EventInput
} from "@fullcalendar/core";
import type { DateClickArg, DropArg, EventReceiveArg } from "@fullcalendar/interaction";

export type SchedulerView = "month" | "week" | "day";
export type SchedulerDateInput = string | Date;
export type SchedulerRRuleInput = string | Record<string, unknown>;

export interface SchedulerEvent {
  id: string;
  title: string;
  start: SchedulerDateInput;
  end?: SchedulerDateInput;
  allDay?: boolean;
  rrule?: SchedulerRRuleInput;
  duration?: string;
  editable?: boolean;
  className?: string | string[];
  sourceId?: string;
  occurrenceStart?: string;
  extendedProps?: Record<string, unknown>;
}

export interface SchedulerProps {
  modelValue?: string;
  view?: SchedulerView;
  views?: SchedulerView[];
  events?: SchedulerEvent[];
  locale?: string;
  editable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  selectMirror?: boolean;
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  height?: string | number;
  showNowIndicator?: boolean;
}

export interface SchedulerDateClickPayload {
  date: string;
  allDay: boolean;
  view: SchedulerView;
  nativeEvent: MouseEvent;
}

export interface SchedulerEventClickPayload {
  event: SchedulerEvent;
  view: SchedulerView;
  nativeEvent: MouseEvent;
}

export interface SchedulerEventChangePayload {
  event: SchedulerEvent;
  oldEvent: SchedulerEvent;
  relatedEvents: SchedulerEvent[];
  revert: () => void;
  view: SchedulerView;
}

export interface SchedulerDateSelectPayload {
  start: string;
  end: string;
  allDay: boolean;
  view: SchedulerView;
}

export interface SchedulerDropPayload {
  date: string;
  allDay: boolean;
  view: SchedulerView;
  nativeEvent: MouseEvent;
}

export interface SchedulerEventReceivePayload {
  event: SchedulerEvent;
  relatedEvents: SchedulerEvent[];
  revert: () => void;
  view: SchedulerView;
}

export interface SchedulerViewChangePayload {
  view: SchedulerView;
  start: string;
  end: string;
  currentDate: string;
}

export interface SchedulerEventContentSlotProps {
  event: SchedulerEvent;
  timeText: string;
  isDraggable: boolean;
  isStartResizable: boolean;
  isEndResizable: boolean;
  isMirror: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPast: boolean;
  isFuture: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  view: SchedulerView;
}

export interface SchedulerDayCellContentSlotProps {
  date: string;
  dayNumberText: string;
  isDisabled: boolean;
  isOther: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  view: SchedulerView;
}

export interface SchedulerEventMappingOptions {
  anchorDate?: string;
  view: SchedulerView;
  weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  rootEditable?: boolean;
}

const VIEW_TO_FULLCALENDAR: Record<SchedulerView, "dayGridMonth" | "timeGridWeek" | "timeGridDay"> =
  {
    month: "dayGridMonth",
    week: "timeGridWeek",
    day: "timeGridDay"
  };

type NormalizedRRuleFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface NormalizedSchedulerRRule {
  freq: NormalizedRRuleFrequency;
  dtstart: Date;
  interval: number;
  count?: number;
  until?: Date;
  byweekday?: number[];
  bymonthday?: number[];
  bymonth?: number[];
  wkst?: number;
}

export function toFullCalendarView(view: SchedulerView) {
  return VIEW_TO_FULLCALENDAR[view];
}

export function fromFullCalendarView(viewType: string): SchedulerView {
  switch (viewType) {
    case "timeGridWeek":
      return "week";
    case "timeGridDay":
      return "day";
    case "dayGridMonth":
    default:
      return "month";
  }
}

export function parseSchedulerDateInput(value?: SchedulerDateInput | null) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  const parsed = new Date(trimmed);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatSchedulerDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatSchedulerDateTime(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");

  return `${formatSchedulerDate(date)}T${hours}:${minutes}:${seconds}`;
}

export function normalizeSchedulerAnchorDate(value?: SchedulerDateInput | null) {
  const parsed = parseSchedulerDateInput(value);

  return parsed ? formatSchedulerDate(parsed) : "";
}

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date, weekStart: SchedulerProps["weekStart"] = 1) {
  const normalized = stripTime(date);
  const offset = (normalized.getDay() - weekStart + 7) % 7;

  normalized.setDate(normalized.getDate() - offset);
  return normalized;
}

function endOfWeek(date: Date, weekStart: SchedulerProps["weekStart"] = 1) {
  const normalized = startOfWeek(date, weekStart);

  normalized.setDate(normalized.getDate() + 6);
  return normalized;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, amount: number) {
  const normalized = new Date(date);

  normalized.setDate(normalized.getDate() + amount);
  return normalized;
}

function addMilliseconds(date: Date, amount: number) {
  return new Date(date.getTime() + amount);
}

function parseDurationToMs(value?: string) {
  if (!value) {
    return 0;
  }

  const segments = value.split(":").map(Number);

  if (segments.some((segment) => Number.isNaN(segment))) {
    return 0;
  }

  if (segments.length === 2) {
    const [hours, minutes] = segments;

    return ((hours ?? 0) * 60 + (minutes ?? 0)) * 60 * 1000;
  }

  if (segments.length === 3) {
    const [hours, minutes, seconds] = segments;

    return (((hours ?? 0) * 60 + (minutes ?? 0)) * 60 + (seconds ?? 0)) * 1000;
  }

  return 0;
}

function resolveEventDurationMs(event: SchedulerEvent) {
  if (event.duration) {
    return parseDurationToMs(event.duration);
  }

  const start = parseSchedulerDateInput(event.start);
  const end = parseSchedulerDateInput(event.end);

  if (start && end) {
    return Math.max(end.getTime() - start.getTime(), 0);
  }

  return event.allDay ? 24 * 60 * 60 * 1000 : 0;
}

function getVisibleRange(
  anchorDate: string | undefined,
  view: SchedulerView,
  weekStart: SchedulerProps["weekStart"] = 1
) {
  const base = parseSchedulerDateInput(anchorDate) ?? new Date();

  if (view === "day") {
    const start = stripTime(base);

    return {
      start,
      end: addDays(start, 1)
    };
  }

  if (view === "week") {
    const start = startOfWeek(base, weekStart);

    return {
      start,
      end: addDays(start, 7)
    };
  }

  const monthStart = startOfMonth(base);
  const monthEnd = endOfMonth(base);
  const start = startOfWeek(monthStart, weekStart);
  const end = addDays(endOfWeek(monthEnd, weekStart), 1);

  return {
    start,
    end
  };
}

const RRULE_FREQ_NAME_MAP: Record<number, NormalizedRRuleFrequency> = {
  0: "YEARLY",
  1: "MONTHLY",
  2: "WEEKLY",
  3: "DAILY"
};

const RRULE_KEY_MAP: Record<string, keyof NormalizedSchedulerRRule | "dtstart"> = {
  freq: "freq",
  dtstart: "dtstart",
  interval: "interval",
  count: "count",
  until: "until",
  byday: "byweekday",
  byweekday: "byweekday",
  bymonthday: "bymonthday",
  bymonth: "bymonth",
  wkst: "wkst"
};

const WEEKDAY_INDEX_MAP: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};

function parseCompactDateInput(value: string) {
  const dateOnlyMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const dateTimeMatch = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);

  if (!dateTimeMatch) {
    return null;
  }

  const [, year, month, day, hour, minute, second, isUtc] = dateTimeMatch;

  if (isUtc) {
    return new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      )
    );
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
}

function parseRRuleDateInput(value: unknown) {
  if (typeof value === "string") {
    const compactParsed = parseCompactDateInput(value.trim());

    if (compactParsed) {
      return compactParsed;
    }
  }

  return parseSchedulerDateInput(value as SchedulerDateInput | null | undefined);
}

function normalizeRRuleFrequency(value: unknown): NormalizedRRuleFrequency | undefined {
  if (typeof value === "number") {
    return RRULE_FREQ_NAME_MAP[value];
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const token = value.trim().toUpperCase();

  if (token === "DAILY" || token === "WEEKLY" || token === "MONTHLY" || token === "YEARLY") {
    return token;
  }

  return undefined;
}

function parseWeekdayToken(value: unknown) {
  if (typeof value === "number") {
    return value >= 0 && value <= 6 ? value : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const matched = value
    .trim()
    .toUpperCase()
    .match(/^[+-]?\d*(SU|MO|TU|WE|TH|FR|SA)$/);

  if (!matched) {
    return undefined;
  }

  return WEEKDAY_INDEX_MAP[matched[1]];
}

function normalizeWeekdayList(value: unknown) {
  const values = Array.isArray(value) ? value : [value];
  const parsed = values
    .map((item) => parseWeekdayToken(item))
    .filter((item): item is number => typeof item === "number");

  return parsed.length ? [...new Set(parsed)].sort((left, right) => left - right) : undefined;
}

function normalizeNumberList(value: unknown) {
  const values = Array.isArray(value) ? value : [value];
  const parsed = values.map((item) => Number(item)).filter((item) => Number.isInteger(item));

  return parsed.length ? parsed : undefined;
}

function parseRRuleParts(parts: Record<string, unknown>, fallbackStart?: Date) {
  const freq = normalizeRRuleFrequency(parts.freq);
  const dtstart = parseRRuleDateInput(parts.dtstart) ?? fallbackStart;

  if (!freq || !dtstart) {
    return null;
  }

  const interval = Math.max(Number(parts.interval ?? 1) || 1, 1);
  const countValue = Number(parts.count);
  const count = Number.isInteger(countValue) && countValue > 0 ? countValue : undefined;
  const until = parseRRuleDateInput(parts.until);

  return {
    freq,
    dtstart,
    interval,
    count,
    until: until ?? undefined,
    byweekday: normalizeWeekdayList(parts.byweekday),
    bymonthday: normalizeNumberList(parts.bymonthday),
    bymonth: normalizeNumberList(parts.bymonth),
    wkst: parseWeekdayToken(parts.wkst)
  } satisfies NormalizedSchedulerRRule;
}

function parseRRuleStringInput(input: string, fallbackStart?: Date) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const parts: Record<string, unknown> = {};

  for (const line of lines) {
    if (line.startsWith("DTSTART")) {
      const [, rawValue = ""] = line.split(":");

      parts.dtstart = rawValue;
      continue;
    }

    const content = line.startsWith("RRULE:") ? line.slice("RRULE:".length) : line;

    content.split(";").forEach((segment) => {
      const [rawKey, rawValue = ""] = segment.split("=");
      const mappedKey = RRULE_KEY_MAP[rawKey.trim().toLowerCase()] ?? rawKey.trim().toLowerCase();
      const normalizedValue = rawValue.trim();

      if (mappedKey === "byweekday" || mappedKey === "bymonthday" || mappedKey === "bymonth") {
        parts[mappedKey] = normalizedValue.split(",").map((item) => item.trim());
        return;
      }

      parts[mappedKey] = normalizedValue;
    });
  }

  return parseRRuleParts(parts, fallbackStart);
}

function parseSchedulerRRule(input: SchedulerRRuleInput | undefined, fallbackStart?: Date) {
  if (!input) {
    return null;
  }

  if (typeof input === "string") {
    return parseRRuleStringInput(input, fallbackStart);
  }

  return parseRRuleParts(input, fallbackStart);
}

function setTimeOfDate(date: Date, timeSource: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    timeSource.getMilliseconds()
  );
}

function pushOccurrence(
  date: Date,
  results: Date[],
  rule: NormalizedSchedulerRRule,
  rangeStart: Date,
  rangeEnd: Date,
  counter: { value: number }
) {
  if (date < rule.dtstart) {
    return false;
  }

  if (rule.until && date > rule.until) {
    return true;
  }

  if (rule.count && counter.value >= rule.count) {
    return true;
  }

  counter.value += 1;

  if (date >= rangeStart && date < rangeEnd) {
    results.push(date);
  }

  return Boolean(rule.count && counter.value >= rule.count);
}

function getMonthCandidateDays(rule: NormalizedSchedulerRRule, cursor: Date) {
  const month = cursor.getMonth();
  const year = cursor.getFullYear();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const rawDays = rule.bymonthday?.length ? rule.bymonthday : [rule.dtstart.getDate()];

  return rawDays
    .map((day) => (day < 0 ? lastDay + day + 1 : day))
    .filter((day) => day >= 1 && day <= lastDay)
    .map((day) => new Date(year, month, day));
}

function expandDailyOccurrences(rule: NormalizedSchedulerRRule, rangeStart: Date, rangeEnd: Date) {
  const results: Date[] = [];
  const counter = { value: 0 };
  const cursor = new Date(rule.dtstart);

  while (cursor < rangeEnd && (!rule.until || cursor <= rule.until)) {
    const weekday = cursor.getDay();
    const month = cursor.getMonth() + 1;
    const monthDay = cursor.getDate();
    const matchedWeekday = !rule.byweekday?.length || rule.byweekday.includes(weekday);
    const matchedMonth = !rule.bymonth?.length || rule.bymonth.includes(month);
    const matchedMonthDay = !rule.bymonthday?.length || rule.bymonthday.includes(monthDay);

    if (matchedWeekday && matchedMonth && matchedMonthDay) {
      const shouldStop = pushOccurrence(
        new Date(cursor),
        results,
        rule,
        rangeStart,
        rangeEnd,
        counter
      );

      if (shouldStop) {
        break;
      }
    }

    cursor.setDate(cursor.getDate() + rule.interval);
  }

  return results;
}

function expandWeeklyOccurrences(rule: NormalizedSchedulerRRule, rangeStart: Date, rangeEnd: Date) {
  const results: Date[] = [];
  const counter = { value: 0 };
  const weekdays = rule.byweekday?.length ? rule.byweekday : [rule.dtstart.getDay()];
  const weekStart = (rule.wkst ?? 1) as NonNullable<SchedulerProps["weekStart"]>;
  const cursor = startOfWeek(rule.dtstart, weekStart);

  while (cursor < rangeEnd && (!rule.until || cursor <= rule.until)) {
    for (const weekday of weekdays) {
      const occurrenceDate = addDays(cursor, (weekday - weekStart + 7) % 7);
      const occurrence = setTimeOfDate(occurrenceDate, rule.dtstart);
      const shouldStop = pushOccurrence(occurrence, results, rule, rangeStart, rangeEnd, counter);

      if (shouldStop) {
        return results;
      }
    }

    cursor.setDate(cursor.getDate() + rule.interval * 7);
  }

  return results;
}

function expandMonthlyOccurrences(
  rule: NormalizedSchedulerRRule,
  rangeStart: Date,
  rangeEnd: Date
) {
  const results: Date[] = [];
  const counter = { value: 0 };
  const cursor = startOfMonth(rule.dtstart);

  while (cursor < rangeEnd && (!rule.until || cursor <= rule.until)) {
    const month = cursor.getMonth() + 1;

    if (!rule.bymonth?.length || rule.bymonth.includes(month)) {
      const candidates = getMonthCandidateDays(rule, cursor).filter((date) => {
        if (!rule.byweekday?.length) {
          return true;
        }

        return rule.byweekday.includes(date.getDay());
      });

      for (const date of candidates) {
        const occurrence = setTimeOfDate(date, rule.dtstart);
        const shouldStop = pushOccurrence(occurrence, results, rule, rangeStart, rangeEnd, counter);

        if (shouldStop) {
          return results;
        }
      }
    }

    cursor.setMonth(cursor.getMonth() + rule.interval, 1);
  }

  return results;
}

function expandYearlyOccurrences(rule: NormalizedSchedulerRRule, rangeStart: Date, rangeEnd: Date) {
  const results: Date[] = [];
  const counter = { value: 0 };
  const cursor = new Date(rule.dtstart.getFullYear(), 0, 1);
  const months = rule.bymonth?.length ? rule.bymonth : [rule.dtstart.getMonth() + 1];

  while (cursor < rangeEnd && (!rule.until || cursor <= rule.until)) {
    for (const month of months) {
      const monthCursor = new Date(cursor.getFullYear(), month - 1, 1);
      const candidates = getMonthCandidateDays(rule, monthCursor).filter((date) => {
        if (!rule.byweekday?.length) {
          return true;
        }

        return rule.byweekday.includes(date.getDay());
      });

      for (const date of candidates) {
        const occurrence = setTimeOfDate(date, rule.dtstart);
        const shouldStop = pushOccurrence(occurrence, results, rule, rangeStart, rangeEnd, counter);

        if (shouldStop) {
          return results;
        }
      }
    }

    cursor.setFullYear(cursor.getFullYear() + rule.interval, 0, 1);
  }

  return results;
}

export function mapSchedulerEvent(event: SchedulerEvent, rootEditable = false): EventInput {
  return {
    ...event,
    rrule: undefined,
    editable: event.editable ?? rootEditable
  };
}

function expandRecurringEvent(
  event: SchedulerEvent,
  options: SchedulerEventMappingOptions
): EventInput[] {
  const rule = parseSchedulerRRule(event.rrule, parseSchedulerDateInput(event.start) ?? undefined);

  if (!rule) {
    return [];
  }

  const { start, end } = getVisibleRange(options.anchorDate, options.view, options.weekStart);
  const duration = resolveEventDurationMs(event);
  const occurrences =
    rule.freq === "DAILY"
      ? expandDailyOccurrences(rule, start, end)
      : rule.freq === "WEEKLY"
        ? expandWeeklyOccurrences(rule, start, end)
        : rule.freq === "MONTHLY"
          ? expandMonthlyOccurrences(rule, start, end)
          : expandYearlyOccurrences(rule, start, end);

  return occurrences.map((occurrence, index) => {
    const occurrenceEnd = duration > 0 ? addMilliseconds(occurrence, duration) : undefined;

    return {
      ...event,
      id: `${event.id}__${occurrence.getTime()}__${index}`,
      start: event.allDay ? formatSchedulerDate(occurrence) : formatSchedulerDateTime(occurrence),
      end:
        occurrenceEnd && event.allDay
          ? formatSchedulerDate(occurrenceEnd)
          : occurrenceEnd
            ? formatSchedulerDateTime(occurrenceEnd)
            : undefined,
      rrule: undefined,
      duration: undefined,
      editable: event.editable ?? options.rootEditable ?? false,
      extendedProps: {
        ...event.extendedProps,
        schedulerSourceId: event.id,
        schedulerOccurrenceStart: event.allDay
          ? formatSchedulerDate(occurrence)
          : formatSchedulerDateTime(occurrence)
      }
    };
  });
}

export function mapSchedulerEvents(
  events: SchedulerEvent[],
  options: SchedulerEventMappingOptions
) {
  return events.flatMap((event) =>
    event.rrule
      ? expandRecurringEvent(event, options)
      : mapSchedulerEvent(event, options.rootEditable)
  );
}

export function normalizeSchedulerEvent(
  event: Pick<
    EventApi,
    | "id"
    | "title"
    | "start"
    | "end"
    | "startStr"
    | "endStr"
    | "allDay"
    | "classNames"
    | "extendedProps"
  >
): SchedulerEvent {
  const extendedProps = {
    ...(event.extendedProps ?? {})
  };
  const sourceId =
    typeof extendedProps.schedulerSourceId === "string"
      ? extendedProps.schedulerSourceId
      : undefined;
  const occurrenceStart =
    typeof extendedProps.schedulerOccurrenceStart === "string"
      ? extendedProps.schedulerOccurrenceStart
      : undefined;

  delete extendedProps.schedulerSourceId;
  delete extendedProps.schedulerOccurrenceStart;

  const normalizedStart = event.allDay
    ? event.startStr || (event.start ? formatSchedulerDate(event.start) : "")
    : event.startStr || (event.start ? formatSchedulerDateTime(event.start) : "");
  const normalized: SchedulerEvent = {
    id: event.id,
    title: event.title,
    start: normalizedStart,
    allDay: event.allDay
  };

  if (sourceId) {
    normalized.sourceId = sourceId;
  }

  if (occurrenceStart) {
    normalized.occurrenceStart = occurrenceStart;
  }

  if (event.endStr) {
    normalized.end = event.endStr;
  } else if (event.end) {
    normalized.end = event.allDay
      ? formatSchedulerDate(event.end)
      : formatSchedulerDateTime(event.end);
  }

  if (event.classNames.length) {
    normalized.className = [...event.classNames];
  }

  if (Object.keys(extendedProps).length) {
    normalized.extendedProps = extendedProps;
  }

  return normalized;
}

export function buildSchedulerDateClickPayload(arg: DateClickArg): SchedulerDateClickPayload {
  return {
    date: arg.dateStr,
    allDay: arg.allDay,
    view: fromFullCalendarView(arg.view.type),
    nativeEvent: arg.jsEvent
  };
}

export function buildSchedulerEventClickPayload(arg: EventClickArg): SchedulerEventClickPayload {
  return {
    event: normalizeSchedulerEvent(arg.event),
    view: fromFullCalendarView(arg.view.type),
    nativeEvent: arg.jsEvent
  };
}

export function buildSchedulerEventChangePayload(
  arg: EventChangeArg,
  currentView: SchedulerView
): SchedulerEventChangePayload {
  return {
    event: normalizeSchedulerEvent(arg.event),
    oldEvent: normalizeSchedulerEvent(arg.oldEvent),
    relatedEvents: arg.relatedEvents.map((event) => normalizeSchedulerEvent(event)),
    revert: arg.revert,
    view: currentView
  };
}

export function buildSchedulerDateSelectPayload(arg: DateSelectArg): SchedulerDateSelectPayload {
  return {
    start: arg.startStr,
    end: arg.endStr,
    allDay: arg.allDay,
    view: fromFullCalendarView(arg.view.type)
  };
}

export function buildSchedulerDropPayload(arg: DropArg): SchedulerDropPayload {
  return {
    date: arg.dateStr,
    allDay: arg.allDay,
    view: fromFullCalendarView(arg.view.type),
    nativeEvent: arg.jsEvent
  };
}

export function buildSchedulerEventReceivePayload(
  arg: EventReceiveArg
): SchedulerEventReceivePayload {
  return {
    event: normalizeSchedulerEvent(arg.event),
    relatedEvents: arg.relatedEvents.map((event) => normalizeSchedulerEvent(event)),
    revert: arg.revert,
    view: fromFullCalendarView(arg.view.type)
  };
}

export function buildSchedulerViewChangePayload(
  arg: DatesSetArg,
  currentDate: string
): SchedulerViewChangePayload {
  return {
    view: fromFullCalendarView(arg.view.type),
    start: arg.startStr,
    end: arg.endStr,
    currentDate
  };
}

export function buildSchedulerEventContentSlotProps(
  arg: EventContentArg
): SchedulerEventContentSlotProps {
  return {
    event: normalizeSchedulerEvent(arg.event),
    timeText: arg.timeText,
    isDraggable: arg.isDraggable,
    isStartResizable: arg.isStartResizable,
    isEndResizable: arg.isEndResizable,
    isMirror: arg.isMirror,
    isStart: arg.isStart,
    isEnd: arg.isEnd,
    isPast: arg.isPast,
    isFuture: arg.isFuture,
    isToday: arg.isToday,
    isSelected: arg.isSelected,
    isDragging: arg.isDragging,
    isResizing: arg.isResizing,
    view: fromFullCalendarView(arg.view.type)
  };
}

export function buildSchedulerDayCellContentSlotProps(
  arg: DayCellContentArg
): SchedulerDayCellContentSlotProps {
  return {
    date: formatSchedulerDate(arg.date),
    dayNumberText: arg.dayNumberText,
    isDisabled: arg.isDisabled,
    isOther: arg.isOther,
    isToday: arg.isToday,
    isPast: arg.isPast,
    isFuture: arg.isFuture,
    view: fromFullCalendarView(arg.view.type)
  };
}
