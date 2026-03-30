import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyCrudPage, XyListPage } from "@xiaoye/pro-components";

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

describe("XyCrudPage", () => {
  it("支持渲染标题并处理新建动作", async () => {
    const wrapper = mount(XyCrudPage, {
      props: {
        title: "成员管理",
        columns: [
          {
            prop: "name",
            label: "名称"
          }
        ],
        data: [
          {
            id: 1,
            name: "小叶"
          }
        ],
        formModel: {
          name: ""
        }
      }
    });

    expect(wrapper.text()).toContain("成员管理");

    wrapper.findComponent(XyListPage).vm.$emit("toolbar-action", {
      key: "create",
      label: "新建"
    });
    await nextTick();

    expect(wrapper.emitted("open-create")).toHaveLength(1);
  });
});
