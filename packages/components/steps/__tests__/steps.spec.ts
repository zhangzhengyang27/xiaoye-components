import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { XyStep, XySteps } from "../index";

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

enableAutoUnmount(afterEach);

describe("XySteps", () => {
  it("支持基础渲染和状态流转", async () => {
    const wrapper = mount(XySteps, {
      props: {
        active: 1
      },
      slots: {
        default: `
          <xy-step title="提交申请" />
          <xy-step title="主管审批" />
          <xy-step title="完成归档" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    await nextTick();

    const items = wrapper.findAll(".xy-steps__item");

    expect(wrapper.classes()).toContain("xy-steps--horizontal");
    expect(items).toHaveLength(3);
    expect(items[0]?.classes()).toContain("is-finish");
    expect(items[1]?.classes()).toContain("is-process");
    expect(items[1]?.attributes("aria-current")).toBe("step");
    expect(items[2]?.classes()).toContain("is-wait");
  });

  it("active 变化时触发 change 事件，并支持 processStatus / finishStatus", async () => {
    const wrapper = mount(XySteps, {
      props: {
        active: 0
      },
      slots: {
        default: `
          <xy-step title="一" />
          <xy-step title="二" />
          <xy-step title="三" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    await wrapper.setProps({
      active: 2,
      finishStatus: "success",
      processStatus: "error"
    });
    await nextTick();

    const items = wrapper.findAll(".xy-steps__item");

    expect(wrapper.emitted("change")?.[0]).toEqual([2, 0]);
    expect(items[0]?.classes()).toContain("is-success");
    expect(items[1]?.classes()).toContain("is-success");
    expect(items[2]?.classes()).toContain("is-error");
  });

  it("支持 vertical 和 alignCenter", async () => {
    const centered = mount(XySteps, {
      props: {
        alignCenter: true
      },
      slots: {
        default: `
          <xy-step title="一" />
          <xy-step title="二" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    expect(centered.find(".xy-steps__item").classes()).toContain("is-center");

    const vertical = mount(XySteps, {
      props: {
        direction: "vertical"
      },
      slots: {
        default: `
          <xy-step title="创建" />
          <xy-step title="复核" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    await nextTick();

    expect(vertical.classes()).toContain("xy-steps--vertical");
    expect(vertical.find(".xy-steps__item").classes()).toContain("is-vertical");
    expect(vertical.attributes("aria-orientation")).toBe("vertical");
  });

  it("支持 simple 模式", async () => {
    const wrapper = mount(XySteps, {
      props: {
        simple: true,
        direction: "vertical",
        alignCenter: true
      },
      slots: {
        default: `
          <xy-step title="草稿" />
          <xy-step title="审批中" />
          <xy-step title="完成" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    await nextTick();

    expect(wrapper.classes()).toContain("xy-steps--simple");
    expect(wrapper.find(".xy-steps__item").classes()).toContain("is-simple");
    expect(wrapper.findAll(".xy-steps__arrow")).toHaveLength(2);
    expect(wrapper.findAll(".xy-steps__description")).toHaveLength(0);
    expect(wrapper.attributes("aria-orientation")).toBe("horizontal");
  });

  it("支持显式 status、title/description 插槽和 icon prop", async () => {
    const wrapper = mount(XySteps, {
      props: {
        active: 1
      },
      slots: {
        default: `
          <xy-step title="创建" status="error" />
          <xy-step icon="mdi:pencil">
            <template #title>人工复核</template>
            <template #description>等待运营确认</template>
          </xy-step>
          <xy-step title="归档" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    await nextTick();

    const items = wrapper.findAll(".xy-steps__item");

    expect(items[0]?.classes()).toContain("is-error");
    expect(items[1]?.classes()).toContain("is-process");
    expect(items[2]?.classes()).toContain("is-wait");
    expect(wrapper.text()).toContain("人工复核");
    expect(wrapper.text()).toContain("等待运营确认");
    expect(wrapper.find('[data-icon="mdi:pencil"]').exists()).toBe(true);
  });

  it("支持 space", () => {
    const wrapper = mount(XySteps, {
      props: {
        space: 120
      },
      slots: {
        default: `
          <xy-step title="一" />
          <xy-step title="二" />
        `
      },
      global: {
        components: {
          XyStep
        }
      }
    });

    expect(wrapper.find(".xy-steps__item").attributes("style")).toContain("flex-basis: 120px");
  });

  it("动态重排后序号与 DOM 顺序保持一致", async () => {
    const Demo = defineComponent({
      components: {
        XySteps,
        XyStep
      },
      setup() {
        const items = ref(["first", "second", "third"]);

        return {
          items
        };
      },
      template: `
        <xy-steps>
          <xy-step
            v-for="item in items"
            :key="item"
            :title="item"
          />
        </xy-steps>
      `
    });

    const wrapper = mount(Demo);
    const api = wrapper.vm as unknown as {
      items: string[];
    };

    await nextTick();
    api.items = ["third", "first", "second"];
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.findAll(".xy-steps__title").map((node) => node.text())).toEqual([
      "third",
      "first",
      "second"
    ]);
    expect(wrapper.findAll(".xy-steps__icon-inner-text").map((node) => node.text())).toEqual([
      "1",
      "2",
      "3"
    ]);
  });
});
