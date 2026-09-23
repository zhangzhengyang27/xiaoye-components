import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XySavedViewTabs } from "@xiaoye/pro-components";
import { XyTabs } from "@xiaoye/components";

describe("XySavedViewTabs", () => {
  it("支持渲染页签并响应切换", async () => {
    const item = {
      key: "done",
      label: "已完成",
      count: 2
    };
    const wrapper = mount(XySavedViewTabs, {
      props: {
        items: [
          {
            key: "all",
            label: "全部"
          },
          item
        ],
        activeKey: "all"
      }
    });

    expect(wrapper.text()).toContain("已完成 (2)");

    wrapper.findComponent(XyTabs).vm.$emit("change", "done");
    await nextTick();

    expect(wrapper.emitted("update:activeKey")?.[0]?.[0]).toBe("done");
    expect(wrapper.emitted("select")?.[0]?.[0]).toEqual(item);
  });

  it("默认不显示新增按钮，addable 时显示加号并派发 create", async () => {
    const items = [
      { key: "all", label: "全部" },
      { key: "done", label: "已完成" }
    ];

    const defaultWrapper = mount(XySavedViewTabs, {
      props: { items, activeKey: "all" }
    });

    expect(defaultWrapper.find(".xy-tabs__add").exists()).toBe(false);

    const addableWrapper = mount(XySavedViewTabs, {
      props: { items, activeKey: "all", addable: true }
    });

    const addButton = addableWrapper.find(".xy-tabs__add");

    expect(addButton.exists()).toBe(true);

    await addButton.trigger("click");

    expect(addableWrapper.emitted("create")).toHaveLength(1);
  });

  it("逐项 closable 协议不受 addable 影响", async () => {
    const items = [
      { key: "fixed", label: "固定页", closable: false },
      { key: "manual", label: "可关页", closable: true },
      { key: "auto", label: "默认页" }
    ];

    const defaultWrapper = mount(XySavedViewTabs, {
      props: { items, activeKey: "fixed" }
    });

    expect(defaultWrapper.findAll(".xy-tabs__tab-close")).toHaveLength(1);

    const closeButton = defaultWrapper.findAll(".xy-tabs__tab-close")[0];

    await closeButton?.trigger("click");

    expect(defaultWrapper.emitted("remove")?.[0]?.[0]).toEqual(items[1]);

    const addableWrapper = mount(XySavedViewTabs, {
      props: { items, activeKey: "fixed", addable: true }
    });

    const closableTabs = addableWrapper.findAll(".xy-tabs__tab.is-closable");

    expect(closableTabs).toHaveLength(2);
    expect(closableTabs.some((tab) => tab.text().includes("固定页"))).toBe(false);
  });
});
