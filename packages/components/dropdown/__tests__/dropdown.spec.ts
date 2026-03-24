import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { XyDropdown } from "../index";

enableAutoUnmount(afterEach);

describe("XyDropdown", () => {
  it("支持键盘打开并选择菜单项", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        items: [
          { key: "edit", label: "编辑" },
          { key: "delete", label: "删除" }
        ]
      }
    });

    const trigger = wrapper.find(".xy-dropdown__trigger");

    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ key: "edit" });
  });

  it("支持 click 触发打开菜单", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        items: [{ key: "edit", label: "编辑" }]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    expect(document.body.querySelector("[role='menu']")).not.toBeNull();
  });

  it("支持 contextmenu 触发", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "contextmenu",
        items: [{ key: "edit", label: "编辑" }]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("contextmenu");
    await nextTick();

    expect(wrapper.emitted("visibleChange")?.at(-1)).toEqual([true]);
  });

  it("支持 command 事件和 maxHeight", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        maxHeight: 120,
        items: [{ key: "edit", label: "编辑", command: "edit-command" }]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const menu = document.body.querySelector(".xy-dropdown__menu") as HTMLElement | null;
    expect(menu?.style.maxHeight).toBe("120px");

    const item = document.body.querySelector(".xy-dropdown__item") as HTMLButtonElement | null;
    item?.click();

    expect(wrapper.emitted("command")?.[0]).toEqual([
      "edit-command",
      expect.objectContaining({ key: "edit" })
    ]);
  });

  it("支持 appendTo、persistent 与样式透传", async () => {
    document.body.innerHTML = `<div id="dropdown-target"></div>`;

    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        appendTo: "#dropdown-target",
        persistent: true,
        popperClass: "custom-dropdown",
        popperStyle: {
          width: "240px"
        },
        items: [{ key: "edit", label: "编辑" }]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const menu = document.querySelector("#dropdown-target .xy-dropdown__menu") as HTMLElement | null;
    expect(menu).not.toBeNull();
    expect(menu?.classList.contains("custom-dropdown")).toBe(true);
    expect(menu?.style.width).toBe("240px");

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();
    expect(menu?.style.display).toBe("none");
  });

  it("支持受控显示且外部更新不重复派发 update:modelValue", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        modelValue: false,
        items: [{ key: "edit", label: "编辑" }]
      }
    });

    await wrapper.setProps({
      modelValue: true
    });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(document.body.querySelector(".xy-dropdown__menu")).not.toBeNull();
  });

  it("支持 roving tabindex，并跳过 disabled 项", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        items: [
          { key: "draft", label: "草稿", disabled: true },
          { key: "publish", label: "发布" },
          { key: "archive", label: "归档" }
        ]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const items = [...document.body.querySelectorAll(".xy-dropdown__item")] as HTMLButtonElement[];
    expect(items[0]?.tabIndex).toBe(-1);
    expect(items[1]?.tabIndex).toBe(0);

    items[1]?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await nextTick();

    expect(items[1]?.tabIndex).toBe(-1);
    expect(items[2]?.tabIndex).toBe(0);
  });

  it("支持 navigation role 和 Tab 关闭", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        role: "navigation",
        items: [{ key: "docs", label: "文档" }]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const menu = document.body.querySelector(".xy-dropdown__menu") as HTMLElement | null;
    const item = document.body.querySelector(".xy-dropdown__item") as HTMLButtonElement | null;
    expect(menu?.getAttribute("role")).toBe("navigation");
    expect(item?.getAttribute("role")).toBe("link");

    item?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();

    expect(menu?.style.display).toBe("none");
  });
});
