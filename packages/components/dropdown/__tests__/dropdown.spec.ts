import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import {
  XyDropdown,
  XyDropdownItem,
  XyDropdownMenu
} from "../index";

enableAutoUnmount(afterEach);

function createVirtualRef(width = 160, height = 36) {
  const element = document.createElement("div");

  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () =>
      ({
        x: 100,
        y: 120,
        top: 120,
        left: 100,
        right: 100 + width,
        bottom: 120 + height,
        width,
        height,
        toJSON: () => ({})
      }) as DOMRect
  });

  document.body.appendChild(element);
  return element;
}

describe("XyDropdown", () => {
  it("静态 Menu/Item 导出可用", () => {
    expect(XyDropdown.Menu).toBe(XyDropdownMenu);
    expect(XyDropdown.Item).toBe(XyDropdownItem);
  });

  it("复合组件模式支持打开并选择菜单项", async () => {
    const selectPayload = ref<unknown>(null);
    const commandPayload = ref<unknown>(null);

    const wrapper = mount({
      components: {
        XyDropdown,
        XyDropdownMenu,
        XyDropdownItem
      },
      template: `
        <xy-dropdown trigger="click" @select="handleSelect" @command="handleCommand">
          <button type="button" class="trigger">更多操作</button>
          <template #dropdown>
            <xy-dropdown-menu>
              <xy-dropdown-item command="edit">编辑成员</xy-dropdown-item>
              <xy-dropdown-item divided icon="mdi:delete-outline" danger command="delete">
                删除成员
                <template #description>会同步移除角色绑定</template>
              </xy-dropdown-item>
            </xy-dropdown-menu>
          </template>
        </xy-dropdown>
      `,
      methods: {
        handleSelect(item: unknown) {
          selectPayload.value = item;
        },
        handleCommand(command: unknown) {
          commandPayload.value = command;
        }
      }
    }, {
      attachTo: document.body
    });

    await wrapper.find(".trigger").trigger("click");
    await nextTick();

    const items = [...document.body.querySelectorAll(".xy-dropdown__item")] as HTMLButtonElement[];
    expect(items).toHaveLength(2);
    expect(document.body.querySelector(".xy-dropdown__item-wrapper.is-divided")).not.toBeNull();
    expect(document.body.querySelector('[data-icon="mdi:delete-outline"]')).not.toBeNull();

    items[1]?.click();
    await nextTick();

    expect((selectPayload.value as { danger?: boolean }).danger).toBe(true);
    expect(commandPayload.value).toBe("delete");
  });

  it("items 兼容模式仍可打开并派发 select/command", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        items: [
          { key: "edit", label: "编辑" },
          { key: "delete", label: "删除", command: "delete-command", danger: true }
        ]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const items = [...document.body.querySelectorAll(".xy-dropdown__item")] as HTMLButtonElement[];
    items[1]?.click();
    await nextTick();

    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ key: "delete", danger: true });
    expect(wrapper.emitted("command")?.[0]?.[0]).toBe("delete-command");
  });

  it("splitButton 会分离主按钮 click 与 caret 展开", async () => {
    const wrapper = mount({
      components: {
        XyDropdown,
        XyDropdownMenu,
        XyDropdownItem
      },
      template: `
        <xy-dropdown split-button trigger="click" @click="handleClick">
          主操作
          <template #dropdown>
            <xy-dropdown-menu>
              <xy-dropdown-item command="copy">复制链接</xy-dropdown-item>
            </xy-dropdown-menu>
          </template>
        </xy-dropdown>
      `,
      methods: {
        handleClick() {
          return;
        }
      }
    }, {
      attachTo: document.body
    });

    const buttons = wrapper.findAll("button");
    await buttons[0]?.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
    expect(document.body.querySelector(".xy-dropdown__menu")).toBeNull();

    await buttons[1]?.trigger("click");
    await nextTick();
    expect(document.body.querySelector(".xy-dropdown__menu")).not.toBeNull();
  });

  it("支持 trigger 数组与自定义 triggerKeys", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: ["click", "contextmenu"],
        triggerKeys: ["F2"],
        items: [{ key: "docs", label: "文档" }]
      }
    });

    const trigger = wrapper.find(".xy-dropdown__trigger");

    await trigger.trigger("contextmenu");
    await nextTick();
    expect(wrapper.emitted("visibleChange")?.at(-1)).toEqual([true]);

    await trigger.trigger("click");
    await nextTick();
    expect((document.body.querySelector(".xy-dropdown__panel") as HTMLElement | null)?.style.display).toBe("none");

    await trigger.trigger("keydown", { key: "F2" });
    await nextTick();
    expect(document.body.querySelector(".xy-dropdown__menu")).not.toBeNull();
  });

  it("支持 showArrow、virtualRef 与 virtualTriggering", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        modelValue: true,
        items: [{ key: "docs", label: "文档" }],
        virtualRef: createVirtualRef(220, 40),
        virtualTriggering: true,
        showArrow: true,
        popperOptions: {
          offset: 20,
          shiftPadding: 12,
          arrowPadding: 10,
          flip: false
        }
      }
    });

    await nextTick();
    await nextTick();

    const panel = document.body.querySelector(".xy-dropdown__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.querySelector(".xy-popper__arrow")).not.toBeNull();
  });

  it("popperOptions 兼容字段不会阻塞菜单打开", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        items: [{ key: "docs", label: "文档" }],
        trigger: "click",
        popperOptions: {
          matchTriggerWidth: true,
          strategy: "absolute"
        }
      },
      slots: {
        default: '<button type="button" class="width-trigger">打开菜单</button>'
      }
    });

    const trigger = wrapper.get(".xy-dropdown__trigger").element as HTMLElement;
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 120,
      top: 120,
      left: 100,
      right: 320,
      bottom: 160,
      width: 220,
      height: 40,
      toJSON: () => ({})
    } as DOMRect);

    await wrapper.get(".xy-dropdown__trigger").trigger("click");
    await nextTick();
    await nextTick();

    const menu = document.body.querySelector(".xy-dropdown__menu") as HTMLElement | null;
    expect(menu).not.toBeNull();
  });

  it("支持 appendTo、persistent、popperClass、popperStyle", async () => {
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

    const panel = document.querySelector("#dropdown-target .xy-dropdown__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.classList.contains("custom-dropdown")).toBe(true);
    expect(panel?.style.width).toBe("240px");

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();
    expect(panel?.style.display).toBe("none");
  });

  it("hideOnClick 优先于 closeOnSelect", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        hideOnClick: false,
        closeOnSelect: true,
        items: [{ key: "edit", label: "编辑" }]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const item = document.body.querySelector(".xy-dropdown__item") as HTMLButtonElement | null;
    item?.click();
    await nextTick();

    expect((document.body.querySelector(".xy-dropdown__menu") as HTMLElement | null)?.style.display).not.toBe("none");
  });

  it("支持 navigation role、Tab 关闭和跳过 disabled 项", async () => {
    const wrapper = mount(XyDropdown, {
      attachTo: document.body,
      props: {
        trigger: "click",
        role: "navigation",
        items: [
          { key: "draft", label: "草稿", disabled: true },
          { key: "publish", label: "发布" },
          { key: "archive", label: "归档" }
        ]
      }
    });

    await wrapper.find(".xy-dropdown__trigger").trigger("click");
    await nextTick();

    const menu = document.body.querySelector(".xy-dropdown__menu") as HTMLElement | null;
    const items = [...document.body.querySelectorAll(".xy-dropdown__item")] as HTMLButtonElement[];

    expect(menu?.getAttribute("role")).toBe("navigation");
    expect(items[1]?.getAttribute("role")).toBe("link");
    expect(items[0]?.tabIndex).toBe(-1);
    expect(items[1]?.tabIndex).toBe(0);

    menu?.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    await nextTick();
    expect((document.body.querySelector(".xy-dropdown__panel") as HTMLElement | null)?.style.display).toBe("none");
  });
});
