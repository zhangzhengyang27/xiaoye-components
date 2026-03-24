import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive, ref } from "vue";
import { describe, expect, it } from "vitest";
import { XyCheckbox, XyCheckboxButton, XyCheckboxGroup, XyForm, XyFormItem } from "@xiaoye/components";

describe("XyCheckbox", () => {
  it("支持单个 checkbox 的 v-model 更新", async () => {
    const value = ref(false);

    const wrapper = mount(() =>
      h(XyCheckbox, {
        modelValue: value.value,
        label: "启用",
        "onUpdate:modelValue": (nextValue) => {
          value.value = nextValue as boolean;
        }
      })
    );

    await wrapper.get('input[type="checkbox"]').setValue(true);
    await nextTick();

    expect(value.value).toBe(true);
    expect(wrapper.classes()).toContain("is-checked");
  });

  it("支持 trueValue 和 falseValue", async () => {
    const value = ref<"open" | "close">("close");

    const wrapper = mount(() =>
      h(XyCheckbox, {
        modelValue: value.value,
        trueValue: "open",
        falseValue: "close",
        label: "切换",
        "onUpdate:modelValue": (nextValue) => {
          value.value = nextValue as "open" | "close";
        }
      })
    );

    await wrapper.get('input[type="checkbox"]').setValue(true);
    await nextTick();
    expect(value.value).toBe("open");

    await wrapper.get('input[type="checkbox"]').setValue(false);
    await nextTick();
    expect(value.value).toBe("close");
  });

  it("支持 disabled 和 border", async () => {
    const wrapper = mount(XyCheckbox, {
      props: {
        modelValue: false,
        label: "启用",
        disabled: true,
        border: true
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.classes()).toContain("is-bordered");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("支持 aria-label 和 aria-controls", () => {
    const wrapper = mount(XyCheckbox, {
      props: {
        modelValue: false,
        ariaLabel: "星标项目",
        ariaControls: "star-panel"
      }
    });

    const input = wrapper.get('input[type="checkbox"]');

    expect(input.attributes("aria-label")).toBe("星标项目");
    expect(input.attributes("aria-controls")).toBe("star-panel");
  });

  it("支持 checkbox-group 插槽用法和 change 事件", async () => {
    const values = ref<Array<string | number | boolean>>([]);
    const changed = ref<Array<string | number | boolean>>([]);

    const wrapper = mount(() =>
      h(
        XyCheckboxGroup,
        {
          modelValue: values.value,
          onChange: (nextValue) => {
            changed.value = nextValue;
          },
          "onUpdate:modelValue": (nextValue) => {
            values.value = nextValue;
          }
        },
        {
          default: () => [
            h(XyCheckbox, { value: "api" }, () => "API"),
            h(XyCheckbox, { value: "sdk" }, () => "SDK")
          ]
        }
      )
    );

    const secondCheckbox = wrapper.findAll(".xy-checkbox")[1];
    await secondCheckbox.get('input[type="checkbox"]').setValue(true);
    await nextTick();

    expect(values.value).toEqual(["sdk"]);
    expect(changed.value).toEqual(["sdk"]);
  });

  it("支持 options 和按钮化渲染", async () => {
    const values = ref<Array<string | number | boolean>>(["api"]);

    const wrapper = mount(XyCheckboxGroup, {
      props: {
        modelValue: values.value,
        type: "button",
        fill: "#1d4ed8",
        textColor: "#f8fafc",
        options: [
          { label: "API", value: "api", description: "系统集成" },
          { label: "OAuth", value: "oauth" },
          { label: "Legacy", value: "legacy", disabled: true }
        ],
        "onUpdate:modelValue": (nextValue: Array<string | number | boolean>) => {
          values.value = nextValue;
        }
      }
    });

    const buttons = wrapper.findAll(".xy-checkbox-button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].classes()).toContain("is-checked");

    await buttons[1].get('input[type="checkbox"]').setValue(true);
    await nextTick();
    expect(values.value).toEqual(["api", "oauth"]);
    await wrapper.setProps({
      modelValue: values.value
    });
    await nextTick();

    await buttons[2].trigger("click");
    expect(values.value).toEqual(["api", "oauth"]);
  });

  it("支持 min / max 限制", async () => {
    const values = ref<Array<string | number | boolean>>(["api"]);

    const wrapper = mount(XyCheckboxGroup, {
      props: {
        modelValue: values.value,
        min: 1,
        max: 2,
        options: [
          { label: "API", value: "api" },
          { label: "OAuth", value: "oauth" },
          { label: "SDK", value: "sdk" }
        ],
        "onUpdate:modelValue": (nextValue: Array<string | number | boolean>) => {
          values.value = nextValue;
        }
      }
    });

    const checkboxes = wrapper.findAll(".xy-checkbox");
    await checkboxes[0].get('input[type="checkbox"]').setValue(false);
    await nextTick();
    expect(values.value).toEqual(["api"]);

    await checkboxes[1].get('input[type="checkbox"]').setValue(true);
    await nextTick();
    expect(values.value).toEqual(["api", "oauth"]);
    await wrapper.setProps({
      modelValue: values.value
    });
    await nextTick();

    await checkboxes[2].get('input[type="checkbox"]').setValue(true);
    await nextTick();
    expect(values.value).toEqual(["api", "oauth"]);
  });

  it("在表单内支持 change 校验", async () => {
    const model = reactive({
      roles: [] as string[]
    });

    const wrapper = mount(
      defineComponent({
        components: {
          XyForm,
          XyFormItem,
          XyCheckbox,
          XyCheckboxGroup
        },
        setup() {
          return {
            model,
            rules: {
              roles: [
                {
                  validator: (_rule: unknown, value: string[]) =>
                    value.length ? Promise.resolve() : Promise.reject(new Error("请至少选择一个角色")),
                  trigger: "change" as const
                }
              ]
            }
          };
        },
        template: `
          <xy-form :model="model" :rules="rules">
            <xy-form-item ref="item" label="角色" prop="roles">
              <xy-checkbox-group v-model="model.roles">
                <xy-checkbox value="owner">Owner</xy-checkbox>
                <xy-checkbox value="viewer">Viewer</xy-checkbox>
              </xy-checkbox-group>
            </xy-form-item>
          </xy-form>
        `
      })
    );

    const item = wrapper.getComponent({ ref: "item" }).vm as {
      validate: (trigger?: "change") => Promise<boolean>;
    };

    await item.validate("change");
    expect(wrapper.text()).toContain("请至少选择一个角色");

    await wrapper.find('.xy-checkbox input[type="checkbox"]').setValue(true);
    await nextTick();
    await nextTick();

    expect(wrapper.text()).not.toContain("请至少选择一个角色");
  });

  it("支持独立的 checkbox-button", async () => {
    const value = ref<string | number | boolean | undefined>(undefined);

    const wrapper = mount(() =>
      h(XyCheckboxButton, {
        modelValue: value.value,
        value: "day",
        "onUpdate:modelValue": (nextValue) => {
          value.value = nextValue;
        }
      }, () => "按天")
    );

    await wrapper.get('input[type="checkbox"]').setValue(true);
    await nextTick();

    expect(value.value).toBe("day");
    expect(wrapper.classes()).toContain("is-checked");
  });
});
