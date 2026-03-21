import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyDropdown } from "@xiaoye/components";

describe("XyDropdown", () => {
  it("支持键盘打开并选择菜单项", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        items: [
          { key: "edit", label: "编辑" },
          { key: "delete", label: "删除" }
        ]
      }
    });

    const trigger = wrapper.find(".xy-dropdown__trigger");

    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ key: "edit" });
  });
});

