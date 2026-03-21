import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyPopover } from "@xiaoye/components";

describe("XyPopover", () => {
  it("支持点击打开并通过 Escape 关闭", async () => {
    const wrapper = mount(XyPopover, {
      attachTo: document.body,
      props: {
        title: "说明"
      },
      slots: {
        default: "<button class='inside'>内部按钮</button>"
      }
    });

    await wrapper.find(".xy-popover__trigger").trigger("click");
    expect(document.body.querySelector(".xy-popover__panel")).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await Promise.resolve();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });
});

