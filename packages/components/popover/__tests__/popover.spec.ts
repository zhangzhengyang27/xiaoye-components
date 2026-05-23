import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyPopover } from "../index";

enableAutoUnmount(afterEach);

describe("XyPopover", () => {
  it("支持点击打开并通过 Escape 关闭", async () => {
    document.body.innerHTML = "";

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

  it("支持 hover 触发和 content prop", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    mount(XyPopover, {
      attachTo: document.body,
      props: {
        trigger: "hover",
        content: "气泡内容"
      },
      slots: {
        trigger: "<button class='trigger'>悬停</button>"
      }
    });

    const trigger = document.body.querySelector(".xy-popover__trigger") as HTMLElement;
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    vi.runAllTimers();
    await Promise.resolve();
    await nextTick();

    expect(document.body.querySelector(".xy-popover__panel")).not.toBeNull();
    expect(document.body.querySelector(".xy-popover__body")?.textContent ?? "").toContain("气泡内容");
    vi.useRealTimers();
  });

  it("支持 reference 插槽作为触发器", async () => {
    document.body.innerHTML = "";

    mount(XyPopover, {
      attachTo: document.body,
      props: {
        content: "reference 内容"
      },
      slots: {
        reference: "<button class='reference-trigger'>reference</button>"
      }
    });

    const trigger = document.body.querySelector(".reference-trigger") as HTMLButtonElement | null;
    trigger?.click();
    await nextTick();

    expect(document.body.querySelector(".xy-popover__panel")).not.toBeNull();
    expect(document.body.querySelector(".xy-popover__body")?.textContent ?? "").toContain("reference 内容");
  });

  it("支持 appendTo 和样式透传", async () => {
    document.body.innerHTML = `<div id="popover-target"></div>`;

    mount(XyPopover, {
      attachTo: document.body,
      props: {
        content: "挂载内容",
        appendTo: "#popover-target",
        popperClass: "custom-popover",
        popperStyle: {
          maxWidth: "360px"
        }
      },
      slots: {
        reference: "<button class='reference-trigger'>reference</button>"
      }
    });

    const trigger = document.body.querySelector(".reference-trigger") as HTMLButtonElement | null;
    trigger?.click();
    await nextTick();

    const panel = document.querySelector("#popover-target .xy-popover__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.classList.contains("custom-popover")).toBe(true);
    expect(panel?.style.maxWidth).toBe("360px");
  });

  it("支持 teleported=false 时在当前容器内渲染，并反映 placement", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyPopover, {
      attachTo: document.body,
      props: {
        content: "本地渲染",
        teleported: false,
        placement: "top-start",
        popperClass: "inline-popover"
      },
      slots: {
        reference: "<button class='reference-trigger'>reference</button>"
      }
    });

    await wrapper.find(".reference-trigger").trigger("click");
    await nextTick();
    await nextTick();

    const panel = wrapper.element.querySelector(".xy-popover__panel.inline-popover") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("class")).toContain("inline-popover");
    expect(panel?.getAttribute("style")).toContain("width: 320px");
  });

  it("showArrow=false 时不渲染箭头", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyPopover, {
      attachTo: document.body,
      props: {
        content: "无箭头",
        showArrow: false
      },
      slots: {
        reference: "<button class='reference-trigger'>reference</button>"
      }
    });

    await wrapper.find(".reference-trigger").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".xy-popover__arrow")).toBeNull();
  });

  it("默认面板风格保持克制但仍可正常显示内容", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyPopover, {
      attachTo: document.body,
      props: {
        title: "标题",
        content: "正文内容"
      },
      slots: {
        reference: "<button class='reference-trigger'>reference</button>"
      }
    });

    await wrapper.find(".reference-trigger").trigger("click");
    await nextTick();

    const panel = document.body.querySelector(".xy-popover__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.textContent ?? "").toContain("正文内容");
  });

  it("默认 trigger 的视觉基线保持克制且仍可打开内容", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyPopover, {
      attachTo: document.body,
      props: {
        title: "标题",
        content: "正文内容"
      }
    });

    const trigger = wrapper.find(".xy-popover__default-trigger");
    expect(trigger.exists()).toBe(true);

    await trigger.trigger("click");
    await nextTick();

    const panel = document.body.querySelector(".xy-popover__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.textContent ?? "").toContain("正文内容");
  });

  it("受控变更不会重复派发 update:modelValue，persistent=true 时关闭后保留 DOM", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyPopover, {
      attachTo: document.body,
      props: {
        modelValue: false,
        persistent: true,
        content: "保留内容"
      },
      slots: {
        trigger: "<button class='trigger'>打开</button>"
      }
    });

    await wrapper.setProps({
      modelValue: true
    });
    await nextTick();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await wrapper.setProps({
      modelValue: false
    });
    await nextTick();
    await nextTick();

    const panel = document.body.querySelector(".xy-popover__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.style.display).toBe("none");
  });
});
