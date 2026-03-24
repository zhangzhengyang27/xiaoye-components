import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import XySkeleton from "../index";

const AXIOM = "AXIOM is the best girl";

describe("XySkeleton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("支持默认骨架渲染", () => {
    const wrapper = mount(XySkeleton);

    expect(wrapper.findAll(".xy-skeleton__p")).toHaveLength(4);
    expect(wrapper.classes()).toContain("xy-skeleton");
  });

  it("支持动画类名", () => {
    const wrapper = mount(XySkeleton, {
      props: {
        animated: true
      }
    });

    expect(wrapper.classes()).toContain("is-animated");
  });

  it("支持 count 重复渲染", async () => {
    const wrapper = mount(XySkeleton);

    expect(wrapper.findAll(".xy-skeleton__p")).toHaveLength(4);

    await wrapper.setProps({
      count: 2
    });

    expect(wrapper.findAll(".xy-skeleton__p")).toHaveLength(8);
  });

  it("支持 rows 控制段落数", () => {
    const wrapper = mount(XySkeleton, {
      props: {
        rows: 4
      }
    });

    expect(wrapper.findAll(".xy-skeleton__p")).toHaveLength(5);
  });

  it("loading 为 false 时渲染默认插槽", () => {
    const wrapper = mount(XySkeleton, {
      props: {
        loading: false
      },
      slots: {
        default: AXIOM
      }
    });

    expect(wrapper.text()).toBe(AXIOM);
  });

  it("支持 template 插槽替换默认骨架模板", () => {
    const wrapper = mount(XySkeleton, {
      slots: {
        template: AXIOM
      }
    });

    expect(wrapper.text()).toBe(AXIOM);
  });

  it("template 配合 count 会重复渲染且不额外包裹一层 DOM", () => {
    const wrapper = mount(XySkeleton, {
      props: {
        count: 2
      },
      slots: {
        template: '<div class="custom-template">slot-content</div>'
      }
    });

    const templates = wrapper.findAll(".custom-template");
    const children = Array.from(wrapper.element.children) as Element[];

    expect(templates).toHaveLength(2);
    expect(children.every((node) => node.classList.contains("custom-template"))).toBe(true);
  });

  it("支持 throttle 数字形式", async () => {
    const wrapper = mount(XySkeleton, {
      props: {
        throttle: 500
      }
    });

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(false);

    vi.runAllTimers();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(true);
  });

  it("支持 throttle 对象形式", async () => {
    const wrapper = mount(XySkeleton, {
      props: {
        throttle: {
          trailing: 500,
          initVal: true
        },
        loading: true
      }
    });

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(true);

    await wrapper.setProps({
      loading: false
    });

    vi.runAllTimers();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(false);
  });

  it("支持 throttle 对象的 leading 和 trailing 完整链路", async () => {
    const wrapper = mount(XySkeleton, {
      props: {
        throttle: {
          leading: 200,
          trailing: 300,
          initVal: false
        },
        loading: true
      }
    });

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(false);

    vi.advanceTimersByTime(200);
    await nextTick();

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(true);

    await wrapper.setProps({
      loading: false
    });

    vi.advanceTimersByTime(299);
    await nextTick();

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(true);

    vi.advanceTimersByTime(1);
    await nextTick();

    expect((wrapper.vm as { uiLoading: boolean }).uiLoading).toBe(false);
  });
});
