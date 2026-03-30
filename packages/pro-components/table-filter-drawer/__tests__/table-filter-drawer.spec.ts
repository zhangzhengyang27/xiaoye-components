import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyTableFilterDrawer } from "@xiaoye/pro-components";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("XyTableFilterDrawer", () => {
  it("支持渲染标题并应用筛选", async () => {
    const wrapper = mount(XyTableFilterDrawer, {
      attachTo: document.body,
      props: {
        open: true,
        title: "表格筛选",
        model: {
          keyword: "账单"
        },
        drawerProps: {
          appendToBody: false
        }
      }
    });

    expect(wrapper.text()).toContain("表格筛选");

    await wrapper.get(".xy-button--primary").trigger("click");
    await nextTick();

    expect(wrapper.emitted("apply")?.[0]?.[0]).toEqual({
      keyword: "账单"
    });
    expect(wrapper.emitted("update:open")?.at(-1)?.[0]).toBe(false);
  });
});
