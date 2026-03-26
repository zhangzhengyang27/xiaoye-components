import { mount } from "@vue/test-utils";
import { Comment, defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyConfigProvider } from "../../config-provider";
import { XyAlert } from "../index";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("XyAlert", () => {
  it("默认渲染为 light info 提示", () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "系统提示"
      }
    });

    expect(wrapper.get(".xy-alert").classes()).toContain("xy-alert");
    expect(wrapper.get(".xy-alert").classes()).toContain("xy-alert--info");
    expect(wrapper.get(".xy-alert").classes()).toContain("is-light");
    expect(wrapper.get(".xy-alert__title").text()).toBe("系统提示");
    expect(wrapper.find(".xy-alert__icon").exists()).toBe(false);
  });

  it.each([
    ["primary", "mdi:information-outline"],
    ["success", "mdi:check-circle-outline"],
    ["info", "mdi:information-outline"],
    ["warning", "mdi:alert-circle-outline"],
    ["error", "mdi:close-circle-outline"]
  ] as const)("支持 %s 类型并映射默认图标", (type, icon) => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "状态提示",
        type,
        showIcon: true
      }
    });

    expect(wrapper.get(".xy-alert").classes()).toContain(`xy-alert--${type}`);
    expect(wrapper.find(`[data-icon="${icon}"]`).exists()).toBe(true);
  });

  it("支持 description 属性并放大图标", () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "提交成功",
        description: "任务已进入执行队列",
        showIcon: true
      }
    });

    expect(wrapper.get(".xy-alert__description").text()).toBe("任务已进入执行队列");
    expect(wrapper.get(".xy-alert__icon").classes()).toContain("is-big");
    expect(wrapper.get(".xy-alert__title").classes()).toContain("with-description");
  });

  it("默认插槽可作为描述区，纯注释节点不会触发描述渲染", () => {
    const slotWrapper = mount(XyAlert, {
      slots: {
        default: "插槽描述"
      }
    });

    expect(slotWrapper.get(".xy-alert__description").text()).toBe("插槽描述");

    const commentWrapper = mount(XyAlert, {
      slots: {
        default: () => [h(Comment, "comment only")]
      }
    });

    expect(commentWrapper.find(".xy-alert__description").exists()).toBe(false);
  });

  it("title 插槽会覆盖 title 属性", () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "属性标题"
      },
      slots: {
        title: "<span class='custom-title'>插槽标题</span>"
      }
    });

    expect(wrapper.find(".custom-title").exists()).toBe(true);
    expect(wrapper.get(".xy-alert__title").text()).toBe("插槽标题");
  });

  it("showIcon 时支持 icon 插槽覆盖默认图标", () => {
    const wrapper = mount(XyAlert, {
      props: {
        showIcon: true
      },
      slots: {
        icon: "<span class='custom-icon'>icon</span>"
      }
    });

    expect(wrapper.find(".custom-icon").exists()).toBe(true);
    expect(wrapper.find(".xy-alert__icon svg").exists()).toBe(false);
  });

  it("closable=false 时不渲染关闭按钮", () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "常驻提示",
        closable: false
      }
    });

    expect(wrapper.find(".xy-alert__close-btn").exists()).toBe(false);
  });

  it("支持 closeText，并在关闭后隐藏组件", async () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "关闭测试",
        closeText: "知道了"
      }
    });

    const closeButton = wrapper.get(".xy-alert__close-btn");

    expect(closeButton.text()).toContain("知道了");

    await closeButton.trigger("click");
    await nextTick();

    expect(wrapper.emitted("close")).toHaveLength(1);
    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).toBe("none");
  });

  it("受控模式下点击关闭时发出 update:modelValue，不直接丢失受控状态", async () => {
    const wrapper = mount(XyAlert, {
      props: {
        modelValue: true,
        title: "受控提示"
      }
    });

    await wrapper.get(".xy-alert__close-btn").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(0)).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).not.toBe("none");
  });

  it("受控模式会跟随 modelValue 变化显示与隐藏", async () => {
    const wrapper = mount(XyAlert, {
      props: {
        modelValue: false,
        title: "显隐同步"
      }
    });

    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).toBe("none");

    await wrapper.setProps({
      modelValue: true
    });

    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).not.toBe("none");
  });

  it("beforeClose 可以拦截手动关闭", async () => {
    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => done(true));
    const wrapper = mount(XyAlert, {
      props: {
        title: "关闭拦截",
        beforeClose
      }
    });

    await wrapper.get(".xy-alert__close-btn").trigger("click");
    await nextTick();

    expect(beforeClose).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("close")).toBeUndefined();
    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).not.toBe("none");
  });

  it("beforeClose 支持异步放行手动关闭", async () => {
    vi.useFakeTimers();

    const beforeClose = vi.fn((done: (cancel?: boolean) => void) => {
      window.setTimeout(() => done(), 80);
    });
    const wrapper = mount(XyAlert, {
      props: {
        title: "异步关闭",
        beforeClose
      }
    });

    await wrapper.get(".xy-alert__close-btn").trigger("click");
    expect(wrapper.emitted("close")).toBeUndefined();

    vi.advanceTimersByTime(80);
    await nextTick();

    expect(wrapper.emitted("close")).toHaveLength(1);
    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).toBe("none");
  });

  it("自动关闭不会进入 beforeClose", async () => {
    vi.useFakeTimers();

    const beforeClose = vi.fn();
    const wrapper = mount(XyAlert, {
      props: {
        title: "自动关闭",
        duration: 120,
        beforeClose
      }
    });

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(beforeClose).not.toHaveBeenCalled();
    expect(wrapper.emitted("auto-close")).toHaveLength(1);
  });

  it("duration>0 时会自动关闭并触发 auto-close", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      props: {
        title: "自动关闭",
        duration: 120
      }
    });

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toHaveLength(1);
    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).toBe("none");
  });

  it("duration=0 时不会启动自动关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      props: {
        title: "常驻提示",
        duration: 0
      }
    });

    vi.advanceTimersByTime(1_000);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toBeUndefined();
    expect((wrapper.get(".xy-alert").element as HTMLElement).style.display).not.toBe("none");
  });

  it("pauseOnHover=true 时会暂停并恢复自动关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      props: {
        title: "悬停暂停",
        duration: 120,
        pauseOnHover: true
      }
    });

    vi.advanceTimersByTime(60);
    await wrapper.get(".xy-alert").trigger("mouseenter");
    expect(wrapper.get(".xy-alert").classes()).toContain("is-paused");

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.emitted("auto-close")).toBeUndefined();

    await wrapper.get(".xy-alert").trigger("mouseleave");
    vi.advanceTimersByTime(60);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toHaveLength(1);
  });

  it("pauseOnHover=false 时悬停不会中断自动关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      props: {
        title: "不停表",
        duration: 120,
        pauseOnHover: false
      }
    });

    vi.advanceTimersByTime(60);
    await wrapper.get(".xy-alert").trigger("mouseenter");
    vi.advanceTimersByTime(60);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toHaveLength(1);
  });

  it("pauseOnFocus=true 时聚焦内部元素会暂停并恢复自动关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      attachTo: document.body,
      props: {
        title: "聚焦暂停",
        duration: 120,
        pauseOnFocus: true,
        closeText: "关闭"
      }
    });

    vi.advanceTimersByTime(60);
    const closeButton = wrapper.get(".xy-alert__close-btn");
    closeButton.element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await nextTick();

    expect(wrapper.get(".xy-alert").classes()).toContain("is-paused");

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.emitted("auto-close")).toBeUndefined();

    closeButton.element.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        relatedTarget: document.body
      })
    );
    await nextTick();

    vi.advanceTimersByTime(60);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toHaveLength(1);
  });

  it("pauseOnPageHidden=true 时页面隐藏会暂停并在恢复后继续倒计时", async () => {
    vi.useFakeTimers();

    let hiddenState = false;
    const hiddenDescriptor = Object.getOwnPropertyDescriptor(document, "hidden");

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get() {
        return hiddenState;
      }
    });

    const wrapper = mount(XyAlert, {
      props: {
        title: "页面隐藏暂停",
        duration: 120,
        pauseOnPageHidden: true
      }
    });

    vi.advanceTimersByTime(60);
    hiddenState = true;
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();

    expect(wrapper.get(".xy-alert").classes()).toContain("is-paused");

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.emitted("auto-close")).toBeUndefined();

    hiddenState = false;
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();

    vi.advanceTimersByTime(60);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toHaveLength(1);

    if (hiddenDescriptor) {
      Object.defineProperty(document, "hidden", hiddenDescriptor);
    } else {
      // @ts-expect-error cleanup test-only descriptor
      delete document.hidden;
    }
  });

  it("带 duration 时手动关闭会清理自动关闭定时器", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      props: {
        title: "手动关闭优先",
        duration: 120,
        closeText: "关闭"
      }
    });

    await wrapper.get(".xy-alert__close-btn").trigger("click");
    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.emitted("close")).toHaveLength(1);
    expect(wrapper.emitted("auto-close")).toBeUndefined();
  });

  it("受控模式重新打开后会重建自动关闭定时器", async () => {
    vi.useFakeTimers();

    const wrapper = mount(XyAlert, {
      props: {
        modelValue: true,
        title: "重新打开",
        duration: 120
      }
    });

    vi.advanceTimersByTime(60);
    await wrapper.setProps({
      modelValue: false
    });
    await nextTick();

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(wrapper.emitted("auto-close")).toBeUndefined();

    await wrapper.setProps({
      modelValue: true
    });
    await nextTick();

    vi.advanceTimersByTime(120);
    await nextTick();

    expect(wrapper.emitted("auto-close")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });

  it("collapsible 开启后支持描述展开与收起", async () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "折叠描述",
        description: "这里是一段很长的描述文本，用来验证 Alert 在可折叠模式下的展开与收起行为。",
        collapsible: true
      }
    });

    expect(wrapper.get(".xy-alert__description").classes()).toContain("is-collapsed");
    expect(wrapper.get(".xy-alert__toggle").text()).toContain("展开详情");

    await wrapper.get(".xy-alert__toggle").trigger("click");

    expect(wrapper.get(".xy-alert__description").classes()).not.toContain("is-collapsed");
    expect(wrapper.get(".xy-alert__toggle").text()).toContain("收起详情");

    await wrapper.get(".xy-alert__toggle").trigger("click");
    expect(wrapper.get(".xy-alert__description").classes()).toContain("is-collapsed");
  });

  it("支持自定义 lineClamp 与折叠文案", async () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "自定义折叠",
        description: "这里是一段很长的描述文本，用来验证 Alert 在可折叠模式下的展开与收起行为。",
        collapsible: true,
        lineClamp: 3,
        expandText: "查看更多",
        collapseText: "收起说明"
      }
    });

    expect(wrapper.get(".xy-alert__toggle").text()).toContain("查看更多");
    expect(wrapper.get(".xy-alert__description").attributes("style")).toContain(
      "--xy-alert-line-clamp: 3;"
    );

    await wrapper.get(".xy-alert__toggle").trigger("click");

    expect(wrapper.get(".xy-alert__toggle").text()).toContain("收起说明");
  });

  it("defaultExpanded=true 时描述初始展开", () => {
    const wrapper = mount(XyAlert, {
      props: {
        description: "默认展开的详细说明",
        collapsible: true,
        defaultExpanded: true
      }
    });

    expect(wrapper.get(".xy-alert__description").classes()).not.toContain("is-collapsed");
  });

  it("actions 插槽可在 default、card、banner 变体中渲染", () => {
    const base = mount(XyAlert, {
      slots: {
        actions: "<button class='alert-action'>处理</button>"
      }
    });

    expect(base.find(".xy-alert__actions .alert-action").exists()).toBe(true);
    expect(base.find(".xy-alert__actions--banner").exists()).toBe(false);

    const card = mount(XyAlert, {
      props: {
        variant: "card"
      },
      slots: {
        actions: "<button class='alert-action'>处理</button>"
      }
    });

    expect(card.find(".xy-alert__actions .alert-action").exists()).toBe(true);

    const banner = mount(XyAlert, {
      props: {
        variant: "banner"
      },
      slots: {
        actions: "<button class='alert-action'>处理</button>"
      }
    });

    expect(banner.find(".xy-alert__actions--banner .alert-action").exists()).toBe(true);
  });

  it("支持 size 与 variant 类名，并跟随 ConfigProvider 尺寸", () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "布局态",
        size: "lg",
        variant: "card"
      }
    });

    expect(wrapper.get(".xy-alert").classes()).toContain("xy-alert--lg");
    expect(wrapper.get(".xy-alert").classes()).toContain("xy-alert--card");

    const providerWrapper = mount(XyConfigProvider, {
      props: {
        size: "sm"
      },
      slots: {
        default: () => h(XyAlert, { title: "全局尺寸" })
      }
    });

    expect(providerWrapper.find(".xy-alert").classes()).toContain("xy-alert--sm");
  });

  it("支持 center 和 dark 主题类名", () => {
    const wrapper = mount(XyAlert, {
      props: {
        title: "居中提示",
        center: true,
        effect: "dark",
        variant: "banner"
      }
    });

    expect(wrapper.get(".xy-alert").classes()).toContain("is-center");
    expect(wrapper.get(".xy-alert").classes()).toContain("is-dark");
    expect(wrapper.get(".xy-alert").classes()).toContain("xy-alert--banner");
  });
});
