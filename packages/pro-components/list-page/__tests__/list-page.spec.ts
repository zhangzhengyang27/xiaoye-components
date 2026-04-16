import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyListPage } from "@xiaoye/pro-components";

describe("XyListPage", () => {
  it("支持渲染标题并转发工具栏动作", async () => {
    const action = {
      key: "create",
      label: "新建"
    };
    const wrapper = mount(XyListPage, {
      props: {
        title: "成员列表",
        immediate: false,
        columns: [
          {
            prop: "name",
            label: "名称"
          }
        ],
        data: [
          {
            id: 1,
            name: "账单中心"
          }
        ],
        toolbarActions: [action]
      }
    });

    expect(wrapper.text()).toContain("成员列表");

    await wrapper.get("button").trigger("click");
    await nextTick();

    expect(wrapper.emitted("toolbar-action")?.[0]?.[0]).toEqual(action);
  });
});
