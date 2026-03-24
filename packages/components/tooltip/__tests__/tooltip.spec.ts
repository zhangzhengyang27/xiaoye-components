import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyTooltip } from "../index";

enableAutoUnmount(afterEach);

function expectTooltipHidden(container: ParentNode = document.body) {
  const tooltip = container.querySelector('[role="tooltip"]') as HTMLElement | null;
  expect(tooltip == null || tooltip.style.display === "none").toBe(true);
}

describe("XyTooltip", () => {
  it("支持 focus 打开并通过 Escape 关闭", async () => {
    document.body.innerHTML = "";
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

    expectTooltipHidden();

    vi.useRealTimers();
  });

  it("支持 click 触发和外部点击关闭", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "click",
        content: "点击提示"
      },
      slots: {
        default: "<button class='trigger'>点击</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();
    expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull();

    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();
    expectTooltipHidden();
  });

  it("支持 teleported=false 和 appendTo", async () => {
    document.body.innerHTML = `<div id="tooltip-target"></div>`;
    const target = document.getElementById("tooltip-target") as HTMLDivElement;

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "click",
        teleported: false,
        appendTo: "#tooltip-target",
        content: "当前容器提示"
      },
      slots: {
        default: "<button class='trigger'>打开</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();

    expect(wrapper.element.querySelector('[role="tooltip"]')).not.toBeNull();
    expect(target.querySelector('[role="tooltip"]')).toBeNull();
  });

  it("支持 appendTo、persistent、showAfter/hideAfter 与样式透传", async () => {
    document.body.innerHTML = `<div id="tooltip-target"></div>`;
    vi.useFakeTimers();
    const target = document.getElementById("tooltip-target") as HTMLDivElement;

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        content: "延迟提示",
        appendTo: "#tooltip-target",
        persistent: true,
        showAfter: 120,
        hideAfter: 90,
        popperClass: "custom-tooltip",
        popperStyle: {
          width: "280px"
        }
      },
      slots: {
        default: "<button class='trigger'>悬停</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("mouseenter");
    vi.advanceTimersByTime(100);
    await nextTick();
    expectTooltipHidden(target);

    vi.advanceTimersByTime(20);
    await nextTick();

    const tooltip = document.querySelector("#tooltip-target [role='tooltip']") as HTMLElement | null;
    expect(tooltip).not.toBeNull();
    expect(tooltip?.classList.contains("custom-tooltip")).toBe(true);
    expect(tooltip?.style.width).toBe("280px");

    await wrapper.find(".xy-tooltip").trigger("mouseleave");
    vi.advanceTimersByTime(80);
    await nextTick();
    expect(tooltip?.style.display).not.toBe("none");

    vi.advanceTimersByTime(10);
    await nextTick();
    expect(tooltip?.style.display).toBe("none");

    vi.useRealTimers();
  });
});
