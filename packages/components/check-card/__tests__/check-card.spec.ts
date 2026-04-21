import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import { XyCheckCard, XyCheckCardGroup } from "@xiaoye/components";
import type { CheckCardGroupOption } from "../src/check-card-group";

describe("XyCheckCard", () => {
  it("支持标题、描述、头像、标签和选中态渲染", () => {
    const wrapper = mount(XyCheckCard, {
      props: {
        modelValue: true,
        size: "lg",
        title: "审批工作台",
        description: "适合承载卡片式选择和状态概览。",
        avatar: {
          text: "审"
        },
        tag: {
          text: "推荐",
          props: {
            status: "primary",
            round: true
          }
        }
      }
    });

    expect(wrapper.classes()).toContain("xy-check-card--lg");
    expect(wrapper.classes()).toContain("is-checked");
    expect(wrapper.text()).toContain("审批工作台");
    expect(wrapper.text()).toContain("适合承载卡片式选择和状态概览。");
    expect(wrapper.text()).toContain("推荐");
    expect(wrapper.find(".xy-avatar").exists()).toBe(true);
  });

  it("点击卡片会派发 update:modelValue 和 change", async () => {
    const wrapper = mount(XyCheckCard, {
      props: {
        title: "成员门户"
      }
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toBe(true);
    expect(wrapper.emitted("change")?.[0]?.[0]).toBe(true);
  });

  it("disabled 时不会触发切换和 extra 事件", async () => {
    const wrapper = mount(XyCheckCard, {
      props: {
        disabled: true,
        title: "只读卡片",
        extra: "查看"
      }
    });

    await wrapper.trigger("click");
    await wrapper.get(".xy-check-card__extra").trigger("click");

    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.emitted("extra")).toBeUndefined();
  });

  it("点击 extra 只派发 extra，不切换 checked", async () => {
    const wrapper = mount(XyCheckCard, {
      props: {
        title: "高级选项",
        extra: "详情"
      }
    });

    await wrapper.get(".xy-check-card__extra").trigger("click");

    expect(wrapper.emitted("extra")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("支持键盘 Enter 和 Space 切换", async () => {
    const wrapper = mount(XyCheckCard, {
      props: {
        title: "键盘可达"
      }
    });

    await wrapper.trigger("keydown", {
      key: "Enter"
    });
    await wrapper.trigger("keydown", {
      key: " "
    });

    expect(wrapper.emitted("update:modelValue")?.map((item) => item[0])).toEqual([true, true]);
  });
});

describe("XyCheckCardGroup", () => {
  it("支持单选模式和取消选中", async () => {
    const value = ref<string | number | null>(null);

    const wrapper = mount(
      defineComponent({
        components: {
          XyCheckCardGroup
        },
        setup() {
          return {
            value,
            options: [
              {
                value: "dashboard",
                title: "工作台"
              },
              {
                value: "report",
                title: "报表中心"
              }
            ]
          };
        },
        template: `
          <xy-check-card-group
            v-model="value"
            :options="options"
          />
        `
      })
    );

    const cards = wrapper.findAll(".xy-check-card");

    await cards[0]?.trigger("click");
    expect(value.value).toBe("dashboard");

    await cards[0]?.trigger("click");
    expect(value.value).toBeNull();
  });

  it("支持 multiple 模式", async () => {
    const value = ref<Array<string | number>>([]);

    const wrapper = mount(
      defineComponent({
        components: {
          XyCheckCardGroup
        },
        setup() {
          return {
            value,
            options: [
              {
                value: "table",
                title: "表格"
              },
              {
                value: "detail",
                title: "详情"
              }
            ]
          };
        },
        template: `
          <xy-check-card-group
            v-model="value"
            multiple
            :options="options"
          />
        `
      })
    );

    const cards = wrapper.findAll(".xy-check-card");

    await cards[0]?.trigger("click");
    await cards[1]?.trigger("click");

    expect(value.value).toEqual(["table", "detail"]);

    await cards[0]?.trigger("click");
    expect(value.value).toEqual(["detail"]);
  });

  it("支持 extra 事件转发", async () => {
    const wrapper = mount(XyCheckCardGroup, {
      props: {
        options: [
          {
            value: "audit",
            title: "审计中心",
            extra: "查看"
          }
        ]
      }
    });

    await wrapper.get(".xy-check-card__extra").trigger("click");

    expect(wrapper.emitted("extra")?.[0]?.[0]).toMatchObject({
      value: "audit",
      title: "审计中心"
    });
  });

  it("支持通用插槽和按值覆盖插槽，且按值插槽优先", async () => {
    const wrapper = mount(XyCheckCardGroup, {
      props: {
        options: [
          {
            value: "general",
            title: "通用工作台"
          },
          {
            value: "vip",
            title: "高优先级工作台"
          }
        ]
      },
      slots: {
        title: ({ option }: { option: CheckCardGroupOption }) =>
          h("span", { class: "generic-title" }, option.title ?? ""),
        "title-vip": ({ option }: { option: CheckCardGroupOption }) =>
          h("span", { class: "specific-title" }, option.title ?? "")
      }
    });

    await nextTick();

    expect(wrapper.findAll(".generic-title")).toHaveLength(1);
    expect(wrapper.find(".specific-title").exists()).toBe(true);
    expect(wrapper.text()).toContain("高优先级工作台");
  });
});
