import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyForm, XyFormItem, XyInput } from "@xiaoye/components";

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

describe("XyInput", () => {
  it("响应 v-model 更新", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: ""
      }
    });

    await wrapper.find("input").setValue("hello");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["hello"]);
  });

  it("支持前后缀图标和 prepend/append 插槽", () => {
    const wrapper = mount(XyInput, {
      props: {
        prefixIcon: "mdi:magnify",
        suffixIcon: "mdi:information-outline"
      },
      slots: {
        prepend: "<span class='prepend'>https://</span>",
        append: "<span class='append'>.com</span>",
        prefix: "<span class='prefix-slot'>P</span>",
        suffix: "<span class='suffix-slot'>S</span>"
      }
    });

    expect(wrapper.find(".xy-input__prepend").exists()).toBe(true);
    expect(wrapper.find(".xy-input__append").exists()).toBe(true);
    expect(wrapper.find(".prefix-slot").exists()).toBe(true);
    expect(wrapper.find(".suffix-slot").exists()).toBe(true);
    expect(wrapper.find('[data-icon="mdi:magnify"]').exists()).toBe(true);
    expect(wrapper.find('[data-icon="mdi:information-outline"]').exists()).toBe(true);
  });

  it("支持 clearable 和 clear 事件", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: "hello",
        clearable: true
      }
    });

    await wrapper.trigger("mouseenter");
    await wrapper.get(".xy-input__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
    expect(wrapper.emitted("clear")).toHaveLength(1);
  });

  it("支持 showPassword 切换输入类型", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: "secret",
        showPassword: true,
        type: "password"
      }
    });

    const input = wrapper.get("input");

    expect(input.attributes("type")).toBe("password");

    await wrapper.get(".xy-input__password").trigger("click");

    expect(input.attributes("type")).toBe("text");
  });

  it("支持 textarea、autosize 和字数统计", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: "这是一段较长的文本",
        type: "textarea",
        autosize: {
          minRows: 2,
          maxRows: 4
        },
        maxlength: 20,
        showWordLimit: true
      }
    });

    const textarea = wrapper.get("textarea").element as HTMLTextAreaElement;

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      get: () => 120
    });

    await wrapper.setProps({
      modelValue: "更新后的多行文本内容"
    });

    expect(wrapper.classes()).toContain("xy-textarea");
    expect(textarea.style.height).toBe("94px");
    expect(wrapper.find(".xy-textarea__count").text()).toContain("10 / 20");
  });

  it("支持 modelModifiers 和 lazy 更新", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: "",
        modelModifiers: {
          trim: true,
          lazy: true
        }
      }
    });

    const input = wrapper.get("input");

    (input.element as HTMLInputElement).value = "  hello  ";
    await input.trigger("input");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["hello"]);
  });

  it("支持 formatter 和 parser", async () => {
    const wrapper = mount(XyInput, {
      props: {
        modelValue: "10000",
        formatter: (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        parser: (value) => value.replace(/,/g, "")
      }
    });

    const input = wrapper.get("input");

    expect((input.element as HTMLInputElement).value).toBe("10,000");

    await input.setValue("1,000,000");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["1000000"]);
  });

  it("在表单内触发 blur/change 校验，并支持 validateEvent 关闭", async () => {
    const model = reactive({
      name: ""
    });

    const wrapper = mount({
      components: {
        XyForm,
        XyFormItem,
        XyInput
      },
      setup() {
        return {
          model,
          rules: {
            name: [{ required: true, message: "请输入名称", trigger: "blur" as const }]
          }
        };
      },
      template: `
        <xy-form :model="model" :rules="rules">
          <xy-form-item ref="item" label="名称" prop="name">
            <xy-input ref="enabled" v-model="model.name" />
            <xy-input ref="disabledValidation" v-model="model.name" :validate-event="false" />
          </xy-form-item>
        </xy-form>
      `
    });

    const enabled = wrapper.findComponent({ ref: "enabled" });
    const disabledValidation = wrapper.findComponent({ ref: "disabledValidation" });

    await enabled.get("input").trigger("blur");
    expect(wrapper.text()).toContain("请输入名称");

    await disabledValidation.get("input").trigger("blur");
    expect(wrapper.text()).toContain("请输入名称");
  });
});
