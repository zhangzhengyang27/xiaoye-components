import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { XyIcon } from "../../icon";
import { XyDrawer } from "../index";

enableAutoUnmount(afterEach);

function mountDrawer(
  props: Record<string, unknown> = {},
  slots?: Record<string, (...args: any[]) => unknown>
) {
  return mount(XyDrawer, {
    attachTo: document.body,
    props: {
      modelValue: true,
      ...props
    },
    slots,
    global: {
      stubs: {
        transition: false
      }
    }
  });
}

function createMouseEvent(type: "mousedown" | "mousemove" | "mouseup", pageX: number, pageY = 0) {
  const event = new MouseEvent(type, {
    bubbles: true
  });

  Object.defineProperty(event, "pageX", {
    configurable: true,
    get: () => pageX
  });
  Object.defineProperty(event, "pageY", {
    configurable: true,
    get: () => pageY
  });

  return event;
}

async function waitForTransition() {
  await nextTick();
  await new Promise<void>((resolve) => {
    const frame =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame
        : (callback: FrameRequestCallback) => window.setTimeout(callback, 16);

    frame(() => {
      frame(() => resolve());
    });
  });
  await nextTick();
}

async function waitForMacrotask() {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
  await nextTick();
}

describe("XyDrawer", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
  });

  it("支持通过关闭按钮关闭", async () => {
    const wrapper = mountDrawer({
      title: "侧边抽屉"
    });

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("direction 会覆盖 placement，并按高度设置上下抽屉 size", async () => {
    mountDrawer({
      placement: "left",
      direction: "btt",
      size: 280
    });

    await nextTick();

    const root = document.body.querySelector(".xy-drawer") as HTMLElement | null;
    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;

    expect(root?.classList.contains("xy-drawer--bottom")).toBe(true);
    expect(panel?.style.height).toBe("280px");
  });

  it("showClose=false 时隐藏关闭按钮", async () => {
    mountDrawer({
      showClose: false
    });

    await nextTick();
    expect(document.body.querySelectorAll(".xy-drawer__close")).toHaveLength(0);
  });

  it("支持 beforeClose 拦截关闭", async () => {
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));
    const wrapper = mountDrawer({
      beforeClose
    });

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("appendTo 会覆盖 appendToBody，并支持无遮罩模式", async () => {
    document.body.innerHTML = `<div id="drawer-target"></div>`;

    mountDrawer({
      appendToBody: false,
      appendTo: "#drawer-target",
      modal: false,
      title: "挂载抽屉"
    });

    await nextTick();

    const target = document.getElementById("drawer-target") as HTMLDivElement;
    expect(target.querySelector("[role='dialog']")).not.toBeNull();
    expect(target.querySelector(".xy-drawer__overlay")).toBeNull();
  });

  it("支持 openDelay / closeDelay，并发出 opened / closed", async () => {
    vi.useFakeTimers();

    const wrapper = mountDrawer({
      modelValue: false,
      openDelay: 120,
      closeDelay: 90,
      title: "延迟抽屉"
    });

    await wrapper.setProps({
      modelValue: true
    });
    vi.advanceTimersByTime(110);
    await nextTick();
    expect(wrapper.emitted("open")).toBeUndefined();

    vi.advanceTimersByTime(10);
    await nextTick();
    expect(document.body.querySelector("[role='dialog']")).not.toBeNull();
    expect(wrapper.emitted("open")).toHaveLength(1);

    await wrapper.setProps({
      modelValue: false
    });
    vi.advanceTimersByTime(80);
    await nextTick();
    expect(wrapper.emitted("close")).toBeUndefined();
    expect(wrapper.emitted("closed")).toBeUndefined();

    vi.advanceTimersByTime(10);
    await nextTick();
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect((wrapper.emitted("opened")?.length ?? 0) >= 1).toBe(true);
  });

  it("destroyOnClose 模式下可以完成关闭链路", async () => {
    const wrapper = mountDrawer({
      destroyOnClose: true
    });

    expect(document.body.querySelector(".xy-drawer__body")).not.toBeNull();

    await wrapper.setProps({
      modelValue: false
    });
    await waitForTransition();

    expect(wrapper.emitted("close")).toHaveLength(1);
    expect((wrapper.emitted("closed")?.length ?? 0) >= 1).toBe(true);
  });

  it("默认懒渲染主体内容，打开后才挂载", async () => {
    const wrapper = mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: false,
        title: "懒渲染抽屉"
      },
      slots: {
        default: () => h("button", { class: "lazy-body-button" }, "body")
      },
      global: {
        stubs: {
          transition: false
        }
      }
    });

    await nextTick();
    expect(document.body.querySelector(".lazy-body-button")).toBeNull();

    await wrapper.setProps({
      modelValue: true
    });
    await waitForTransition();

    expect(document.body.querySelector(".lazy-body-button")).not.toBeNull();
  });

  it("destroyOnClose 会在再次打开时重新挂载主体内容", async () => {
    const setupSpy = vi.fn();
    const LazyChild = {
      setup() {
        setupSpy();
        return () => h("div", { class: "lazy-child" }, "child");
      }
    };

    const wrapper = mountDrawer(
      {
        destroyOnClose: true
      },
      {
        default: () => h(LazyChild)
      }
    );

    await waitForTransition();
    expect(setupSpy).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      modelValue: false
    });
    await waitForTransition();
    expect(document.body.querySelector(".lazy-child")).toBeNull();

    await wrapper.setProps({
      modelValue: true
    });
    await waitForTransition();
    expect(setupSpy).toHaveBeenCalledTimes(2);
  });

  it("beforeClose 拦截时 destroyOnClose 不会提前卸载内容", async () => {
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));
    const wrapper = mountDrawer(
      {
        destroyOnClose: true,
        beforeClose
      },
      {
        default: () => h("div", { class: "guarded-body" }, "guarded")
      }
    );

    await waitForTransition();

    wrapper.vm.handleClose();
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(document.body.querySelector(".guarded-body")).not.toBeNull();
  });

  it("beforeClose 会收到关闭原因", async () => {
    const reasons: Array<string | undefined> = [];
    const beforeClose = vi.fn((done: (cancel?: boolean) => void, reason?: string) => {
      reasons.push(reason);
      done(true);
    });
    const wrapper = mountDrawer({
      beforeClose
    });

    await waitForTransition();

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    const overlay = document.body.querySelector(".xy-drawer__overlay") as HTMLElement | null;
    overlay?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    overlay?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();

    wrapper.vm.handleClose();
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(4);
    expect(reasons).toEqual(["close", "backdrop", "escape", "programmatic"]);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("beforeClose 进行中时会忽略重复关闭请求", async () => {
    const beforeClose = vi.fn();
    mountDrawer({
      beforeClose
    });

    await waitForTransition();

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    closeButton?.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
  });

  it("外部未立即同步 modelValue 时不会锁死后续关闭请求", async () => {
    const wrapper = mountDrawer();

    await waitForTransition();

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    closeButton?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toHaveLength(2);
  });

  it("支持按下 Escape 关闭", async () => {
    const wrapper = mountDrawer();
    await waitForTransition();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await waitForTransition();

    expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("支持点击外部关闭", async () => {
    const wrapper = mountDrawer();
    await waitForTransition();

    const overlay = document.body.querySelector(".xy-drawer__overlay") as HTMLElement | null;
    overlay?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    overlay?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("遮罩按下后如果没有在遮罩上完成点击，则不会关闭", async () => {
    const wrapper = mountDrawer();
    await waitForTransition();

    const overlay = document.body.querySelector(".xy-drawer__overlay") as HTMLElement | null;
    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;

    overlay?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    panel?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    panel?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("modalPenetrable=true 且无遮罩时不会因外部点击关闭", async () => {
    const wrapper = mountDrawer({
      modal: false,
      modalPenetrable: true
    });

    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("modalPenetrable=true 时背景按钮仍可点击", async () => {
    const Demo = defineComponent({
      components: {
        XyDrawer
      },
      setup() {
        const open = ref(true);
        const count = ref(0);

        return {
          count,
          open
        };
      },
      render() {
        return h("div", [
          h(
            "button",
            {
              class: "outside-trigger",
              onClick: () => {
                this.count += 1;
              }
            },
            String(this.count)
          ),
          h(
            XyDrawer,
            {
              modelValue: this.open,
              modal: false,
              modalPenetrable: true,
              title: "穿透抽屉",
              "onUpdate:modelValue": (value: boolean) => {
                this.open = value;
              }
            },
            {
              default: () => h("div", "body")
            }
          )
        ]);
      }
    });

    const wrapper = mount(Demo, {
      attachTo: document.body,
      global: {
        stubs: {
          transition: false
        }
      }
    });

    await nextTick();

    const button = document.body.querySelector(".outside-trigger") as HTMLButtonElement | null;
    button?.click();
    await nextTick();

    expect(button?.textContent).toBe("1");
    expect(wrapper.findComponent(XyDrawer).emitted("update:modelValue")).toBeUndefined();
  });

  it("嵌套抽屉只会响应最上层的 Escape 关闭", async () => {
    const outer = mountDrawer({
      title: "外层"
    });
    const inner = mountDrawer({
      title: "内层"
    });

    await waitForTransition();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await waitForTransition();

    expect(outer.emitted("update:modelValue")).toBeUndefined();
    expect(inner.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("嵌套抽屉点击遮罩时只关闭最上层", async () => {
    const outer = mountDrawer({
      title: "外层"
    });
    const inner = mountDrawer({
      title: "内层"
    });

    await waitForTransition();

    const overlays = Array.from(document.body.querySelectorAll(".xy-drawer__overlay")) as HTMLElement[];
    const topOverlay = overlays[overlays.length - 1] ?? null;

    topOverlay?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    topOverlay?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    topOverlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    expect(outer.emitted("update:modelValue")).toBeUndefined();
    expect(inner.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("modalClass 会挂到 overlay，zIndex 会作用到根节点", async () => {
    mountDrawer({
      modalClass: "mask-layer",
      zIndex: 3200
    });

    await nextTick();

    const overlay = document.body.querySelector(".xy-drawer__overlay") as HTMLElement | null;
    const root = document.body.querySelector(".xy-drawer") as HTMLElement | null;

    expect(overlay?.classList.contains("mask-layer")).toBe(true);
    expect(root?.style.zIndex).toBe("3200");
  });

  it("支持 header/body/footerClass、header 插槽参数和 headerAriaLevel", async () => {
    let slotProps:
      | {
          close: () => void;
          titleId: string;
          titleClass: string;
        }
      | undefined;

    const wrapper = mountDrawer(
      {
        title: "抽屉标题",
        headerClass: "custom-header",
        bodyClass: "custom-body",
        footerClass: "custom-footer",
        headerAriaLevel: 4
      },
      {
        header: ((props: { close: () => void; titleId: string; titleClass: string }) => {
          slotProps = props as typeof slotProps;
          return h("button", {
            class: "slot-close",
            "data-title-id": props.titleId,
            "data-title-class": props.titleClass,
            onClick: props.close
          }, "关闭");
        }) as never,
        footer: () => h("div", "footer")
      }
    );

    await nextTick();

    expect(document.body.querySelector(".custom-header")).not.toBeNull();
    expect(document.body.querySelector(".custom-body")).not.toBeNull();
    expect(document.body.querySelector(".custom-footer")).not.toBeNull();
    expect(slotProps?.titleClass).toBe("xy-drawer__title");
    expect(slotProps?.titleId).toBeTruthy();

    const titleButton = document.body.querySelector(".slot-close") as HTMLButtonElement | null;
    expect(titleButton?.dataset.titleId).toBeTruthy();
    expect(titleButton?.dataset.titleClass).toBe("xy-drawer__title");

    titleButton?.click();
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);

    const labelledDrawer = mountDrawer({
      title: "可访问标题",
      headerAriaLevel: 5
    });
    await nextTick();

    const title = document.body.querySelector(".xy-drawer__title") as HTMLElement | null;
    expect(title?.getAttribute("aria-level")).toBe("5");
    const dialog = document.body.querySelector("[role='dialog']") as HTMLElement | null;
    expect(dialog?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("兼容 title 插槽并透出标题属性", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    mountDrawer(
      {
        modelValue: true
      },
      {
        title: ({ titleId, titleClass }: { titleId: string; titleClass: string }) =>
          h("span", { id: titleId, class: `${titleClass} legacy-title` }, "兼容标题")
      }
    );

    await nextTick();

    expect(document.body.querySelector(".legacy-title")?.textContent).toBe("兼容标题");
    const dialog = document.body.querySelector("[role='dialog']") as HTMLElement | null;
    const labelledBy = dialog?.getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy ?? "")).not.toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("customClass 会兼容挂到面板并给出废弃提示", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    mountDrawer({
      customClass: "legacy-panel-class"
    });

    await nextTick();

    expect(document.body.querySelector(".legacy-panel-class")).not.toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("暴露 handleClose，并在打开和关闭时处理焦点", async () => {
    document.body.innerHTML = `<button id="trigger">open</button>`;
    const trigger = document.getElementById("trigger") as HTMLButtonElement;
    trigger.focus();

    const wrapper = mountDrawer(
      {},
      {
        default: () => h("button", { class: "inside-button" }, "inside")
      }
    );

    await nextTick();
    await nextTick();

    expect(wrapper.emitted("open-auto-focus")).toHaveLength(1);
    expect((document.activeElement as HTMLElement | null)?.className).toContain("xy-drawer__close");

    wrapper.vm.handleClose();
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);

    await wrapper.setProps({
      modelValue: false
    });
    await waitForTransition();

    expect(wrapper.emitted("close-auto-focus")).toHaveLength(1);
    expect(document.activeElement).toBe(trigger);
    expect(typeof wrapper.vm.afterEnter).toBe("function");
    expect(typeof wrapper.vm.afterLeave).toBe("function");
  });

  it("焦点意外离开抽屉时会重新回到抽屉内部", async () => {
    document.body.innerHTML = `<button id="outside">outside</button>`;

    mountDrawer(
      {},
      {
        default: () => h("button", { class: "inside-button" }, "inside")
      }
    );

    await waitForTransition();

    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;
    const insideButton = document.body.querySelector(".inside-button") as HTMLButtonElement | null;
    const outsideButton = document.getElementById("outside") as HTMLButtonElement | null;

    insideButton?.focus();
    outsideButton?.focus();
    await waitForMacrotask();

    expect(document.activeElement).not.toBe(outsideButton);
    expect(panel?.contains(document.activeElement as Node)).toBe(true);
  });

  it("panel 自身聚焦时 Shift+Tab 会回到最后一个可聚焦元素", async () => {
    mountDrawer(
      {},
      {
        default: () => h("button", { class: "inside-last" }, "last")
      }
    );

    await waitForTransition();

    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;
    const lastButton = document.body.querySelector(".inside-last") as HTMLButtonElement | null;

    panel?.focus();
    panel?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }));
    await nextTick();

    expect(document.activeElement).toBe(lastButton);
  });

  it("无遮罩穿透模式下指针切换焦点不会被抽屉重新抢回", async () => {
    document.body.innerHTML = `<button id="outside">outside</button>`;

    mountDrawer(
      {
        modal: false,
        modalPenetrable: true
      },
      {
        default: () => h("button", { class: "inside-button" }, "inside")
      }
    );

    await waitForTransition();

    const insideButton = document.body.querySelector(".inside-button") as HTMLButtonElement | null;
    const outsideButton = document.getElementById("outside") as HTMLButtonElement | null;

    insideButton?.focus();
    outsideButton?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    outsideButton?.focus();
    await waitForMacrotask();

    expect(document.activeElement).toBe(outsideButton);
  });

  it("resizable 模式支持拖拽调整尺寸并发出事件", async () => {
    const wrapper = mountDrawer({
      resizable: true,
      size: 300,
      direction: "rtl"
    });

    await nextTick();

    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;
    const dragger = document.body.querySelector(".xy-drawer__dragger") as HTMLElement | null;

    Object.defineProperty(panel, "offsetWidth", {
      configurable: true,
      get: () => 300
    });

    dragger?.dispatchEvent(createMouseEvent("mousedown", 300));
    window.dispatchEvent(createMouseEvent("mousemove", 260));
    await nextTick();

    expect(panel?.style.width).toBe("340px");
    expect(wrapper.emitted("resize-start")?.[0]?.[1]).toBe(300);
    expect(wrapper.emitted("resize")?.[0]?.[1]).toBe(340);

    window.dispatchEvent(createMouseEvent("mouseup", 260));
    await nextTick();

    expect(wrapper.emitted("resize-end")?.[0]?.[1]).toBe(340);
  });

  it("modalFade=false 时会关闭遮罩渐隐类", async () => {
    mountDrawer({
      modalFade: false
    });

    await nextTick();

    const root = document.body.querySelector(".xy-drawer") as HTMLElement | null;
    expect(root?.classList.contains("is-no-modal-fade")).toBe(true);
  });

  it("支持 closeIcon、fullscreen 和 transition", async () => {
    const onAfterEnter = vi.fn();
    const onAfterLeave = vi.fn();

    const wrapper = mountDrawer({
      modelValue: false,
      fullscreen: true,
      resizable: true,
      closeIcon: "mdi:close-circle-outline",
      transition: {
        name: "xy-fade",
        onAfterEnter,
        onAfterLeave
      }
    });

    await wrapper.setProps({
      modelValue: true
    });
    await waitForTransition();

    const root = document.body.querySelector(".xy-drawer") as HTMLElement | null;
    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;

    expect(root?.classList.contains("is-fullscreen")).toBe(true);
    expect(panel?.classList.contains("is-fullscreen")).toBe(true);
    expect(panel?.style.width).toBe("100%");
    expect(panel?.style.height).toBe("100%");
    expect(document.body.querySelector(".xy-drawer__dragger")).toBeNull();
    expect(onAfterEnter).toHaveBeenCalled();

    const closeIcon = wrapper.findComponent(XyIcon);
    expect(closeIcon.exists()).toBe(true);
    expect(closeIcon.props("icon")).toBe("mdi:close-circle-outline");

    await wrapper.setProps({
      modelValue: false
    });
    await waitForTransition();
    expect(onAfterLeave).toHaveBeenCalled();
  });
});
