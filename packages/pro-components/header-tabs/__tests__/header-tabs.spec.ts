import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyHeaderTabs } from "@xiaoye/pro-components";
import { XyDropdown } from "@xiaoye/components";

describe("XyHeaderTabs", () => {
  it("支持页签切换和菜单动作", async () => {
    const wrapper = mount(XyHeaderTabs, {
      props: {
        items: [
          { key: "overview", label: "概览" },
          { key: "orders", label: "订单" }
        ]
      }
    });

    await wrapper.findAll('[role="tab"]')[1]?.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["orders"]);

    wrapper.getComponent(XyDropdown).vm.$emit("command", "close-all");
    expect(wrapper.emitted("tabMenuClick")?.[0]).toEqual(["close-all"]);
  });
});
