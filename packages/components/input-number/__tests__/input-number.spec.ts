import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyInputNumber } from "@xiaoye/components";

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

describe("XyInputNumber", () => {
  it("支持按钮增减和 v-model 更新", async () => {
    const wrapper = mount(XyInputNumber, {
      props: {
        modelValue: 1
      }
    });

    await wrapper.get(".xy-input-number__increase").trigger("click");
    await wrapper.get(".xy-input-number__decrease").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([2]);
    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([1]);
    expect(wrapper.emitted("change")?.[0]).toEqual([2, 1]);
  });

  it("支持 min/max 和 step", async () => {
    const wrapper = mount(XyInputNumber, {
      props: {
        modelValue: 2,
        min: 0,
        max: 4,
        step: 2
      }
    });

    await wrapper.get(".xy-input-number__increase").trigger("click");
    await wrapper.get(".xy-input-number__increase").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([4]);
    expect(wrapper.emitted("update:modelValue")).toHaveLength(1);

    await wrapper.setProps({
      modelValue: 4
    });

    await wrapper.get(".xy-input-number__decrease").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[1]).toEqual([2]);
  });

  it("支持 stepStrictly 和 precision 校正", async () => {
    const wrapper = mount(XyInputNumber, {
      props: {
        modelValue: 0,
        step: 0.1,
        stepStrictly: true,
        precision: 2
      }
    });

    const input = wrapper.get("input");

    await input.setValue("0.26");
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([0.3]);
    await wrapper.setProps({
      modelValue: 0.3
    });

    expect((input.element as HTMLInputElement).value).toBe("0.30");
  });

  it("支持 controls-position、align 和 disabledScientific", async () => {
    const wrapper = mount(XyInputNumber, {
      props: {
        modelValue: 1,
        controlsPosition: "right",
        align: "right",
        disabledScientific: true
      }
    });

    const input = wrapper.get("input");
    const keydown = new KeyboardEvent("keydown", {
      key: "e",
      cancelable: true
    });
    const prevented = vi.spyOn(keydown, "preventDefault");

    input.element.dispatchEvent(keydown);

    expect(prevented).toHaveBeenCalledTimes(1);
    expect(wrapper.classes()).toContain("is-controls-right");
    expect(wrapper.classes()).toContain("is-right");
  });

  it("支持清空策略和失焦回写", async () => {
    const wrapper = mount(XyInputNumber, {
      props: {
        modelValue: 8,
        min: 2,
        valueOnClear: "min"
      }
    });

    const input = wrapper.get("input");

    await input.setValue("");
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2]);
    expect(wrapper.emitted("change")?.at(-1)).toEqual([2, 8]);
  });

  it("禁用和只读状态下不会触发增减", async () => {
    const disabledWrapper = mount(XyInputNumber, {
      props: {
        modelValue: 1,
        disabled: true
      }
    });

    await disabledWrapper.get(".xy-input-number__increase").trigger("click");
    expect(disabledWrapper.emitted("update:modelValue")).toBeUndefined();

    const readonlyWrapper = mount(XyInputNumber, {
      props: {
        modelValue: 1,
        readonly: true
      }
    });

    await readonlyWrapper.get(".xy-input-number__increase").trigger("click");
    expect(readonlyWrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("在表单中触发 change 和 blur 校验", async () => {
    const model = reactive({
      amount: null as number | null
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInputNumber
      },
      setup() {
        return {
          model,
          rules: {
            amount: [{ required: true, message: "请输入数量", trigger: "change" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="数量" prop="amount">
            <xy-input-number v-model="model.amount" />
          </xy-form-item>
        </xy-form>
      `
    });

    const input = wrapper.get("input");

    await input.setValue("");
    await input.trigger("change");

    expect(wrapper.text()).toContain("请输入数量");
  });

  it("在 change 校验失败后，输入合法值并确认会清除错误", async () => {
    const model = reactive({
      amount: null as number | null
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInputNumber
      },
      setup() {
        return {
          model,
          rules: {
            amount: [{ required: true, message: "请输入数量", trigger: "change" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="数量" prop="amount">
            <xy-input-number v-model="model.amount" />
          </xy-form-item>
        </xy-form>
      `
    });

    const input = wrapper.get("input");

    await input.setValue("");
    await input.trigger("change");
    await nextTick();
    expect(wrapper.text()).toContain("请输入数量");

    await input.setValue("50");
    await input.trigger("change");
    await nextTick();

    expect(model.amount).toBe(50);
    expect(wrapper.text()).not.toContain("请输入数量");
  });

  it("在 blur 校验失败后，输入合法值并失焦会清除错误", async () => {
    const model = reactive({
      ratio: null as number | null
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInputNumber
      },
      setup() {
        return {
          model,
          rules: {
            ratio: [{ required: true, message: "请输入比例", trigger: "blur" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="比例" prop="ratio">
            <xy-input-number v-model="model.ratio" :precision="2" :step="0.05" />
          </xy-form-item>
        </xy-form>
      `
    });

    const input = wrapper.get("input");

    await input.trigger("focus");
    await input.setValue("");
    await input.trigger("blur");
    await nextTick();
    expect(wrapper.text()).toContain("请输入比例");

    await input.trigger("focus");
    await input.setValue("0.25");
    await input.trigger("blur");
    await nextTick();

    expect(model.ratio).toBe(0.25);
    expect(wrapper.text()).not.toContain("请输入比例");
  });
});
