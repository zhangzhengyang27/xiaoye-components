import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyConfigProvider, XyDivider } from "@xiaoye/components";

describe("XyDivider", () => {
  it("默认渲染为横向分割线，并支持内容插槽", () => {
    const wrapper = mount(XyDivider, {
      slots: {
        default: "基础分段"
      }
    });

    expect(wrapper.classes()).toContain("xy-divider");
    expect(wrapper.classes()).toContain("xy-divider--horizontal");
    expect(wrapper.classes()).toContain("xy-divider--md");
    expect(wrapper.classes()).toContain("is-neutral");
    expect(wrapper.attributes("role")).toBe("separator");
    expect(wrapper.attributes("aria-orientation")).toBe("horizontal");
    expect(wrapper.find(".xy-divider__text").classes()).toContain("is-center");
    expect(wrapper.text()).toContain("基础分段");
    expect(wrapper.element.style.getPropertyValue("--xy-divider-border-style")).toBe("solid");
  });

  it("支持内容位置、状态和边框线型", () => {
    const wrapper = mount(XyDivider, {
      props: {
        contentPosition: "right",
        status: "primary",
        borderStyle: "dashed"
      },
      slots: {
        default: "审批节点"
      }
    });

    expect(wrapper.classes()).toContain("is-primary");
    expect(wrapper.find(".xy-divider__text").classes()).toContain("is-right");
    expect(wrapper.element.style.getPropertyValue("--xy-divider-border-style")).toBe("dashed");
  });

  it("direction=vertical 时渲染竖向分割线并忽略默认插槽", () => {
    const wrapper = mount(XyDivider, {
      props: {
        direction: "vertical"
      },
      slots: {
        default: "不会显示"
      }
    });

    expect(wrapper.classes()).toContain("xy-divider--vertical");
    expect(wrapper.attributes("aria-orientation")).toBe("vertical");
    expect(wrapper.find(".xy-divider__text").exists()).toBe(false);
    expect(wrapper.text()).toBe("");
  });

  it("支持局部 size 覆盖", () => {
    const wrapper = mount(XyDivider, {
      props: {
        size: "lg"
      }
    });

    expect(wrapper.classes()).toContain("xy-divider--lg");
  });

  it("支持全局尺寸继承", () => {
    const wrapper = mount({
      components: {
        XyConfigProvider,
        XyDivider
      },
      template: `
        <xy-config-provider size="sm">
          <xy-divider ref="divider">全局尺寸</xy-divider>
        </xy-config-provider>
      `
    });

    const divider = wrapper.findComponent({ ref: "divider" });

    expect(divider.classes()).toContain("xy-divider--sm");
  });
});
