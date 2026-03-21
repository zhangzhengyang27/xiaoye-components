import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyTabs } from "@xiaoye/components";

describe("XyTabs", () => {
  it("支持键盘切换并跳过禁用项", async () => {
    const wrapper = mount(XyTabs, {
      props: {
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员", disabled: true },
          { key: "billing", label: "账单" }
        ]
      }
    });

    const firstTab = wrapper.findAll('[role="tab"]')[0];

    await firstTab.trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["billing"]);
    expect(wrapper.findAll('[role="tab"]')[2].attributes("aria-selected")).toBe("true");
  });
});
