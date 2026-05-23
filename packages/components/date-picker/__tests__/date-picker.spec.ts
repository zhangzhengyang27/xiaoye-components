import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it } from "vitest";
import { XyDatePicker } from "@xiaoye/components";

describe("XyDatePicker", () => {
  it("支持打开面板并选择日期", async () => {
    const wrapper = mount(XyDatePicker, {
      attachTo: document.body
    });

    await wrapper.find(".xy-date-picker__trigger").trigger("click");

    const cells = [...document.body.querySelectorAll(".xy-date-picker__cell")].filter(
      (element) => !element.classList.contains("is-outside") && !element.hasAttribute("disabled")
    );

    (cells[0] as HTMLButtonElement | undefined)?.click();
    await nextTick();

    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(wrapper.emitted("change")?.[0]?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("默认日期选择器风格保持克制且仍可正常打开", async () => {
    const wrapper = mount(XyDatePicker, {
      attachTo: document.body
    });

    expect(wrapper.find(".xy-date-picker__trigger").exists()).toBe(true);

    await wrapper.find(".xy-date-picker__trigger").trigger("click");
    await nextTick();

    expect(document.body.querySelector(".xy-date-picker__panel")).not.toBeNull();
  });

  it("支持清空选中值", async () => {
    const wrapper = mount(XyDatePicker, {
      props: {
        modelValue: "2026-03-22",
        clearable: true
      }
    });

    await wrapper.find(".xy-date-picker__clear").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
    expect(wrapper.emitted("clear")).toBeTruthy();
  });

  it("空范围值时保持 placeholder 且不展示清空按钮", () => {
    const wrapper = mount(XyDatePicker, {
      props: {
        type: "daterange",
        modelValue: ["", ""],
        clearable: true,
        placeholder: "请选择日期范围"
      }
    });

    expect(wrapper.find(".xy-date-picker__selection").text()).toBe("请选择日期范围");
    expect(wrapper.find(".xy-date-picker__selection").classes()).toContain("is-placeholder");
    expect(wrapper.find(".xy-date-picker__clear").exists()).toBe(false);
  });

  it("有效范围值时仍展示清空按钮", () => {
    const wrapper = mount(XyDatePicker, {
      props: {
        type: "daterange",
        modelValue: ["2026-03-22", "2026-03-23"],
        clearable: true
      }
    });

    expect(wrapper.find(".xy-date-picker__selection").classes()).toContain("is-value");
    expect(wrapper.find(".xy-date-picker__clear").exists()).toBe(true);
  });

  it("支持 appendTo、popperClass、popperStyle 和 placement", async () => {
    document.body.innerHTML = `<div id="date-picker-target"></div>`;

    const wrapper = mount(XyDatePicker, {
      attachTo: document.body,
      props: {
        appendTo: "#date-picker-target",
        popperClass: "custom-date-panel",
        popperStyle: {
          width: "360px"
        },
        placement: "top-start"
      }
    });

    await wrapper.find(".xy-date-picker__trigger").trigger("click");
    await nextTick();
    await nextTick();

    const panel = document.querySelector("#date-picker-target .xy-date-picker__panel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    expect(panel?.classList.contains("custom-date-panel")).toBe(true);
    expect(panel?.style.width).toBe("360px");
    expect(panel?.getAttribute("data-placement")).toContain("top");
  });

  it("关闭 teleport 后会在本地容器内渲染面板", async () => {
    const wrapper = mount(XyDatePicker, {
      attachTo: document.body,
      props: {
        teleported: false
      }
    });

    await wrapper.find(".xy-date-picker__trigger").trigger("click");
    await nextTick();

    expect(wrapper.find(".xy-date-picker__panel").exists()).toBe(true);
    expect(wrapper.element.querySelector(".xy-date-picker__panel")).not.toBeNull();
  });
});
