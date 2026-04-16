import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyImportResultTable } from "@xiaoye/pro-components";

describe("XyImportResultTable", () => {
  it("支持渲染汇总信息和表格内容", () => {
    const wrapper = mount(XyImportResultTable, {
      props: {
        data: [
          {
            id: 1,
            name: "导入结果"
          }
        ],
        columns: [
          {
            prop: "name",
            label: "名称"
          }
        ],
        summary: {
          total: 1,
          success: 1,
          failed: 0
        }
      }
    });

    expect(wrapper.text()).toContain("总数 1");
    expect(wrapper.text()).toContain("成功 1");
    expect(wrapper.find(".xy-pro-table").exists()).toBe(true);
  });
});
