import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { XySplitter, XySplitterPanel } from "@xiaoye/components";

function mockSplitterSize(element: Element, width: number, height = 320) {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      width,
      height,
      top: 0,
      right: width,
      bottom: height,
      left: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      }
    })
  });
}

describe("XySplitter", () => {
  it("支持基础渲染和垂直布局", async () => {
    const wrapper = mount(XySplitter, {
      props: {
        layout: "vertical"
      },
      slots: {
        default: [
          h(XySplitterPanel, null, () => "上方面板"),
          h(XySplitterPanel, null, () => "下方面板")
        ]
      },
      attachTo: document.body
    });

    const splitter = wrapper.find(".xy-splitter");
    mockSplitterSize(splitter.element, 480, 360);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    expect(splitter.classes()).toContain("xy-splitter--vertical");
    expect(wrapper.findAll(".xy-splitter-panel")).toHaveLength(2);
    expect(wrapper.findAll(".xy-splitter-panel")[0].attributes("style")).toContain("180px");
  });

  it("支持拖拽调整并触发事件", async () => {
    const wrapper = mount(XySplitter, {
      slots: {
        default: [
          h(XySplitterPanel, { size: 220, min: 120 }, () => "左侧"),
          h(XySplitterPanel, { min: 160 }, () => "右侧")
        ]
      },
      attachTo: document.body
    });

    const splitter = wrapper.find(".xy-splitter");
    mockSplitterSize(splitter.element, 600);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    const dragger = wrapper.find(".xy-splitter-bar__dragger");
    dragger.element.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, clientX: 220, clientY: 0 })
    );
    window.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 300, clientY: 0 }));
    await nextTick();

    expect(dragger.attributes("style")).toContain("translate(calc(-50% + 0px), -50%)");

    window.dispatchEvent(new MouseEvent("mouseup"));
    await nextTick();

    const panels = wrapper.findAll(".xy-splitter-panel");
    expect(panels[0].attributes("style")).toContain("300px");
    expect(panels[1].attributes("style")).toContain("300px");
    expect(wrapper.emitted("resizeStart")?.[0]).toEqual([0, [220, 380]]);
    expect(wrapper.emitted("resize")?.at(-1)).toEqual([0, [300, 300]]);
    expect(wrapper.emitted("resizeEnd")?.[0]).toEqual([0, [300, 300]]);
  });

  it("lazy 模式下拖拽预览线跟随偏移", async () => {
    const wrapper = mount(XySplitter, {
      props: {
        lazy: true
      },
      slots: {
        default: [
          h(XySplitterPanel, { size: 220, min: 120 }, () => "左侧"),
          h(XySplitterPanel, { min: 160 }, () => "右侧")
        ]
      },
      attachTo: document.body
    });

    const splitter = wrapper.find(".xy-splitter");
    mockSplitterSize(splitter.element, 600);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    const dragger = wrapper.find(".xy-splitter-bar__dragger");
    dragger.element.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, clientX: 220, clientY: 0 })
    );
    window.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 300, clientY: 0 }));
    await nextTick();

    expect(dragger.attributes("style")).toContain("translate(calc(-50% + 80px), -50%)");

    window.dispatchEvent(new MouseEvent("mouseup"));
    await nextTick();
  });

  it("支持折叠和面板尺寸双向绑定", async () => {
    const size = ref(180);

    const Demo = defineComponent({
      components: {
        XySplitter,
        XySplitterPanel
      },
      setup() {
        return {
          size
        };
      },
      template: `
        <xy-splitter>
          <xy-splitter-panel v-model:size="size" collapsible>
            左侧
          </xy-splitter-panel>
          <xy-splitter-panel>
            右侧
          </xy-splitter-panel>
        </xy-splitter>
      `
    });

    const wrapper = mount(Demo, {
      attachTo: document.body
    });

    const splitter = wrapper.find(".xy-splitter");
    mockSplitterSize(splitter.element, 480);
    window.dispatchEvent(new Event("resize"));
    await nextTick();

    const collapseButton = wrapper.find(".xy-splitter-bar__collapse--start");
    await collapseButton.trigger("click");
    await nextTick();

    expect(size.value).toBe(0);
    expect(wrapper.findAll(".xy-splitter-panel")[0].attributes("style")).toContain("0px");

    await collapseButton.trigger("click");
    await nextTick();

    expect(size.value).toBe(180);
    expect(wrapper.findAll(".xy-splitter-panel")[0].attributes("style")).toContain("180px");
  });
});
