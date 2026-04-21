import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { XyDrawer } from "@xiaoye/components";
import { XyDrawerForm, XyOverlayForm } from "@xiaoye/pro-components";

describe("XyDrawerForm", () => {
  it("固定以 drawer 容器渲染覆盖层表单", () => {
    const wrapper = mount(XyDrawerForm, {
      props: {
        open: true,
        model: {
          name: "成员台账"
        }
      }
    });

    expect(wrapper.findComponent(XyOverlayForm).exists()).toBe(true);
    expect(wrapper.findComponent(XyDrawer).exists()).toBe(true);
  });

  it("转发 update:open、submit、cancel 和 closed 事件", async () => {
    const wrapper = mount(XyDrawerForm, {
      props: {
        open: true,
        model: {
          name: "成员台账"
        }
      }
    });

    const overlay = wrapper.findComponent(XyOverlayForm);
    const payload = {
      mode: "create" as const,
      model: {
        name: "成员台账"
      }
    };

    overlay.vm.$emit("update:open", false);
    overlay.vm.$emit("submit", payload);
    overlay.vm.$emit("cancel", payload);
    overlay.vm.$emit("closed");
    await nextTick();

    expect(wrapper.emitted("update:open")?.[0]?.[0]).toBe(false);
    expect(wrapper.emitted("submit")?.[0]?.[0]).toEqual(payload);
    expect(wrapper.emitted("cancel")?.[0]?.[0]).toEqual(payload);
    expect(wrapper.emitted("closed")).toHaveLength(1);
  });
});
