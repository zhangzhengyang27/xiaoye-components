import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, reactive, ref, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyRate } from "@xiaoye/components";

describe("XyRate", () => {
  it("按 max 渲染评分项", () => {
    const wrapper = mount(XyRate, {
      props: {
        max: 7
      }
    });

    expect(wrapper.findAll(".xy-rate__item")).toHaveLength(7);
  });

  it("支持点击选中", async () => {
    const value = ref(0);
    const wrapper = mount({
      components: { XyRate },
      setup() {
        return {
          value
        };
      },
      template: `<xy-rate v-model="value" />`
    });

    await wrapper.findAll(".xy-rate__item")[2]?.trigger("click");

    expect(value.value).toBe(3);
  });

  it("支持 clearable 清空当前值", async () => {
    const value = ref(4);
    const wrapper = mount({
      components: { XyRate },
      setup() {
        return {
          value
        };
      },
      template: `<xy-rate v-model="value" clearable />`
    });

    await wrapper.findAll(".xy-rate__item")[3]?.trigger("click");
    expect(value.value).toBe(0);
  });

  it("支持半星预览和提交", async () => {
    const value = ref(0);
    const wrapper = mount({
      components: { XyRate },
      setup() {
        return {
          value
        };
      },
      template: `<xy-rate v-model="value" allow-half />`
    });

    const secondItem = wrapper.findAll(".xy-rate__item")[1];
    Object.defineProperty(secondItem.element, "getBoundingClientRect", {
      value: () => ({
        width: 20,
        left: 0
      })
    });

    await secondItem.trigger("mousemove", {
      clientX: 5
    });
    await secondItem.trigger("click");

    expect(value.value).toBe(1.5);
  });

  it("支持键盘增减", async () => {
    const wrapper = mount(XyRate, {
      props: {
        modelValue: 2
      }
    });

    await wrapper.trigger("keydown", {
      key: "ArrowRight"
    });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([3]);
    expect(wrapper.emitted("change")?.[0]).toEqual([3]);
  });

  it("支持文本、分数模板和颜色变量", () => {
    const textWrapper = mount(XyRate, {
      props: {
        modelValue: 4,
        showText: true,
        texts: ["1", "2", "3", "4", "5"]
      }
    });

    expect(textWrapper.get(".xy-rate__text").text()).toBe("4");

    const scoreWrapper = mount(XyRate, {
      props: {
        modelValue: 3.5,
        allowHalf: true,
        showScore: true,
        scoreTemplate: "{value} 分",
        colors: ["#94a3b8", "#fbbf24", "#f97316"]
      }
    });

    expect(scoreWrapper.get(".xy-rate__text").text()).toBe("3.5 分");
    expect(
      (scoreWrapper.element as HTMLElement).style.getPropertyValue("--xy-rate-fill-color")
    ).toBe("#fbbf24");
  });

  it("禁用时不响应交互", async () => {
    const wrapper = mount(XyRate, {
      props: {
        modelValue: 2,
        disabled: true
      }
    });

    await wrapper.findAll(".xy-rate__item")[3]?.trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("在表单中触发 change 校验并复用表单生成的 id", async () => {
    const model = reactive({
      level: 1
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyRate
      },
      setup() {
        return {
          model,
          rules: {
            level: [{ required: true, type: "number", min: 1, message: "请给出评分", trigger: "change" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item label="服务评分" prop="level">
            <xy-rate v-model="model.level" clearable data-test="rate" />
          </xy-form-item>
        </xy-form>
      `
    });

    const rate = wrapper.get('[data-test="rate"]');
    const label = wrapper.get(".xy-form-item__label");

    await rate.findAll(".xy-rate__item")[0]?.trigger("click");
    await nextTick();

    expect(rate.attributes("id")).toBeTruthy();
    expect(label.attributes("for")).toBe(rate.attributes("id"));
    expect(wrapper.text()).toContain("请给出评分");

    await rate.findAll(".xy-rate__item")[3]?.trigger("click");
    await nextTick();

    expect(wrapper.text()).not.toContain("请给出评分");
  });
});
