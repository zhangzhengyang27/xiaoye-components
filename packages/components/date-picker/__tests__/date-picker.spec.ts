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
});

