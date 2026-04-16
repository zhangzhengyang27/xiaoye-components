import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyFilterPanel } from "@xiaoye/pro-components";

describe("XyFilterPanel", () => {
  it("支持渲染标题并切换折叠状态", async () => {
    const wrapper = mount(XyFilterPanel, {
      props: {
        title: "筛选条件"
      },
      slots: {
        default: () => h("div", { class: "filter-content" }, "筛选项")
      }
    });

    expect(wrapper.text()).toContain("筛选条件");
    expect(wrapper.find(".filter-content").exists()).toBe(true);

    await wrapper.get(".xy-button").trigger("click");

    expect(wrapper.emitted("update:collapsed")?.[0]?.[0]).toBe(true);
    expect(wrapper.emitted("toggle")?.[0]?.[0]).toBe(true);
  });
});
