import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyTimeSelect } from "@xiaoye/components";

vi.mock("@iconify/vue", () => ({
  addCollection: vi.fn(),
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

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
