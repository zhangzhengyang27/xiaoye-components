import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, reactive, ref } from "vue";
import { XyForm, XyFormItem, XyRadio, XyRadioButton, XyRadioGroup } from "@xiaoye/components";

describe("XyRadio", () => {
  it("支持单个 radio 的 v-model 更新", async () => {
    const value = ref<string | number | boolean>("manual");

    const wrapper = mount(() =>
      h(XyRadio, {
        modelValue: value.value,
        value: "api",
        label: "API",
        "onUpdate:modelValue": (nextValue) => {
          value.value = nextValue;
        }
      })
    );

    await wrapper.get('input[type="radio"]').setValue(true);
    await nextTick();

    expect(value.value).toBe("api");
    expect(wrapper.classes()).toContain("is-checked");
  });

  it("支持 disabled 和 border 状态", async () => {
    const wrapper = mount(XyRadio, {
      props: {
        modelValue: "manual",
        value: "api",
        label: "API",
        disabled: true,
        border: true
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.classes()).toContain("is-bordered");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("支持 radio-group 插槽用法和 change 事件", async () => {
    const value = ref<string | number | boolean>("design");
    const changed = ref<string | number | boolean>("");

    const wrapper = mount(() =>
      h(
        XyRadioGroup,
        {
          modelValue: value.value,
          onChange: (nextValue) => {
            changed.value = nextValue;
          },
          "onUpdate:modelValue": (nextValue) => {
            value.value = nextValue;
          }
        },
        {
          default: () => [
            h(XyRadio, { value: "design" }, () => "设计规范"),
            h(XyRadio, { value: "develop" }, () => "开发规范")
          ]
        }
      )
    );

    const secondRadio = wrapper.findAll(".xy-radio")[1];
    await secondRadio.get('input[type="radio"]').setValue(true);
    await nextTick();

    expect(value.value).toBe("develop");
    expect(changed.value).toBe("develop");
    expect(secondRadio.classes()).toContain("is-checked");
  });

  it("支持 options 快速渲染和纵向布局", async () => {
    const wrapper = mount(XyRadioGroup, {
      props: {
        modelValue: "api",
        direction: "vertical",
        options: [
          { label: "API", value: "api", description: "适合服务间调用和系统集成。" },
          { label: "SDK", value: "sdk", disabled: true }
        ]
      }
    });

    expect(wrapper.classes()).toContain("xy-radio-group--vertical");
    expect(wrapper.findAll(".xy-radio")).toHaveLength(2);
    expect(wrapper.findAll(".xy-radio")[1].classes()).toContain("is-disabled");
    expect(wrapper.text()).toContain("适合服务间调用和系统集成。");

    await wrapper.findAll(".xy-radio")[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("在表单内支持 change 校验", async () => {
    const model = reactive({
      role: ""
    });

    const wrapper = mount(
      defineComponent({
        components: {
          XyForm,
          XyFormItem,
          XyRadio,
          XyRadioGroup
        },
        setup() {
          return {
            model,
            rules: {
              role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
            }
          };
        },
        template: `
          <xy-form :model="model" :rules="rules">
            <xy-form-item ref="item" label="角色" prop="role">
              <xy-radio-group v-model="model.role">
                <xy-radio value="owner">Owner</xy-radio>
                <xy-radio value="viewer">Viewer</xy-radio>
              </xy-radio-group>
            </xy-form-item>
          </xy-form>
        `
      })
    );

    const item = wrapper.getComponent({ ref: "item" }).vm as {
      validate: (trigger?: "change") => Promise<boolean>;
    };

    await item.validate("change");
    expect(wrapper.text()).toContain("请选择角色");

    await wrapper.find('.xy-radio input[type="radio"]').setValue(true);
    await nextTick();
    await nextTick();

    expect(wrapper.text()).not.toContain("请选择角色");
  });

  it("支持 radio-button 按钮化单选和自定义激活色", async () => {
    const value = ref<string | number | boolean>("day");

    const wrapper = mount(() =>
      h(
        XyRadioGroup,
        {
          modelValue: value.value,
          fill: "#0f766e",
          textColor: "#f8fafc",
          "onUpdate:modelValue": (nextValue) => {
            value.value = nextValue;
          }
        },
        {
          default: () => [
            h(XyRadioButton, { value: "day" }, () => "按天"),
            h(XyRadioButton, { value: "week" }, () => "按周"),
            h(XyRadioButton, { value: "month", disabled: true }, () => "按月")
          ]
        }
      )
    );

    const buttons = wrapper.findAll(".xy-radio-button");
    await buttons[1].get('input[type="radio"]').setValue(true);
    await nextTick();

    expect(value.value).toBe("week");
    expect(buttons[1].classes()).toContain("is-active");
    expect(buttons[1].get(".xy-radio-button__inner").attributes("style")).toContain(
      "background-color: rgb(15, 118, 110)"
    );

    await buttons[2].trigger("click");
    expect(value.value).toBe("week");
  });

  it("支持 options + type=button 的按钮化渲染", async () => {
    const value = ref<string | number | boolean>("api");

    const wrapper = mount(XyRadioGroup, {
      props: {
        modelValue: value.value,
        type: "button",
        fill: "#1d4ed8",
        textColor: "#f8fafc",
        options: [
          { label: "API", value: "api", description: "系统集成" },
          { label: "OAuth", value: "oauth" },
          { label: "Legacy", value: "legacy", disabled: true }
        ],
        "onUpdate:modelValue": (nextValue: string | number | boolean) => {
          value.value = nextValue;
        }
      }
    });

    const buttons = wrapper.findAll(".xy-radio-button");
    expect(wrapper.classes()).toContain("xy-radio-group--button");
    expect(buttons).toHaveLength(3);

    await buttons[1].get('input[type="radio"]').setValue(true);
    await wrapper.setProps({
      modelValue: value.value
    });
    await nextTick();

    expect(value.value).toBe("oauth");
    expect(buttons[1].classes()).toContain("is-active");
    expect(wrapper.text()).toContain("系统集成");
  });

  it("支持 options 模式下通过 option 插槽自定义内容", async () => {
    const value = ref<string | number | boolean>("stable");

    const wrapper = mount(XyRadioGroup, {
      props: {
        modelValue: value.value,
        direction: "vertical",
        options: [
          {
            label: "稳定版",
            value: "stable",
            description: "适合大多数正式环境"
          },
          {
            label: "预览版",
            value: "preview",
            description: "包含最新交互和实验特性"
          }
        ],
        "onUpdate:modelValue": (nextValue: string | number | boolean) => {
          value.value = nextValue;
        }
      },
      slots: {
        option: ({
          option,
          checked
        }: {
          option: { label: string; description?: string };
          checked: boolean;
        }) =>
          h("div", { class: "slot-option" }, [
            h("strong", option.label),
            h("span", checked ? "当前" : option.description)
          ])
      }
    });

    expect(wrapper.findAll(".slot-option")).toHaveLength(2);
    expect(wrapper.text()).toContain("当前");
    expect(wrapper.text()).toContain("包含最新交互和实验特性");

    await wrapper.findAll('.xy-radio input[type="radio"]')[1].setValue(true);
    await wrapper.setProps({
      modelValue: value.value
    });
    await nextTick();

    expect(value.value).toBe("preview");
  });
});
