import { enableAutoUnmount, mount } from "@vue/test-utils";
import { h } from "vue";
import { afterEach, describe, expect, it } from "vitest";
import { XyEmpty } from "../index";
import { XyConfigProvider } from "../../config-provider";

enableAutoUnmount(afterEach);

describe("XyEmpty", () => {
  it("默认渲染内置标题、描述和插画", () => {
    const wrapper = mount(XyEmpty);

    expect(wrapper.find(".xy-empty__default-art").exists()).toBe(true);
    expect(wrapper.find(".xy-empty__title").text()).toBe("暂无数据");
    expect(wrapper.find(".xy-empty__description").text()).toBe("这里还没有可展示的内容");
  });

  it("未传 title 和 description 时支持从 ConfigProvider locale 回退", () => {
    const wrapper = mount(XyConfigProvider, {
      props: {
        locale: {
          emptyTitle: "暂无项目",
          emptyDescription: "还没有内容"
        }
      },
      slots: {
        default: () => h(XyEmpty)
      }
    });

    expect(wrapper.text()).toContain("暂无项目");
    expect(wrapper.text()).toContain("还没有内容");
  });

  it("title 传空字符串时隐藏标题区", () => {
    const wrapper = mount(XyEmpty, {
      props: {
        title: ""
      }
    });

    expect(wrapper.find(".xy-empty__title").exists()).toBe(false);
    expect(wrapper.find(".xy-empty__description").exists()).toBe(true);
  });

  it("description 传空字符串时隐藏描述区", () => {
    const wrapper = mount(XyEmpty, {
      props: {
        description: ""
      }
    });

    expect(wrapper.find(".xy-empty__description").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("这里还没有可展示的内容");
  });

  it("image 插槽优先于 image prop", () => {
    const wrapper = mount(XyEmpty, {
      props: {
        image: "/empty.png"
      },
      slots: {
        image: "<span class='custom-image'>自定义插画</span>"
      }
    });

    expect(wrapper.find(".custom-image").exists()).toBe(true);
    expect(wrapper.find(".xy-empty__image").exists()).toBe(false);
  });

  it("支持 imageAlt 和 imageSize", () => {
    const wrapper = mount(XyEmpty, {
      props: {
        image: "/empty.png",
        imageAlt: "空状态插画",
        imageSize: 120
      }
    });

    const image = wrapper.find(".xy-empty__image");
    expect(image.attributes("src")).toBe("/empty.png");
    expect(image.attributes("alt")).toBe("空状态插画");

    const illustration = wrapper.find(".xy-empty__illustration");
    expect(illustration.attributes("style")).toContain("width: 120px");
  });

  it("imageSize 支持字符串", () => {
    const wrapper = mount(XyEmpty, {
      props: {
        imageSize: "12rem"
      }
    });

    expect(wrapper.find(".xy-empty__illustration").attributes("style")).toContain("width: 12rem");
  });

  it("默认插槽存在时渲染底部操作区", () => {
    const wrapper = mount(XyEmpty, {
      slots: {
        default: "<button class='empty-action'>立即创建</button>"
      }
    });

    expect(wrapper.find(".xy-empty__footer").exists()).toBe(true);
    expect(wrapper.find(".empty-action").exists()).toBe(true);
  });
});
