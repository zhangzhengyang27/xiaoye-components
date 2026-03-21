import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyButton } from "@xiaoye/components";

describe("XyButton", () => {
  it("在 loading 时阻止点击事件", async () => {
    const wrapper = mount(XyButton, {
      props: {
        loading: true
      },
      slots: {
        default: "保存"
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toBeUndefined();
    expect(wrapper.classes()).toContain("is-loading");
  });

  it("支持通过 kebab-case 标签全局注册后直接使用", () => {
    const wrapper = mount(
      {
        template: `
          <xy-button variant="outline">保存</xy-button>
        `
      },
      {
        global: {
          plugins: [XyButton]
        }
      }
    );

    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.text()).toContain("保存");
  });
});
