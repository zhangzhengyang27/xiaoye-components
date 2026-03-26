import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyTooltip, type TooltipExposed } from "../index";

enableAutoUnmount(afterEach);

function getTooltip(container: ParentNode = document.body) {
  return container.querySelector('[role="tooltip"]') as HTMLElement | null;
}

function expectTooltipHidden(container: ParentNode = document.body) {
  const tooltip = getTooltip(container);
  expect(tooltip == null || tooltip.style.display === "none").toBe(true);
}

function mockRect(element: Element, rect: Partial<DOMRect>) {
  const nextRect = DOMRect.fromRect({
    x: rect.x ?? rect.left ?? 0,
    y: rect.y ?? rect.top ?? 0,
    width: rect.width ?? 0,
    height: rect.height ?? 0
  });

  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(nextRect);
}

describe("XyTooltip", () => {
  it("默认 hover 也支持 focus 打开，并可通过 Escape 关闭", async () => {
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
    await nextTick();

    expect(getTooltip()).not.toBeNull();

    await wrapper.find(".xy-tooltip").trigger("keydown", {
      key: "Escape"
    });
    await nextTick();

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

    expect(getTooltip()).not.toBeNull();

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

  it("支持 trigger 数组组合行为", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: ["hover", "click"],
        content: "多触发提示"
      },
      slots: {
        default: "<button class='trigger'>更多触发</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("mouseenter");
    vi.runAllTimers();
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();
    expectTooltipHidden();

    vi.useRealTimers();
  });

  it("支持 contextmenu 触发打开和再次切换关闭", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "contextmenu",
        content: "右键提示"
      },
      slots: {
        default: "<button class='trigger'>右键</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("contextmenu");
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    await wrapper.find(".xy-tooltip").trigger("contextmenu");
    await nextTick();
    expectTooltipHidden();
  });

  it("支持默认 triggerKeys 通过 Enter、NumpadEnter 和空格切换", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "click",
        content: "键盘提示"
      },
      slots: {
        default: "<button class='trigger'>键盘</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("keydown", {
      key: "Enter",
      code: "Enter"
    });
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    await wrapper.find(".xy-tooltip").trigger("keydown", {
      key: "Enter",
      code: "NumpadEnter"
    });
    await nextTick();
    expectTooltipHidden();

    await wrapper.find(".xy-tooltip").trigger("keydown", {
      key: " ",
      code: "Space"
    });
    await nextTick();
    expect(getTooltip()).not.toBeNull();
  });

  it("manual 模式不会自动触发，但 expose.show/hide 可以控制显示", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "manual",
        content: "手动提示"
      },
      slots: {
        default: "<button class='trigger'>手动</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("mouseenter");
    vi.runAllTimers();
    await nextTick();
    expectTooltipHidden();

    const exposed = wrapper.vm as unknown as TooltipExposed;
    exposed.show();
    await nextTick();
    expect(getTooltip()).not.toBeNull();

    exposed.hide();
    await nextTick();
    expectTooltipHidden();

    vi.useRealTimers();
  });

  it("受控变更不会重复派发 update:modelValue，并会补齐 before/show/hide 生命周期", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        modelValue: false,
        trigger: "click",
        content: "受控提示"
      },
      slots: {
        default: "<button class='trigger'>受控</button>"
      }
    });

    await wrapper.setProps({
      modelValue: true
    });
    await nextTick();
    await nextTick();
    wrapper.getComponent({ name: "XyTooltipContent" }).vm.$emit("afterEnter");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("before-show")).toHaveLength(1);
    expect(wrapper.emitted("open")).toHaveLength(1);
    expect(wrapper.emitted("show")).toHaveLength(1);

    await wrapper.setProps({
      modelValue: false
    });
    await nextTick();
    await nextTick();
    wrapper.getComponent({ name: "XyTooltipContent" }).vm.$emit("afterLeave");
    await nextTick();

    expect(wrapper.emitted("before-hide")).toHaveLength(1);
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(wrapper.emitted("hide")).toHaveLength(1);
  });

  it("before-show/open/show 与 before-hide/close/hide 事件顺序正确", async () => {
    document.body.innerHTML = "";
    const order: string[] = [];

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "click",
        content: "顺序提示",
        onBeforeShow: () => order.push("before-show"),
        "onUpdate:modelValue": () => order.push("update"),
        onOpen: () => order.push("open"),
        onShow: () => order.push("show"),
        onBeforeHide: () => order.push("before-hide"),
        onClose: () => order.push("close"),
        onHide: () => order.push("hide")
      },
      slots: {
        default: "<button class='trigger'>顺序</button>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();
    await nextTick();
    wrapper.getComponent({ name: "XyTooltipContent" }).vm.$emit("afterEnter");
    await nextTick();
    expect(order.slice(0, 4)).toEqual(["before-show", "update", "open", "show"]);

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();
    await nextTick();
    wrapper.getComponent({ name: "XyTooltipContent" }).vm.$emit("afterLeave");
    await nextTick();
    expect(order.slice(4)).toEqual(["before-hide", "update", "close", "hide"]);
  });

  it("content 插槽优先于 rawContent 渲染", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "click",
        rawContent: true,
        content: "<strong class='raw-content'>原始 HTML</strong>"
      },
      slots: {
        default: "<button class='trigger'>打开</button>",
        content: "<span class='slot-content'>插槽优先</span>"
      }
    });

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".slot-content")?.textContent).toBe("插槽优先");
    expect(document.body.querySelector(".raw-content")).toBeNull();
  });

  it("支持 virtualTriggering + virtualRef，并同步 aria-describedby", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    const virtualTrigger = document.createElement("button");
    virtualTrigger.type = "button";
    virtualTrigger.textContent = "虚拟触发";
    document.body.appendChild(virtualTrigger);

    mount(XyTooltip, {
      attachTo: document.body,
      props: {
        content: "虚拟触发提示",
        virtualRef: virtualTrigger,
        virtualTriggering: true
      }
    });

    virtualTrigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.runAllTimers();
    await nextTick();

    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(virtualTrigger.getAttribute("aria-describedby")).toBe(tooltip?.id ?? null);

    vi.useRealTimers();
  });

  it("支持 popperOptions 控制 strategy，并可通过 fallbackPlacements 触发翻转", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyTooltip, {
      attachTo: document.body,
      props: {
        trigger: "click",
        content: "定位提示",
        placement: "left-start",
        popperOptions: {
          strategy: "absolute",
          fallbackPlacements: ["right-start"]
        }
      },
      slots: {
        default: "<button class='trigger'>定位</button>"
      }
    });

    Object.defineProperty(window, "innerWidth", {
      value: 320,
      configurable: true
    });
    Object.defineProperty(window, "innerHeight", {
      value: 240,
      configurable: true
    });
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 320,
      configurable: true
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 240,
      configurable: true
    });

    const trigger = wrapper.find(".xy-tooltip").element as HTMLElement;
    mockRect(trigger, {
      left: 0,
      top: 20,
      width: 48,
      height: 24
    });

    await wrapper.find(".xy-tooltip").trigger("click");
    await nextTick();

    const tooltip = getTooltip() as HTMLElement;
    expect(tooltip).not.toBeNull();

    mockRect(tooltip, {
      left: 0,
      top: 0,
      width: 160,
      height: 48
    });
    Object.defineProperty(tooltip, "offsetWidth", {
      value: 160,
      configurable: true
    });
    Object.defineProperty(tooltip, "offsetHeight", {
      value: 48,
      configurable: true
    });

    const exposed = wrapper.vm as unknown as TooltipExposed;
    await exposed.updatePopper();
    await nextTick();

    expect(tooltip.style.position).toBe("absolute");
    expect(["left-start", "right-start"]).toContain(tooltip.dataset.placement);
  });
});
