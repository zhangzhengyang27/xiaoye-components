import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XySwitch } from "@xiaoye/components";

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

describe("XySwitch", () => {
  it("支持基础切换和 v-model 更新", async () => {
    const value = ref(false);

    const wrapper = mount(() =>
      h(XySwitch, {
        modelValue: value.value,
        "onUpdate:modelValue": (nextValue: boolean | string | number) => {
          value.value = nextValue as boolean;
        }
      })
    );

    await wrapper.get(".xy-switch__core").trigger("click");
    await nextTick();

    expect(value.value).toBe(true);
    expect(wrapper.classes()).toContain("is-checked");
  });

  it("支持 activeValue 和 inactiveValue", async () => {
    const value = ref<"open" | "close">("open");

    const wrapper = mount(() =>
      h(XySwitch, {
        modelValue: value.value,
        activeValue: "open",
        inactiveValue: "close",
        "onUpdate:modelValue": (nextValue: boolean | string | number) => {
          value.value = nextValue as "open" | "close";
        }
      })
    );

    await wrapper.get(".xy-switch__core").trigger("click");
    await nextTick();
    expect(value.value).toBe("close");

    await wrapper.get(".xy-switch__core").trigger("click");
    await nextTick();
    expect(value.value).toBe("open");
  });

  it("支持 inlinePrompt 和文本标签", () => {
    const wrapper = mount(XySwitch, {
      props: {
        inlinePrompt: true,
        activeText: "开",
        inactiveText: "关",
        width: 56
      }
    });

    expect(wrapper.find(".xy-switch__inner").exists()).toBe(true);
    expect(wrapper.find(".xy-switch__core").attributes("style")).toContain("--xy-switch-width: 56px");
    expect(wrapper.text()).toContain("关");
  });

  it("支持 loading 和 action icon", () => {
    const loadingWrapper = mount(XySwitch, {
      props: {
        loading: true
      }
    });

    expect(loadingWrapper.classes()).toContain("is-loading");
    expect(loadingWrapper.find('[data-icon="mdi:loading"]').exists()).toBe(true);

    const iconWrapper = mount(XySwitch, {
      props: {
        modelValue: true,
        activeActionIcon: "mdi:check"
      }
    });

    expect(iconWrapper.find('[data-icon="mdi:check"]').exists()).toBe(true);
  });

  it("支持 disabled", async () => {
    const wrapper = mount(XySwitch, {
      props: {
        modelValue: true,
        disabled: true
      }
    });

    await wrapper.get(".xy-switch__core").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.classes()).toContain("is-disabled");
  });

  it("支持 beforeChange 返回 boolean", async () => {
    const allow = ref(false);
    const value = ref(true);

    const wrapper = mount(() =>
      h(XySwitch, {
        modelValue: value.value,
        beforeChange: () => allow.value,
        "onUpdate:modelValue": (nextValue: boolean | string | number) => {
          value.value = nextValue as boolean;
        }
      })
    );

    await wrapper.get(".xy-switch__core").trigger("click");
    expect(value.value).toBe(true);

    allow.value = true;
    await wrapper.get(".xy-switch__core").trigger("click");
    await nextTick();
    expect(value.value).toBe(false);
  });

  it("支持 beforeChange 返回 Promise", async () => {
    const value = ref(false);

    const wrapper = mount(() =>
      h(XySwitch, {
        modelValue: value.value,
        beforeChange: () => Promise.resolve(true),
        "onUpdate:modelValue": (nextValue: boolean | string | number) => {
          value.value = nextValue as boolean;
        }
      })
    );

    await wrapper.get(".xy-switch__core").trigger("click");
    await Promise.resolve();
    await nextTick();

    expect(value.value).toBe(true);
  });

  it("在表单内支持 change 校验", async () => {
    const model = reactive({
      enabled: false
    });

    const wrapper = mount(
      defineComponent({
        components: {
          XyForm,
          XyFormItem,
          XySwitch
        },
        setup() {
          return {
            model,
            rules: {
              enabled: [
                {
                  validator: (_rule: unknown, value: boolean) =>
                    value ? Promise.resolve() : Promise.reject(new Error("请开启开关")),
                  trigger: "change" as const
                }
              ]
            }
          };
        },
        template: `
          <xy-form :model="model" :rules="rules">
            <xy-form-item ref="item" label="状态" prop="enabled">
              <xy-switch v-model="model.enabled" active-text="启用" inactive-text="停用" />
            </xy-form-item>
          </xy-form>
        `
      })
    );

    const item = wrapper.getComponent({ ref: "item" }).vm as {
      validate: (trigger?: "change") => Promise<boolean>;
    };

    await item.validate("change");
    expect(wrapper.text()).toContain("请开启开关");

    await wrapper.get(".xy-switch__core").trigger("click");
    await Promise.resolve();
    await nextTick();
    await nextTick();

    expect(wrapper.text()).not.toContain("请开启开关");
  });

  it("暴露 focus 和 checked", async () => {
    const wrapper = mount(XySwitch, {
      attachTo: document.body,
      props: {
        modelValue: true
      }
    });

    const api = wrapper.vm as unknown as {
      focus: () => void;
      checked: boolean;
    };

    api.focus();
    expect(document.activeElement).toBe(wrapper.get("input").element);
    expect(api.checked).toBe(true);
  });
});
