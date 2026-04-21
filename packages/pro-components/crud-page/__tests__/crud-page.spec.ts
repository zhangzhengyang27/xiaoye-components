import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyCrudPage, XyDetailPanel, XyListPage } from "@xiaoye/pro-components";

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

  it("支持通过 detailSchema 直接渲染详情面板", async () => {
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
            name: "小叶",
            status: "reviewing"
          }
        ],
        formModel: {
          name: ""
        },
        detailSchema: [
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "status",
            label: "状态",
            valueType: "tag",
            options: [
              {
                label: "审核中",
                value: "reviewing",
                status: "warning"
              }
            ]
          }
        ]
      }
    });

    const detailPanel = wrapper.findComponent(XyDetailPanel);

    expect(detailPanel.exists()).toBe(true);
    expect(detailPanel.props("schema")).toHaveLength(2);
    expect(detailPanel.props("model")).toEqual({});
  });
});
