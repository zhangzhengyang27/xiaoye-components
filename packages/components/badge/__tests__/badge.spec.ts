import { mount } from "@vue/test-utils";
import { computed, defineComponent, h, nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { XyBadge, XyButton } from "@xiaoye/components";

describe("XyBadge", () => {
  it("支持基础数值显示", () => {
    const wrapper = mount(XyBadge, {
      props: {
        value: 80
      }
    });

    expect(wrapper.find(".xy-badge__content").text()).toBe("80");
  });

  it("有默认插槽时会固定定位", () => {
    const wrapper = mount(XyBadge, {
      props: {
        value: 1
      },
      slots: {
        default: () => h(XyButton, null, () => "消息")
      }
    });

    expect(wrapper.find(".xy-badge__content").classes()).toContain("is-fixed");
    expect(wrapper.text()).toContain("消息");
  });

  it("支持 dot 模式和类型样式", () => {
    const wrapper = mount(XyBadge, {
      props: {
        isDot: true,
        type: "success"
      }
    });

    const content = wrapper.find(".xy-badge__content");
    expect(content.classes()).toContain("is-dot");
    expect(content.classes()).toContain("xy-badge__content--success");
  });

  it("支持 hidden 和 max", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const state = computed(() => ({
            hidden: false,
            value: 200
          }));

          return () =>
            h(XyBadge, {
              hidden: state.value.hidden,
              value: state.value.value,
              max: 99
            });
        }
      })
    );

    expect(wrapper.find(".xy-badge__content").text()).toBe("99+");

    await wrapper.setProps({
      hidden: true
    });
  });

  it("支持 showZero 隐藏 0", async () => {
    const wrapper = mount(XyBadge, {
      props: {
        showZero: false,
        value: 0
      }
    });

    expect(wrapper.find(".xy-badge__content").classes()).toContain("is-hide-zero");

    await wrapper.setProps({
      value: 1
    });

    expect(wrapper.find(".xy-badge__content").text()).toBe("1");
    expect(wrapper.find(".xy-badge__content").classes()).not.toContain("is-hide-zero");
  });

  it("支持 color、badgeStyle、badgeClass 和 offset", () => {
    const wrapper = mount(XyBadge, {
      props: {
        value: 20,
        color: "blue",
        badgeStyle: {
          borderWidth: "2px"
        },
        badgeClass: "custom-badge",
        offset: [10, 5]
      }
    });

    const content = wrapper.find(".xy-badge__content");
    expect(content.classes()).toContain("custom-badge");
    expect(content.attributes("style")).toContain("background-color: blue");
    expect(content.attributes("style")).toContain("margin-right: -10px");
    expect(content.attributes("style")).toContain("margin-top: 5px");
    expect(content.attributes("style")).toContain("border-width: 2px");
  });

  it("支持 content 插槽", () => {
    const wrapper = mount(XyBadge, {
      props: {
        value: 99
      },
      slots: {
        content: ({ value }: { value: string }) =>
          h("span", { class: "custom-content" }, `值:${value}`)
      }
    });

    expect(wrapper.find(".custom-content").text()).toBe("值:99");
  });
});
