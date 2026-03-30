import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyDialog, XyDrawer } from "@xiaoye/components";
import { XyOverlayForm } from "@xiaoye/pro-components";

describe("XyOverlayForm", () => {
  it("在 drawer 模式下渲染抽屉表单", () => {
    const wrapper = mount(XyOverlayForm, {
      props: {
        open: true,
        container: "drawer",
        model: {
          name: "成员台账"
        }
      }
    });

    expect(wrapper.findComponent(XyDrawer).exists()).toBe(true);
  });

  it("在 modal 模式下渲染弹窗表单", () => {
    const wrapper = mount(XyOverlayForm, {
      props: {
        open: true,
        container: "modal",
        model: {
          name: "成员台账"
        }
      }
    });

    expect(wrapper.findComponent(XyDialog).exists()).toBe(true);
  });
});
