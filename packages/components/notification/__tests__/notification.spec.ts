import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyNotification } from "../index";

function mountNotification(
  props: Record<string, unknown> = {},
  slots?: Record<string, string | ((...args: any[]) => unknown)>
) {
  return mount(XyNotification, {
    props,
    slots,
    global: {
      stubs: {
        transition: false
      }
    },
    attachTo: document.body
  });
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("XyNotification", () => {
  it("默认渲染标题、内容与 info 图标", async () => {
    const wrapper = mountNotification({
      title: "系统通知",
      message: "同步任务已进入队列",
      type: "info"
    });

    await nextTick();

    expect(wrapper.get(".xy-notification__title").text()).toBe("系统通知");
    expect(wrapper.get(".xy-notification__content").text()).toContain("同步任务已进入队列");
    expect(wrapper.find('[data-icon="mdi:information-outline"]').exists()).toBe(true);
  });

  it("支持自定义 icon 和 closeIcon", async () => {
    const wrapper = mountNotification({
      message: "自定义图标",
      icon: "mdi:bell-outline",
      closeIcon: "mdi:close-circle-outline",
      type: ""
    });

    await nextTick();

    expect(wrapper.find('[data-icon="mdi:bell-outline"]').exists()).toBe(true);
    expect(wrapper.find('[data-icon="mdi:close-circle-outline"]').exists()).toBe(true);
  });

  it("showClose=false 时不显示关闭按钮", async () => {
    const wrapper = mountNotification({
      message: "常驻通知",
      showClose: false
    });

    await nextTick();

    expect(wrapper.find(".xy-notification__close").exists()).toBe(false);
  });

  it("受控模式下点击关闭会发出 update:modelValue", async () => {
    const wrapper = mountNotification({
      modelValue: true,
      message: "受控通知"
    });

    await wrapper.get(".xy-notification__close").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(0)).toEqual([false]);
  });

  it("非受控模式下点击关闭会触发 close 和 closed", async () => {
    const wrapper = mountNotification({
      title: "关闭测试",
      message: "将要关闭",
      duration: 0
    });

    await wrapper.get(".xy-notification__close").trigger("click");
    await nextTick();

    expect(wrapper.emitted("close")?.at(0)).toEqual(["manual"]);
    expect(wrapper.emitted("closed")?.at(0)).toEqual(["manual"]);
  });

  it("duration>0 时会自动关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mountNotification({
      message: "自动关闭",
      duration: 100
    });

    vi.advanceTimersByTime(100);
    await nextTick();

    expect(wrapper.emitted("close")?.at(0)).toEqual(["auto"]);
    expect(wrapper.emitted("closed")?.at(0)).toEqual(["auto"]);
  });

  it("duration=0 时不会自动关闭", async () => {
    vi.useFakeTimers();

    const wrapper = mountNotification({
      message: "不会自动关闭",
      duration: 0
    });

    vi.advanceTimersByTime(500);
    await nextTick();

    expect(wrapper.emitted("close")).toBeUndefined();
  });

  it("hover 时暂停自动关闭，离开后重新开始计时", async () => {
    vi.useFakeTimers();

    const wrapper = mountNotification({
      message: "hover 暂停",
      duration: 100
    });

    vi.advanceTimersByTime(50);
    await wrapper.get(".xy-notification").trigger("mouseenter");
    vi.advanceTimersByTime(200);
    await nextTick();

    expect(wrapper.emitted("close")).toBeUndefined();

    await wrapper.get(".xy-notification").trigger("mouseleave");
    vi.advanceTimersByTime(100);
    await nextTick();

    expect(wrapper.emitted("close")?.at(0)).toEqual(["auto"]);
  });

  it("按下 Escape 会关闭通知", async () => {
    const wrapper = mountNotification({
      message: "Esc 关闭",
      duration: 0
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();

    expect(wrapper.emitted("close")?.at(0)).toEqual(["escape"]);
    expect(wrapper.emitted("closed")?.at(0)).toEqual(["escape"]);
  });

  it("默认插槽优先于 message 属性", async () => {
    const wrapper = mountNotification(
      {
        title: "插槽通知",
        message: "属性内容"
      },
      {
        default: "<strong class='slot-content'>插槽内容</strong>"
      }
    );

    await nextTick();

    expect(wrapper.find(".slot-content").exists()).toBe(true);
    expect(wrapper.get(".xy-notification__content").text()).toContain("插槽内容");
    expect(wrapper.get(".xy-notification__content").text()).not.toContain("属性内容");
  });

  it("title 插槽会覆盖 title 属性", async () => {
    const wrapper = mountNotification(
      {
        title: "属性标题",
        message: "正文内容"
      },
      {
        title: "<span class='custom-title'>插槽标题</span>"
      }
    );

    await nextTick();

    expect(wrapper.find(".custom-title").exists()).toBe(true);
    expect(wrapper.get(".xy-notification__title").text()).toContain("插槽标题");
    expect(wrapper.get(".xy-notification__title").text()).not.toContain("属性标题");
  });

  it("支持 VNode 和渲染函数消息内容", async () => {
    const vnodeWrapper = mountNotification({
      message: () => h("span", { class: "rendered-content" }, "渲染函数")
    });

    await nextTick();

    expect(vnodeWrapper.find(".rendered-content").exists()).toBe(true);
  });

  it("dangerouslyUseHTMLString=true 时按 HTML 渲染字符串", async () => {
    const wrapper = mountNotification({
      message: "<strong class='html-content'>高亮</strong>",
      dangerouslyUseHTMLString: true
    });

    await nextTick();

    expect(wrapper.find(".html-content").exists()).toBe(true);
  });

  it("支持 actions 插槽，并保持自动关闭行为", async () => {
    vi.useFakeTimers();

    const wrapper = mountNotification(
      {
        title: "审批提醒",
        duration: 100
      },
      {
        default: "请在 10 分钟内完成审批。",
        actions: `
          <button class="custom-action">立即处理</button>
          <button class="custom-action">稍后再说</button>
        `
      }
    );

    await nextTick();

    expect(wrapper.findAll(".custom-action")).toHaveLength(2);
    expect(wrapper.find(".xy-notification__actions").exists()).toBe(true);

    vi.advanceTimersByTime(100);
    await nextTick();

    expect(wrapper.emitted("close")?.at(0)).toEqual(["auto"]);
    expect(wrapper.emitted("closed")?.at(0)).toEqual(["auto"]);
  });

  it("default/title/actions 可同时生效且互不覆盖", async () => {
    const wrapper = mountNotification(
      {
        title: "属性标题",
        message: "属性正文"
      },
      {
        title: "<span class='title-slot'>标题插槽</span>",
        default: "<span class='body-slot'>正文插槽</span>",
        actions: "<button class='action-slot'>操作按钮</button>"
      }
    );

    await nextTick();

    expect(wrapper.find(".title-slot").exists()).toBe(true);
    expect(wrapper.find(".body-slot").exists()).toBe(true);
    expect(wrapper.find(".action-slot").exists()).toBe(true);
    expect(wrapper.get(".xy-notification__content").text()).toContain("正文插槽");
  });

  it("click 事件会在点击主体时触发", async () => {
    const wrapper = mountNotification({
      message: "点击通知"
    });

    await wrapper.get(".xy-notification").trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});
