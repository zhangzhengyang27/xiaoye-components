import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import { XyTabs } from "@xiaoye/components";

describe("XyTabs", () => {
  it("支持键盘切换并跳过禁用项", async () => {
    const wrapper = mount(XyTabs, {
      props: {
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员", disabled: true },
          { key: "billing", label: "账单" }
        ]
      }
    });

    const firstTab = wrapper.findAll('[role="tab"]')[0];

    await firstTab.trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["billing"]);
    expect(wrapper.findAll('[role="tab"]')[2].attributes("aria-selected")).toBe("true");
  });

  it("支持 defaultValue", () => {
    const wrapper = mount(XyTabs, {
      props: {
        defaultValue: "members",
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" },
          { key: "billing", label: "账单" }
        ]
      }
    });

    expect(wrapper.findAll('[role="tab"]')[1].attributes("aria-selected")).toBe("true");
  });

  it("支持 card 和 border-card 样式", () => {
    const cardWrapper = mount(XyTabs, {
      props: {
        type: "card",
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" }
        ]
      }
    });

    expect(cardWrapper.classes()).toContain("xy-tabs--card");

    const borderCardWrapper = mount(XyTabs, {
      props: {
        type: "border-card",
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" }
        ]
      }
    });

    expect(borderCardWrapper.classes()).toContain("xy-tabs--border-card");
  });

  it("支持垂直方向和 stretch", () => {
    const wrapper = mount(XyTabs, {
      props: {
        tabPosition: "left",
        stretch: true,
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" }
        ]
      }
    });

    expect(wrapper.classes()).toContain("xy-tabs--left");
    expect(wrapper.classes()).toContain("is-stretch");
    expect(wrapper.get('[role="tablist"]').attributes("aria-orientation")).toBe("vertical");
  });

  it("支持 beforeLeave 阻止切换", async () => {
    const wrapper = mount(XyTabs, {
      props: {
        beforeLeave: () => false,
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" }
        ]
      }
    });

    await wrapper.findAll('[role="tab"]')[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.findAll('[role="tab"]')[0].attributes("aria-selected")).toBe("true");
  });

  it("支持 beforeLeave 返回 Promise", async () => {
    const wrapper = mount(XyTabs, {
      props: {
        beforeLeave: () => Promise.resolve(true),
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" }
        ]
      }
    });

    await wrapper.findAll('[role="tab"]')[1].trigger("click");
    await Promise.resolve();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["members"]);
  });

  it("支持 closable / addable / editable 事件", async () => {
    const activeKey = ref("members");
    const items = ref([
      { key: "overview", label: "概览" },
      { key: "members", label: "成员", closable: true },
      { key: "billing", label: "账单", closable: false }
    ]);

    const wrapper = mount(
      defineComponent({
        components: { XyTabs },
        setup() {
          function handleRemove(key: string) {
            const index = items.value.findIndex((item) => item.key === key);
            items.value = items.value.filter((item) => item.key !== key);

            if (activeKey.value === key) {
              activeKey.value = items.value[index]?.key ?? items.value[index - 1]?.key ?? "";
            }
          }

          function handleAdd() {
            const key = `tab-${items.value.length + 1}`;
            items.value = [...items.value, { key, label: `新增 ${items.value.length + 1}` }];
            activeKey.value = key;
          }

          return {
            activeKey,
            items,
            handleRemove,
            handleAdd
          };
        },
        template: `
          <xy-tabs
            v-model="activeKey"
            :items="items"
            editable
            @tab-remove="handleRemove"
            @tab-add="handleAdd"
          />
        `
      })
    );

    await wrapper.findAll(".xy-tabs__tab-close")[0].trigger("click");
    await nextTick();

    expect(wrapper.emitted()).toBeTruthy();
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2);

    await wrapper.get(".xy-tabs__add").trigger("click");
    await nextTick();

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3);
  });

  it("暴露 currentName", async () => {
    const wrapper = mount(XyTabs, {
      props: {
        modelValue: "overview",
        items: [
          { key: "overview", label: "概览" },
          { key: "members", label: "成员" }
        ]
      }
    });

    const api = wrapper.vm as unknown as {
      currentName: string;
    };

    expect(api.currentName).toBe("overview");

    await wrapper.findAll('[role="tab"]')[1].trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["members"]);
  });
});
