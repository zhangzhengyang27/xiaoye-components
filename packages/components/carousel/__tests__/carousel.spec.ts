import { mount, type VueWrapper } from "@vue/test-utils";
import { describe, expect, it, vi, afterEach } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { XyCarousel, XyCarouselItem } from "@xiaoye/components";

vi.mock("@iconify/vue", () => ({
  addCollection: vi.fn(),
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

const mountedWrappers: VueWrapper[] = [];

function mountCarousel(...args: Parameters<typeof mount>) {
  const wrapper = mount(...args);
  mountedWrappers.push(wrapper);
  return wrapper;
}

afterEach(() => {
  mountedWrappers.forEach((wrapper) => wrapper.unmount());
  mountedWrappers.length = 0;
  document.body.innerHTML = "";
  vi.useRealTimers();
});

function createSlides(count = 3, withLabel = false) {
  return Array.from({ length: count }, (_, index) =>
    h(
      XyCarouselItem,
      {
        name: `slide-${index}`,
        label: withLabel ? `Slide ${index + 1}` : ""
      },
      () => h("div", { class: "slide-content" }, `slide-${index + 1}`)
    )
  );
}

function createConfigSlides(configs: Array<Partial<{ name: string; label: string; duration: number; autoplayDisabled: boolean }>>) {
  return configs.map((config, index) =>
    h(
      XyCarouselItem,
      {
        name: config.name ?? `slide-${index}`,
        label: config.label ?? "",
        duration: config.duration,
        autoplayDisabled: config.autoplayDisabled
      },
      () => h("div", { class: "slide-content" }, config.name ?? `slide-${index + 1}`)
    )
  );
}

function dispatchPointer(target: EventTarget, type: string, init: MouseEventInit & { pointerId?: number }) {
  const PointerCtor = window.PointerEvent ?? MouseEvent;
  const event = new PointerCtor(type, {
    bubbles: true,
    ...init
  });

  Object.defineProperty(event, "pointerId", {
    configurable: true,
    value: init.pointerId ?? 1
  });

  target.dispatchEvent(event);
}

describe("XyCarousel", () => {
  it("支持基础渲染和 initialIndex", async () => {
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          initialIndex: 1
        },
        () => createSlides(3)
      )
    );

    await nextTick();

    const items = wrapper.findAll(".xy-carousel__item");
    expect(items).toHaveLength(3);
    expect(items[1]?.classes()).toContain("is-active");
  });

  it("支持自动播放和 change 事件", async () => {
    vi.useFakeTimers();
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          interval: 50
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    vi.advanceTimersByTime(60);
    await nextTick();

    const items = wrapper.findAll(".xy-carousel__item");
    expect(items[1]?.classes()).toContain("is-active");
    expect(items[1]?.classes()).toContain("is-animating");
    expect(items[0]?.classes()).toContain("is-animating");
    expect(wrapper.findComponent(XyCarousel).emitted("change")?.[0]).toEqual([1, 0]);
  });

  it("支持 pauseOnHover", async () => {
    vi.useFakeTimers();
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          interval: 50,
          pauseOnHover: true
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    await wrapper.get(".xy-carousel").trigger("mouseenter");
    vi.advanceTimersByTime(80);
    await nextTick();

    expect(wrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("is-active");

    await wrapper.get(".xy-carousel").trigger("mouseleave");
    vi.advanceTimersByTime(60);
    await nextTick();

    expect(wrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });

  it("支持指示器 hover/click 触发和 label", async () => {
    const hoverWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          trigger: "hover"
        },
        () => createSlides(3, true)
      )
    );

    await nextTick();
    expect(hoverWrapper.find(".xy-carousel__button span").text()).toBe("Slide 1");

    await hoverWrapper.findAll(".xy-carousel__indicator")[1]?.trigger("mouseenter");
    await nextTick();
    expect(hoverWrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");

    const clickWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          trigger: "click"
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    await clickWrapper.findAll(".xy-carousel__indicator")[2]?.trigger("click");
    await nextTick();
    expect(clickWrapper.findAll(".xy-carousel__item")[2]?.classes()).toContain("is-active");
  });

  it("支持 vertical 方向", async () => {
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          direction: "vertical",
          height: "120px"
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    expect(wrapper.find(".xy-carousel").classes()).toContain("xy-carousel--vertical");
    expect(wrapper.findAll(".xy-carousel__arrow")).toHaveLength(0);
    expect(wrapper.find(".xy-carousel__item")?.attributes("style")).toContain("translateY");
  });

  it("支持 expose 方法和按 name 切换", async () => {
    const wrapper = mountCarousel(XyCarousel, {
      slots: {
        default: () => createSlides(3)
      },
      props: {
        autoplay: false
      }
    });

    await nextTick();

    const api = wrapper.vm as unknown as {
      activeIndex: number;
      setActiveItem: (index: number | string) => void;
      prev: () => void;
      next: () => void;
    };

    api.setActiveItem("slide-2");
    await nextTick();
    expect(api.activeIndex).toBe(2);

    api.prev();
    await nextTick();
    expect(api.activeIndex).toBe(1);

    api.next();
    await nextTick();
    expect(api.activeIndex).toBe(2);
  });

  it("两项循环会补位渲染并保持对外索引为逻辑索引", async () => {
    const wrapper = mountCarousel(XyCarousel, {
      props: {
        autoplay: false,
        loop: true
      },
      slots: {
        default: () => createSlides(2, true)
      }
    });

    await nextTick();
    await nextTick();

    const api = wrapper.vm as unknown as {
      activeIndex: number;
      next: () => void;
      prev: () => void;
    };

    const items = wrapper.findAll(".xy-carousel__item");
    const indicators = wrapper.findAll(".xy-carousel__indicator");

    expect(items).toHaveLength(4);
    expect(api.activeIndex).toBe(0);
    expect(indicators).toHaveLength(4);
    expect(indicators.filter((indicator) => indicator.isVisible())).toHaveLength(2);

    api.next();
    await nextTick();
    expect(api.activeIndex).toBe(1);

    api.next();
    await nextTick();
    expect(api.activeIndex).toBe(0);

    api.prev();
    await nextTick();
    expect(api.activeIndex).toBe(1);
  });

  it("循环模式下末尾切回首项时会直接回绕真实索引并重排位置", async () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return 600;
      }
    });

    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          loop: true,
          initialIndex: 2
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    await nextTick();

    const api = wrapper.findComponent(XyCarousel).vm as unknown as {
      next: () => void;
      activeIndex: number;
    };

    const items = wrapper.findAll(".xy-carousel__item");
    expect(items[0]?.attributes("style")).toContain("translateX(600px)");
    expect(items[1]?.attributes("style")).toContain("translateX(-600px)");

    api.next();
    await nextTick();

    expect(api.activeIndex).toBe(0);
    expect(items[0]?.classes()).toContain("is-active");
    expect(items[0]?.attributes("style")).toContain("translateX(0px)");
    expect(items[2]?.attributes("style")).toContain("translateX(-600px)");
    expect(items[0]?.classes()).toContain("is-animating");
    expect(items[2]?.classes()).toContain("is-animating");
  });

  it("循环模式下首项切回末尾时也会直接回绕真实索引并重排位置", async () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return 600;
      }
    });

    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          loop: true,
          initialIndex: 0
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    await nextTick();

    const api = wrapper.findComponent(XyCarousel).vm as unknown as {
      prev: () => void;
      activeIndex: number;
    };

    api.prev();
    await nextTick();

    const items = wrapper.findAll(".xy-carousel__item");
    expect(api.activeIndex).toBe(2);
    expect(items[2]?.classes()).toContain("is-active");
    expect(items[0]?.attributes("style")).toContain("translateX(600px)");
    expect(items[1]?.attributes("style")).toContain("translateX(-600px)");
    expect(items[0]?.classes()).toContain("is-animating");
    expect(items[2]?.classes()).toContain("is-animating");
  });

  it("自动播放跨越循环边界时会直接重置进度", async () => {
    vi.useFakeTimers();

    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: true,
          loop: true,
          initialIndex: 2,
          interval: 50,
          showProgress: true,
          progressPlacement: "indicator"
        },
        {
          default: () => createSlides(3),
          progress: ({ percent }: { percent: number }) =>
            h("span", { class: "boundary-progress" }, `${Math.round(percent)}%`)
        }
      )
    );

    await nextTick();
    await nextTick();

    vi.advanceTimersByTime(60);
    await nextTick();
    expect(wrapper.findComponent(XyCarousel).vm.activeIndex).toBe(0);
    expect(wrapper.find(".boundary-progress").text()).toBe("0%");
  });

  it("支持 card 模式和点击侧卡切换", async () => {
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          type: "card"
        },
        () => createSlides(5)
      )
    );

    await nextTick();

    const items = wrapper.findAll(".xy-carousel__item");
    expect(wrapper.find(".xy-carousel").classes()).toContain("xy-carousel--card");
    expect(items[0]?.classes()).toContain("is-active");

    await items[1]?.trigger("click");
    await nextTick();

    expect(items[1]?.classes()).toContain("is-active");
  });

  it("支持 activeIndex 受控模式和 update:activeIndex", async () => {
    const controlled = ref(0);
    const wrapper = mountCarousel(
      defineComponent({
        setup() {
          return () =>
            h(
              XyCarousel,
              {
                activeIndex: controlled.value,
                "onUpdate:activeIndex": (value: number) => {
                  controlled.value = value;
                },
                autoplay: false
              },
              () => createSlides(3)
            );
        }
      })
    );

    await nextTick();
    await wrapper.findAll(".xy-carousel__indicator")[1]?.trigger("click");
    await nextTick();

    expect(controlled.value).toBe(1);
    expect(wrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });

  it("支持 draggable 切换", async () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return 600;
      }
    });

    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          draggable: true
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    const root = wrapper.get(".xy-carousel").element;
    dispatchPointer(root, "pointerdown", {
      clientX: 320,
      pointerId: 1
    });
    dispatchPointer(window, "pointermove", {
      clientX: 220,
      pointerId: 1
    });
    dispatchPointer(window, "pointerup", {
      clientX: 220,
      pointerId: 1
    });
    await nextTick();

    expect(wrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });

  it("拖拽过程中自动播放不会抢切换", async () => {
    vi.useFakeTimers();

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return 600;
      }
    });

    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          interval: 50,
          duration: 180,
          draggable: true
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    const root = wrapper.get(".xy-carousel").element;

    dispatchPointer(root, "pointerdown", {
      clientX: 320,
      pointerId: 2
    });
    dispatchPointer(window, "pointermove", {
      clientX: 290,
      pointerId: 2
    });
    vi.advanceTimersByTime(80);
    await nextTick();

    expect(wrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("is-active");

    dispatchPointer(window, "pointerup", {
      clientX: 290,
      pointerId: 2
    });
    vi.advanceTimersByTime(120);
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("is-active");

    vi.advanceTimersByTime(120);
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });

  it("支持 slidesPerView / slidesPerGroup / gap / centered，并按 snap point 生成指示器", async () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return 600;
      }
    });

    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          slidesPerView: 1.2,
          slidesPerGroup: 2,
          gap: 16,
          centered: true,
          indicatorPosition: "outside"
        },
        () => createSlides(5)
      )
    );

    await nextTick();
    expect(wrapper.findAll(".xy-carousel__indicator")).toHaveLength(3);

    const api = wrapper.findComponent(XyCarousel).vm as unknown as {
      next: () => void;
      activeIndex: number;
    };
    api.next();
    await nextTick();
    expect(api.activeIndex).toBe(2);
  });

  it("支持 height='auto' 并根据当前可见项更新高度", async () => {
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          height: "auto"
        },
        () => createSlides(3)
      )
    );

    await nextTick();

    const items = wrapper.findAll(".xy-carousel__item");
    Object.defineProperty(items[0]?.element as HTMLElement, "offsetHeight", {
      configurable: true,
      get: () => 120
    });
    Object.defineProperty(items[1]?.element as HTMLElement, "offsetHeight", {
      configurable: true,
      get: () => 180
    });
    Object.defineProperty(items[2]?.element as HTMLElement, "offsetHeight", {
      configurable: true,
      get: () => 140
    });

    const api = wrapper.findComponent(XyCarousel).vm as unknown as {
      setActiveItem: (index: number) => void;
    };
    api.setActiveItem(1);
    await nextTick();

    expect(wrapper.find(".xy-carousel__container").attributes("style")).toContain("height: 180px");
  });

  it("支持 fade 动画，并在不兼容场景下回退为 slide", async () => {
    const fadeWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          effect: "fade"
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    expect(fadeWrapper.find(".xy-carousel").classes()).toContain("xy-carousel--fade");
    expect(fadeWrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("xy-carousel__item--fade");

    const fallbackWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          effect: "fade",
          slidesPerView: 2
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    expect(fallbackWrapper.find(".xy-carousel").classes()).not.toContain("xy-carousel--fade");
  });

  it("支持 indicatorType='dot' 和键盘切换", async () => {
    vi.useFakeTimers();
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          interval: 50,
          indicatorType: "dot"
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    expect(wrapper.find(".xy-carousel").classes()).toContain("xy-carousel--indicator-dot");

    await wrapper.get(".xy-carousel").trigger("focusin");
    vi.advanceTimersByTime(80);
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("is-active");

    await wrapper.get(".xy-carousel").trigger("keydown", { key: "ArrowRight" });
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });

  it("支持 thumbs 联动和自定义 thumb 插槽", async () => {
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          thumbs: true
        },
        {
          default: () => createSlides(3, true),
          thumb: ({ index, active }: { index: number; active: boolean }) =>
            h("span", { class: ["custom-thumb", active ? "is-active" : ""] }, `thumb-${index + 1}`)
        }
      )
    );

    await nextTick();
    expect(wrapper.findAll(".custom-thumb")).toHaveLength(3);

    await wrapper.findAll(".xy-carousel__thumb")[1]?.trigger("click");
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });

  it("支持 progress 与控制区插槽", async () => {
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          showProgress: true,
          progressPlacement: "indicator"
        },
        {
          default: () => createSlides(3),
          indicator: ({ index }: { index: number }) =>
            h("span", { class: "custom-indicator" }, `${index + 1}`),
          "arrow-prev": () => h("span", { class: "custom-prev" }, "prev"),
          "arrow-next": () => h("span", { class: "custom-next" }, "next"),
          progress: ({ percent }: { percent: number }) =>
            h("span", { class: "custom-progress" }, `${Math.round(percent)}%`)
        }
      )
    );

    await nextTick();
    expect(wrapper.find(".custom-indicator").exists()).toBe(true);
    expect(wrapper.find(".xy-carousel__button--custom").exists()).toBe(true);
    expect(wrapper.find(".custom-progress").exists()).toBe(true);
    expect(wrapper.find(".custom-prev").exists()).toBe(true);
    expect(wrapper.find(".custom-next").exists()).toBe(true);
  });

  it("支持每项 duration 覆盖和 autoplayDisabled 跳过", async () => {
    vi.useFakeTimers();
    const wrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: true,
          interval: 50
        },
        () =>
          createConfigSlides([
            { name: "first", duration: 120 },
            { name: "second", autoplayDisabled: true },
            { name: "third" }
          ])
      )
    );

    await nextTick();
    vi.advanceTimersByTime(80);
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("is-active");

    vi.advanceTimersByTime(60);
    await nextTick();
    expect(wrapper.findAll(".xy-carousel__item")[2]?.classes()).toContain("is-active");
  });

  it("支持 lazy 和 virtual 只渲染窗口内容", async () => {
    const lazyWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          lazy: true,
          lazyRange: 0
        },
        () => createSlides(4)
      )
    );

    await nextTick();
    expect(lazyWrapper.findAll(".slide-content")).toHaveLength(1);

    const virtualWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          virtual: true,
          virtualBuffer: 0,
          slidesPerView: 1.2,
          centered: true
        },
        () => createSlides(5)
      )
    );

    await nextTick();
    expect(virtualWrapper.findAll(".slide-content").length).toBeLessThan(5);
  });

  it("支持 keyboard 的 Home / End 和 vertical 方向键", async () => {
    const horizontalWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          keyboard: true
        },
        () => createSlides(4)
      )
    );

    await nextTick();
    await horizontalWrapper.get(".xy-carousel").trigger("keydown", { key: "End" });
    await nextTick();
    expect(horizontalWrapper.findAll(".xy-carousel__item")[3]?.classes()).toContain("is-active");

    await horizontalWrapper.get(".xy-carousel").trigger("keydown", { key: "Home" });
    await nextTick();
    expect(horizontalWrapper.findAll(".xy-carousel__item")[0]?.classes()).toContain("is-active");

    const verticalWrapper = mountCarousel(() =>
      h(
        XyCarousel,
        {
          autoplay: false,
          direction: "vertical",
          keyboard: true,
          height: "120px"
        },
        () => createSlides(3)
      )
    );

    await nextTick();
    await verticalWrapper.get(".xy-carousel").trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(verticalWrapper.findAll(".xy-carousel__item")[1]?.classes()).toContain("is-active");
  });
});
