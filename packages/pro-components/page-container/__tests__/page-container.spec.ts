import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyPageContainer } from "@xiaoye/pro-components";

describe("XyPageContainer", () => {
  it("默认头部会根据标题信息自动渲染", () => {
    const wrapper = mount(XyPageContainer, {
      props: {
        title: "成员中心",
        description: "统一承接详情页主体内容"
      },
      slots: {
        default: '<div class="page-body">正文区域</div>'
      }
    });

    expect(wrapper.find(".xy-page-header").exists()).toBe(true);
    expect(wrapper.find(".page-body").exists()).toBe(true);
  });

  it("header 插槽会覆盖默认头部，footer 插槽正常渲染", () => {
    const wrapper = mount(XyPageContainer, {
      props: {
        title: "不会显示"
      },
      slots: {
        header: '<div class="custom-header">自定义头部</div>',
        default: '<div class="body">正文</div>',
        footer: '<div class="footer">底部操作</div>'
      }
    });

    expect(wrapper.find(".custom-header").exists()).toBe(true);
    expect(wrapper.find(".xy-page-header").exists()).toBe(false);
    expect(wrapper.find(".footer").exists()).toBe(true);
  });

  it("loading 状态会切换到加载内容", () => {
    const wrapper = mount(XyPageContainer, {
      props: {
        loading: true
      },
      slots: {
        default: '<div class="body">正文</div>'
      }
    });

    expect(wrapper.find(".xy-page-container__loading").exists()).toBe(true);
    expect(wrapper.find(".body").exists()).toBe(false);
  });
});
