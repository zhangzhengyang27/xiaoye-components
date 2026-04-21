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

  it("readonly 时复用只读展示协议而不是继续渲染提交表单", () => {
    const wrapper = mount(XyRequestForm, {
      props: {
        title: "查看成员",
        readonly: true,
        immediate: false,
        model: {
          name: "账单中心",
          status: "enabled"
        },
        schema: [
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
                label: "启用",
                value: "enabled",
                status: "success"
              }
            ]
          }
        ]
      }
    });

    expect(wrapper.find(".xy-descriptions").exists()).toBe(true);
    expect(wrapper.text()).toContain("账单中心");
    expect(wrapper.text()).toContain("启用");
  });
});
