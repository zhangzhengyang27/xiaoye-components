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
});
