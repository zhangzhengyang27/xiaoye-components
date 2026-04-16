import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyRequestForm } from "@xiaoye/pro-components";

describe("XyRequestForm", () => {
  it("支持初始化请求并回填模型", async () => {
    const model = {
      name: ""
    };
    const initialRequest = vi.fn().mockResolvedValue({
      name: "账单中心"
    });

    const wrapper = mount(XyRequestForm, {
      props: {
        title: "编辑成员",
        model,
        initialRequest
      }
    });

    await flushPromises();

    expect(initialRequest).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("编辑成员");
    expect(model.name).toBe("账单中心");
    expect(wrapper.emitted("request-success")?.[0]?.[0]).toEqual({
      name: "账单中心"
    });
  });
});
