import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { XyTreeSelect } from "@xiaoye/components";

const options = [
  {
    id: 1,
    label: "工作台",
    children: [{ id: 11, label: "账单中心" }]
  },
  {
    id: 2,
    label: "配置中心"
  }
];

afterEach(() => {
  document.body.innerHTML = "";
});

describe("XyTreeSelect", () => {
  it("支持基础选择和受控回显", async () => {
    const wrapper = mount(XyTreeSelect, {
      props: {
        modelValue: null,
        data: options,
        nodeKey: "id"
      },
      attachTo: document.body
    });

    await wrapper.get(".xy-tree-select__trigger").trigger("click");
    await document.body.querySelector('[data-key="2"] .xy-tree__node-content')?.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toBe(2);
  });

  it("支持过滤和清空", async () => {
    const wrapper = mount(XyTreeSelect, {
      props: {
        modelValue: 2,
        data: options,
        nodeKey: "id",
        filterable: true,
        clearable: true
      },
      attachTo: document.body
    });

    expect(wrapper.find(".xy-tree-select__label").text()).toContain("配置中心");

    await wrapper.get(".xy-tree-select__trigger").trigger("click");
    const searchInput = document.body.querySelector(".xy-tree-select__search input") as HTMLInputElement;
    searchInput.value = "账单";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain("账单中心");

    await wrapper.get(".xy-tree-select__clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBeNull();
  });

  it("空字符串且无对应节点时保持 placeholder 且不展示清空按钮", () => {
    const wrapper = mount(XyTreeSelect, {
      props: {
        modelValue: "",
        data: options,
        nodeKey: "id",
        clearable: true,
        placeholder: "全部节点"
      },
      attachTo: document.body
    });

    expect(wrapper.find(".xy-tree-select__label").text()).toBe("全部节点");
    expect(wrapper.find(".xy-tree-select__label").classes()).toContain("is-placeholder");
    expect(wrapper.find(".xy-tree-select__clear").exists()).toBe(false);
  });

  it("空字符串且存在对应节点时仍按有效值处理", () => {
    const wrapper = mount(XyTreeSelect, {
      props: {
        modelValue: "",
        data: [
          {
            id: "",
            label: "未分类"
          },
          ...options
        ],
        nodeKey: "id",
        clearable: true
      },
      attachTo: document.body
    });

    expect(wrapper.find(".xy-tree-select__label").text()).toBe("未分类");
    expect(wrapper.find(".xy-tree-select__label").classes()).not.toContain("is-placeholder");
    expect(wrapper.find(".xy-tree-select__clear").exists()).toBe(true);
  });

  it("支持自定义 popup 容器、类名、样式和 placement", async () => {
    const appendTarget = document.createElement("div");
    appendTarget.className = "tree-select-target";
    document.body.appendChild(appendTarget);

    const wrapper = mount(XyTreeSelect, {
      props: {
        modelValue: null,
        data: options,
        nodeKey: "id",
        appendTo: ".tree-select-target",
        placement: "top-start",
        popperClass: "custom-tree-select-dropdown",
        popperStyle: {
          width: "300px"
        }
      },
      attachTo: document.body
    });

    await wrapper.get(".xy-tree-select__trigger").trigger("click");

    const dropdown = appendTarget.querySelector(".custom-tree-select-dropdown") as HTMLElement | null;
    expect(dropdown).not.toBeNull();
    expect(dropdown?.classList.contains("xy-tree-select__dropdown")).toBe(true);
    expect(dropdown?.style.width).toBe("300px");
    expect(dropdown?.getAttribute("data-placement")).toContain("top");
  });

  it("在 teleported=false 时将 dropdown 保留在当前容器内", async () => {
    const wrapper = mount(XyTreeSelect, {
      props: {
        modelValue: null,
        data: options,
        nodeKey: "id",
        teleported: false,
        popperClass: "inline-tree-select-dropdown"
      },
      attachTo: document.body
    });

    await wrapper.get(".xy-tree-select__trigger").trigger("click");

    expect(wrapper.find(".inline-tree-select-dropdown").exists()).toBe(true);
    expect(document.body.querySelector(".inline-tree-select-dropdown")).not.toBeNull();
  });
});
