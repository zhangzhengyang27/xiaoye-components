import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { XyTransfer } from "@xiaoye/components";

afterEach(() => {
  document.body.innerHTML = "";
});

const data = [
  { key: 1, label: "控制台" },
  { key: 2, label: "账单中心", description: "财务相关" },
  { key: 3, label: "配置中心", disabled: true }
];

describe("XyTransfer", () => {
  it("支持基础穿梭和 change 事件", async () => {
    const wrapper = mount(XyTransfer, {
      props: {
        modelValue: [],
        data
      }
    });

    const sourceItem = wrapper
      .findAll(".xy-transfer__panel")
      .at(0)
      ?.findAll(".xy-transfer__item")
      .find((node) => node.text().includes("控制台"));
    const leftCheckbox = sourceItem?.find(".xy-checkbox__original");
    await leftCheckbox?.setValue(true);
    await wrapper.find(".xy-transfer__actions .xy-button").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([1]);
    expect(wrapper.emitted("change")?.[0]?.[0]).toEqual([1]);
  });

  it("支持搜索和禁用项", async () => {
    const wrapper = mount(XyTransfer, {
      props: {
        modelValue: [2],
        data,
        filterable: true
      }
    });

    const inputs = wrapper.findAll("input");
    await inputs[0]?.setValue("配置");

    expect(wrapper.text()).toContain("配置中心");
    expect(wrapper.findAll(".xy-transfer__item.is-disabled")).toHaveLength(1);
  });
});
