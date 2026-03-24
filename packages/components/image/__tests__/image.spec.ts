import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyImage } from "../index";

const observedTargets: Element[] = [];
let intersectionCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe(target: Element) {
    observedTargets.push(target);
  }

  disconnect() {}
}

function createTouchEvent(
  type: string,
  points: Array<{ pageX: number; pageY: number }>
) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true
  });

  Object.defineProperty(event, "touches", {
    configurable: true,
    value:
      type === "touchend"
        ? []
        : points.map((point) => ({
            ...point,
            clientX: point.pageX,
            clientY: point.pageY
          }))
  });

  return event;
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
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
  intersectionCallback = null;
  observedTargets.length = 0;
  document.body.innerHTML = "";
});

describe("XyImage", () => {
  it("支持 fit 和原生图片属性透传", () => {
    const wrapper = mount(XyImage, {
      attrs: {
        referrerpolicy: "origin"
      },
      props: {
        src: "https://example.com/cover.png",
        alt: "cover",
        fit: "contain",
        loading: "lazy"
      }
    });

    const image = wrapper.get("img");
    expect(image.attributes("src")).toBe("https://example.com/cover.png");
    expect(image.attributes("alt")).toBe("cover");
    expect(image.attributes("loading")).toBe("lazy");
    expect(image.attributes("referrerpolicy")).toBe("origin");
    expect(image.attributes("style")).toContain("object-fit: contain");
  });

  it("加载中时支持 placeholder 插槽", () => {
    const wrapper = mount(XyImage, {
      props: {
        src: "https://example.com/cover.png"
      },
      slots: {
        placeholder: "<div class='custom-placeholder'>加载中</div>"
      }
    });

    expect(wrapper.find(".custom-placeholder").exists()).toBe(true);
  });

  it("加载失败时支持 error 插槽和 error 事件", async () => {
    const wrapper = mount(XyImage, {
      props: {
        src: "https://example.com/broken.png"
      },
      slots: {
        error: "<div class='custom-error'>失败</div>"
      }
    });

    await wrapper.get("img").trigger("error");

    expect(wrapper.find(".custom-error").exists()).toBe(true);
    expect(wrapper.emitted("error")).toHaveLength(1);
  });

  it("lazy 模式进入视口后才加载图片", async () => {
    const wrapper = mount(XyImage, {
      props: {
        src: "https://example.com/lazy.png",
        lazy: true
      }
    });

    expect(wrapper.find("img").exists()).toBe(false);
    expect(observedTargets).toHaveLength(1);
    expect(intersectionCallback).not.toBeNull();

    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    await nextTick();

    expect(wrapper.get("img").attributes("src")).toBe("https://example.com/lazy.png");
  });

  it("支持预览、初始索引和切换事件", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: [
          "https://example.com/a.png",
          "https://example.com/b.png",
          "https://example.com/c.png"
        ],
        initialIndex: 1,
        showProgress: true
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    expect(viewerImage.src).toContain("/b.png");
    expect(document.body.querySelector(".xy-image-viewer__progress")?.textContent).toContain("2 / 3");

    const nextButton = document.body.querySelector(
      ".xy-image-viewer__arrow--next"
    ) as HTMLButtonElement;
    nextButton.click();
    await nextTick();

    expect(wrapper.emitted("switch")?.[0]?.[0]).toBe(2);
    expect((document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).src).toContain(
      "/c.png"
    );
  });

  it("预览层补充无障碍语义", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: [
          "https://example.com/a.png",
          "https://example.com/b.png"
        ],
        showProgress: true
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const viewer = document.body.querySelector(".xy-image-viewer") as HTMLElement | null;
    const progress = document.body.querySelector(".xy-image-viewer__progress") as HTMLElement | null;
    const canvas = document.body.querySelector(".xy-image-viewer__canvas") as HTMLElement | null;
    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;

    expect(viewer?.getAttribute("role")).toBe("dialog");
    expect(viewer?.getAttribute("aria-label")).toContain("图片预览");
    expect(viewer?.getAttribute("aria-describedby")).toBe("xy-image-viewer-instructions");
    expect(document.body.querySelector("#xy-image-viewer-instructions")).not.toBeNull();
    expect(progress?.getAttribute("role")).toBe("status");
    expect(progress?.getAttribute("aria-live")).toBe("polite");
    expect(canvas?.getAttribute("aria-busy")).toBe("true");
    expect(viewerImage.getAttribute("alt")).toContain("预览图片 1 / 2");

    viewerImage.dispatchEvent(new Event("load"));
    await nextTick();
    expect(canvas?.getAttribute("aria-busy")).toBe("false");
  });

  it("变换后切换图片会重置缩放、旋转和显示模式", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: [
          "https://example.com/a.png",
          "https://example.com/b.png"
        ]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();

    (document.body.querySelector('[aria-label="放大"]') as HTMLButtonElement | null)?.click();
    (document.body.querySelector('[aria-label="顺时针旋转"]') as HTMLButtonElement | null)?.click();
    (
      document.body.querySelector(".xy-image-viewer") as HTMLElement | null
    )?.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await nextTick();

    (
      document.body.querySelector(".xy-image-viewer__arrow--next") as HTMLButtonElement | null
    )?.click();
    await nextTick();

    const viewer = document.body.querySelector(".xy-image-viewer") as HTMLElement | null;
    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;

    expect(viewer?.classList.contains("is-original")).toBe(false);
    expect(viewerImage.getAttribute("style")).toContain("scale(1)");
    expect(viewerImage.getAttribute("style")).toContain("rotate(0deg)");
    expect(viewerImage.src).toContain("/b.png");
  });

  it("支持预览工具栏缩放、旋转和模式切换", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();

    const zoomInButton = document.body.querySelector(
      '[aria-label="放大"]'
    ) as HTMLButtonElement | null;
    zoomInButton?.click();
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    expect(viewerImage.getAttribute("style")).toContain("scale(1.2)");

    const rotateButton = document.body.querySelector(
      '[aria-label="顺时针旋转"]'
    ) as HTMLButtonElement | null;
    rotateButton?.click();
    await nextTick();
    expect(viewerImage.getAttribute("style")).toContain("rotate(90deg)");

    (
      document.body.querySelector(".xy-image-viewer") as HTMLElement | null
    )?.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await nextTick();
    expect(document.body.querySelector(".xy-image-viewer")?.classList.contains("is-original")).toBe(
      true
    );
  });

  it("预览层支持加载态和 load 后隐藏", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".xy-image-viewer__loading")).not.toBeNull();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();

    expect(document.body.querySelector(".xy-image-viewer__loading")).toBeNull();
  });

  it("支持通过滚轮缩放预览图片", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();

    (
      document.body.querySelector(".xy-image-viewer") as HTMLElement | null
    )?.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true }));
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    expect(viewerImage.getAttribute("style")).toContain("scale(1.2)");
  });

  it("支持双击在放大和重置之间切换", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    viewerImage.dispatchEvent(new Event("load"));
    await nextTick();

    viewerImage.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await nextTick();
    expect(viewerImage.getAttribute("style")).toContain("scale(2)");

    viewerImage.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await nextTick();
    expect(viewerImage.getAttribute("style")).toContain("scale(1)");
    expect(viewerImage.getAttribute("style")).toContain("rotate(0deg)");
  });

  it("支持鼠标拖拽已放大的预览图片", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();

    (document.body.querySelector('[aria-label="放大"]') as HTMLButtonElement | null)?.click();
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    viewerImage.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        button: 0,
        clientX: 100,
        clientY: 120
      })
    );
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: 148,
        clientY: 156
      })
    );
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
    await nextTick();

    expect(viewerImage.getAttribute("style")).toContain("translate(48px, 36px)");
  });

  it("支持双指缩放预览图片", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    viewerImage.dispatchEvent(new Event("load"));
    await nextTick();

    viewerImage.dispatchEvent(
      createTouchEvent("touchstart", [
        { pageX: 100, pageY: 100 },
        { pageX: 200, pageY: 100 }
      ])
    );
    document.dispatchEvent(
      createTouchEvent("touchmove", [
        { pageX: 80, pageY: 100 },
        { pageX: 240, pageY: 100 }
      ])
    );
    document.dispatchEvent(createTouchEvent("touchend", []));
    await nextTick();

    expect(viewerImage.getAttribute("style")).toContain("scale(1.6)");
  });

  it("平移会限制在可视范围内", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const canvas = document.body.querySelector(".xy-image-viewer__canvas") as HTMLElement;
    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;

    Object.defineProperty(canvas, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(canvas, "clientHeight", { configurable: true, value: 180 });
    Object.defineProperty(viewerImage, "offsetWidth", { configurable: true, value: 400 });
    Object.defineProperty(viewerImage, "offsetHeight", { configurable: true, value: 240 });

    viewerImage.dispatchEvent(new Event("load"));
    await nextTick();

    (document.body.querySelector('[aria-label="放大"]') as HTMLButtonElement | null)?.click();
    await nextTick();

    viewerImage.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        button: 0,
        clientX: 50,
        clientY: 50
      })
    );
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        clientX: 400,
        clientY: 400
      })
    );
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
    await nextTick();

    expect(viewerImage.getAttribute("style")).toContain("translate(90px, 54px)");
  });

  it("支持触摸拖拽原始尺寸模式下的预览图片", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();

    (
      document.body.querySelector(".xy-image-viewer") as HTMLElement | null
    )?.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await nextTick();

    const viewerImage = document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement;
    viewerImage.dispatchEvent(createTouchEvent("touchstart", [{ pageX: 20, pageY: 30 }]));
    document.dispatchEvent(createTouchEvent("touchmove", [{ pageX: 54, pageY: 72 }]));
    document.dispatchEvent(createTouchEvent("touchend", []));
    await nextTick();

    expect(viewerImage.getAttribute("style")).toContain("translate(34px, 42px)");
  });

  it("支持遮罩点击和 Escape 关闭预览", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"],
        hideOnClickModal: true,
        previewTeleported: true
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();
    expect(document.body.querySelector(".xy-image-viewer")).not.toBeNull();

    (document.body.querySelector(".xy-image-viewer__mask") as HTMLElement | null)?.click();
    await nextTick();
    expect(document.body.querySelector(".xy-image-viewer")).toBeNull();

    await wrapper.get("img").trigger("click");
    await nextTick();
    (
      document.body.querySelector(".xy-image-viewer") as HTMLElement | null
    )?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();

    expect(wrapper.emitted("close")).toHaveLength(2);
  });

  it("支持自定义工具栏和 viewer-error 插槽", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      },
      slots: {
        toolbar:
          "<button class='custom-toolbar' type='button'>自定义工具栏</button>",
        "viewer-error": ({ retry }: { retry: () => void }) =>
          h(
            "button",
            {
              class: "custom-viewer-error",
              type: "button",
              onClick: retry
            },
            "预览失败，点击重试"
          )
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const actions = document.body.querySelector(".xy-image-viewer__actions") as HTMLElement | null;
    expect(actions?.classList.contains("is-hidden")).toBe(true);

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();
    expect(document.body.querySelector(".custom-toolbar")).not.toBeNull();
    expect(actions?.classList.contains("is-hidden")).toBe(false);

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("error")
    );
    await nextTick();
    expect(document.body.querySelector(".custom-viewer-error")).not.toBeNull();

    (document.body.querySelector(".custom-viewer-error") as HTMLButtonElement | null)?.click();
    await nextTick();
    expect(document.body.querySelector(".xy-image-viewer__image")).not.toBeNull();
    expect(document.body.querySelector(".xy-image-viewer__loading")).not.toBeNull();
  });

  it("预览失败后支持默认重试入口", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("error")
    );
    await nextTick();
    expect(document.body.querySelector(".xy-image-viewer__retry")).not.toBeNull();
    expect(document.body.querySelector('.xy-image-viewer__error[role="alert"]')).not.toBeNull();

    (document.body.querySelector(".xy-image-viewer__retry") as HTMLButtonElement | null)?.click();
    await nextTick();
    expect(document.body.querySelector(".xy-image-viewer__image")).not.toBeNull();
    expect(document.body.querySelector(".xy-image-viewer__loading")).not.toBeNull();
  });

  it("loading 和 error 状态下会隐藏默认工具栏", async () => {
    const wrapper = mount(XyImage, {
      attachTo: document.body,
      props: {
        src: "https://example.com/thumb.png",
        previewSrcList: ["https://example.com/a.png"]
      }
    });

    await wrapper.get("img").trigger("click");
    await nextTick();

    const actions = document.body.querySelector(".xy-image-viewer__actions") as HTMLElement | null;
    expect(actions?.classList.contains("is-hidden")).toBe(true);

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("load")
    );
    await nextTick();
    expect(actions?.classList.contains("is-hidden")).toBe(false);

    (document.body.querySelector(".xy-image-viewer__image") as HTMLImageElement).dispatchEvent(
      new Event("error")
    );
    await nextTick();
    expect(actions?.classList.contains("is-hidden")).toBe(true);
  });
});
