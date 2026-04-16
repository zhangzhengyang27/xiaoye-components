import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { XyPopconfirm } from "../index";

enableAutoUnmount(afterEach);

function createVirtualRef(width = 180, height = 40) {
  const element = document.createElement("button");

  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () =>
      ({
        x: 100,
        y: 120,
        top: 120,
        left: 100,
        right: 100 + width,
        bottom: 120 + height,
        width,
        height,
        toJSON: () => ({})
      }) as DOMRect
  });

  document.body.appendChild(element);
  return element;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("XyPopconfirm", () => {
  it("会派发 before-show/open 与 before-hide/close 顺序事件", async () => {
    const sequence: string[] = [];

    const wrapper = mount({
      components: {
        XyPopconfirm
      },
      setup() {
        const push = (name: string) => {
          sequence.push(name);
        };

        return {
          push
        };
      },
      template: `
        <xy-popconfirm
          title="确认归档"
          :hide-after="0"
          :teleported="false"
          @before-show="push('before-show')"
          @open="push('open')"
          @before-hide="push('before-hide')"
          @close="push('close')"
        >
          <template #reference>
            <button class="reference-trigger">归档</button>
          </template>
        </xy-popconfirm>
      `
    }, {
      attachTo: document.body,
      global: {
        stubs: {
          transition: false
        }
      }
    });

    await wrapper.get(".reference-trigger").trigger("click");
    await nextTick();
    await nextTick();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    await nextTick();

    expect(sequence).toEqual([
      "before-show",
      "open",
      "before-hide",
      "close"
    ]);
  });

  it("default 插槽优先于 content，并暴露 close/confirming/cancelling", async () => {
    const wrapper = mount(XyPopconfirm, {
      props: {
        title: "确认发布",
        content: "不会出现的 content",
        modelValue: true,
        teleported: false
      },
      slots: {
        default: ({ close, confirming, cancelling }) => [
          h("div", { class: "body-slot" }, `${confirming}-${cancelling}`),
          h("button", { class: "body-close", onClick: close }, "关闭")
        ]
      }
    });

    await nextTick();

    expect(wrapper.find(".body-slot").text()).toBe("false-false");
    expect(wrapper.text()).not.toContain("不会出现的 content");

    await wrapper.get(".body-close").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });

  it("beforeConfirm 成功后会派发 confirm，并按 hideAfter 延迟关闭", async () => {
    vi.useFakeTimers();
    const beforeConfirm = vi.fn(async () => true);

    const wrapper = mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        title: "确定删除该成员吗？",
        hideAfter: 120,
        beforeConfirm
      },
      slots: {
        reference: "<button class='reference-trigger'>删除成员</button>"
      }
    });

    await wrapper.get(".reference-trigger").trigger("click");
    await nextTick();

    const panel = document.body.querySelector(".xy-popconfirm__panel") as HTMLElement | null;
    const confirmButton = document.body.querySelectorAll(".xy-popconfirm__actions .xy-button")[1] as
      | HTMLElement
      | undefined;

    confirmButton?.click();
    await Promise.resolve();
    await nextTick();

    expect(beforeConfirm).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("confirm")).toHaveLength(1);
    expect(panel?.style.display).not.toBe("none");

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });

  it("beforeConfirm 返回 false 时保持展开且不派发 confirm", async () => {
    const beforeConfirm = vi.fn(() => false);

    const wrapper = mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        title: "确认提交吗？",
        hideAfter: 0,
        beforeConfirm
      },
      slots: {
        reference: "<button class='reference-trigger'>提交</button>"
      }
    });

    await wrapper.get(".reference-trigger").trigger("click");
    await nextTick();

    const confirmButton = document.body.querySelectorAll(".xy-popconfirm__actions .xy-button")[1] as
      | HTMLElement
      | undefined;
    confirmButton?.click();
    await nextTick();

    expect(beforeConfirm).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("confirm")).toBeUndefined();
    expect(document.body.querySelector(".xy-popconfirm__panel")).not.toBeNull();
  });

  it("beforeCancel Promise reject 时保持展开且不派发 cancel", async () => {
    const beforeCancel = vi.fn(async () => {
      throw new Error("cancel blocked");
    });

    const wrapper = mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        title: "确认取消本次发布吗？",
        hideAfter: 0,
        beforeCancel
      },
      slots: {
        reference: "<button class='reference-trigger'>取消发布</button>"
      }
    });

    await wrapper.get(".reference-trigger").trigger("click");
    await nextTick();

    const cancelButton = document.body.querySelectorAll(".xy-popconfirm__actions .xy-button")[0] as
      | HTMLElement
      | undefined;
    cancelButton?.click();
    await Promise.resolve();
    await nextTick();

    expect(beforeCancel).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("cancel")).toBeUndefined();
    expect(document.body.querySelector(".xy-popconfirm__panel")).not.toBeNull();
  });

  it("pending 中重复点击不会重复触发 beforeConfirm，且按钮状态会合并", async () => {
    let resolveConfirm: (() => void) | undefined;
    const beforeConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = () => resolve();
        })
    );

    const wrapper = mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        modelValue: true,
        teleported: false,
        hideAfter: 0,
        title: "确认执行同步吗？",
        beforeConfirm,
        confirmButtonType: "danger",
        confirmButtonProps: {
          plain: true,
          icon: "mdi:check-bold"
        },
        cancelButtonProps: {
          icon: "mdi:close-thick",
          disabled: true
        }
      }
    });

    await nextTick();

    const buttons = wrapper.findAll(".xy-popconfirm__actions .xy-button");
    const cancelButton = buttons[0];
    const confirmButton = buttons[1];

    expect(confirmButton.classes()).toContain("xy-button--danger");
    expect(confirmButton.classes()).toContain("is-plain");
    expect(wrapper.find('[data-icon="mdi:check-bold"]').exists()).toBe(true);
    expect(cancelButton.attributes("disabled")).toBeDefined();

    await confirmButton.trigger("click");
    await confirmButton.trigger("click");
    await nextTick();

    expect(beforeConfirm).toHaveBeenCalledTimes(1);
    expect(confirmButton.classes()).toContain("is-loading");
    expect(cancelButton.classes()).toContain("is-disabled");

    resolveConfirm?.();
    await Promise.resolve();
    await nextTick();

    expect(wrapper.emitted("confirm")).toHaveLength(1);
  });

  it("支持 actions 插槽作用域参数", async () => {
    const wrapper = mount(XyPopconfirm, {
      props: {
        modelValue: true,
        title: "确认上线吗？",
        teleported: false,
        hideAfter: 0
      },
      slots: {
        actions: ({ confirm, cancel, confirming, cancelling }) => [
          h("span", { class: "action-state" }, `${confirming}-${cancelling}`),
          h("button", { class: "custom-cancel", onClick: cancel }, "稍后"),
          h("button", { class: "custom-confirm", onClick: confirm }, "立即上线")
        ]
      }
    });

    await nextTick();

    expect(wrapper.find(".action-state").text()).toBe("false-false");
    await wrapper.get(".custom-confirm").trigger("click");
    expect(wrapper.emitted("confirm")).toHaveLength(1);
  });

  it("支持 triggerKeys 打开，以及 transition/popperOptions/virtualRef 不阻塞展示", async () => {
    const wrapper = mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        title: "键盘打开确认框",
        triggerKeys: ["F2"],
        transition: "xy-fade",
        popperOptions: {
          fallbackPlacements: ["top", "left"],
          flip: true
        }
      },
      slots: {
        reference: "<button class='reference-trigger'>键盘打开</button>"
      }
    });

    await wrapper.get(".reference-trigger").trigger("keydown", { key: "F2" });
    await nextTick();

    expect(document.body.querySelector(".xy-popconfirm__panel")).not.toBeNull();

    mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "虚拟触发定位",
        virtualRef: createVirtualRef(220, 40),
        virtualTriggering: true,
        hideAfter: 0,
        transition: "xy-fade",
        popperOptions: {
          fallbackPlacements: ["top", "right"]
        }
      }
    });

    await nextTick();
    await nextTick();

    const panels = document.body.querySelectorAll(".xy-popconfirm__panel");
    expect(panels.length).toBeGreaterThan(0);
  });

  it("hide expose 可以立即关闭，并在非虚拟触发模式下恢复焦点", async () => {
    const wrapper = mount(XyPopconfirm, {
      attachTo: document.body,
      props: {
        title: "关闭后恢复焦点",
        hideAfter: 0,
        teleported: false
      },
      slots: {
        reference: "<button class='focus-trigger'>打开确认框</button>"
      }
    });

    const trigger = wrapper.get(".focus-trigger").element as HTMLButtonElement;
    trigger.focus();

    await wrapper.get(".focus-trigger").trigger("click");
    await nextTick();

    (wrapper.vm as unknown as { hide: () => void }).hide();
    await nextTick();

    expect(document.activeElement).toBe(trigger);
  });
});
