import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyRow } from "@xiaoye/components";

describe("XyRow", () => {
  it("默认渲染为 flex 容器", () => {
    const wrapper = mount(XyRow);

    expect(wrapper.classes()).toContain("xy-row");
  });

  it("支持通过 gutter 生成负外边距", () => {
    const wrapper = mount(XyRow, {
      props: {
        gutter: 24
      }
    });

    const element = wrapper.element as HTMLElement;

    expect(element.style.marginLeft).toBe("-12px");
    expect(element.style.marginRight).toBe("-12px");
  });

  it("支持 justify 与 align 状态类", () => {
    const wrapper = mount(XyRow, {
      props: {
        justify: "space-between",
        align: "middle"
      }
    });

    expect(wrapper.classes()).toContain("is-justify-space-between");
    expect(wrapper.classes()).toContain("is-align-middle");
  });

  it("支持自定义根标签", () => {
    const wrapper = mount(XyRow, {
      props: {
        tag: "section"
      }
    });

    expect(wrapper.element.tagName).toBe("SECTION");
  });
});
