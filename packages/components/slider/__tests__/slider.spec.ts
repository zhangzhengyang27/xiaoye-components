import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XySlider } from "@xiaoye/components";

vi.mock("@iconify/vue", () => ({
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

function mockRunwayRect(wrapper: ReturnType<typeof mount>, rect: Partial<DOMRect>) {
  const runway = wrapper.get(".xy-slider__runway").element as HTMLElement;
  vi.spyOn(runway, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    width: 200,
    height: 24,
    top: 0,
    left: 0,
    bottom: 24,
    right: 200,
    toJSON: () => ({}),
    ...rect
  } as DOMRect);
}

describe("XySlider", () => {
  it("支持基础渲染和点击轨道更新", async () => {
    const value = ref(0);
    const wrapper = mount({
      components: { XySlider },
      setup() {
        return { value };
      },
      template: `<xy-slider v-model="value" />`
    });

    mockRunwayRect(wrapper, { width: 200, left: 0 });

    await wrapper.get(".xy-slider__runway").trigger("mousedown", {
      clientX: 100
    });

    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 100 }));
    await nextTick();

    expect(value.value).toBe(50);
  });

  it("支持范围选择并渲染双按钮", async () => {
    const value = ref<[number, number]>([20, 80]);
    const wrapper = mount({
      components: { XySlider },
      setup() {
        return { value };
      },
      template: `<xy-slider v-model="value" range />`
    });

    mockRunwayRect(wrapper, { width: 200, left: 0 });

    expect(wrapper.findAll(".xy-slider__thumb-wrapper")).toHaveLength(2);

    await wrapper.get(".xy-slider__runway").trigger("mousedown", {
      clientX: 60
    });
    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 60 }));
    await nextTick();

    expect(value.value).toEqual([30, 80]);
  });

  it("支持拖拽更新", async () => {
    const value = ref(0);
    const wrapper = mount({
      components: { XySlider },
      setup() {
        return { value };
      },
      template: `<xy-slider v-model="value" />`
    });

    mockRunwayRect(wrapper, { width: 200, left: 0 });

    await wrapper.get(".xy-slider__thumb-wrapper").trigger("mousedown", {
      clientX: 0
    });

    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 150 }));
    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 150 }));
    await nextTick();

    expect(value.value).toBe(75);
  });

  it("支持键盘控制", async () => {
    const wrapper = mount(XySlider, {
      props: {
        modelValue: 10
      }
    });

    const thumb = wrapper.get(".xy-slider__thumb-wrapper");

    await thumb.trigger("keydown", { key: "ArrowRight" });
    await thumb.trigger("keydown", { key: "PageUp" });
    await thumb.trigger("keydown", { key: "Home" });
    await thumb.trigger("keydown", { key: "End" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([11]);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([100]);
    expect(wrapper.emitted("change")?.at(-1)).toEqual([100]);
  });

  it("支持步长断点和步长吸附", async () => {
    const value = ref(20);
    const wrapper = mount({
      components: { XySlider },
      setup() {
        return { value };
      },
      template: `
        <xy-slider
          v-model="value"
          show-stops
          :step="10"
        />
      `
    });

    mockRunwayRect(wrapper, { width: 200, left: 0 });

    expect(wrapper.findAll(".xy-slider__stop").length).toBeGreaterThan(0);

    await wrapper.get(".xy-slider__runway").trigger("mousedown", {
      clientX: 130
    });
    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 130 }));
    await nextTick();

    expect(value.value).toBe(70);
  });

  it("支持 showInput 与输入框联动", async () => {
    const wrapper = mount(XySlider, {
      props: {
        modelValue: 20,
        showInput: true
      }
    });

    const input = wrapper.get(".xy-slider__input input");
    await input.setValue("40");
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([40]);
    expect(wrapper.emitted("change")?.at(-1)).toEqual([40]);
  });

  it("支持垂直模式", async () => {
    const value = ref(0);
    const wrapper = mount({
      components: { XySlider },
      setup() {
        return { value };
      },
      template: `<xy-slider v-model="value" vertical height="200px" />`
    });

    mockRunwayRect(wrapper, { height: 200, bottom: 200, top: 0 });

    await wrapper.get(".xy-slider__runway").trigger("mousedown", {
      clientY: 100
    });
    window.dispatchEvent(new MouseEvent("mouseup", { clientY: 100 }));
    await nextTick();

    expect(value.value).toBe(50);
    expect(wrapper.classes()).toContain("is-vertical");
  });

  it("禁用状态下不会响应交互", async () => {
    const wrapper = mount(XySlider, {
      props: {
        modelValue: 10,
        disabled: true
      }
    });

    await wrapper.get(".xy-slider__runway").trigger("mousedown", {
      clientX: 100
    });

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("在表单中复用 id 并同步表单值", async () => {
    const model = reactive({
      volume: 50
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XySlider
      },
      setup() {
        return {
          model,
          rules: {
            volume: [
              {
                trigger: "change" as const,
                validator: (_rule: unknown, value: number) =>
                  value >= 60 ? Promise.resolve() : Promise.reject(new Error("请至少设置到 60"))
              }
            ]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="音量" prop="volume">
            <xy-slider v-model="model.volume" data-test="slider" />
          </xy-form-item>
        </xy-form>
      `
    });

    mockRunwayRect(wrapper, { width: 200, left: 0 });

    const slider = wrapper.get('[data-test="slider"]');
    const label = wrapper.get(".xy-form-item__label");

    await slider.get(".xy-slider__runway").trigger("mousedown", {
      clientX: 40
    });
    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 40 }));
    await nextTick();

    expect(label.attributes("for")).toBe(slider.get(".xy-slider__thumb-wrapper").attributes("id"));
    expect(model.volume).toBe(20);
  });
});
