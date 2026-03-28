import { enableAutoUnmount, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { XyWatermark } from "../index";
import type { WatermarkInstance } from "../index";

enableAutoUnmount(afterEach);

const fillTextMock = vi.fn();
const drawImageMock = vi.fn();
const measureTextMock = vi.fn((text: string) => ({
  width: text.length * 8,
  fontBoundingBoxAscent: 12,
  fontBoundingBoxDescent: 4,
  actualBoundingBoxAscent: 12,
  actualBoundingBoxDescent: 4
}));

let dataUrlSeed = 0;
let imageBehaviors: Array<"load" | "error"> = [];

class MockImage {
  crossOrigin = "";
  referrerPolicy = "";
  onload: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  private _src = "";

  set src(value: string) {
    this._src = value;
    const behavior = imageBehaviors.shift() ?? "load";

    setTimeout(() => {
      if (behavior === "load") {
        this.onload?.(new Event("load"));
        return;
      }

      this.onerror?.(new Event("error"));
    }, 0);
  }

  get src() {
    return this._src;
  }
}

function createMockContext() {
  return {
    save: vi.fn(),
    drawImage: drawImageMock,
    translate: vi.fn(),
    rotate: vi.fn(),
    fillText: fillTextMock,
    measureText: measureTextMock,
    fillStyle: "",
    font: "",
    textAlign: "center",
    textBaseline: "top"
  } as unknown as CanvasRenderingContext2D;
}

async function flushWatermark(cycles = 2) {
  for (let index = 0; index < cycles; index += 1) {
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  await nextTick();
}

function getLayer(root: ParentNode = document) {
  return root.querySelector(".xy-watermark__layer") as HTMLDivElement | null;
}

beforeEach(() => {
  dataUrlSeed = 0;
  imageBehaviors = [];
  fillTextMock.mockReset();
  drawImageMock.mockReset();
  measureTextMock.mockClear();

  vi.stubGlobal("Image", MockImage);
  vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation((contextId) => (contextId === "2d" ? createMockContext() : null));
  vi
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockImplementation(() => `data:image/mock-${++dataUrlSeed}`);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("XyWatermark", () => {
  it("默认文本水印与默认插槽共存", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      slots: {
        default: "<div class='watermark-content'>内容区</div>"
      }
    });

    await flushWatermark();

    expect(wrapper.find(".watermark-content").exists()).toBe(true);
    expect(getLayer(wrapper.element)?.getAttribute("style")).toContain("pointer-events: none");
    expect(getLayer(wrapper.element)?.getAttribute("style")).toContain("background-image: url(");
    expect(fillTextMock).toHaveBeenCalledWith("Xiaoye Components", expect.any(Number), 0);
    expect(wrapper.emitted("rendered")?.[0]?.[0]).toMatchObject({
      source: "text",
      target: wrapper.element
    });
  });

  it("content 为数组时支持多行文字绘制", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: ["小叶组件库", "Xiaoye Components"]
      }
    });

    await flushWatermark();

    expect(getLayer(wrapper.element)).not.toBeNull();
    expect(fillTextMock).toHaveBeenCalledWith("小叶组件库", expect.any(Number), 0);
    expect(fillTextMock).toHaveBeenCalledWith("Xiaoye Components", expect.any(Number), 19);
  });

  it("图片模式成功时优先绘制图片", async () => {
    imageBehaviors = ["load"];

    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>",
        width: 132,
        height: 36,
        content: "回退文案"
      }
    });

    await flushWatermark(3);

    expect(getLayer(wrapper.element)).not.toBeNull();
    expect(drawImageMock).toHaveBeenCalled();
    expect(fillTextMock).not.toHaveBeenCalled();
    expect(wrapper.emitted("rendered")?.[0]?.[0]).toMatchObject({
      source: "image",
      target: wrapper.element
    });
  });

  it("图片加载失败时回退到文本水印", async () => {
    imageBehaviors = ["error"];

    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        image: "broken-image",
        content: "回退文案"
      }
    });

    await flushWatermark(3);

    expect(getLayer(wrapper.element)).not.toBeNull();
    expect(wrapper.emitted("image-error")).toHaveLength(1);
    expect(fillTextMock).toHaveBeenCalledWith("回退文案", expect.any(Number), 0);
    expect(wrapper.emitted("rendered")?.[0]?.[0]).toMatchObject({
      source: "text"
    });
  });

  it("gap、offset、rotate、zIndex、width、height 会反映到水印层样式", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "定制参数",
        gap: [120, 80],
        offset: [30, 50],
        rotate: -30,
        zIndex: 12,
        width: 160,
        height: 52
      }
    });

    await flushWatermark();

    const style = getLayer(wrapper.element)?.getAttribute("style") ?? "";

    expect(style).toContain("z-index: 12");
    expect(style).toContain("top: 10px");
    expect(style).toContain("background-position: -30px 0px");
    expect(style).toMatch(/background-size: \d+px \d+px/);
  });

  it("disabled 开关会移除和恢复水印层", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "禁用切换"
      }
    });

    await flushWatermark();
    expect(getLayer(wrapper.element)).not.toBeNull();

    await wrapper.setProps({
      disabled: true
    });
    await flushWatermark();

    expect(getLayer(wrapper.element)).toBeNull();

    await wrapper.setProps({
      disabled: false
    });
    await flushWatermark();

    expect(getLayer(wrapper.element)).not.toBeNull();
  });

  it("opacity 和 repeat 会反映到水印层样式", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "样式参数",
        opacity: 0.35,
        repeat: "repeat-y"
      }
    });

    await flushWatermark();

    const style = getLayer(wrapper.element)?.getAttribute("style") ?? "";
    expect(style).toContain("opacity: 0.35");
    expect(style).toContain("background-repeat: repeat-y");
  });

  it("props 变化后会重新绘制水印", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "初始文案"
      }
    });

    await flushWatermark();

    const initialStyle = getLayer(wrapper.element)?.getAttribute("style");
    const initialSeed = dataUrlSeed;

    fillTextMock.mockClear();

    await wrapper.setProps({
      content: "更新文案",
      rotate: -10
    });
    await flushWatermark();

    expect(dataUrlSeed).toBeGreaterThan(initialSeed);
    expect(getLayer(wrapper.element)?.getAttribute("style")).not.toBe(initialStyle);
    expect(fillTextMock).toHaveBeenCalledWith("更新文案", expect.any(Number), 0);
  });

  it("删除水印层后会自动恢复", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "自动恢复"
      }
    });

    await flushWatermark();

    const removedLayer = getLayer(wrapper.element);
    removedLayer?.remove();

    await flushWatermark(3);

    expect(getLayer(wrapper.element)).not.toBeNull();
    expect(getLayer(wrapper.element)).not.toBe(removedLayer);
  });

  it("篡改水印层样式后会自动恢复", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "样式恢复"
      }
    });

    await flushWatermark();

    const layer = getLayer(wrapper.element);
    layer?.setAttribute("style", "background-image: none;");

    await flushWatermark(3);

    expect(getLayer(wrapper.element)?.getAttribute("style")).toContain("background-image: url(");
  });

  it("autoObserve=false 时删除水印层后不会自动恢复", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "不自动恢复",
        autoObserve: false
      }
    });

    await flushWatermark();

    getLayer(wrapper.element)?.remove();
    await flushWatermark(3);

    expect(getLayer(wrapper.element)).toBeNull();
  });

  it("content 为空且没有 image 时不渲染水印层", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: ""
      },
      slots: {
        default: "<div class='plain-content'>内容区</div>"
      }
    });

    await flushWatermark();

    expect(wrapper.find(".plain-content").exists()).toBe(true);
    expect(getLayer(wrapper.element)).toBeNull();
  });

  it("暴露 rerender、getDataUrl 和 getTarget", async () => {
    imageBehaviors = ["load", "load"];

    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'></svg>"
      }
    });

    const api = wrapper.vm as WatermarkInstance;
    expect(api.getDataUrl()).toBeNull();
    expect(api.getTarget()).toBe(wrapper.element);

    await flushWatermark(3);

    const firstDataUrl = api.getDataUrl();
    expect(firstDataUrl).toContain("data:image/mock-");

    api.rerender();
    await flushWatermark(3);

    expect(api.getDataUrl()).not.toBe(firstDataUrl);
    expect(api.getTarget()).toBe(wrapper.element);
  });

  it("fullscreen 模式会把水印层挂到 document.body 并在卸载时清理", async () => {
    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "全屏水印",
        fullscreen: true
      }
    });

    await flushWatermark();

    const layer = document.body.querySelector(".xy-watermark__layer") as HTMLDivElement | null;
    expect(layer).not.toBeNull();
    expect(layer?.getAttribute("style")).toContain("position: fixed");
    expect(wrapper.find(".xy-watermark__layer").exists()).toBe(false);

    wrapper.unmount();
    expect(document.body.querySelector(".xy-watermark__layer")).toBeNull();
  });

  it("target 支持选择器并自动补定位上下文", async () => {
    document.body.innerHTML = "<div class='watermark-host'></div>";
    const target = document.querySelector(".watermark-host") as HTMLElement;

    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "目标容器",
        target: ".watermark-host"
      },
      slots: {
        default: "<div class='watermark-helper'>说明内容</div>"
      }
    });

    await flushWatermark();

    expect(target.querySelector(".xy-watermark__layer")).not.toBeNull();
    expect(wrapper.find(".watermark-helper").exists()).toBe(true);
    expect(wrapper.find(".xy-watermark__layer").exists()).toBe(false);
    expect(target.classList.contains("xy-watermark-target--relative")).toBe(true);
    expect((wrapper.vm as WatermarkInstance).getTarget()).toBe(target);

    wrapper.unmount();
    expect(target.classList.contains("xy-watermark-target--relative")).toBe(false);
  });

  it("target 支持 HTMLElement", async () => {
    const target = document.createElement("section");
    target.className = "watermark-element-host";
    document.body.append(target);

    const wrapper = mount(XyWatermark, {
      attachTo: document.body,
      props: {
        content: "HTMLElement 目标",
        target
      }
    });

    await flushWatermark();

    expect(target.querySelector(".xy-watermark__layer")).not.toBeNull();
    expect((wrapper.vm as WatermarkInstance).getTarget()).toBe(target);
  });

  it("target 不存在时抛出错误", () => {
    expect(() =>
      mount(XyWatermark, {
        attachTo: document.body,
        props: {
          content: "缺失目标",
          target: ".missing-watermark-target"
        }
      })
    ).toThrow("[XyWatermark] target does not exist: .missing-watermark-target");
  });
});
