import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { XyCollapse, XyCollapseItem } from "../index";

enableAutoUnmount(afterEach);

describe("XyCollapse", () => {
  it("支持基础展开和收起", async () => {
    const wrapper = mount(XyCollapse, {
      props: {
        modelValue: []
      },
      slots: {
        default: `
          <xy-collapse-item name="base" title="基础标题">
            基础内容
          </xy-collapse-item>
        `
      },
      global: {
        components: {
          XyCollapseItem
        }
      }
    });

    const header = wrapper.get(".xy-collapse__header");
    await header.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["base"]]);
  });

  it("支持 accordion 模式", async () => {
    const wrapper = mount(XyCollapse, {
      props: {
        accordion: true,
        modelValue: "first"
      },
      slots: {
        default: `
          <xy-collapse-item name="first" title="一">内容一</xy-collapse-item>
          <xy-collapse-item name="second" title="二">内容二</xy-collapse-item>
        `
      },
      global: {
        components: {
          XyCollapseItem
        }
      }
    });

    const headers = wrapper.findAll(".xy-collapse__header");
    await headers[1]?.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["second"]);
  });

  it("支持 beforeCollapse 阻止切换", async () => {
    const wrapper = mount(XyCollapse, {
      props: {
        beforeCollapse: () => false
      },
      slots: {
        default: `
          <xy-collapse-item name="guard" title="守卫">守卫内容</xy-collapse-item>
        `
      },
      global: {
        components: {
          XyCollapseItem
        }
      }
    });

    await wrapper.get(".xy-collapse__header").trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("支持 beforeCollapse 返回 Promise", async () => {
    const wrapper = mount(XyCollapse, {
      props: {
        beforeCollapse: () => Promise.resolve(true)
      },
      slots: {
        default: `
          <xy-collapse-item name="async" title="异步">异步内容</xy-collapse-item>
        `
      },
      global: {
        components: {
          XyCollapseItem
        }
      }
    });

    await wrapper.get(".xy-collapse__header").trigger("click");
    await Promise.resolve();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["async"]]);
  });

  it("禁用项不可切换，支持键盘触发", async () => {
    const wrapper = mount(XyCollapse, {
      slots: {
        default: `
          <xy-collapse-item name="disabled" title="禁用" disabled>禁用内容</xy-collapse-item>
          <xy-collapse-item name="enabled" title="可用">可用内容</xy-collapse-item>
        `
      },
      global: {
        components: {
          XyCollapseItem
        }
      }
    });

    const headers = wrapper.findAll(".xy-collapse__header");
    await headers[0]?.trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await headers[1]?.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["enabled"]]);
  });

  it("支持 expandIconPosition 和 expose", async () => {
    const wrapper = mount(XyCollapse, {
      props: {
        expandIconPosition: "left",
        modelValue: ["first"]
      },
      slots: {
        default: `
          <xy-collapse-item name="first" title="标题">内容</xy-collapse-item>
        `
      },
      global: {
        components: {
          XyCollapseItem
        }
      }
    });

    expect(wrapper.classes()).toContain("xy-collapse--icon-left");
    const api = wrapper.vm as unknown as {
      activeNames: Array<string | number>;
      setActiveNames: (value: Array<string | number>) => void;
    };
    expect(api.activeNames).toEqual(["first"]);

    api.setActiveNames(["second"]);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([["second"]]);
  });

  it("支持受控用法和 title 插槽", async () => {
    const Demo = defineComponent({
      components: {
        XyCollapse,
        XyCollapseItem
      },
      setup() {
        const active = ref<Array<string | number>>(["slot"]);
        return {
          active
        };
      },
      template: `
        <xy-collapse v-model="active">
          <xy-collapse-item name="slot">
            <template #title="{ isActive }">
              <span class="custom-title">{{ isActive ? '展开中' : '未展开' }}</span>
            </template>
            插槽内容
          </xy-collapse-item>
        </xy-collapse>
      `
    });

    const wrapper = mount(Demo);
    expect(wrapper.find(".custom-title").text()).toBe("展开中");
  });
});
