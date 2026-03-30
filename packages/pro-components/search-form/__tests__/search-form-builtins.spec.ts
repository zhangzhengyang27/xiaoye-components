import { mount } from "@vue/test-utils";
import { reactive } from "vue";
import { describe, expect, it } from "vitest";
import { XySearchForm } from "@xiaoye/pro-components";

describe("XySearchForm builtins", () => {
  it("支持 radio-group / checkbox-group / cascader / transfer 等扩展内建组件", async () => {
    const model = reactive({
      status: "all",
      scenes: ["a"],
      path: ["hz", "yuhang"],
      members: []
    });

    const wrapper = mount(XySearchForm, {
      props: {
        model,
        defaultCollapsed: false,
        fields: [
          {
            prop: "status",
            label: "状态",
            component: "radio-group",
            options: [
              { label: "全部", value: "all" },
              { label: "启用", value: "enabled" }
            ]
          },
          {
            prop: "scenes",
            label: "场景",
            component: "checkbox-group",
            options: [
              { label: "A", value: "a" },
              { label: "B", value: "b" }
            ]
          },
          {
            prop: "path",
            label: "地域",
            component: "cascader",
            componentProps: {
              options: [
                {
                  label: "杭州",
                  value: "hz",
                  children: [{ label: "余杭", value: "yuhang" }]
                }
              ]
            }
          },
          {
            prop: "members",
            label: "成员",
            component: "transfer",
            componentProps: {
              data: [
                { key: "1", label: "小叶" },
                { key: "2", label: "小周" }
              ]
            }
          }
        ]
      }
    });

    expect(wrapper.find(".xy-radio-group").exists()).toBe(true);
    expect(wrapper.find(".xy-checkbox-group").exists()).toBe(true);
    expect(wrapper.find(".xy-cascader").exists()).toBe(true);
    expect(wrapper.find(".xy-transfer").exists()).toBe(true);
  });
});
