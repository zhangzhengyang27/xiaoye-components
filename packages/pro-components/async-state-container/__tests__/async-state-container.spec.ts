import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyAsyncStateContainer } from "@xiaoye/pro-components";

describe("XyAsyncStateContainer", () => {
  it("支持渲染错误态并触发重试", async () => {
    const wrapper = mount(XyAsyncStateContainer, {
      props: {
        error: "请求失败"
      }
    });

    expect(wrapper.text()).toContain("请求失败");

    await wrapper.get(".xy-button--primary").trigger("click");

    expect(wrapper.emitted("retry")).toHaveLength(1);
  });
});
