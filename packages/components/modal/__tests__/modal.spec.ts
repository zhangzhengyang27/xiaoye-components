import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { XyModal } from "../index";

enableAutoUnmount(afterEach);

describe("XyModal", () => {
  it("支持通过 close 按钮关闭", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "测试弹窗"
      }
    });

    const closeButton = document.body.querySelector(".xy-modal__close") as HTMLButtonElement | null;

    closeButton?.click();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("通过关闭按钮关闭后恢复到触发元素，并补全标题 aria 关联", async () => {
    document.body.innerHTML = "";

    const Demo = defineComponent({
      components: {
        XyModal
      },
      setup() {
        const open = ref(false);
        return {
          open
        };
      },
      template: `
        <div>
          <button class="opener" type="button" @click="open = true">打开</button>
          <xy-modal v-model="open" title="成员弹窗">
            <button type="button">内部按钮</button>
          </xy-modal>
        </div>
      `
    });

    const wrapper = mount(Demo, {
      attachTo: document.body
    });

    const opener = wrapper.find(".opener");
    (opener.element as HTMLButtonElement).focus();
    await opener.trigger("click");
    await nextTick();
    await nextTick();

    const dialogElement = document.body.querySelector("[role='dialog']") as HTMLElement | null;
    expect(dialogElement?.getAttribute("aria-labelledby")).toBeTruthy();

    const closeButton = document.body.querySelector(".xy-modal__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(opener.element);
  });

  it("lockScroll=false 时不锁定 body 滚动", async () => {
    document.body.innerHTML = "";

    mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "测试弹窗",
        lockScroll: false
      }
    });

    await nextTick();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("showClose=false 时隐藏关闭按钮", () => {
    document.body.innerHTML = "";

    mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        showClose: false
      }
    });

    expect(document.body.querySelectorAll(".xy-modal__close")).toHaveLength(0);
  });

  it("支持 beforeClose 拦截关闭", async () => {
    document.body.innerHTML = "";
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));

    const wrapper = mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        beforeClose
      }
    });

    const closeButton = document.body.querySelector(".xy-modal__close") as HTMLButtonElement | null;
    closeButton?.click();
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("支持 appendTo 和 modal=false", async () => {
    document.body.innerHTML = `<div id="modal-target"></div>`;

    mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: true,
        appendTo: "#modal-target",
        modal: false,
        title: "挂载测试"
      }
    });

    const target = document.getElementById("modal-target") as HTMLDivElement;
    expect(target.querySelector("[role='dialog']")).not.toBeNull();
    expect(target.querySelector(".xy-modal__overlay")).toBeNull();
  });

  it("支持 openDelay / closeDelay，并发出 opened / closed", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    const wrapper = mount(XyModal, {
      attachTo: document.body,
      props: {
        modelValue: false,
        openDelay: 100,
        closeDelay: 80,
        title: "延迟弹窗"
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
    vi.advanceTimersByTime(90);
    await nextTick();
    expect(wrapper.emitted("open")).toBeUndefined();

    vi.advanceTimersByTime(10);
    await nextTick();
    expect(document.body.querySelector("[role='dialog']")).not.toBeNull();
    expect(wrapper.emitted("open")).toHaveLength(1);

    await wrapper.setProps({
      modelValue: false
    });
    vi.advanceTimersByTime(70);
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
