import { mount } from "@vue/test-utils";
import { nextTick, reactive } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyButton } from "@xiaoye/components";
import { XyLoginForm } from "@xiaoye/pro-components";

describe("XyLoginForm", () => {
  it("支持标题、描述、用户名密码和记住我渲染", () => {
    const wrapper = mount(XyLoginForm, {
      props: {
        model: reactive({
          username: "",
          password: "",
          remember: true
        }),
        title: "运营后台登录",
        description: "统一登录主链路",
        showRemember: true
      }
    });

    expect(wrapper.text()).toContain("运营后台登录");
    expect(wrapper.text()).toContain("统一登录主链路");
    expect(wrapper.text()).toContain("记住我");
    expect(wrapper.findAll("input")).toHaveLength(3);
  });

  it("默认校验通过后会触发 submit", async () => {
    const model = reactive({
      username: "xiaoye",
      password: "secret",
      remember: true
    });
    const wrapper = mount(XyLoginForm, {
      props: {
        model
      }
    });
    const api = wrapper.vm as unknown as {
      submit: () => Promise<boolean>;
    };

    await expect(api.submit()).resolves.toBe(true);
    await nextTick();

    expect(wrapper.emitted("submit")).toHaveLength(1);
    expect(wrapper.emitted("submit")?.[0]?.[0]).toEqual({
      username: "xiaoye",
      password: "secret",
      remember: true
    });
  });

  it("自定义 rules 会覆盖默认校验并阻止提交", async () => {
    const model = reactive({
      username: "ab",
      password: "secret",
      remember: false
    });
    const wrapper = mount(XyLoginForm, {
      props: {
        model,
        rules: {
          username: [
            {
              min: 4,
              message: "用户名至少 4 位",
              trigger: ["blur", "change"]
            }
          ]
        }
      }
    });

    const valid = await (wrapper.vm as unknown as { validate: () => Promise<boolean> }).validate();

    expect(valid).toBe(false);
    expect(wrapper.text()).toContain("用户名至少 4 位");

    await wrapper.findComponent(XyButton).trigger("click");
    await nextTick();

    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("loading 和 disabled 状态会透传到提交按钮", () => {
    const wrapper = mount(XyLoginForm, {
      props: {
        model: reactive({
          username: "xiaoye",
          password: "secret"
        }),
        loading: true,
        disabled: true
      }
    });

    const button = wrapper.findComponent(XyButton);

    expect(button.props("loading")).toBe(true);
    expect(button.props("disabled")).toBe(true);
  });

  it("third-party-click 会返回点击项", async () => {
    const wrapper = mount(XyLoginForm, {
      props: {
        model: reactive({
          username: "",
          password: ""
        }),
        thirdPartyItems: [
          {
            key: "github",
            label: "GitHub",
            icon: "mdi:github"
          }
        ]
      }
    });

    await wrapper.findAllComponents(XyButton)[1]?.trigger("click");

    expect(wrapper.emitted("third-party-click")).toHaveLength(1);
    expect(wrapper.emitted("third-party-click")?.[0]?.[0]).toEqual({
      key: "github",
      label: "GitHub",
      icon: "mdi:github"
    });
  });

  it("expose 的 focus 和 submit 可用", async () => {
    const model = reactive({
      username: "xiaoye",
      password: "secret"
    });
    const wrapper = mount(XyLoginForm, {
      attachTo: document.body,
      props: {
        model
      }
    });
    const api = wrapper.vm as unknown as {
      focus: (field?: "username" | "password") => void;
      submit: () => Promise<boolean>;
    };

    api.focus("password");
    await nextTick();

    expect(document.activeElement).toBe(wrapper.findAll("input")[1]?.element);
    await expect(api.submit()).resolves.toBe(true);
  });
});
