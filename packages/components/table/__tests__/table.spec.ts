import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyTable, XyTableColumn } from "@xiaoye/components";
import type { TableInstance } from "@xiaoye/components";

vi.mock("@iconify/vue", () => ({
  Icon: defineComponent({
    name: "MockIconifyIcon",
    inheritAttrs: false,
    props: {
      icon: {
        type: String,
        required: true
      }
    },
    setup(props, { attrs }) {
      return () => h("svg", { ...attrs, "data-icon": props.icon });
    }
  })
}));

interface Row {
  id: number;
  name: string;
  score: number;
  status: "启用" | "停用";
}

function createTableWrapper(template: string, data: () => Record<string, unknown>) {
  return mount({
    components: {
      XyTable,
      XyTableColumn
    },
    template,
    data
  });
}

describe("XyTable", () => {
  it("支持列注册渲染、行点击和自定义行类名", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          clickable
          :row-class-name="rowClassName"
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console" }],
        rowClassName: (row: Row) => `row-${row.id}`
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.find(".xy-table__row").trigger("click");

    expect(wrapper.find(".xy-table__row").classes()).toContain("row-1");
    expect(table.emitted("row-click")?.[0]?.[0]).toEqual({
      id: 1,
      name: "Billing Console"
    });
  });

  it("支持键盘触发行点击，并在高亮当前行时派发 current-change", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          clickable
          highlight-current-row
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.find(".xy-table__row").trigger("keydown", { key: "Enter" });

    expect(table.emitted("row-click")?.[0]?.[1]).toBe(0);
    expect(wrapper.find(".xy-table__row").classes()).toContain("is-current");
    expect(table.emitted("current-change")?.[0]?.[0]).toEqual({
      id: 1,
      name: "Billing Console"
    });
  });

  it("支持本地排序三态切换", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" sortable />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "A", score: 9 },
          { id: 2, name: "B", score: 2 }
        ]
      })
    );

    await nextTick();

    const getCellTexts = () =>
      wrapper
        .findAll("tbody tr td:nth-child(2) .xy-table__cell-text")
        .map((node) => node.text());

    expect(getCellTexts()).toEqual(["9", "2"]);

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();
    expect(getCellTexts()).toEqual(["2", "9"]);

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();
    expect(getCellTexts()).toEqual(["9", "2"]);

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();
    expect(getCellTexts()).toEqual(["9", "2"]);
  });

  it("sortable='custom' 时只派发排序事件，不修改数据顺序", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" @sort-change="handleSortChange">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" sortable="custom" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "A", score: 9 },
          { id: 2, name: "B", score: 2 }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();

    const scores = wrapper
      .findAll("tbody tr td:nth-child(2) .xy-table__cell-text")
      .map((node) => node.text());

    expect(scores).toEqual(["9", "2"]);
    expect(table.emitted("sort-change")?.[0]?.[0]).toMatchObject({
      prop: "score",
      order: "ascending"
    });
  });

  it("支持筛选面板、多选筛选和 filter-change 事件", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" @filter-change="handleFilterChange">
          <xy-table-column
            prop="status"
            label="状态"
            :filters="filters"
            filter-multiple
          />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, status: "启用" },
          { id: 2, status: "停用" },
          { id: 3, status: "启用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await wrapper.find(".xy-table__filter-option").trigger("click");
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(table.emitted("filter-change")?.[0]?.[0]).toEqual({
      status: ["启用"]
    });
  });

  it("支持 empty 插槽、滚动容器和 showOverflowTooltip", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" max-height="180px">
          <xy-table-column prop="name" label="名称" show-overflow-tooltip />
          <template #empty>
            <div class="custom-empty">暂无成员</div>
          </template>
        </xy-table>
      `,
      () => ({
        rows: [] as Array<{ name: string }>
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table__body-wrapper").attributes("style")).toContain("max-height: 180px");
    expect(wrapper.find(".custom-empty").exists()).toBe(true);

    await wrapper.setData({
      rows: [{ name: "一段很长很长很长的文本内容" }]
    });
    await nextTick();

    expect(wrapper.find(".xy-tooltip").exists()).toBe(true);
  });

  it("支持 selection、expand 和实例方法", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column type="selection" />
          <xy-table-column type="expand">
            <template #default="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Billing Console" },
          { id: 2, name: "Sales Admin" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.find(".xy-checkbox__original").trigger("change");
    await nextTick();

    expect(wrapper.findComponent({ name: "XyTable" }).emitted("selection-change")?.[0]?.[0]).toHaveLength(2);

    table.clearSelection();
    await nextTick();
    expect(wrapper.findComponent({ name: "XyTable" }).emitted("selection-change")?.at(-1)?.[0]).toEqual([]);

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();
    expect(wrapper.find(".expanded-row").text()).toBe("Billing Console");

    table.toggleRowExpansion((wrapper.vm as unknown as { rows: Row[] }).rows[0], false);
    await nextTick();
    expect(wrapper.find(".expanded-row").exists()).toBe(false);
  });

  it("支持嵌套表头、fixed 和 span-method", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" show-summary sum-text="总计" :span-method="spanMethod">
          <xy-table-column label="基础信息">
            <xy-table-column prop="name" label="名称" fixed="left" />
            <xy-table-column prop="status" label="状态" />
          </xy-table-column>
          <xy-table-column prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "A", status: "启用", score: 12 },
          { id: 2, name: "A", status: "停用", score: 8 }
        ],
        spanMethod: ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
          if (rowIndex === 0 && columnIndex === 0) {
            return [2, 1];
          }

          if (rowIndex === 1 && columnIndex === 0) {
            return [0, 0];
          }

          return [1, 1];
        }
      })
    );

    await nextTick();

    expect(wrapper.findAll(".xy-table__header-main thead tr")).toHaveLength(2);
    expect(wrapper.find(".xy-table__fixed-panel--header.is-left").exists()).toBe(true);
    expect(wrapper.find(".xy-table__fixed-panel--header.is-left").text()).toContain("基础信息");
    expect(wrapper.find("tbody td").attributes("rowspan")).toBe("2");
    expect(wrapper.find(".xy-table__footer-cell .xy-table__cell-text").text()).toBe("总计");
  });

  it("EP 主命名优先于兼容别名，并且列级 filtered-value 优先于表级兼容 filterValues", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          :stripe="stripe"
          :striped="striped"
          :border="border"
          :bordered="bordered"
          :filter-values="compatFilterValues"
        >
          <xy-table-column
            prop="status"
            label="状态"
            :filters="filters"
            :filtered-value="columnFilteredValue"
          />
        </xy-table>
      `,
      () => ({
        stripe: false,
        striped: true,
        border: false,
        bordered: true,
        compatFilterValues: {
          status: ["停用"]
        },
        columnFilteredValue: ["启用"],
        rows: [
          { id: 1, status: "启用" },
          { id: 2, status: "停用" },
          { id: 3, status: "启用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );

    await nextTick();

    expect(wrapper.get(".xy-table").classes()).not.toContain("is-striped");
    expect(wrapper.get(".xy-table").classes()).not.toContain("is-bordered");
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.text()).toContain("启用");
    expect(wrapper.text()).not.toContain("停用");
  });

  it("fixed body panel 会渲染左右分区并复用行状态", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" height="120">
          <xy-table-column fixed="left" prop="name" label="名称" width="140" />
          <xy-table-column prop="status" label="状态" width="160" />
          <xy-table-column prop="score" label="分数" width="160" />
          <xy-table-column fixed="right" prop="id" label="ID" width="120" />
        </xy-table>
      `,
      () => ({
        rows: Array.from({ length: 12 }, (_, index) => ({
          id: index + 1,
          name: `项目 ${index + 1}`,
          status: index % 2 === 0 ? "启用" : "停用",
          score: 100 - index
        }))
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table__fixed-panel--body.is-left").exists()).toBe(true);
    expect(wrapper.find(".xy-table__fixed-panel--body.is-right").exists()).toBe(true);
    expect(wrapper.findAll(".xy-table__fixed-panel--body.is-left tbody tr")).toHaveLength(12);
    expect(wrapper.find(".xy-table__fixed-panel--body.is-left").text()).toContain("项目 1");
    expect(wrapper.find(".xy-table__fixed-panel--body.is-right").text()).toContain("1");
  });

  it("支持 lazy tree 数据展开", async () => {
    const load = vi.fn((_row: { id: number }, _treeNode: unknown, resolve: (rows: Row[]) => void) => {
      resolve([{ id: 11, name: "子节点", score: 0, status: "启用" } as Row]);
    });

    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" lazy :load="load">
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "父节点", score: 0, status: "启用", hasChildren: true }],
        load
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("子节点");
  });
});
