import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick, reactive } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyTimePicker } from "@xiaoye/components";

function queryLast<T extends Element>(selector: string) {
  return document.body.querySelectorAll(selector).item(
    document.body.querySelectorAll(selector).length - 1
  ) as T | null;
}

function queryLastFooterAction(index: number) {
  const footer = queryLast<HTMLElement>(".xy-time-picker__footer");
  return footer?.querySelectorAll(".xy-time-picker__action").item(index) as HTMLButtonElement | null;
}

const mountedWrappers: VueWrapper[] = [];

function mountTimePicker(...args: Parameters<typeof mount>) {
  const wrapper = mount(...args);
  mountedWrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  mountedWrappers.forEach((wrapper) => wrapper.unmount());
  mountedWrappers.length = 0;
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("XyTimePicker", () => {
  it("支持打开面板并选择单个时间", async () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      attachTo: document.body
    });

    await wrapper.get(".xy-time-picker__trigger").trigger("click");

    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="hour"][data-time-value="09"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="minute"][data-time-value="30"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="second"][data-time-value="15"]'
    ))?.click();
    queryLast<HTMLButtonElement>(".xy-time-picker__action--primary")?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["09:30:15"]);
    expect(wrapper.emitted("change")?.[0]).toEqual(["09:30:15"]);
  });

  it("支持清空选中值", async () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      props: {
        modelValue: "10:20:30",
        clearable: true
      }
    });

    await wrapper.get(".xy-time-picker__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
    expect(wrapper.emitted("clear")).toBeTruthy();
    expect(wrapper.find(".xy-time-picker__actions").exists()).toBe(true);
  });

  it("支持 HH:mm 格式", async () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      attachTo: document.body,
      props: {
        format: "HH:mm"
      }
    });

    await wrapper.get(".xy-time-picker__trigger").trigger("click");
    expect(document.body.querySelectorAll('[data-time-unit="second"]').length).toBe(0);

    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="hour"][data-time-value="08"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="minute"][data-time-value="45"]'
    ))?.click();
    queryLast<HTMLButtonElement>(".xy-time-picker__action--primary")?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["08:45"]);
  });

  it("支持范围选择", async () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      attachTo: document.body,
      props: {
        isRange: true,
        format: "HH:mm"
      }
    });

    await wrapper.get(".xy-time-picker__trigger").trigger("click");

    (queryLast<HTMLButtonElement>(
      '[data-time-section="start"][data-time-unit="hour"][data-time-value="09"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="start"][data-time-unit="minute"][data-time-value="15"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="end"][data-time-unit="hour"][data-time-value="18"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="end"][data-time-unit="minute"][data-time-value="40"]'
    ))?.click();
    queryLast<HTMLButtonElement>(".xy-time-picker__action--primary")?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["09:15", "18:40"]]);
  });

  it("空范围值时保持 placeholder 且不展示清空按钮", () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      props: {
        isRange: true,
        modelValue: ["", ""],
        clearable: true
      }
    });

    const values = wrapper.findAll(".xy-time-picker__value");
    expect(values[0]?.classes()).toContain("is-placeholder");
    expect(values[1]?.classes()).toContain("is-placeholder");
    expect(wrapper.find(".xy-time-picker__clear").exists()).toBe(false);
  });

  it("范围值任一侧有内容时仍展示清空按钮", () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      props: {
        isRange: true,
        modelValue: ["09:15", ""],
        clearable: true,
        format: "HH:mm"
      }
    });

    expect(wrapper.find(".xy-time-picker__clear").exists()).toBe(true);
  });

  it("支持禁用时间项", async () => {
    const wrapper = mountTimePicker(XyTimePicker, {
      attachTo: document.body,
      props: {
        disabledHours: () => Array.from({ length: 23 }, (_, index) => index)
      }
    });

    await wrapper.get(".xy-time-picker__trigger").trigger("click");

    const disabledHour = queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="hour"][data-time-value="08"]'
    );
    const enabledHour = queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="hour"][data-time-value="23"]'
    );

    expect(disabledHour?.disabled).toBe(true);
    expect(enabledHour?.disabled).toBe(false);
  });

  it("点击现在会立即回写当前时间", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-24T14:25:36"));

    const wrapper = mountTimePicker(XyTimePicker, {
      attachTo: document.body
    });

    await wrapper.get(".xy-time-picker__trigger").trigger("click");
    queryLastFooterAction(0)?.click();
    await Promise.resolve();
    await nextTick();
    await Promise.resolve();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["14:25:36"]);
    expect(wrapper.emitted("change")?.[0]).toEqual(["14:25:36"]);
    expect(wrapper.find(".xy-time-picker__trigger").text()).toContain("14:25:36");
    expect(document.body.querySelector(".xy-time-picker__panel")).toBeNull();
  });

  it("在表单中复用 id 并同步值", async () => {
    const model = reactive({
      alarm: null as string | null
    });

    const wrapper = mountTimePicker({
      attachTo: document.body,
      components: {
        XyForm,
        XyFormItem,
        XyTimePicker
      },
      setup() {
        return {
          model
        };
      },
      template: `
        <xy-form :model="model">
          <xy-form-item label="提醒时间" prop="alarm">
            <xy-time-picker v-model="model.alarm" data-test="time-picker" />
          </xy-form-item>
        </xy-form>
      `
    });

    const picker = wrapper.get('[data-test="time-picker"]');
    const label = wrapper.get(".xy-form-item__label");

    await picker.get(".xy-time-picker__trigger").trigger("click");
    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="hour"][data-time-value="11"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="minute"][data-time-value="20"]'
    ))?.click();
    (queryLast<HTMLButtonElement>(
      '[data-time-section="single"][data-time-unit="second"][data-time-value="00"]'
    ))?.click();
    queryLast<HTMLButtonElement>(".xy-time-picker__action--primary")?.click();
    await nextTick();

    expect(label.attributes("for")).toBe(picker.get(".xy-time-picker__trigger").attributes("id"));
    expect(model.alarm).toBe("11:20:00");
  });
});
