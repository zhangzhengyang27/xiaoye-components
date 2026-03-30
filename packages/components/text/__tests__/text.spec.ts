import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { XyConfigProvider, XyText } from "@xiaoye/components";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("XyText", () => {
  it("默认渲染为文本组件", () => {
    const wrapper = mount(XyText, {
      slots: {
        default: "文本内容"
      }
    });

    expect(wrapper.classes()).toContain("xy-text");
    expect(wrapper.classes()).toContain("xy-text--default");
    expect(wrapper.classes()).toContain("xy-text--md");
    expect(wrapper.text()).toContain("文本内容");
  });

  it("支持类型和尺寸", () => {
    const wrapper = mount(XyText, {
      props: {
        type: "success",
        size: "lg"
      }
    });

    expect(wrapper.classes()).toContain("xy-text--success");
    expect(wrapper.classes()).toContain("xy-text--lg");
  });

  it("支持全局尺寸继承", () => {
    const wrapper = mount({
      components: {
        XyConfigProvider,
        XyText
      },
      template: `
        <xy-config-provider size="sm">
          <xy-text ref="text">全局尺寸</xy-text>
        </xy-config-provider>
      `
    });

    const text = wrapper.findComponent({ ref: "text" });

    expect(text.classes()).toContain("xy-text--sm");
  });

  it("支持单行截断和 title 回填", async () => {
    const wrapper = mount(XyText, {
      props: {
        truncated: true
      },
      slots: {
        default: "这是一段会被截断的长文本"
      }
    });

    const element = wrapper.element as HTMLElement;

    Object.defineProperty(element, "offsetWidth", {
      configurable: true,
      get: () => 80
    });
    Object.defineProperty(element, "scrollWidth", {
      configurable: true,
      get: () => 160
    });

    await wrapper.setProps({
      type: "primary"
    });

    expect(wrapper.classes()).toContain("is-truncated");
    expect(wrapper.attributes("title")).toBe("这是一段会被截断的长文本");
  });

  it("支持多行截断和 line-clamp 样式", async () => {
    const wrapper = mount(XyText, {
      props: {
        lineClamp: 2
      },
      slots: {
        default: "第一行 第二行 第三行"
      }
    });

    const element = wrapper.element as HTMLElement;

    Object.defineProperty(element, "offsetHeight", {
      configurable: true,
      get: () => 40
    });
    Object.defineProperty(element, "scrollHeight", {
      configurable: true,
      get: () => 90
    });

    await wrapper.setProps({
      lineClamp: 3
    });

    expect(wrapper.classes()).toContain("is-line-clamp");
    expect(element.style.webkitLineClamp).toBe("3");
    expect(wrapper.attributes("title")).toBe("第一行 第二行 第三行");
  });

  it("支持自定义标签", () => {
    const wrapper = mount(XyText, {
      props: {
        tag: "del"
      },
      slots: {
        default: "已下线"
      }
    });

    expect(wrapper.element.tagName).toBe("DEL");
  });

  it("支持复制和语义样式", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText
      }
    });

    const wrapper = mount(XyText, {
      props: {
        copyable: true,
        strong: true,
        underline: true,
        delete: true
      },
      slots: {
        default: "复制文本"
      }
    });

    expect(wrapper.find(".xy-text").classes()).toContain("is-strong");
    expect(wrapper.find(".xy-text").classes()).toContain("is-underline");
    expect(wrapper.find(".xy-text").classes()).toContain("is-delete");

    await wrapper.get(".xy-text__action").trigger("click");

    expect(writeText).toHaveBeenCalledWith("复制文本");
  });

  it("支持 expandable 展开收起", async () => {
    const wrapper = mount(XyText, {
      props: {
        lineClamp: 2,
        expandable: true
      },
      slots: {
        default: "第一行 第二行 第三行 第四行"
      }
    });

    const element = wrapper.find(".xy-text").element as HTMLElement;

    Object.defineProperty(element, "offsetHeight", {
      configurable: true,
      get: () => 40
    });
    Object.defineProperty(element, "scrollHeight", {
      configurable: true,
      get: () => 90
    });

    await wrapper.setProps({
      type: "primary"
    });

    expect(wrapper.find(".xy-text__toggle").text()).toBe("展开");

    await wrapper.get(".xy-text__toggle").trigger("click");

    expect(wrapper.find(".xy-text").classes()).toContain("is-expanded");
    expect(wrapper.find(".xy-text__toggle").text()).toBe("收起");
  });

  it("用户显式传 title 时不会覆盖", async () => {
    const wrapper = mount(XyText, {
      props: {
        truncated: true
      },
      attrs: {
        title: "自定义标题"
      },
      slots: {
        default: "原始文本"
      }
    });

    const element = wrapper.element as HTMLElement;

    Object.defineProperty(element, "offsetWidth", {
      configurable: true,
      get: () => 80
    });
    Object.defineProperty(element, "scrollWidth", {
      configurable: true,
      get: () => 120
    });

    await nextTick();

    expect(wrapper.attributes("title")).toBe("自定义标题");
  });
});
