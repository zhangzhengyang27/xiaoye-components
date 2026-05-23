import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyTimeSelect } from "@xiaoye/components";

const mountedWrappers: VueWrapper[] = [];

function mountTimeSelect(...args: Parameters<typeof mount>) {
  const wrapper = mount(...args);
  mountedWrappers.push(wrapper);
  return wrapper;
}

async function flushAsyncUpdates() {
  await Promise.resolve();
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

afterEach(() => {
  mountedWrappers.forEach((wrapper) => wrapper.unmount());
  mountedWrappers.length = 0;
  document.body.innerHTML = "";
});

describe("XyTimeSelect", () => {
  it("支持打开下拉并选择时间", async () => {
    const wrapper = mountTimeSelect(XyTimeSelect, {
      attachTo: document.body
    });

    await wrapper.find(".xy-time-select__trigger").trigger("click");
    await nextTick();

    const dropdown = document.body.querySelector(".xy-time-select__dropdown") as HTMLElement | null;
    expect(dropdown?.querySelector(".xy-popper__arrow")).not.toBeNull();
    expect(dropdown?.getAttribute("data-placement")).toContain("bottom");

    const options = document.body.querySelectorAll(".xy-time-select__option");
    (options[0] as HTMLButtonElement | undefined)?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["09:00"]);
    expect(wrapper.emitted("change")?.[0]).toEqual(["09:00"]);
  });

  it("默认时间下拉风格保持克制且仍可正常打开", async () => {
    const wrapper = mountTimeSelect(XyTimeSelect, {
      attachTo: document.body
    });

    expect(wrapper.find(".xy-time-select__trigger").exists()).toBe(true);

    await wrapper.find(".xy-time-select__trigger").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".xy-time-select__dropdown")).not.toBeNull();
  });

  it("支持 minTime/maxTime、includeEndTime 和 format", async () => {
    const wrapper = mountTimeSelect(XyTimeSelect, {
      attachTo: document.body,
      props: {
        start: "08:00",
        end: "09:00",
        step: "00:30",
        minTime: "08:30",
        maxTime: "09:00",
        includeEndTime: true,
        format: "hh:mm A"
      }
    });

    await wrapper.find(".xy-time-select__trigger").trigger("click");

    const options = [...document.body.querySelectorAll(".xy-time-select__option")] as HTMLButtonElement[];

    expect(options.map((option) => option.textContent?.trim())).toEqual([
      "08:00 AM",
      "08:30 AM",
      "09:00 AM"
    ]);
    expect(options[0]?.disabled).toBe(true);
    expect(options[2]?.disabled).toBe(false);

    options[2]?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["09:00 AM"]);
  });

  it("支持自定义 popup 容器、类名、样式和 placement", async () => {
    const appendTarget = document.createElement("div");
    appendTarget.className = "time-select-target";
    document.body.appendChild(appendTarget);

    const wrapper = mountTimeSelect(XyTimeSelect, {
      attachTo: document.body,
      props: {
        appendTo: ".time-select-target",
        placement: "top-start",
        popperClass: "custom-time-select-dropdown",
        popperStyle: {
          width: "280px"
        }
      }
    });

    await wrapper.find(".xy-time-select__trigger").trigger("click");
    await nextTick();

    const dropdown = appendTarget.querySelector(".custom-time-select-dropdown") as HTMLElement | null;
    expect(dropdown).not.toBeNull();
    expect(dropdown?.classList.contains("xy-time-select__dropdown")).toBe(true);
    expect(dropdown?.style.width).toBe("280px");
    expect(dropdown?.getAttribute("data-placement")).toContain("top");
  });

  it("在 teleported=false 时将下拉保留在当前容器内", async () => {
    const wrapper = mountTimeSelect(XyTimeSelect, {
      attachTo: document.body,
      props: {
        teleported: false,
        popperClass: "inline-time-select-dropdown"
      }
    });

    await wrapper.find(".xy-time-select__trigger").trigger("click");
    await nextTick();

    expect(wrapper.find(".inline-time-select-dropdown").exists()).toBe(true);
    expect(document.body.querySelector(".inline-time-select-dropdown")).not.toBeNull();
  });

  it("支持清空当前值", async () => {
    const wrapper = mountTimeSelect(XyTimeSelect, {
      props: {
        modelValue: "10:30",
        clearable: true
      }
    });

    await wrapper.find(".xy-time-select__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
    expect(wrapper.emitted("clear")).toHaveLength(1);
  });

  it("非法时间字符串时保持 placeholder 且不展示清空按钮", () => {
    const wrapper = mountTimeSelect(XyTimeSelect, {
      props: {
        modelValue: "invalid",
        clearable: true,
        placeholder: "请选择时间"
      }
    });

    expect(wrapper.find(".xy-time-select__selection").text()).toBe("请选择时间");
    expect(wrapper.find(".xy-time-select__selection").classes()).toContain("is-placeholder");
    expect(wrapper.find(".xy-time-select__clear").exists()).toBe(false);
  });

  it("支持 expose 方法和表单 change 校验", async () => {
    const model = reactive({
      startAt: null as string | null
    });

    const wrapper = mountTimeSelect(
      defineComponent({
        components: {
          XyForm,
          XyFormItem,
          XyTimeSelect
        },
        setup() {
          return {
            model,
            rules: {
              startAt: [{ required: true, message: "请选择开始时间", trigger: "change" as const }]
            }
          };
        },
        template: `
          <xy-form :model="model" :rules="rules">
            <xy-form-item ref="item" label="开始时间" prop="startAt">
              <xy-time-select ref="timeSelect" v-model="model.startAt" clearable />
            </xy-form-item>
          </xy-form>
        `
      }),
      {
        attachTo: document.body
      }
    );

    const item = wrapper.getComponent({ ref: "item" }).vm as {
      validate: (trigger?: "change") => Promise<boolean>;
    };
    const timeSelect = wrapper.getComponent({ ref: "timeSelect" }).vm as {
      focus: () => void;
      blur: () => Promise<void>;
      open: () => Promise<void>;
      close: () => Promise<void>;
    };

    await item.validate("change");
    expect(wrapper.text()).toContain("请选择开始时间");

    timeSelect.focus();
    await timeSelect.open();

    const options = document.body.querySelectorAll(".xy-time-select__option");
    (options[1] as HTMLButtonElement | undefined)?.click();
    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain("请选择开始时间");

    await timeSelect.open();
    expect(document.body.querySelector(".xy-time-select__dropdown")).not.toBeNull();

    await timeSelect.close();
    await nextTick();
    expect(document.body.querySelector(".xy-time-select__dropdown")).toBeNull();
  });
});
