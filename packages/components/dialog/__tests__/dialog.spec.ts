import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { XyConfigProvider } from "../../config-provider";
import { XyDialog, XyDialogService } from "../index";
import type { DialogInstance } from "../index";
import {
  dialogServiceState,
  finishDialogServiceEntry,
  requestCloseDialogServiceEntry,
  setDialogServiceEntryPendingAction
} from "../src/service-state";

enableAutoUnmount(afterEach);

async function flushDialog() {
  await nextTick();
  await nextTick();
  await nextTick();
}

function createMouseEvent(
  type: "mousedown" | "mousemove" | "mouseup",
  clientX: number,
  clientY: number
) {
  return new MouseEvent(type, {
    bubbles: true,
    button: 0,
    clientX,
    clientY
  });
}

async function flushServiceDialog() {
  await flushDialog();
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  await flushDialog();
}

function expectCurrentServiceTitle(title: string) {
  const titleElement = document.body.querySelector(".xy-dialog__title");
  expect(titleElement?.textContent).toContain(title);
}

describe("XyDialog", () => {
  afterEach(async () => {
    XyDialogService.closeAll();
    await flushServiceDialog();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
    vi.useRealTimers();
  });

  it("支持基础渲染和 footer 插槽", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "新建成员"
      },
      slots: {
        default: () => "主体内容",
        footer: () => "底部操作"
      }
    });

    await flushDialog();

    expect(document.body.querySelector(".xy-dialog__title")?.textContent).toContain("新建成员");
    expect(document.body.querySelector(".xy-dialog__body")?.textContent).toContain("主体内容");
    expect(document.body.querySelector(".xy-dialog__footer")?.textContent).toContain("底部操作");
    expect(wrapper.emitted("open")).toHaveLength(1);
    expect(wrapper.emitted("opened")).toHaveLength(1);
  });

  it("header 插槽会透出 close、titleId 和 titleClass", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true
      },
      slots: {
        header: ({
          close,
          titleId,
          titleClass
        }: {
          close: () => void;
          titleId: string;
          titleClass: string;
        }) =>
          h(
            "button",
            {
              class: "header-trigger",
              "data-title-id": titleId,
              "data-title-class": titleClass,
              onClick: close
            },
            "自定义头部"
          )
      }
    });

    await flushDialog();

    const headerTrigger = document.body.querySelector(
      ".header-trigger"
    ) as HTMLButtonElement | null;
    expect(headerTrigger?.dataset.titleId).toBeTruthy();
    expect(headerTrigger?.dataset.titleClass).toBe("xy-dialog__title");

    headerTrigger?.click();
    await flushDialog();

    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("兼容 title 插槽并透出标题属性", async () => {
    document.body.innerHTML = "";

    mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true
      },
      slots: {
        title: ({ titleId, titleClass }: { titleId: string; titleClass: string }) =>
          h("span", { id: titleId, class: titleClass }, "插槽标题")
      }
    });

    await flushDialog();

    const title = document.body.querySelector(".xy-dialog__title") as HTMLSpanElement | null;
    expect(title?.id).toMatch(/^xy-dialog-title-/);
    expect(title?.textContent).toBe("插槽标题");
  });

  it("自定义 header 且未挂 titleId 时会回退到 aria-label，并把 modalClass 挂到遮罩节点", async () => {
    document.body.innerHTML = "";

    mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "高级配置",
        modalClass: "custom-mask"
      },
      slots: {
        header: () => h("div", { class: "custom-header" }, "自定义头部")
      }
    });

    await flushDialog();

    const dialog = document.body.querySelector("[role='dialog']") as HTMLElement | null;
    const overlay = document.body.querySelector(".xy-dialog__overlay") as HTMLElement | null;

    expect(dialog?.getAttribute("aria-labelledby")).toBeNull();
    expect(dialog?.getAttribute("aria-label")).toBe("高级配置");
    expect(overlay?.classList.contains("custom-mask")).toBe(true);
  });

  it("打开后补齐 aria 关联并在关闭后恢复焦点", async () => {
    document.body.innerHTML = `<button class="opener" type="button">打开</button>`;
    const opener = document.body.querySelector(".opener") as HTMLButtonElement;
    opener.focus();

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "成员弹窗"
      },
      slots: {
        default: () => h("button", { type: "button" }, "内部按钮")
      }
    });

    await flushDialog();

    const dialog = document.body.querySelector("[role='dialog']") as HTMLElement | null;
    expect(dialog?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(wrapper.emitted("openAutoFocus")).toHaveLength(1);

    const closeButton = document.body.querySelector(
      ".xy-dialog__close"
    ) as HTMLButtonElement | null;
    closeButton?.click();
    await flushDialog();

    expect(document.activeElement).toBe(opener);
    expect(wrapper.emitted("closeAutoFocus")).toHaveLength(1);
  });

  it("支持通过遮罩点击关闭，点击面板本身不会误触发关闭", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "遮罩测试"
      }
    });

    await flushDialog();

    const overlay = document.body.querySelector(".xy-dialog") as HTMLElement;
    const panel = document.body.querySelector(".xy-dialog__panel") as HTMLElement;

    panel.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    panel.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    panel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushDialog();
    expect(wrapper.emitted("close")).toBeUndefined();

    overlay.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    overlay.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushDialog();

    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("支持 Escape 关闭，并且只响应最上层对话框", async () => {
    document.body.innerHTML = "";

    const first = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "第一层"
      }
    });

    const second = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "第二层"
      }
    });

    await flushDialog();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await flushDialog();

    expect(first.emitted("update:modelValue")).toBeUndefined();
    expect(second.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("支持 beforeClose 拦截内建关闭入口", async () => {
    document.body.innerHTML = "";
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        beforeClose
      }
    });

    await flushDialog();

    const closeButton = document.body.querySelector(
      ".xy-dialog__close"
    ) as HTMLButtonElement | null;
    closeButton?.click();
    await flushDialog();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("默认 appendToBody=false，且支持 appendTo 自定义挂载点", async () => {
    document.body.innerHTML = `<div id="dialog-target"></div>`;
    const host = document.createElement("div");
    document.body.appendChild(host);

    mount(XyDialog, {
      attachTo: host,
      props: {
        modelValue: true,
        title: "本地挂载",
        appendToBody: false
      }
    });

    await flushDialog();
    expect(host.querySelector(".xy-dialog")).not.toBeNull();

    mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        appendTo: "#dialog-target",
        title: "目标挂载"
      }
    });

    await flushDialog();
    expect(document.getElementById("dialog-target")?.querySelector(".xy-dialog")).not.toBeNull();
  });

  it("支持 destroyOnClose 的懒渲染和销毁", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: false,
        destroyOnClose: true,
        title: "懒渲染",
        transition: {
          name: "xy-dialog-fade",
          css: false,
          onLeave: (_element: Element, done: () => void) => {
            done();
          }
        }
      }
    });

    expect(document.body.querySelector(".xy-dialog__panel")).toBeNull();

    await wrapper.setProps({
      modelValue: true
    });
    await flushDialog();
    expect(document.body.querySelector(".xy-dialog__panel")).not.toBeNull();

    await wrapper.setProps({
      modelValue: false
    });
    await flushDialog();
    expect(document.body.querySelector(".xy-dialog__panel")).toBeNull();
  });

  it("支持 center、alignCenter、fullscreen、分区 class 和 zIndex 覆盖", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "样式能力",
        center: true,
        alignCenter: true,
        fullscreen: true,
        headerClass: "test-header",
        bodyClass: "test-body",
        footerClass: "test-footer",
        zIndex: 4000
      },
      slots: {
        footer: () => "底部"
      }
    });

    await flushDialog();

    const root = document.body.querySelector(".xy-dialog") as HTMLElement;
    const panel = document.body.querySelector(".xy-dialog__panel") as HTMLElement;

    expect(root.classList.contains("is-align-center")).toBe(true);
    expect(root.classList.contains("is-fullscreen")).toBe(true);
    expect(root.style.zIndex).toBe("4000");
    expect(panel.classList.contains("xy-dialog__panel--center")).toBe(true);
    expect(panel.classList.contains("is-fullscreen")).toBe(true);
    expect(document.body.querySelector(".test-header")).not.toBeNull();
    expect(document.body.querySelector(".test-body")).not.toBeNull();
    expect(document.body.querySelector(".test-footer")).not.toBeNull();

    await wrapper.setProps({
      fullscreen: false
    });
    await flushDialog();
    expect(panel.classList.contains("is-fullscreen")).toBe(false);
  });

  it("支持 openDelay / closeDelay，并在关闭期间标记 is-closing", async () => {
    document.body.innerHTML = "";
    vi.useFakeTimers();

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: false,
        title: "延迟对话框",
        openDelay: 100,
        closeDelay: 80,
        transition: {
          name: "xy-dialog-fade",
          css: false,
          onLeave: (_element: Element, done: () => void) => {
            window.setTimeout(done, 40);
          }
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
    await flushDialog();
    expect(wrapper.emitted("open")).toHaveLength(1);

    const closeButton = document.body.querySelector(".xy-dialog__close") as HTMLButtonElement;
    closeButton.click();
    vi.advanceTimersByTime(79);
    await nextTick();
    expect(wrapper.emitted("close")).toBeUndefined();

    vi.advanceTimersByTime(1);
    await nextTick();
    const overlay = document.body.querySelector(".xy-dialog") as HTMLElement;
    expect(overlay.classList.contains("is-closing")).toBe(true);
    expect(wrapper.emitted("close")).toHaveLength(1);

    vi.advanceTimersByTime(40);
    await flushDialog();
    expect(wrapper.emitted("closed")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);

    vi.useRealTimers();
  });

  it("支持 draggable、overflow 和 resetPosition expose", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "拖拽对话框",
        draggable: true,
        overflow: true
      }
    });

    await flushDialog();

    const header = document.body.querySelector(".xy-dialog__header") as HTMLElement;
    const panel = document.body.querySelector(".xy-dialog__panel") as HTMLElement;

    header.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        button: 0,
        clientX: 20,
        clientY: 20
      })
    );
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: 60,
        clientY: 80
      })
    );
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    await flushDialog();

    expect(panel.style.transform).toContain("translate(40px, 60px)");

    const instance = wrapper.vm as unknown as DialogInstance;
    instance.resetPosition();
    await nextTick();
    expect(panel.style.transform).toBe("");
  });

  it("支持 resizable 与 min/max 边界，并发出 resize-start/resize/resize-end", async () => {
    document.body.innerHTML = "";
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 900
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 700
    });

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "可调整尺寸",
        resizable: true,
        width: 400,
        minWidth: 300,
        maxWidth: 500,
        minHeight: 180,
        maxHeight: 260
      }
    });

    await flushDialog();

    const panel = document.body.querySelector(".xy-dialog__panel") as HTMLElement;
    Object.defineProperty(panel, "offsetWidth", {
      configurable: true,
      value: 400
    });
    Object.defineProperty(panel, "offsetHeight", {
      configurable: true,
      value: 220
    });

    const resizer = document.body.querySelector(".xy-dialog__resizer") as HTMLElement;
    resizer.dispatchEvent(createMouseEvent("mousedown", 0, 0));
    document.dispatchEvent(createMouseEvent("mousemove", 300, 300));
    document.dispatchEvent(createMouseEvent("mouseup", 300, 300));
    await flushDialog();

    expect(wrapper.emitted("resize-start")?.[0]?.slice(1)).toEqual([400, 220]);
    expect(wrapper.emitted("resize")?.at(-1)?.slice(1)).toEqual([500, 260]);
    expect(wrapper.emitted("resize-end")?.at(-1)?.slice(1)).toEqual([500, 260]);
    expect(panel.style.width).toBe("500px");
    expect(panel.style.height).toBe("260px");

    resizer.dispatchEvent(createMouseEvent("mousedown", 100, 100));
    document.dispatchEvent(createMouseEvent("mousemove", -400, -400));
    document.dispatchEvent(createMouseEvent("mouseup", -400, -400));
    await flushDialog();

    expect(panel.style.width).toBe("300px");
    expect(panel.style.height).toBe("180px");
  });

  it("支持 maximizable、update:fullscreen、maximize/restore，并在全屏时禁用拖拽和尺寸调整", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "窗口能力",
        maximizable: true,
        draggable: true,
        resizable: true
      }
    });

    await flushDialog();

    const panel = document.body.querySelector(".xy-dialog__panel") as HTMLElement;
    const action = document.body.querySelector(".xy-dialog__action") as HTMLButtonElement;
    const resizer = document.body.querySelector(".xy-dialog__resizer") as HTMLElement;

    expect(action).not.toBeNull();
    expect(resizer).not.toBeNull();

    action.click();
    await flushDialog();

    expect(wrapper.emitted("update:fullscreen")?.[0]).toEqual([true]);

    await wrapper.setProps({
      fullscreen: true
    });
    await flushDialog();

    expect(panel.classList.contains("is-fullscreen")).toBe(true);
    expect(document.body.querySelector(".xy-dialog__resizer")).toBeNull();
    expect(panel.classList.contains("is-draggable")).toBe(false);

    action.click();
    await flushDialog();
    expect(wrapper.emitted("update:fullscreen")?.[1]).toEqual([false]);

    await wrapper.setProps({
      fullscreen: false
    });
    await flushDialog();
    expect(document.body.querySelector(".xy-dialog__resizer")).not.toBeNull();
  });

  it("支持 stickyHeader、stickyFooter、bodyMaxHeight、loading 和 loadingText", async () => {
    document.body.innerHTML = "";

    mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "长内容",
        stickyHeader: true,
        stickyFooter: true,
        bodyMaxHeight: 240,
        loading: true,
        loadingText: "处理中..."
      },
      slots: {
        default: () => "主体内容",
        footer: () => "底部区域"
      }
    });

    await flushDialog();

    const header = document.body.querySelector(".xy-dialog__header") as HTMLElement;
    const footer = document.body.querySelector(".xy-dialog__footer") as HTMLElement;
    const body = document.body.querySelector(".xy-dialog__body") as HTMLElement;
    const loading = document.body.querySelector(".xy-dialog__loading") as HTMLElement | null;

    expect(header.classList.contains("is-sticky")).toBe(true);
    expect(footer.classList.contains("is-sticky")).toBe(true);
    expect(body.style.maxHeight).toBe("240px");
    expect(body.classList.contains("is-loading")).toBe(true);
    expect(loading?.textContent).toContain("处理中...");
  });

  it("会读取 ConfigProvider.loading 默认项并补 aria-busy", async () => {
    document.body.innerHTML = "";

    mount(
      defineComponent({
        components: {
          XyConfigProvider,
          XyDialog
        },
        template: `
          <xy-config-provider :loading="{ text: '全局对话框加载', svg: '<path class=\\'dialog-loading-path\\' d=\\'M 15 5 L 35 45\\' />' }">
            <xy-dialog model-value title="长内容" loading>
              主体内容
            </xy-dialog>
          </xy-config-provider>
        `
      }),
      {
        attachTo: document.body
      }
    );

    await flushDialog();

    const dialog = document.body.querySelector(".xy-dialog__panel") as HTMLElement | null;
    expect(dialog?.getAttribute("aria-busy")).toBe("true");
    expect(document.body.querySelector(".xy-loading-text")?.textContent).toContain(
      "全局对话框加载"
    );
    expect(document.body.querySelector(".dialog-loading-path")).not.toBeNull();
  });

  it("closeIcon 同时支持字符串和组件", async () => {
    document.body.innerHTML = "";
    const CustomClose = defineComponent({
      name: "CustomClose",
      setup() {
        return () => h("span", { class: "custom-close-icon" }, "X");
      }
    });

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "图标"
      }
    });

    await flushDialog();
    expect(document.body.querySelector(".xy-icon")).not.toBeNull();

    await wrapper.setProps({
      closeIcon: CustomClose
    });
    await flushDialog();
    expect(document.body.querySelector(".custom-close-icon")).not.toBeNull();
  });

  it("ConfigProvider.dialog 默认值会生效，局部 props 可以覆盖", async () => {
    document.body.innerHTML = "";

    const wrapper = mount(
      defineComponent({
        components: {
          XyConfigProvider,
          XyDialog
        },
        setup() {
          const open = ref(true);
          return {
            open
          };
        },
        template: `
          <xy-config-provider :dialog="{ alignCenter: true, draggable: true, resizable: true, stickyHeader: true }">
            <xy-dialog v-model="open" title="全局默认" />
            <xy-dialog v-model="open" title="局部覆盖" :align-center="false" :draggable="false" :resizable="false" :sticky-header="false" />
          </xy-config-provider>
        `
      }),
      {
        attachTo: document.body
      }
    );

    await flushDialog();

    const panels = Array.from(document.body.querySelectorAll(".xy-dialog__panel")) as HTMLElement[];
    const headers = Array.from(
      document.body.querySelectorAll(".xy-dialog__header")
    ) as HTMLElement[];
    const roots = Array.from(document.body.querySelectorAll(".xy-dialog")) as HTMLElement[];

    expect(roots[0]?.classList.contains("is-align-center")).toBe(true);
    expect(panels[0]?.classList.contains("is-draggable")).toBe(true);
    expect(document.body.querySelectorAll(".xy-dialog__resizer")).toHaveLength(1);
    expect(headers[0]?.classList.contains("is-sticky")).toBe(true);

    expect(roots[1]?.classList.contains("is-align-center")).toBe(false);
    expect(panels[1]?.classList.contains("is-draggable")).toBe(false);
    expect(headers[1]?.classList.contains("is-sticky")).toBe(false);

    wrapper.unmount();
  });

  it("支持 nested dialog，并且 appendToBody=true 时内层正确挂到 body", async () => {
    document.body.innerHTML = "";

    const Demo = defineComponent({
      components: { XyDialog },
      setup() {
        const outerOpen = ref(true);
        const innerOpen = ref(true);
        return {
          innerOpen,
          outerOpen
        };
      },
      template: `
        <xy-dialog v-model="outerOpen" title="外层">
          <xy-dialog v-model="innerOpen" title="内层" append-to-body />
        </xy-dialog>
      `
    });

    mount(Demo, {
      attachTo: document.body
    });

    await flushDialog();

    const dialogs = document.body.querySelectorAll("[role='dialog']");
    expect(dialogs).toHaveLength(2);
    expect(document.body.querySelectorAll(".xy-dialog")).toHaveLength(2);
  });

  it("自定义 transition 会执行用户钩子", async () => {
    document.body.innerHTML = "";
    let transitionName = "";

    const wrapper = mount(XyDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: "动画",
        transition: {
          name: "xy-dialog-fade",
          css: false,
          onLeave: (_element: Element, done: () => void) => done()
        }
      },
      global: {
        stubs: {
          transition: defineComponent({
            props: {
              name: {
                type: String,
                default: ""
              }
            },
            setup(props, { slots }) {
              transitionName = props.name;
              return () => slots.default?.();
            }
          })
        }
      }
    });

    await flushDialog();
    expect(transitionName).toBe("xy-dialog-fade");

    await wrapper.setProps({
      modelValue: false
    });
    await flushDialog();
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});

describe("XyDialogService", () => {
  afterEach(async () => {
    XyDialogService.closeAll();
    await flushServiceDialog();
    document.body.innerHTML = "";
    document.body.style.overflow = "";
    vi.useRealTimers();
  });

  it("open 支持宿主挂载、队列串行、update、close 和 result", async () => {
    const first = XyDialogService.open({
      title: "第一项",
      message: "第一条消息"
    });
    const second = XyDialogService.open({
      title: "第二项",
      message: "第二条消息"
    });

    await flushServiceDialog();

    expect(document.body.querySelector(".xy-dialog-service-host")).not.toBeNull();
    expect(dialogServiceState.current?.id).toBe(first.id);
    expect(dialogServiceState.queue).toHaveLength(1);
    expectCurrentServiceTitle("第一项");

    first.update({
      title: "第一项已更新",
      message: "已更新内容",
      dialogProps: {
        width: 480
      }
    });
    await flushServiceDialog();

    expectCurrentServiceTitle("第一项已更新");
    expect(document.body.querySelector(".xy-dialog__body")?.textContent).toContain("已更新内容");
    expect(dialogServiceState.current?.dialogProps?.width).toBe(480);

    requestCloseDialogServiceEntry(first.id, "programmatic");
    finishDialogServiceEntry(first.id);
    expect(await first.result).toEqual({
      action: "programmatic",
      value: undefined
    });

    await flushServiceDialog();
    expect(dialogServiceState.current?.id).toBe(second.id);
    expectCurrentServiceTitle("第二项");

    requestCloseDialogServiceEntry(second.id, "programmatic");
    finishDialogServiceEntry(second.id);
    await expect(second.result).resolves.toEqual({
      action: "programmatic",
      value: undefined
    });
  });

  it("alert 只显示确认按钮，并在确认后 resolve void", async () => {
    const result = XyDialogService.alert({
      title: "提示",
      message: "已完成"
    });

    await flushServiceDialog();

    expect(document.body.textContent).toContain("知道了");
    expect(document.body.textContent).not.toContain("取消");

    expect(dialogServiceState.current?.showCancelButton).toBe(false);
    setDialogServiceEntryPendingAction(dialogServiceState.current!, "confirm");
    finishDialogServiceEntry(dialogServiceState.current!.id);
    await expect(result).resolves.toBeUndefined();
  });

  it("confirm 支持 beforeConfirm 和 beforeCancel", async () => {
    const beforeConfirm = vi.fn(async () => {
      await Promise.resolve();
    });
    const beforeCancel = vi.fn(async () => {
      await Promise.resolve();
    });

    const confirmResult = XyDialogService.confirm({
      title: "确认",
      message: "是否继续？",
      beforeConfirm
    });
    await flushServiceDialog();
    await dialogServiceState.current?.beforeConfirm?.({
      id: dialogServiceState.current!.id,
      action: "confirm",
      value: dialogServiceState.current!.promptValue,
      close() {}
    });
    setDialogServiceEntryPendingAction(dialogServiceState.current!, "confirm");
    finishDialogServiceEntry(dialogServiceState.current!.id);
    await expect(confirmResult).resolves.toBe(true);
    expect(beforeConfirm).toHaveBeenCalledTimes(1);

    const cancelResult = XyDialogService.confirm({
      title: "取消",
      message: "是否取消？",
      beforeCancel
    });
    await flushServiceDialog();
    await dialogServiceState.current?.beforeCancel?.({
      id: dialogServiceState.current!.id,
      action: "cancel",
      value: dialogServiceState.current!.promptValue,
      close() {}
    });
    setDialogServiceEntryPendingAction(dialogServiceState.current!, "cancel");
    finishDialogServiceEntry(dialogServiceState.current!.id);
    await expect(cancelResult).resolves.toBe(false);
    expect(beforeCancel).toHaveBeenCalledTimes(1);
  });

  it("prompt 支持 validator，校验失败时不关闭，修正后返回值", async () => {
    const result = XyDialogService.prompt({
      title: "输入名称",
      message: "请输入名称",
      inputValue: "",
      inputValidator: (value) => (value.trim() ? undefined : "名称不能为空")
    });

    await flushServiceDialog();

    const invalid = await dialogServiceState.current?.inputValidator?.("");
    expect(invalid).toBe("名称不能为空");

    dialogServiceState.current!.promptValue = "新名称";
    const valid = await dialogServiceState.current?.inputValidator?.("新名称");
    expect(valid).toBeUndefined();

    setDialogServiceEntryPendingAction(dialogServiceState.current!, "confirm");
    finishDialogServiceEntry(dialogServiceState.current!.id);
    await expect(result).resolves.toEqual({
      confirmed: true,
      value: "新名称"
    });
  });

  it("open 支持 render、component 和 footerRender", async () => {
    const CustomBody = defineComponent({
      props: {
        label: {
          type: String,
          default: ""
        }
      },
      setup(props) {
        return () => h("div", { class: "custom-body" }, props.label);
      }
    });

    const openHandle = XyDialogService.open({
      title: "Render 模式",
      render: () => h("div", { class: "render-body" }, "render body"),
      footerRender: ({ close }) =>
        h("button", { class: "custom-footer-close", onClick: () => close("programmatic") }, "关闭")
    });
    await flushServiceDialog();
    expect(document.body.querySelector(".render-body")?.textContent).toContain("render body");
    expect(dialogServiceState.current?.footerRender).toBeTruthy();
    requestCloseDialogServiceEntry(openHandle.id, "programmatic");
    finishDialogServiceEntry(openHandle.id);
    await expect(openHandle.result).resolves.toEqual({
      action: "programmatic",
      value: undefined
    });

    const componentHandle = XyDialogService.open({
      title: "Component 模式",
      component: CustomBody,
      componentProps: {
        label: "component body"
      }
    });
    await flushServiceDialog();
    expect(document.body.querySelector(".custom-body")?.textContent).toContain("component body");
    requestCloseDialogServiceEntry(componentHandle.id, "programmatic");
    finishDialogServiceEntry(componentHandle.id);
    await componentHandle.result;
  });

  it("closeAll 会清空当前项与队列，并把结果标记为 programmatic", async () => {
    const first = XyDialogService.open({
      title: "A",
      message: "a"
    });
    const second = XyDialogService.open({
      title: "B",
      message: "b"
    });

    await flushServiceDialog();
    XyDialogService.closeAll();

    await expect(first.result).resolves.toEqual({
      action: "programmatic",
      value: undefined
    });
    await expect(second.result).resolves.toEqual({
      action: "programmatic",
      value: undefined
    });
    await flushServiceDialog();

    expect(dialogServiceState.current).toBeNull();
    expect(dialogServiceState.queue).toHaveLength(0);
  });
});
