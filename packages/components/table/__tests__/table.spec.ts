import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { XyTable, defineTableProps } from "@xiaoye/components";

interface Row {
  id: number;
  name: string;
}

describe("XyTable", () => {
  it("支持行点击事件和自定义行类名", async () => {
    const wrapper = mount(XyTable as never, {
      props: defineTableProps<Row>({
        columns: [{ key: "name", title: "名称", dataIndex: "name" }],
        data: [{ id: 1, name: "Billing Console" }],
        rowKey: "id",
        clickable: true,
        rowClassName: (row) => `row-${row.id}`
      }) as never
    });

    await wrapper.find(".xy-table__row").trigger("click");

    expect(wrapper.find(".xy-table__row").classes()).toContain("row-1");
    expect(wrapper.emitted("rowClick")?.[0]?.[0]).toEqual({ id: 1, name: "Billing Console" });
    expect(wrapper.emitted("rowClick")?.[0]?.[1]).toBe(0);
  });

  it("支持键盘触发行点击", async () => {
    const wrapper = mount(XyTable as never, {
      props: defineTableProps<Row>({
        columns: [{ key: "name", title: "名称", dataIndex: "name" }],
        data: [{ id: 1, name: "Billing Console" }],
        rowKey: (_row, rowIndex) => `row-${rowIndex}`,
        clickable: true
      }) as never
    });

    await wrapper.find(".xy-table__row").trigger("keydown", {
      key: "Enter"
    });

    expect(wrapper.emitted("rowClick")?.[0]?.[1]).toBe(0);
  });

  it("支持 empty 插槽", () => {
    const wrapper = mount(XyTable as never, {
      props: defineTableProps<Row>({
        columns: [{ key: "name", title: "名称", dataIndex: "name" }],
        data: []
      }) as never,
      slots: {
        empty: "<div class='custom-empty'>暂无成员</div>"
      }
    });

    expect(wrapper.find(".custom-empty").exists()).toBe(true);
  });
});
