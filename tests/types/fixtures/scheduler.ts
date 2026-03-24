import type { SchedulerEvent, SchedulerProps } from "xiaoye-components";

const events: SchedulerEvent[] = [
  {
    id: "kickoff",
    title: "Kickoff",
    start: "2026-03-24T10:00:00",
    end: "2026-03-24T11:00:00",
    editable: true
  },
  {
    id: "weekly-sync",
    title: "双周同步会",
    start: "2026-03-02T09:30:00",
    rrule: {
      freq: "weekly",
      byweekday: ["mo", "th"],
      dtstart: "2026-03-02T09:30:00"
    },
    duration: "01:00"
  }
];

const props: SchedulerProps = {
  modelValue: "2026-03-24",
  view: "week",
  events,
  editable: true,
  droppable: true,
  selectable: true,
  locale: "zh-cn"
};

void props;

const invalidProps: SchedulerProps = {
  // @ts-expect-error invalid view
  view: "timeline"
};

void invalidProps;
