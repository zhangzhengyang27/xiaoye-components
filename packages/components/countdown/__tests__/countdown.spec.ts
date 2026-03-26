import dayjs from "dayjs";
import { mount } from "@vue/test-utils";
import { h, nextTick, ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Countdown from "../src/countdown.vue";

describe("XyCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-26T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("支持基础倒计时渲染", async () => {
    const wrapper = mount(Countdown, {
      props: {
        title: "距离发布",
        value: Date.now() + 1000 * 60
      }
    });

    await nextTick();

    expect(wrapper.get(".xy-statistic__head").text()).toBe("距离发布");
    expect(wrapper.get(".xy-statistic__value").text()).toBe("00:01:00");
  });

  it("支持 number Date dayjs 三种 value 输入", async () => {
    const numberWrapper = mount(Countdown, {
      props: {
        value: Date.now() + 1000 * 60
      }
    });
    const dateWrapper = mount(Countdown, {
      props: {
        value: new Date(Date.now() + 1000 * 60 * 60)
      }
    });
    const dayjsWrapper = mount(Countdown, {
      props: {
        value: dayjs().add(2, "hour")
      }
    });

    await nextTick();

    expect(numberWrapper.get(".xy-statistic__value").text()).toBe("00:01:00");
    expect(dateWrapper.get(".xy-statistic__value").text()).toBe("01:00:00");
    expect(dayjsWrapper.get(".xy-statistic__value").text()).toBe("02:00:00");
  });

  it.each([
    ["DD [days] HH:mm:ss", "02 days 02:02:02"],
    ["HH:mm:ss:SSS", "50:02:02:002"]
  ])("支持格式串 %s", async (format, expected) => {
    const wrapper = mount(Countdown, {
      props: {
        value: dayjs()
          .add(2, "day")
          .add(2, "hour")
          .add(2, "minute")
          .add(2, "second")
          .add(2, "millisecond"),
        format
      }
    });

    await nextTick();

    expect(wrapper.get(".xy-statistic__value").text()).toBe(expected);
  });

  it("会触发 change 事件", async () => {
    const onChange = vi.fn();
    const wrapper = mount(Countdown, {
      props: {
        value: Date.now() + 1000 * 60,
        onChange
      }
    });

    await nextTick();
    expect(onChange).toHaveBeenCalled();
    expect(typeof onChange.mock.calls.at(-1)?.[0]).toBe("number");
    expect(onChange.mock.calls.at(-1)?.[0]).toBeGreaterThan(0);
    wrapper.unmount();
  });

  it("finish 只会触发一次", async () => {
    const onFinish = vi.fn();
    const wrapper = mount(Countdown, {
      props: {
        value: Date.now() + 20,
        onFinish
      }
    });

    await nextTick();

    vi.advanceTimersByTime(100);

    expect(onFinish).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(wrapper.get(".xy-statistic__value").text()).toBe("00:00:00");
  });

  it("value 和 format 变化后会重启计时并刷新展示", async () => {
    const value = ref<number | Date | ReturnType<typeof dayjs>>(Date.now() + 1000 * 60);
    const format = ref("HH:mm:ss");
    const wrapper = mount(() =>
      h(Countdown, {
        value: value.value,
        format: format.value
      })
    );

    await nextTick();
    expect(wrapper.get(".xy-statistic__value").text()).toBe("00:01:00");

    value.value = dayjs().add(2, "hour");
    format.value = "HH [hours]";
    await nextTick();

    expect(wrapper.get(".xy-statistic__value").text()).toBe("02 hours");
  });

  it("卸载后会停止继续触发 change", async () => {
    const onChange = vi.fn();
    const wrapper = mount(Countdown, {
      props: {
        value: Date.now() + 1000 * 60,
        onChange
      }
    });

    await nextTick();
    wrapper.unmount();
    const callCount = onChange.mock.calls.length;

    vi.advanceTimersByTime(100);

    expect(onChange.mock.calls.length).toBe(callCount);
  });

  it("暴露 displayValue", async () => {
    const wrapper = mount(Countdown, {
      props: {
        value: Date.now() + 1000 * 60
      }
    });

    await nextTick();

    expect((wrapper.vm as { displayValue: string }).displayValue).toBe("00:01:00");
  });
});
