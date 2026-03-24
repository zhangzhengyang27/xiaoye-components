import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyCard } from "@xiaoye/components";

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

describe("XyCard", () => {
  it("支持基础内容渲染", () => {
    const wrapper = mount(XyCard, {
      slots: {
        default: "卡片内容"
      }
    });

    expect(wrapper.text()).toContain("卡片内容");
  });

  it("支持字符串 header 和 footer", () => {
    const wrapper = mount(XyCard, {
      props: {
        header: "卡片标题",
        footer: "底部内容"
      },
      slots: {
        default: "主体内容"
      }
    });

    expect(wrapper.find(".xy-card__header").text()).toBe("卡片标题");
    expect(wrapper.find(".xy-card__footer").text()).toBe("底部内容");
  });

  it("支持 header 和 footer 插槽", () => {
    const wrapper = mount(XyCard, {
      slots: {
        header: "<div class='custom-header'>插槽头部</div>",
        default: "主体内容",
        footer: "<div class='custom-footer'>插槽底部</div>"
      }
    });

    expect(wrapper.find(".custom-header").exists()).toBe(true);
    expect(wrapper.find(".custom-footer").exists()).toBe(true);
  });

  it("支持 bodyStyle 的字符串、对象和数组", async () => {
    const wrapper = mount(XyCard, {
      props: {
        bodyStyle: "font-size: 14px;"
      },
      slots: {
        default: "主体内容"
      }
    });

    expect(wrapper.find(".xy-card__body").attributes("style")).toContain("font-size: 14px");

    await wrapper.setProps({
      bodyStyle: {
        color: "blue"
      }
    });

    expect(wrapper.find(".xy-card__body").attributes("style")).toContain("color: blue");

    await wrapper.setProps({
      bodyStyle: [{ color: "blue" }, { fontSize: "12px" }]
    });

    expect(wrapper.find(".xy-card__body").attributes("style")).toContain("color: blue");
    expect(wrapper.find(".xy-card__body").attributes("style")).toContain("font-size: 12px");
  });

  it("支持 headerClass、bodyClass、footerClass 和 shadow", () => {
    const wrapper = mount(XyCard, {
      props: {
        headerClass: "test-header",
        bodyClass: "test-body",
        footerClass: "test-footer",
        shadow: "hover"
      },
      slots: {
        header: "头部",
        default: "主体",
        footer: "底部"
      }
    });

    expect(wrapper.find(".xy-card__header").classes()).toContain("test-header");
    expect(wrapper.find(".xy-card__body").classes()).toContain("test-body");
    expect(wrapper.find(".xy-card__footer").classes()).toContain("test-footer");
    expect(wrapper.classes()).toContain("is-hover-shadow");
  });

  it("默认会启用分隔线、边框和默认变体", () => {
    const wrapper = mount(XyCard, {
      slots: {
        header: "头部",
        default: "主体",
        footer: "底部"
      }
    });

    expect(wrapper.classes()).toContain("xy-card--default");
    expect(wrapper.classes()).not.toContain("is-borderless");
    expect(wrapper.find(".xy-card__header").classes()).not.toContain("is-no-divider");
    expect(wrapper.find(".xy-card__footer").classes()).not.toContain("is-no-divider");
  });

  it("支持 size、variant、bordered、headerDivider 和 footerDivider", () => {
    const wrapper = mount(XyCard, {
      props: {
        size: "sm",
        variant: "muted",
        bordered: false,
        headerDivider: false,
        footerDivider: false
      },
      slots: {
        header: "头部",
        default: "主体",
        footer: "底部"
      }
    });

    expect(wrapper.classes()).toContain("xy-card--sm");
    expect(wrapper.classes()).toContain("xy-card--muted");
    expect(wrapper.classes()).toContain("is-borderless");
    expect(wrapper.find(".xy-card__header").classes()).toContain("is-no-divider");
    expect(wrapper.find(".xy-card__footer").classes()).toContain("is-no-divider");
  });

  it("支持 header + extra 的标准头部布局", () => {
    const wrapper = mount(XyCard, {
      props: {
        header: "筛选面板",
        extra: "最近更新"
      },
      slots: {
        default: "主体"
      }
    });

    expect(wrapper.find(".xy-card__header-main").text()).toBe("筛选面板");
    expect(wrapper.find(".xy-card__header-extra").text()).toBe("最近更新");
  });

  it("header 插槽优先于 header 和 extra", () => {
    const wrapper = mount(XyCard, {
      props: {
        header: "旧标题",
        extra: "旧操作"
      },
      slots: {
        header: "<div class='custom-header'>自定义头部</div>",
        default: "主体"
      }
    });

    expect(wrapper.find(".custom-header").exists()).toBe(true);
    expect(wrapper.find(".xy-card__header-inner").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("旧标题");
    expect(wrapper.text()).not.toContain("旧操作");
  });

  it("loading 优先级高于 empty，且不影响 header/footer", () => {
    const wrapper = mount(XyCard, {
      props: {
        header: "头部",
        footer: "底部",
        loading: true,
        empty: true,
        loadingText: "正在同步"
      },
      slots: {
        default: "主体",
        empty: "<div class='custom-empty'>空态</div>"
      }
    });

    expect(wrapper.find(".xy-card__header").exists()).toBe(true);
    expect(wrapper.find(".xy-card__footer").exists()).toBe(true);
    expect(wrapper.find(".xy-card__loading").text()).toContain("正在同步");
    expect(wrapper.find(".custom-empty").exists()).toBe(false);
  });

  it("支持 loading 和 empty 插槽覆盖默认内容", async () => {
    const wrapper = mount(XyCard, {
      props: {
        loading: true
      },
      slots: {
        loading: "<div class='custom-loading'>自定义加载</div>",
        empty: "<div class='custom-empty'>自定义空态</div>"
      }
    });

    expect(wrapper.find(".custom-loading").exists()).toBe(true);

    await wrapper.setProps({
      loading: false,
      empty: true
    });

    expect(wrapper.find(".custom-empty").exists()).toBe(true);
  });

  it("empty 默认回退 XyEmpty，并正确使用标题和描述", () => {
    const wrapper = mount(XyCard, {
      props: {
        empty: true,
        emptyTitle: "暂无成员",
        emptyDescription: "请先添加成员"
      }
    });

    expect(wrapper.find(".xy-empty").exists()).toBe(true);
    expect(wrapper.text()).toContain("暂无成员");
    expect(wrapper.text()).toContain("请先添加成员");
  });

  it("bodyClass 和 bodyStyle 在 loading 与 empty 状态下仍然挂到 body 容器", async () => {
    const wrapper = mount(XyCard, {
      props: {
        bodyClass: "custom-body",
        bodyStyle: {
          minHeight: "200px"
        },
        loading: true
      }
    });

    const body = wrapper.find(".xy-card__body");
    expect(body.classes()).toContain("custom-body");
    expect(body.attributes("style")).toContain("min-height: 200px");

    await wrapper.setProps({
      loading: false,
      empty: true
    });

    expect(wrapper.find(".xy-card__body").classes()).toContain("custom-body");
    expect(wrapper.find(".xy-card__body").attributes("style")).toContain("min-height: 200px");
  });
});
