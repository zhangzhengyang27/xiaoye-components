import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyAvatarMenu } from "@xiaoye/pro-components";
import { XyDropdown } from "@xiaoye/components";

describe("XyAvatarMenu", () => {
  it("会渲染用户信息并透传下拉选择事件", () => {
    const wrapper = mount(XyAvatarMenu, {
      props: {
        username: "小叶",
        description: "管理员",
        items: [
          {
            key: "profile",
            label: "个人中心",
            command: "profile"
          }
        ]
      }
    });

    expect(wrapper.text()).toContain("小叶");
    expect(wrapper.text()).toContain("管理员");

    wrapper.getComponent(XyDropdown).vm.$emit("command", "profile");
    wrapper.getComponent(XyDropdown).vm.$emit("select", { command: "profile" });

    expect(wrapper.emitted("command")?.[0]).toEqual(["profile"]);
    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ command: "profile" });
  });
});
