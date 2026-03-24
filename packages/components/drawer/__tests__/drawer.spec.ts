import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyDrawer } from "../index";

enableAutoUnmount(afterEach);

describe("XyDrawer", () => {
  it("支持通过关闭按钮关闭", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "侧边抽屉"
      }
    });

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("支持 top 方向并按高度设置 size", () => {
    document.body.innerHTML = "";

    mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: true,
        placement: "top",
        size: 280
      }
    });

    const panel = document.body.querySelector(".xy-drawer__panel") as HTMLElement | null;
    expect(panel?.style.height).toBe("280px");
  });

  it("showClose=false 时隐藏关闭按钮", async () => {
    document.body.innerHTML = "";

    mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: true,
        showClose: false
      }
    });

    await nextTick();
    expect(document.body.querySelectorAll(".xy-drawer__close")).toHaveLength(0);
  });

  it("支持 beforeClose 拦截关闭按钮关闭", async () => {
    document.body.innerHTML = "";
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));

    const wrapper = mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: true,
        beforeClose
      }
    });

    const closeButton = document.body.querySelector(".xy-drawer__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("支持 appendTo 和无遮罩模式", async () => {
    document.body.innerHTML = `<div id="drawer-target"></div>`;

    mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: true,
        appendTo: "#drawer-target",
        modal: false,
        title: "挂载抽屉"
      }
    });

    const target = document.getElementById("drawer-target") as HTMLDivElement;
    expect(target.querySelector("[role='dialog']")).not.toBeNull();
    expect(target.querySelector(".xy-drawer__overlay")).toBeNull();
  });

  it("支持 openDelay / closeDelay，并发出 opened / closed", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    const wrapper = mount(XyDrawer, {
      attachTo: document.body,
      props: {
        modelValue: false,
        openDelay: 120,
        closeDelay: 90,
        title: "延迟抽屉"
      },
      global: {
        stubs: {
          transition: false
        }
      }
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
    await nextTick();
    await nextTick();
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect((wrapper.emitted("opened")?.length ?? 0) >= 1).toBe(true);

    vi.useRealTimers();
  });
});
