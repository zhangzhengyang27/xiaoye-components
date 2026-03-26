import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import XyTableCellText from "../src/table-cell-text.vue";
import { XyTooltip } from "../../tooltip";

enableAutoUnmount(afterEach);

describe("XyTableCellText", () => {
  it("showTooltip 仅在文本实际溢出时启用 tooltip", async () => {
    const wrapper = mount(XyTableCellText, {
      attachTo: document.body,
      props: {
        content: "短文本",
        tooltipContent: "完整短文本",
        showTooltip: true
      }
    });

    const text = wrapper.get(".xy-table__cell-text").element as HTMLElement;
    Object.defineProperty(text, "offsetWidth", {
      value: 80,
      configurable: true
    });
    Object.defineProperty(text, "scrollWidth", {
      value: 80,
      configurable: true
    });

    await wrapper.setProps({
      content: "短文本"
    });
    await nextTick();

    expect(wrapper.getComponent(XyTooltip).props("disabled")).toBe(true);

    Object.defineProperty(text, "scrollWidth", {
      value: 180,
      configurable: true
    });

    await wrapper.setProps({
      content: "一段很长很长很长的文本内容"
    });
    await nextTick();

    expect(wrapper.getComponent(XyTooltip).props("disabled")).toBe(false);
    expect(wrapper.getComponent(XyTooltip).props("content")).toBe("完整短文本");
  });
});
