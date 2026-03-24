import type {
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  EventChangeArg,
  EventInput
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/vue3";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyScheduler } from "@xiaoye/components";
import type { SchedulerEvent } from "../src/scheduler";
import { buildSchedulerDateClickPayload, formatSchedulerDate } from "../src/scheduler";
import type { DropArg, EventReceiveArg } from "@fullcalendar/interaction";

const baseEvents: SchedulerEvent[] = [
  {
    id: "kickoff",
    title: "产品 Kickoff",
    start: "2026-03-24T10:00:00",
    end: "2026-03-24T11:30:00"
  },
  {
    id: "review",
    title: "版本评审",
    start: "2026-03-26T15:00:00",
    end: "2026-03-26T16:30:00"
  }
];

async function waitForCalendarRender() {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("XyScheduler", () => {
  it("会把初始 view 和 modelValue 映射到 FullCalendar", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        view: "week",
        modelValue: "2026-03-24",
        events: baseEvents
      }
    });

    await waitForCalendarRender();

    const calendar = wrapper.findComponent(FullCalendar as never) as any;
    const api = calendar.vm.getApi();

    expect(api.view.type).toBe("timeGridWeek");
    expect(formatSchedulerDate(api.getDate())).toBe("2026-03-24");
  });

  it("支持通过 views 限制可切换视图，并在单视图时隐藏切换按钮", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        view: "month",
        views: ["month"],
        modelValue: "2026-03-24",
        events: baseEvents
      }
    });

    await waitForCalendarRender();

    expect(wrapper.findAll(".xy-scheduler__view-button")).toHaveLength(0);
    const calendar = wrapper.findComponent(FullCalendar as never) as any;
    expect(calendar.vm.getApi().view.type).toBe("dayGridMonth");
  });

  it("支持渲染重复事件", async () => {
    mount(XyScheduler, {
      attachTo: document.body,
      props: {
        modelValue: "2026-03-01",
        view: "month",
        events: [
          {
            id: "weekly-sync",
            title: "双周同步会",
            start: "2026-03-02T10:00:00",
            rrule: {
              freq: "weekly",
              byweekday: ["mo", "th"],
              dtstart: "2026-03-02T10:00:00",
              until: "2026-05-31"
            },
            duration: "01:00"
          }
        ]
      }
    });

    await waitForCalendarRender();

    const titles = [...document.body.querySelectorAll(".fc-event-title")]
      .map((element) => element.textContent?.trim())
      .filter((value) => value === "双周同步会");

    expect(titles.length).toBeGreaterThan(1);
  });

  it("支持字符串 rrule，并为重复实例保留 sourceId 与 occurrenceStart", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        modelValue: "2026-03-01",
        view: "month",
        events: [
          {
            id: "weekly-sync",
            title: "双周同步会",
            start: "2026-03-02T10:00:00",
            rrule: "DTSTART:20260302T100000\nRRULE:FREQ=WEEKLY;BYDAY=MO,TH;UNTIL=20260531",
            duration: "01:00"
          }
        ]
      }
    });

    await waitForCalendarRender();

    document.querySelector<HTMLElement>(".fc-event")?.click();
    await nextTick();

    expect(wrapper.emitted("event-click")?.[0]?.[0]).toMatchObject({
      event: {
        sourceId: "weekly-sync",
        occurrenceStart: "2026-03-02T10:00:00"
      }
    });
  });

  it("支持日期点击负载构建、点击事件和切换视图", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        modelValue: "2026-03-01",
        view: "month",
        events: baseEvents
      }
    });

    await waitForCalendarRender();

    const calendar = wrapper.findComponent(FullCalendar as never) as unknown as {
      vm: { getApi: () => CalendarApi };
    };
    const api = calendar.vm.getApi();
    const dateClickPayload = buildSchedulerDateClickPayload({
      date: new Date("2026-03-25T00:00:00"),
      dateStr: "2026-03-25",
      allDay: true,
      dayEl: document.createElement("div"),
      jsEvent: new MouseEvent("click"),
      view: api.view
    } as never);
    document.querySelector<HTMLElement>(".fc-event")?.click();
    await wrapper.findAll(".xy-scheduler__view-button")[2]?.trigger("click");
    await waitForCalendarRender();

    expect(dateClickPayload).toMatchObject({
      date: "2026-03-25",
      view: "month"
    });
    expect((wrapper.emitted("event-click")?.[0]?.[0] as any)?.event.title).toBe("产品 Kickoff");
    expect(wrapper.emitted("update:view")?.some(([value]) => value === "day")).toBe(true);
    expect(wrapper.emitted("view-change")).toBeTruthy();
  });

  it("支持 selectable 并回传 date-select", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        modelValue: "2026-03-24",
        view: "week",
        selectable: true,
        events: baseEvents
      }
    });

    await waitForCalendarRender();

    const calendar = wrapper.findComponent(FullCalendar as never) as any;
    const options = calendar.props("options") as CalendarOptions;

    expect(options.selectable).toBe(true);
    expect(options.selectMirror).toBe(true);

    (options.select as ((arg: DateSelectArg) => void) | undefined)?.({
      start: new Date("2026-03-24T00:00:00"),
      end: new Date("2026-03-26T00:00:00"),
      startStr: "2026-03-24",
      endStr: "2026-03-26",
      allDay: true,
      view: calendar.vm.getApi().view
    } as DateSelectArg);

    await nextTick();

    expect(wrapper.emitted("date-select")?.[0]?.[0]).toMatchObject({
      start: "2026-03-24",
      end: "2026-03-26",
      allDay: true,
      view: "week"
    });
  });

  it("支持 droppable 并回传 drop / event-receive", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        modelValue: "2026-03-24",
        view: "month",
        droppable: true,
        events: baseEvents
      }
    });

    await waitForCalendarRender();

    const calendar = wrapper.findComponent(FullCalendar as never) as any;
    const options = calendar.props("options") as CalendarOptions;

    expect(options.droppable).toBe(true);

    (options.drop as ((arg: DropArg) => void) | undefined)?.({
      date: new Date("2026-03-25T00:00:00"),
      dateStr: "2026-03-25",
      allDay: true,
      draggedEl: document.createElement("div"),
      jsEvent: new MouseEvent("mouseup"),
      view: calendar.vm.getApi().view
    } as DropArg);

    (options.eventReceive as ((arg: EventReceiveArg) => void) | undefined)?.({
      draggedEl: document.createElement("div"),
      event: {
        id: "external-task",
        title: "外部事项",
        start: new Date("2026-03-25T09:00:00"),
        end: new Date("2026-03-25T10:00:00"),
        startStr: "2026-03-25T09:00:00",
        endStr: "2026-03-25T10:00:00",
        allDay: false,
        classNames: [],
        extendedProps: {}
      },
      relatedEvents: [],
      revert: vi.fn(),
      view: calendar.vm.getApi().view
    } as unknown as EventReceiveArg);

    await nextTick();

    expect(wrapper.emitted("drop")?.[0]?.[0]).toMatchObject({
      date: "2026-03-25",
      view: "month"
    });
    expect(wrapper.emitted("event-receive")?.[0]?.[0]).toMatchObject({
      event: {
        id: "external-task",
        title: "外部事项"
      },
      view: "month"
    });
  });

  it("会按 editable 策略映射事件并归一化 event-change", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        view: "week",
        editable: false,
        events: [
          {
            id: "readonly",
            title: "只读排期",
            start: "2026-03-24T09:00:00",
            end: "2026-03-24T10:00:00"
          },
          {
            id: "editable",
            title: "可调整排期",
            start: "2026-03-24T10:00:00",
            end: "2026-03-24T11:00:00",
            editable: true
          }
        ]
      }
    });

    await waitForCalendarRender();

    const calendar = wrapper.findComponent(FullCalendar as never) as any;
    const options = calendar.props("options") as CalendarOptions;
    const events = options.events as EventInput[];

    expect(events[0]?.editable).toBe(false);
    expect(events[1]?.editable).toBe(true);

    const revert = vi.fn();

    (options.eventChange as ((arg: EventChangeArg) => void) | undefined)?.({
      event: {
        id: "editable",
        title: "可调整排期",
        start: new Date("2026-03-24T12:00:00"),
        end: new Date("2026-03-24T13:00:00"),
        startStr: "2026-03-24T12:00:00",
        endStr: "2026-03-24T13:00:00",
        allDay: false,
        classNames: ["is-important"],
        extendedProps: {
          owner: "运营"
        }
      },
      oldEvent: {
        id: "editable",
        title: "可调整排期",
        start: new Date("2026-03-24T10:00:00"),
        end: new Date("2026-03-24T11:00:00"),
        startStr: "2026-03-24T10:00:00",
        endStr: "2026-03-24T11:00:00",
        allDay: false,
        classNames: [],
        extendedProps: {}
      },
      relatedEvents: [],
      revert
    } as unknown as EventChangeArg);

    await nextTick();

    expect(wrapper.emitted("event-change")?.[0]?.[0]).toMatchObject({
      view: "week",
      event: {
        id: "editable",
        start: "2026-03-24T12:00:00",
        end: "2026-03-24T13:00:00"
      },
      oldEvent: {
        start: "2026-03-24T10:00:00"
      }
    });
  });

  it("重复事件实例的归一化负载会保留 sourceId", async () => {
    const wrapper = mount(XyScheduler, {
      attachTo: document.body,
      props: {
        view: "week",
        editable: true,
        events: [
          {
            id: "weekly-sync",
            title: "双周同步会",
            start: "2026-03-24T09:30:00",
            rrule: {
              freq: "weekly",
              byweekday: ["mo", "we"],
              dtstart: "2026-03-24T09:30:00"
            },
            duration: "00:30",
            editable: true
          }
        ]
      }
    });

    await waitForCalendarRender();

    const calendar = wrapper.findComponent(FullCalendar as never) as any;
    const options = calendar.props("options") as CalendarOptions;

    (options.eventChange as ((arg: EventChangeArg) => void) | undefined)?.({
      event: {
        id: "weekly-sync__1774344600000__0",
        title: "双周同步会",
        start: new Date("2026-03-25T10:00:00"),
        end: new Date("2026-03-25T10:30:00"),
        startStr: "2026-03-25T10:00:00",
        endStr: "2026-03-25T10:30:00",
        allDay: false,
        classNames: [],
        extendedProps: {
          schedulerSourceId: "weekly-sync",
          schedulerOccurrenceStart: "2026-03-25T10:00:00"
        }
      },
      oldEvent: {
        id: "weekly-sync__1774344600000__0",
        title: "双周同步会",
        start: new Date("2026-03-24T09:30:00"),
        end: new Date("2026-03-24T10:00:00"),
        startStr: "2026-03-24T09:30:00",
        endStr: "2026-03-24T10:00:00",
        allDay: false,
        classNames: [],
        extendedProps: {
          schedulerSourceId: "weekly-sync",
          schedulerOccurrenceStart: "2026-03-24T09:30:00"
        }
      },
      relatedEvents: [],
      revert: vi.fn()
    } as unknown as EventChangeArg);

    await nextTick();

    expect(wrapper.emitted("event-change")?.[0]?.[0]).toMatchObject({
      event: {
        id: "weekly-sync__1774344600000__0",
        sourceId: "weekly-sync",
        occurrenceStart: "2026-03-25T10:00:00"
      },
      oldEvent: {
        sourceId: "weekly-sync",
        occurrenceStart: "2026-03-24T09:30:00"
      }
    });
  });
});
