import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { XyScrollbar } from "@xiaoye/components";

function defineDimension(element: Element, key: string, value: number) {
  Object.defineProperty(element, key, {
    configurable: true,
    get: () => value
  });
}

describe("XyScrollbar", () => {
  it("默认渲染滚动容器和视图容器", () => {
    const wrapper = mount(XyScrollbar, {
      slots: {
        default: "<div>content</div>"
      }
    });

    expect(wrapper.classes()).toContain("xy-scrollbar");
    expect(wrapper.find(".xy-scrollbar__wrap").exists()).toBe(true);
    expect(wrapper.find(".xy-scrollbar__view").exists()).toBe(true);
  });

  it("支持自定义高度和标签", async () => {
    const wrapper = mount(XyScrollbar, {
      props: {
        height: 200,
        tag: "ul",
        viewClass: "custom-view"
      },
      slots: {
        default: "<li>item</li>"
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".xy-scrollbar__wrap").attributes("style")).toContain("height: 200px");
    expect(wrapper.find(".xy-scrollbar__view").element.tagName).toBe("UL");
    expect(wrapper.find(".xy-scrollbar__view").classes()).toContain("custom-view");
  });

  it("在内容溢出时计算纵向滚动条", async () => {
    const wrapper = mount(XyScrollbar, {
      props: {
        height: 204,
        always: true
      },
      slots: {
        default: "<div style='height: 404px;'>content</div>"
      }
    });

    const wrap = wrapper.find(".xy-scrollbar__wrap").element as HTMLDivElement;

    defineDimension(wrap, "clientHeight", 204);
    defineDimension(wrap, "scrollHeight", 404);
    defineDimension(wrap, "clientWidth", 120);
    defineDimension(wrap, "scrollWidth", 120);

    (wrapper.vm as unknown as { update: () => void }).update();
    await wrapper.vm.$nextTick();

    const bar = wrapper.find(".xy-scrollbar__bar.is-vertical");

    expect(bar.exists()).toBe(true);
    expect(bar.attributes("style")).not.toContain("display: none");
    expect(wrapper.find(".xy-scrollbar__thumb").attributes("style")).toContain("height:");
  });

  it("支持 scroll 事件与滚动方法", async () => {
    const wrapper = mount(XyScrollbar, {
      props: {
        height: 200,
        always: true
      },
      slots: {
        default: "<div style='height: 500px; width: 500px;'>content</div>"
      }
    });

    const wrap = wrapper.find(".xy-scrollbar__wrap").element as HTMLDivElement;

    defineDimension(wrap, "clientHeight", 200);
    defineDimension(wrap, "scrollHeight", 500);
    defineDimension(wrap, "clientWidth", 200);
    defineDimension(wrap, "scrollWidth", 500);
    wrap.scrollTo = vi.fn((leftOrOptions?: number | ScrollToOptions, top?: number) => {
      if (typeof leftOrOptions === "object" && leftOrOptions !== null) {
        if (typeof leftOrOptions.top === "number") {
          wrap.scrollTop = leftOrOptions.top;
        }
        if (typeof leftOrOptions.left === "number") {
          wrap.scrollLeft = leftOrOptions.left;
        }
        return;
      }

      if (typeof leftOrOptions === "number") {
        wrap.scrollLeft = leftOrOptions;
        wrap.scrollTop = top ?? wrap.scrollTop;
      }
    }) as typeof wrap.scrollTo;

    const api = wrapper.vm as unknown as {
      update: () => void;
      setScrollTop: (value: number) => void;
      setScrollLeft: (value: number) => void;
      scrollTo: (options: ScrollToOptions) => void;
      handleScroll: () => void;
    };

    api.update();
    api.setScrollTop(120);
    api.setScrollLeft(60);

    expect(wrapper.emitted("scroll")?.at(-1)?.[0]).toEqual({
      scrollTop: 120,
      scrollLeft: 60
    });

    api.scrollTo({
      top: 260,
      left: 180
    });

    expect(wrap.scrollTo).toHaveBeenCalled();
    expect(wrapper.emitted("scroll")?.at(-1)?.[0]).toEqual({
      scrollTop: 260,
      scrollLeft: 180
    });
  });

  it("支持 endReached 事件和 native 模式", async () => {
    const wrapper = mount(XyScrollbar, {
      props: {
        height: 200,
        distance: 8,
        native: true
      },
      slots: {
        default: "<div style='height: 400px;'>content</div>"
      }
    });

    const wrap = wrapper.find(".xy-scrollbar__wrap").element as HTMLDivElement;

    defineDimension(wrap, "clientHeight", 200);
    defineDimension(wrap, "scrollHeight", 400);
    wrap.scrollTop = 192;

    (wrapper.vm as unknown as { handleScroll: () => void }).handleScroll();

    expect(wrapper.emitted("endReached")?.[0]?.[0]).toBe("bottom");
    expect(wrapper.find(".xy-scrollbar__bar").exists()).toBe(false);
  });
});
