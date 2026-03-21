import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { XyTooltip } from "@xiaoye/components";

describe("XyTooltip", () => {
  it("支持 focus 打开并通过 Escape 关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        content: "提示信息"
      },
      slots: {
        default: "<button class='trigger'>查看提示</button>"
      }
    });

    await wrapper.find(".trigger").trigger("focusin");
    vi.runAllTimers();
    await Promise.resolve();

    expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull();

    await wrapper.find(".xy-tooltip").trigger("keydown", {
      key: "Escape"
    });

    expect(document.body.querySelector('[role="tooltip"]')).toBeNull();

    vi.useRealTimers();
  });
});
