import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, onMounted, onUnmounted } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyDialog, XyDrawer } from "@xiaoye/components";
import { XyOverlayForm } from "@xiaoye/pro-components";

function createLifecycleContent(counter: { mounted: number; unmounted: number }) {
  return defineComponent({
    name: "OverlayFormLifecycleContent",
    setup() {
      onMounted(() => {
        counter.mounted += 1;
      });

      onUnmounted(() => {
        counter.unmounted += 1;
      });

      return () => h("div", { class: "overlay-form-lifecycle" }, "生命周期内容");
    }
  });
}

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

  it("resetOnClose 开启后关闭时会重置表单状态", async () => {
    const wrapper = mount(XyOverlayForm, {
      props: {
        open: true,
        container: "drawer",
        resetOnClose: true,
        model: {
          name: "成员台账"
        }
      }
    });

    const api = wrapper.vm as unknown as {
      formRef: {
        reset?: () => void;
        resetFields?: () => void;
        clearValidate?: () => void;
      } | null;
    };

    const reset = vi.fn();
    const resetFields = vi.fn();
    const clearValidate = vi.fn();

    api.formRef = {
      reset,
      resetFields,
      clearValidate
    };

    wrapper.findComponent(XyDrawer).vm.$emit("closed");
    await nextTick();

    expect(reset).toHaveBeenCalled();
    expect(resetFields).toHaveBeenCalled();
    expect(clearValidate).toHaveBeenCalled();
  });

  it("destroyOnClose 开启后关闭会卸载内容并在再次打开时重新挂载", async () => {
    const counter = {
      mounted: 0,
      unmounted: 0
    };
    const LifecycleContent = createLifecycleContent(counter);
    const wrapper = mount(XyOverlayForm, {
      props: {
        open: true,
        container: "drawer",
        destroyOnClose: true,
        model: {
          name: "成员台账"
        }
      },
      slots: {
        default: () => h(LifecycleContent)
      }
    });

    expect(counter.mounted).toBe(1);

    wrapper.findComponent(XyDrawer).vm.$emit("closed");
    await nextTick();

    expect(counter.unmounted).toBe(1);

    await wrapper.setProps({
      open: false
    });
    await nextTick();

    await wrapper.setProps({
      open: true
    });
    await nextTick();

    expect(counter.mounted).toBe(2);
  });

  it("destroyOnClose 与 resetOnClose 同时开启时会同时重置并卸载内容", async () => {
    const counter = {
      mounted: 0,
      unmounted: 0
    };
    const LifecycleContent = createLifecycleContent(counter);
    const wrapper = mount(XyOverlayForm, {
      props: {
        open: true,
        container: "drawer",
        resetOnClose: true,
        destroyOnClose: true,
        model: {
          name: "成员台账"
        }
      },
      slots: {
        default: () => h(LifecycleContent)
      }
    });

    const api = wrapper.vm as unknown as {
      formRef: {
        reset?: () => void;
        resetFields?: () => void;
        clearValidate?: () => void;
      } | null;
    };
    const reset = vi.fn();
    const resetFields = vi.fn();
    const clearValidate = vi.fn();

    api.formRef = {
      reset,
      resetFields,
      clearValidate
    };

    wrapper.findComponent(XyDrawer).vm.$emit("closed");
    await nextTick();

    expect(reset).toHaveBeenCalledTimes(1);
    expect(resetFields).toHaveBeenCalledTimes(1);
    expect(clearValidate).toHaveBeenCalledTimes(1);
    expect(counter.unmounted).toBe(1);

    await wrapper.setProps({
      open: false
    });
    await nextTick();

    await wrapper.setProps({
      open: true
    });
    await nextTick();

    expect(counter.mounted).toBe(2);
  });
});
