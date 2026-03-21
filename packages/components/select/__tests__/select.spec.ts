import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { XySelect } from "@xiaoye/components";

describe("XySelect", () => {
  it("可以选择选项并发出 change 事件", async () => {
    const wrapper = mount(XySelect, {
      attachTo: document.body,
      props: {
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    const options = document.body.querySelectorAll(".xy-select__option");
    const secondOption = options[1] as HTMLButtonElement | undefined;

    secondOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["member"]);
    expect(wrapper.emitted("change")?.[0]).toEqual(["member"]);
  });

  it("支持键盘选择高亮项", async () => {
    const wrapper = mount(XySelect, {
      attachTo: document.body,
      props: {
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    const trigger = wrapper.find(".xy-select__trigger");

    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["member"]);
  });

  it("支持搜索无匹配文案和清空已选值", async () => {
    const wrapper = mount(XySelect, {
      attachTo: document.body,
      props: {
        modelValue: "admin",
        searchable: true,
        clearable: true,
        noMatchText: "没有结果",
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");
    const searchInput = document.body.querySelector(".xy-select__search input") as HTMLInputElement | null;

    if (!searchInput) {
      throw new Error("missing search input");
    }

    searchInput.value = "zzz";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    await nextTick();

    expect(document.body.textContent).toContain("没有结果");

    await wrapper.find(".xy-select__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
    expect(wrapper.emitted("clear")).toBeTruthy();
  });

  it("在可搜索模式下支持键盘关闭下拉", async () => {
    const wrapper = mount(XySelect, {
      attachTo: document.body,
      props: {
        searchable: true,
        options: [
          { label: "管理员", value: "admin" },
          { label: "成员", value: "member" },
          { label: "访客", value: "guest" }
        ]
      }
    });

    await wrapper.find(".xy-select__trigger").trigger("click");

    const searchInput = document.body.querySelector(".xy-select__search input") as HTMLInputElement | null;

    if (!searchInput) {
      throw new Error("missing search input");
    }

    searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await nextTick();

    expect(document.body.querySelector(".xy-select__dropdown")).toBeNull();
    expect(wrapper.emitted("blur")).toBeTruthy();
  });
});
