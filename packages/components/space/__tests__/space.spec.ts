import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XySpace } from "../index";

describe("XySpace", () => {
  it("默认渲染为横向间距布局", () => {
    const wrapper = mount(XySpace, {
      slots: {
        default: "<span>一</span><span>二</span>"
      }
    });

    expect(wrapper.classes()).toContain("xy-space");
    expect(wrapper.classes()).toContain("xy-space--horizontal");
    expect(wrapper.classes()).not.toContain("is-wrap");
    expect(wrapper.element.style.gap).toBe("12px");
    expect(wrapper.element.style.alignItems).toBe("center");
    expect(wrapper.element.style.flexWrap).toBe("nowrap");
  });

  it("支持自定义尺寸、纵向布局和换行", () => {
    const wrapper = mount(XySpace, {
      props: {
        size: 20,
        direction: "vertical",
        wrap: true,
        align: "stretch"
      },
      slots: {
        default: "<span>甲</span><span>乙</span>"
      }
    });

    expect(wrapper.classes()).toContain("xy-space--vertical");
    expect(wrapper.classes()).toContain("is-wrap");
    expect(wrapper.element.style.gap).toBe("20px");
    expect(wrapper.element.style.alignItems).toBe("stretch");
    expect(wrapper.element.style.flexWrap).toBe("wrap");
  });
});
