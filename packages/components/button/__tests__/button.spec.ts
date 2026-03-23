import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyButton, XyButtonGroup, XyForm, XyFormItem, XyInput } from "@xiaoye/components";

vi.mock("@xiaoye/utils", async () => {
  const actual = await vi.importActual<typeof import("@xiaoye/utils")>("@xiaoye/utils");

  return {
    ...actual,
    isDev: () => true,
    warnOnce: (scope: string, message: string) => {
      console.warn(`[${scope}] ${message}`);
    }
  };
});

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

describe("XyButton", () => {
  it("默认渲染为中性按钮，并支持 type/plain/round/block", () => {
    const wrapper = mount(XyButton, {
      props: {
        type: "primary",
        plain: true,
        round: true,
        block: true
      }
    });

    expect(wrapper.classes()).toContain("xy-button--primary");
    expect(wrapper.classes()).toContain("is-plain");
    expect(wrapper.classes()).toContain("is-round");
    expect(wrapper.classes()).toContain("is-block");
  });

  it("会归一化互斥的视觉 props，并只保留 link 语义", () => {
    const wrapper = mount(XyButton, {
      props: {
        plain: true,
        text: true,
        link: true,
        bg: true
      }
    });

    expect(wrapper.classes()).toContain("is-link");
    expect(wrapper.classes()).not.toContain("is-plain");
    expect(wrapper.classes()).not.toContain("is-text");
    expect(wrapper.classes()).not.toContain("is-has-bg");
  });

  it("会在开发态提示冲突 props 和缺失的 icon-only 可访问名称", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    mount(XyButton, {
      props: {
        plain: true,
        text: true,
        link: true,
        bg: true,
        circle: true,
        icon: "mdi:plus"
      }
    });

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("`plain`、`text`、`link` 同时传入时会按 `link > text > plain` 归一化。")
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("`bg` 仅在 `text` 模式下生效。")
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("纯图标按钮需要提供 `aria-label` 或 `aria-labelledby`。")
    );

    warn.mockRestore();
  });

  it("在 loading 时阻止点击事件", async () => {
    const wrapper = mount(XyButton, {
      props: {
        loading: true
      },
      slots: {
        default: "保存"
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toBeUndefined();
    expect(wrapper.classes()).toContain("is-loading");
  });

  it("支持 icon、loadingIcon 与 loading 插槽优先级", () => {
    const iconWrapper = mount(XyButton, {
      props: {
        icon: "mdi:magnify"
      }
    });

    expect(iconWrapper.find('[data-icon="mdi:magnify"]').exists()).toBe(true);

    const loadingIconWrapper = mount(XyButton, {
      props: {
        loading: true,
        loadingIcon: "mdi:refresh"
      }
    });

    expect(loadingIconWrapper.find('[data-icon="mdi:refresh"]').exists()).toBe(true);

    const loadingSlotWrapper = mount(XyButton, {
      props: {
        loading: true
      },
      slots: {
        loading: "<span class='custom-loading'>处理中</span>"
      }
    });

    expect(loadingSlotWrapper.find(".custom-loading").exists()).toBe(true);
    expect(loadingSlotWrapper.find('[data-icon="mdi:loading"]').exists()).toBe(false);
  });

  it("在 loading 时补充 aria-busy", () => {
    const wrapper = mount(XyButton, {
      props: {
        loading: true
      },
      slots: {
        default: "加载中"
      }
    });

    expect(wrapper.attributes("aria-busy")).toBe("true");
  });

  it("支持非 button 标签的 aria-disabled 分流", async () => {
    const wrapper = mount(XyButton, {
      props: {
        tag: "a",
        disabled: true
      },
      attrs: {
        href: "#demo"
      },
      slots: {
        default: "只读链接"
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("aria-disabled")).toBe("true");
    expect(wrapper.attributes("disabled")).toBeUndefined();
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  it("支持非 button 标签的键盘触发语义", async () => {
    const wrapper = mount(XyButton, {
      props: {
        tag: "div"
      },
      slots: {
        default: "自定义按钮"
      }
    });

    await wrapper.trigger("keydown", {
      key: "Enter"
    });
    await wrapper.trigger("keydown", {
      key: " "
    });

    expect(wrapper.attributes("role")).toBe("button");
    expect(wrapper.attributes("tabindex")).toBe("0");
    expect(wrapper.emitted("click")).toHaveLength(2);
  });

  it("circle 在有文本内容时不会强制走图标圆形模式", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const wrapper = mount(XyButton, {
      props: {
        circle: true
      },
      slots: {
        default: "新建"
      }
    });

    expect(wrapper.classes()).not.toContain("is-circle");
    expect(wrapper.classes()).not.toContain("is-icon-only");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("只有纯图标按钮才会应用 `circle` 布局")
    );

    warn.mockRestore();
  });

  it("circle 在只有 suffix 时不会误判为 icon-only", () => {
    const wrapper = mount(XyButton, {
      props: {
        circle: true
      },
      slots: {
        suffix: "<span class='suffix-only'>更多</span>"
      }
    });

    expect(wrapper.classes()).not.toContain("is-circle");
    expect(wrapper.classes()).not.toContain("is-icon-only");
  });

  it("circle 在 loading 且使用自定义 loading 插槽时不会误判为 icon-only", () => {
    const wrapper = mount(XyButton, {
      props: {
        circle: true,
        loading: true
      },
      slots: {
        loading: "<span class='custom-loading'>处理中</span>"
      }
    });

    expect(wrapper.classes()).not.toContain("is-circle");
    expect(wrapper.classes()).not.toContain("is-icon-only");
  });

  it("在表单内点击 reset 按钮时会重置字段", async () => {
    const model = reactive({
      name: "初始值"
    });

    const wrapper = mount({
      components: {
        XyButton,
        XyForm,
        XyFormItem,
        XyInput
      },
      setup() {
        return {
          model
        };
      },
      template: `
        <xy-form :model="model">
          <xy-form-item label="名称" prop="name">
            <xy-input v-model="model.name" />
          </xy-form-item>
          <xy-button native-type="reset">重置</xy-button>
        </xy-form>
      `
    });

    model.name = "已修改";
    await nextTick();

    await wrapper.find("button").trigger("click");

    expect(model.name).toBe("初始值");
  });

  it("支持 button-group 继承 type 和 size", () => {
    const wrapper = mount({
      components: {
        XyButton,
        XyButtonGroup
      },
      template: `
        <xy-button-group type="primary" size="lg">
          <xy-button>上一步</xy-button>
          <xy-button>下一步</xy-button>
        </xy-button-group>
      `
    });

    const buttons = wrapper.findAll("button");

    expect(wrapper.find(".xy-button-group").exists()).toBe(true);
    expect(buttons[0]?.classes()).toContain("xy-button--primary");
    expect(buttons[0]?.classes()).toContain("xy-button--lg");
    expect(buttons[1]?.classes()).toContain("xy-button--primary");
  });

  it("支持 button-group vertical 方向类名", () => {
    const wrapper = mount(XyButtonGroup, {
      props: {
        direction: "vertical"
      },
      slots: {
        default: "<button class='inner'>按钮</button>"
      }
    });

    expect(wrapper.classes()).toContain("xy-button-group--vertical");
  });

  it("支持通过 kebab-case 标签全局注册后直接使用", () => {
    const wrapper = mount(
      {
        template: `
          <xy-button-group type="primary">
            <xy-button plain>保存</xy-button>
            <xy-button>提交</xy-button>
          </xy-button-group>
        `
      },
      {
        global: {
          plugins: [XyButton, XyButtonGroup]
        }
      }
    );

    expect(wrapper.find(".xy-button-group").exists()).toBe(true);
    expect(wrapper.findAll("button")).toHaveLength(2);
  });
});
