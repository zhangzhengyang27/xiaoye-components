import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { XyCollapseTransition } from "../index";

describe("XyCollapseTransition", () => {
  it("渲染过渡容器并透传默认插槽", () => {
    const wrapper = mount(XyCollapseTransition, {
      slots: {
        default: '<div class="collapse-body">折叠内容</div>'
      }
    });

    expect(wrapper.html()).toContain("transition-stub");
    expect(wrapper.get(".collapse-body").text()).toBe("折叠内容");
    expect(wrapper.get("transition-stub").attributes("name")).toBe("xy-collapse-transition");
  });

  it("支持包裹条件渲染内容", async () => {
    const Demo = defineComponent({
      components: {
        XyCollapseTransition
      },
      setup() {
        const open = ref(true);

        return {
          open
        };
      },
      template: `
        <xy-collapse-transition>
          <div v-if="open" class="toggle-body">可切换内容</div>
        </xy-collapse-transition>
      `
    });

    const wrapper = mount(Demo);

    expect(wrapper.find(".toggle-body").exists()).toBe(true);

    wrapper.vm.open = false;
    await nextTick();

    expect(wrapper.find(".toggle-body").exists()).toBe(false);
  });
});
