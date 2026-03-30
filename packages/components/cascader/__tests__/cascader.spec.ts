import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyCascader } from "@xiaoye/components";

afterEach(() => {
  document.body.innerHTML = "";
});

const options = [
  {
    value: 1,
    label: "工作台",
    children: [{ value: 11, label: "账单中心" }]
  },
  {
    value: 2,
    label: "配置中心"
  }
];

describe("XyCascader", () => {
  it("支持基础层级选择", async () => {
    const wrapper = mount(XyCascader, {
      props: {
        modelValue: null,
        options
      },
      attachTo: document.body
    });

    await wrapper.get(".xy-cascader__trigger").trigger("click");
    const firstColumnButtons = Array.from(document.body.querySelectorAll(".xy-cascader__column:first-child .xy-cascader__option"));
    await (firstColumnButtons[0] as HTMLButtonElement).click();
    await nextTick();
    const secondColumnButtons = Array.from(document.body.querySelectorAll(".xy-cascader__column:nth-child(2) .xy-cascader__option"));
    await (secondColumnButtons[0] as HTMLButtonElement).click();

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([1, 11]);
  });

  it("支持搜索结果选择与清空", async () => {
    const wrapper = mount(XyCascader, {
      props: {
        modelValue: [2],
        options,
        filterable: true,
        clearable: true
      },
      attachTo: document.body
    });

    await wrapper.get(".xy-cascader__trigger").trigger("click");
    const input = document.body.querySelector(".xy-cascader__search input") as HTMLInputElement;
    input.value = "账单";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain("工作台 / 账单中心");

    const result = document.body.querySelector(".xy-cascader__search-item") as HTMLButtonElement;
    await result.click();
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([1, 11]);

    await wrapper.get(".xy-cascader__clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBeNull();
  });

  it("支持懒加载节点", async () => {
    const load = vi.fn((option, resolve) => {
      resolve([{ value: 11, label: `${option.label}-子项` }]);
    });

    const wrapper = mount(XyCascader, {
      props: {
        modelValue: null,
        lazy: true,
        load,
        options: [{ value: 1, label: "工作台", leaf: false }]
      },
      attachTo: document.body
    });

    await wrapper.get(".xy-cascader__trigger").trigger("click");
    const optionButton = document.body.querySelector(".xy-cascader__option") as HTMLButtonElement;
    await optionButton.click();
    await Promise.resolve();
    await nextTick();

    expect(load).toHaveBeenCalledTimes(1);
    expect(document.body.textContent).toContain("工作台-子项");
  });
});
