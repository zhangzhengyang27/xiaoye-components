import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import XyConfigProvider from "../../config-provider";
import XyTable, { XyTableColumn } from "../index";
import type { TableInstance, TableResolvedColumn, TableSortOrder } from "../index";
import { normalizeColumns } from "../src/util";

vi.mock("@iconify/vue", () => ({
  addCollection: vi.fn(),
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
  hasChildren?: boolean;
}

function createTableWrapper(template: string, data: () => Record<string, unknown>) {
  return mount({
    attachTo: document.body,
    components: {
      XyConfigProvider,
      XyTable,
      XyTableColumn
    },
    template,
    data
  });
}

function waitForAnimationFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function mockSizingHeaderWidths(
  cells: Array<{ text: () => string; element: Element }>,
  widthByLabel: Record<string, number>
) {
  cells.forEach((cell) => {
    const label = cell.text().trim();
    const width = widthByLabel[label];

    if (!width) {
      return;
    }

    Object.defineProperty(cell.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ width })
    });
  });
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("XyTable", () => {
  it("会读取 ConfigProvider.loading 默认项并补 aria-busy", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-config-provider :loading="{ text: '全局表格加载', svg: '<path class=\\'table-loading-path\\' d=\\'M 15 5 L 35 45\\' />' }">
          <xy-table loading :data="rows" row-key="id">
            <xy-table-column prop="name" label="名称" />
          </xy-table>
        </xy-config-provider>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console" }]
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table").attributes("aria-busy")).toBe("true");
    expect(wrapper.find(".xy-loading-text").text()).toContain("全局表格加载");
    expect(wrapper.find(".table-loading-path").exists()).toBe(true);
  });

  it("支持表格容器与展开/树节点按钮的 aria 语义", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          aria-label="资产列表"
          aria-labelledby="table-title"
          aria-describedby="table-help"
        >
          <xy-table-column type="expand">
            <template #default="{ row }">
              <div>{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "控制台", score: 100, status: "启用", hasChildren: false },
          { id: 2, name: "树节点", score: 80, status: "启用", hasChildren: true }
        ]
      })
    );

    await nextTick();

    const table = wrapper.find(".xy-table");
    expect(table.attributes("role")).toBe("table");
    expect(table.attributes("aria-label")).toBe("资产列表");
    expect(table.attributes("aria-labelledby")).toBe("table-title");
    expect(table.attributes("aria-describedby")).toBe("table-help");
    expect(table.attributes("aria-colcount")).toBe("2");
    expect(table.attributes("aria-rowcount")).toBe("2");

    const expandButton = wrapper.find(".xy-table__expand-trigger");
    expect(expandButton.attributes("aria-label")).toBe("展开当前行");
    expect(expandButton.attributes("aria-expanded")).toBe("false");
    expect(expandButton.attributes("aria-controls")).toBe("xy-table-expanded-row-1");

    await expandButton.trigger("click");
    await nextTick();

    expect(expandButton.attributes("aria-label")).toBe("收起当前行");
    expect(expandButton.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find("#xy-table-expanded-row-1").exists()).toBe(true);

    const treeToggle = wrapper.find(".xy-table__tree-toggle");
    expect(treeToggle.attributes("aria-label")).toBe("展开树节点");
    expect(treeToggle.attributes("aria-expanded")).toBe("false");
  });

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

    expect(table.emitted("row-click")?.[0]?.[1]).toBeUndefined();
    expect(table.emitted("row-click")?.[0]?.[2]).toBeInstanceOf(KeyboardEvent);
    expect(wrapper.find(".xy-table__row").classes()).toContain("is-current");
    expect(table.emitted("current-change")?.[0]?.[0]).toEqual({
      id: 1,
      name: "Billing Console"
    });
  });

  it("支持对象风格的 row/header 回调签名", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :header-row-class-name="headerRowClassName"
          :header-row-style="headerRowStyle"
          :header-cell-class-name="headerCellClassName"
          :header-cell-style="headerCellStyle"
        >
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 96, status: "启用" as const }],
        rowClassName: ({ rowIndex }: { rowIndex: number }) => `row-object-${rowIndex}`,
        rowStyle: ({ row }: { row: Row }) => ({
          color: row.name.includes("Billing") ? "rgb(255, 0, 0)" : "rgb(0, 0, 0)"
        }),
        headerRowClassName: ({ rowIndex }: { rowIndex: number }) => `header-object-${rowIndex}`,
        headerRowStyle: ({ rowIndex }: { rowIndex: number }) => ({
          zIndex: String(rowIndex + 1)
        }),
        headerCellClassName: ({ column }: { column: TableResolvedColumn<Row> }) =>
          `header-cell-${column.prop ?? "unknown"}`,
        headerCellStyle: ({ column }: { column: TableResolvedColumn<Row> }) => ({
          textAlign: column.headerAlign
        })
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table__row").classes()).toContain("row-object-0");
    expect(wrapper.find(".xy-table__header-row").classes()).toContain("header-object-0");
    expect(wrapper.find(".xy-table__header-cell").classes()).toContain("header-cell-name");
    expect(wrapper.find(".xy-table__row").attributes("style")).toContain("color: rgb(255, 0, 0)");
  });

  it("row-click / row-dblclick / row-contextmenu 会回传命中的列上下文", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "A", score: 9, status: "启用" as const }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const scoreCell = wrapper.find("tbody tr td:nth-child(2)");

    await scoreCell.trigger("click");
    await scoreCell.trigger("dblclick");
    await scoreCell.trigger("contextmenu");
    await nextTick();

    expect(table.emitted("row-click")?.[0]?.[1]).toMatchObject({
      prop: "score",
      label: "分数"
    });
    expect(table.emitted("row-dblclick")?.[0]?.[1]).toMatchObject({
      prop: "score",
      label: "分数"
    });
    expect(table.emitted("row-contextmenu")?.[0]?.[1]).toMatchObject({
      prop: "score",
      label: "分数"
    });
  });

  it("受控 current-row-key 切换时会传递正确的 oldCurrentRow，并在数据替换后保持高亮", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="release"
          highlight-current-row
          :current-row-key="currentRowKey"
        >
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="release" label="发布时间" />
        </xy-table>
      `,
      () => ({
        currentRowKey: null as string | null,
        rows: [
          { id: 1, name: "Toy Story", release: "1995-11-22", score: 81, status: "启用" },
          { id: 2, name: "Bug's Life", release: "1998-11-25", score: 90, status: "启用" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.setData({
      currentRowKey: "1995-11-22"
    });
    await nextTick();

    expect(table.emitted("current-change")?.[0]?.[0]).toMatchObject({
      id: 1,
      name: "Toy Story"
    });
    expect(table.emitted("current-change")?.[0]?.[1]).toBeNull();

    await wrapper.setData({
      currentRowKey: "1998-11-25"
    });
    await nextTick();

    expect(table.emitted("current-change")?.[1]?.[0]).toMatchObject({
      id: 2,
      name: "Bug's Life"
    });
    expect(table.emitted("current-change")?.[1]?.[1]).toMatchObject({
      id: 1,
      name: "Toy Story"
    });

    await wrapper.setData({
      rows: [
        { id: 9, name: "Monsters, Inc.", release: "2001-11-02", score: 88, status: "启用" },
        { id: 1, name: "Toy Story Redux", release: "1995-11-22", score: 95, status: "启用" },
        { id: 2, name: "Bug's Life Redux", release: "1998-11-25", score: 93, status: "启用" }
      ]
    });
    await nextTick();

    const rows = wrapper.findAll(".xy-table__body-scroll-view tbody tr");
    expect(rows[2]?.classes()).toContain("is-current");
    expect(table.emitted("current-change")?.[2]?.[0]).toMatchObject({
      id: 2,
      name: "Bug's Life Redux"
    });
    expect(table.emitted("current-change")?.[2]?.[1]).toMatchObject({
      id: 2,
      name: "Bug's Life"
    });
  });

  it("rowKey 支持嵌套路径，并用于 current 与 selection 恢复", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="meta.identity.id"
          highlight-current-row
          :current-row-key="currentRowKey"
        >
          <xy-table-column type="selection" reserve-selection />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        currentRowKey: 202,
        rows: [
          { id: 1, name: "控制台", score: 81, status: "启用", meta: { identity: { id: 101 } } },
          { id: 2, name: "工作台", score: 90, status: "启用", meta: { identity: { id: 202 } } }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;
    const vm = wrapper.vm as unknown as { rows: Row[] };

    await nextTick();

    expect(wrapper.findAll(".xy-table__body-scroll-view tbody tr")[1]?.classes()).toContain("is-current");

    instance.toggleRowSelection(vm.rows[1] as Row, true);
    await nextTick();

    await wrapper.setData({
      rows: [
        { id: 9, name: "新节点", score: 70, status: "启用", meta: { identity: { id: 999 } } },
        { id: 2, name: "工作台 V2", score: 91, status: "启用", meta: { identity: { id: 202 } } }
      ]
    });
    await nextTick();

    const rows = wrapper.findAll(".xy-table__body-scroll-view tbody tr");
    expect(rows[1]?.classes()).toContain("is-current");
    expect(instance.getSelectionRows()[0]).toMatchObject({
      id: 2,
      name: "工作台 V2"
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
      wrapper.findAll("tbody tr td:nth-child(2) .xy-table__cell-text").map((node) => node.text());

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

  it("default-sort 只传 prop 时会默认按升序排序", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" :default-sort="{ prop: 'score' }">
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

    const scores = wrapper
      .findAll("tbody tr td:nth-child(2) .xy-table__cell-text")
      .map((node) => node.text());

    expect(scores).toEqual(["2", "9"]);
    expect(wrapper.findAll(".xy-table__header-cell")[1]?.attributes("aria-sort")).toBe("ascending");
  });

  it("受控 sortProp/sortOrder 在整批替换数据后仍保持排序结果", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          :sort-prop="sortProp"
          :sort-order="sortOrder"
        >
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" sortable />
        </xy-table>
      `,
      () => ({
        sortProp: "score",
        sortOrder: "ascending" as TableSortOrder,
        rows: [
          { id: 1, name: "A", score: 9 },
          { id: 2, name: "B", score: 2 }
        ]
      })
    );

    await nextTick();

    let scores = wrapper
      .findAll("tbody tr td:nth-child(2) .xy-table__cell-text")
      .map((node) => node.text());
    expect(scores).toEqual(["2", "9"]);

    await wrapper.setData({
      rows: [
        { id: 11, name: "C", score: 7 },
        { id: 12, name: "D", score: 1 }
      ]
    });
    await nextTick();

    scores = wrapper
      .findAll("tbody tr td:nth-child(2) .xy-table__cell-text")
      .map((node) => node.text());
    expect(scores).toEqual(["1", "7"]);
  });

  it("clearSort 会清空当前排序并派发 update:sortProp / update:sortOrder", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
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
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();

    instance.clearSort();
    await nextTick();

    expect(table.emitted("update:sortProp")?.at(-1)?.[0]).toBeUndefined();
    expect(table.emitted("update:sortOrder")?.at(-1)?.[0]).toBeNull();
    expect(table.emitted("sort-change")?.at(-1)?.[0]).toMatchObject({
      prop: undefined,
      order: null
    });
  });

  it("clearSort 会清空当前排序并派发 update:sortProp / update:sortOrder", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
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
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();

    instance.clearSort();
    await nextTick();

    expect(table.emitted("update:sortProp")?.at(-1)?.[0]).toBeUndefined();
    expect(table.emitted("update:sortOrder")?.at(-1)?.[0]).toBeNull();
    expect(table.emitted("sort-change")?.at(-1)?.[0]).toMatchObject({
      prop: undefined,
      order: null
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
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[0]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(table.emitted("filter-change")?.[0]?.[0]).toEqual({
      status: ["启用"]
    });
  });

  it("支持 filter-icon 插槽自定义筛选图标", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column prop="status" label="状态" :filters="filters">
            <template #filter-icon="{ filterOpened }">
              <span class="custom-filter-icon">{{ filterOpened ? "open" : "closed" }}</span>
            </template>
          </xy-table-column>
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, status: "启用" },
          { id: 2, status: "停用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );

    await nextTick();

    expect(wrapper.find(".custom-filter-icon").text()).toBe("closed");
    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();
    expect(wrapper.find(".custom-filter-icon").text()).toBe("open");
  });

  it("property 可以作为 prop 的兼容别名参与渲染和排序", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column property="name" label="名称" />
          <xy-table-column property="score" label="分数" sortable />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "A", score: 9, status: "启用" as const },
          { id: 2, name: "B", score: 2, status: "停用" as const }
        ]
      })
    );

    await nextTick();

    expect(wrapper.find("tbody tr td .xy-table__cell-text").text()).toBe("A");

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();

    const scores = wrapper
      .findAll("tbody tr td:nth-child(2) .xy-table__cell-text")
      .map((node) => node.text());

    expect(scores).toEqual(["2", "9"]);
  });

  it("会 expose 当前列上下文", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" sortable />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "A", score: 9 }]
      })
    );
    const instance = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    expect(instance.columns).toHaveLength(2);
    expect(instance.columns.map((column) => column.label)).toEqual(["名称", "分数"]);
    expect(instance.columns[1]?.sortable).toBe(true);
  });

  it("动态隐藏筛选列时会自动关闭已打开的筛选面板", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column
            v-if="showStatus"
            prop="status"
            label="状态"
            :filters="filters"
          />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        showStatus: true,
        rows: [{ id: 1, name: "控制台", status: "启用" }],
        filters: [{ text: "启用", value: "启用" }]
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.find(".xy-table__filter-panel").exists()).toBe(true);

    await wrapper.setData({
      showStatus: false
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".xy-table__filter-panel").exists()).toBe(false);
  });

  it("受控 filterValues 在整批替换数据后仍持续生效", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" :filter-values="filterValues">
          <xy-table-column
            prop="status"
            label="状态"
            :filters="filters"
          />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        filterValues: {
          status: ["启用"]
        },
        rows: [
          { id: 1, name: "控制台", status: "启用" },
          { id: 2, name: "工作台", status: "停用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );

    await nextTick();

    let names = wrapper
      .findAll("tbody tr .xy-table__cell-text")
      .map((node) => node.text());
    expect(names).toContain("控制台");
    expect(names).not.toContain("工作台");

    await wrapper.setData({
      rows: [
        { id: 11, name: "账单中心", status: "启用" },
        { id: 12, name: "归档库", status: "停用" }
      ]
    });
    await nextTick();

    names = wrapper
      .findAll("tbody tr .xy-table__cell-text")
      .map((node) => node.text());
    expect(names).toContain("账单中心");
    expect(names).not.toContain("归档库");
  });

  it("筛选后 toggleAllSelection 只作用于当前可见行，清空筛选后保持正确选中集合", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column type="selection" />
          <xy-table-column
            prop="status"
            label="状态"
            :filters="filters"
          />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "控制台", status: "启用" },
          { id: 2, name: "工作台", status: "停用" },
          { id: 3, name: "账单中心", status: "启用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[0]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    const headerCheckbox = wrapper.find(".xy-table__header-cell .xy-checkbox__original");
    await headerCheckbox.trigger("change");
    await nextTick();

    expect(instance.getSelectionRows().map((row) => row.id)).toEqual([1, 3]);

    instance.clearFilter();
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(3);
    expect(instance.getSelectionRows().map((row) => row.id)).toEqual([1, 3]);
    expect(table.emitted("selection-change")?.at(-1)?.[0]).toMatchObject([
      { id: 1 },
      { id: 3 }
    ]);
  });

  it("clearFilter 只清除目标列筛选，并保留其他列筛选状态", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column prop="status" label="状态" :filters="statusFilters" />
          <xy-table-column prop="owner" label="负责人" :filters="ownerFilters" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, status: "启用", owner: "小叶" },
          { id: 2, status: "停用", owner: "小周" },
          { id: 3, status: "启用", owner: "小周" }
        ],
        statusFilters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ],
        ownerFilters: [
          { text: "小叶", value: "小叶" },
          { text: "小周", value: "小周" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.findAll(".xy-table__filter-trigger")[0]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[0]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    await wrapper.findAll(".xy-table__filter-trigger")[1]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[1]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(1);

    instance.clearFilter("status");
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(table.emitted("filter-change")?.at(-1)?.[0]).toEqual({
      owner: ["小周"]
    });
  });

  it("clearFilter 不传参数时会清空所有列筛选", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column prop="status" label="状态" :filters="statusFilters" />
          <xy-table-column prop="owner" label="负责人" :filters="ownerFilters" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, status: "启用", owner: "小叶" },
          { id: 2, status: "停用", owner: "小周" },
          { id: 3, status: "启用", owner: "小周" }
        ],
        statusFilters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ],
        ownerFilters: [
          { text: "小叶", value: "小叶" },
          { text: "小周", value: "小周" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.findAll(".xy-table__filter-trigger")[0]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[0]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    await wrapper.findAll(".xy-table__filter-trigger")[1]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[1]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(1);

    instance.clearFilter();
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(3);
    expect(table.emitted("filter-change")?.at(-1)?.[0]).toEqual({});
  });

  it("单选筛选支持键盘导航与回车确认", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column prop="status" label="状态" :filters="filters" :filter-multiple="false" />
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

    await nextTick();

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();

    const list = wrapper.find(".xy-table__filter-panel-list");
    expect(list.exists()).toBe(true);

    list.element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await nextTick();
    list.element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await nextTick();

    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
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

    expect(wrapper.find(".xy-table__body-wrapper").attributes("style")).toContain(
      "max-height: 180px"
    );
    expect(wrapper.find(".custom-empty").exists()).toBe(true);

    await wrapper.setData({
      rows: [{ name: "一段很长很长很长的文本内容" }]
    });
    await nextTick();

    expect(wrapper.find(".xy-tooltip").exists()).toBe(true);
  });

  it("fit=false 时主表格按列总宽撑开，允许横向滚动", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" :fit="false">
          <xy-table-column prop="name" label="名称" width="180" />
          <xy-table-column prop="status" label="状态" width="160" />
          <xy-table-column prop="score" label="分数" width="140" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", status: "启用", score: 99 }]
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table__header-table").attributes("style")).toContain("width: 480px");
    expect(wrapper.find(".xy-table__body-table").attributes("style")).toContain("width: 480px");
  });

  it("运行时切换列 width 与 fixed 时，会同步更新列宽和固定分区", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" height="120">
          <xy-table-column
            prop="name"
            label="名称"
            :width="nameWidth"
            :fixed="nameFixed"
          />
          <xy-table-column prop="status" label="状态" width="160" />
        </xy-table>
      `,
      () => ({
        nameWidth: 120,
        nameFixed: false as false | "left" | "right",
        rows: [{ id: 1, name: "Billing Console", status: "启用" }]
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table__fixed-panel--body.is-left").exists()).toBe(false);
    expect(wrapper.find(".xy-table__header-table col").attributes("style")).toContain("width: 120px");

    await wrapper.setData({
      nameWidth: 220,
      nameFixed: "left"
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".xy-table__fixed-panel--body.is-left").exists()).toBe(true);
    expect(wrapper.find(".xy-table__header-table col").attributes("style")).toContain("width: 220px");
    expect(wrapper.find(".xy-table__fixed-panel--header.is-left").text()).toContain("名称");
  });

  it("支持无 prop 的操作列默认插槽解构 row", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column label="操作">
            <template #default="{ row }">
              <button class="row-action" type="button" @click="handleAction(row)">
                操作 {{ row.name }}
              </button>
            </template>
          </xy-table-column>
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console" }],
        actionText: "未触发",
        handleAction(this: { actionText: string }, row: { name: string }) {
          this.actionText = row.name;
        }
      })
    );

    await nextTick();

    const button = wrapper.find(".row-action");
    expect(button.text()).toContain("Billing Console");

    await button.trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as { actionText: string }).actionText).toBe("Billing Console");
  });

  it("运行时切换 v-if 列时会按最新顺序渲染单元格", async () => {
    const wrapper = createTableWrapper(
      `
        <div>
          <xy-table :data="rows">
            <xy-table-column v-if="showName" key="name" label="名称">
              <template #default="{ row }">
                <span class="name-cell">{{ row.name }}</span>
              </template>
            </xy-table-column>
            <xy-table-column key="status" label="状态">
              <template #default="{ row }">
                <span class="status-cell">{{ row.status }}</span>
              </template>
            </xy-table-column>
          </xy-table>
        </div>
      `,
      () => ({
        showName: true,
        rows: [{ id: 1, name: "Billing Console", status: "启用" }]
      })
    );

    await nextTick();

    expect(wrapper.find(".xy-table__body-table tbody td span").classes()).toContain("name-cell");

    await wrapper.setData({
      showName: false
    });
    await nextTick();
    await nextTick();

    expect(wrapper.find(".xy-table__body-table tbody td span").classes()).toContain("status-cell");
  });

  it("v-for + key 动态重排列顺序时会按最新顺序渲染", async () => {
    const wrapper = createTableWrapper(
      `
        <div>
          <xy-table :data="rows">
            <xy-table-column
              v-for="column in columns"
              :key="column.prop"
              :label="column.label"
            >
              <template #default="{ row }">
                <span :class="column.prop">{{ row[column.prop] }}</span>
              </template>
            </xy-table-column>
          </xy-table>
        </div>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", status: "启用" }] as Array<Record<string, string | number>>,
        columns: [
          { prop: "name", label: "名称" },
          { prop: "status", label: "状态" }
        ] as Array<{ prop: "name" | "status"; label: string }>
      })
    );

    await nextTick();

    const getFirstCellClass = () => wrapper.find(".xy-table__body-table tbody td span").classes()[0];
    expect(getFirstCellClass()).toBe("name");

    await wrapper.setData({
      columns: [
        { prop: "status", label: "状态" },
        { prop: "name", label: "名称" }
      ]
    });
    await nextTick();
    await nextTick();

    expect(getFirstCellClass()).toBe("status");
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

    expect(
      wrapper.findComponent({ name: "XyTable" }).emitted("selection-change")?.[0]?.[0]
    ).toHaveLength(2);

    table.clearSelection();
    await nextTick();
    expect(
      wrapper.findComponent({ name: "XyTable" }).emitted("selection-change")?.at(-1)?.[0]
    ).toEqual([]);

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();
    expect(wrapper.find(".expanded-row").text()).toBe("Billing Console");

    table.toggleRowExpansion((wrapper.vm as unknown as { rows: Row[] }).rows[0], false);
    await nextTick();
    expect(wrapper.find(".expanded-row").exists()).toBe(false);
  });

  it("type='expand' 时会优先使用 expand 专用槽位", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column type="expand">
            <template #expand="{ row, expanded, expandable }">
              <div class="expanded-slot">{{ row.name }} / {{ expanded }} / {{ expandable }}</div>
            </template>
            <template #default="{ row }">
              <div class="expanded-default">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 96, status: "启用" as const }]
      })
    );

    await nextTick();
    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();

    expect(wrapper.find(".expanded-slot").text()).toBe("Billing Console / true / true");
    expect(wrapper.find(".expanded-default").exists()).toBe(false);
  });

  it("非 reserveSelection 时，整批替换数据会清空选择，局部变更只清理失效项", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column type="selection" />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Billing Console", status: "启用" },
          { id: 2, name: "Sales Admin", status: "启用" },
          { id: 3, name: "Insight Hub", status: "启用" }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;
    const vm = wrapper.vm as unknown as { rows: Row[] };

    await nextTick();

    instance.toggleRowSelection(vm.rows[0] as Row, true);
    instance.toggleRowSelection(vm.rows[1] as Row, true);
    await nextTick();

    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([
      vm.rows[0],
      vm.rows[1]
    ]);

    vm.rows.splice(0, 1);
    await nextTick();

    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([vm.rows[0]]);

    await wrapper.setData({
      rows: [
        { id: 2, name: "Sales Admin V2", status: "启用" },
        { id: 4, name: "Ops Center", status: "启用" }
      ]
    });
    await nextTick();

    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([]);
  });

  it("reserveSelection 开启后，数据切走再切回时会按 rowKey 恢复勾选", async () => {
    const pageOne = [
      { id: 1, name: "Billing Console", status: "启用" },
      { id: 2, name: "Sales Admin", status: "启用" }
    ];
    const pageTwo = [{ id: 9, name: "Archive", status: "停用" }];
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column type="selection" reserve-selection />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: pageOne
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;

    await nextTick();

    instance.toggleRowSelection(pageOne[0] as Row, true);
    await nextTick();
    expect(wrapper.findAll(".xy-checkbox.is-checked")).toHaveLength(1);

    await wrapper.setData({
      rows: pageTwo
    });
    await nextTick();
    expect(wrapper.findAll(".xy-checkbox.is-checked")).toHaveLength(0);

    await wrapper.setData({
      rows: pageOne.map((row) => ({ ...row }))
    });
    await nextTick();

    const checkboxRows = wrapper.findAll(".xy-table__body-scroll-view tbody .xy-checkbox.is-checked");
    expect(checkboxRows).toHaveLength(1);
    expect(instance.getSelectionRows()?.[0]).toMatchObject({
      id: 1,
      name: "Billing Console"
    });
  });

  it("数据替换后会按 rowKey 恢复展开态，并在 rowExpandable 失效时自动收敛", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          :row-expandable="rowExpandable"
        >
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
          { id: 1, name: "Billing Console", status: "启用" },
          { id: 2, name: "Sales Admin", status: "停用" }
        ],
        rowExpandable: (row: Row) => row.status === "启用"
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("Billing Console");

    await wrapper.setData({
      rows: [
        { id: 1, name: "Billing Console V2", status: "启用" },
        { id: 2, name: "Sales Admin", status: "停用" }
      ]
    });
    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("Billing Console V2");

    await wrapper.setData({
      rows: [
        { id: 1, name: "Billing Console V3", status: "停用" },
        { id: 2, name: "Sales Admin", status: "停用" }
      ]
    });
    await nextTick();

    expect(wrapper.find(".expanded-row").exists()).toBe(false);
  });

  it("展开行在排序后会按 rowKey 保持展开态", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column type="expand">
            <template #default="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" sortable />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Alpha", score: 9, status: "启用" },
          { id: 2, name: "Beta", score: 2, status: "启用" }
        ]
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();
    expect(wrapper.find(".expanded-row").text()).toBe("Alpha");

    await wrapper.findAll(".xy-table__header-cell")[2]?.trigger("click");
    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("Alpha");
    const dataRows = wrapper.findAll(".xy-table__body-scroll-view tbody > tr.xy-table__row");
    expect(dataRows[0]?.text()).toContain("Beta");
    expect(dataRows[1]?.text()).toContain("Alpha");
  });

  it("展开行在筛选隐藏后清空筛选时会按 rowKey 恢复展开态", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id">
          <xy-table-column type="expand">
            <template #default="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column
            prop="status"
            label="状态"
            :filters="filters"
          />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Alpha", score: 9, status: "启用" },
          { id: 2, name: "Beta", score: 2, status: "停用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );
    const instance = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();
    expect(wrapper.find(".expanded-row").text()).toBe("Alpha");

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.findAll(".xy-table__filter-option")[1]?.trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.find(".expanded-row").exists()).toBe(false);

    instance.clearFilter();
    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("Alpha");
  });

  it("defaultExpandAll 在整批替换数据后会重新作用于新的可展开行", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          default-expand-all
        >
          <xy-table-column type="expand">
            <template #default="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "初始节点", status: "启用" }]
      })
    );

    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("初始节点");

    await wrapper.setData({
      rows: [
        { id: 2, name: "刷新后节点 A", status: "启用" },
        { id: 3, name: "刷新后节点 B", status: "启用" }
      ]
    });
    await nextTick();

    const expandedRows = wrapper.findAll(".expanded-row");
    expect(expandedRows).toHaveLength(2);
    expect(expandedRows[0]?.text()).toBe("刷新后节点 A");
    expect(expandedRows[1]?.text()).toBe("刷新后节点 B");
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

  it("分组列 fixed 会向子列传播，保持固定分区一致", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column label="分组" fixed="left">
            <xy-table-column label="二级分组">
              <xy-table-column prop="status" label="状态" />
              <xy-table-column prop="score" label="分数" fixed="right" />
            </xy-table-column>
          </xy-table-column>
          <xy-table-column prop="owner" label="负责人" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", status: "启用", score: 99, owner: "小叶" }]
      })
    );

    await nextTick();

    const leftHeader = wrapper.find(".xy-table__fixed-panel--header.is-left");
    const rightHeader = wrapper.find(".xy-table__fixed-panel--header.is-right");

    expect(leftHeader.exists()).toBe(true);
    expect(leftHeader.text()).toContain("状态");
    expect(leftHeader.text()).toContain("分数");
    expect(rightHeader.exists()).toBe(false);
  });

  it("doLayout 会同步主表与 fixed 面板的行高", async () => {
    const requestAnimationFrameSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" row-key="id" border>
          <xy-table-column fixed="left" prop="name" label="名称" width="160" />
          <xy-table-column prop="status" label="状态" width="120" />
          <xy-table-column fixed="right" prop="score" label="分数" width="120" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Billing Console", status: "启用", score: 96 },
          { id: 2, name: "Sales Admin", status: "停用", score: 82 }
        ]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const mainRows = wrapper.findAll(".xy-table__body-scroll-view > .xy-table__body-table tbody tr");
    const leftRows = wrapper.findAll(".xy-table__fixed-panel--body.is-left tbody tr");
    const rightRows = wrapper.findAll(".xy-table__fixed-panel--body.is-right tbody tr");

    [
      [mainRows[0]?.element, 48],
      [mainRows[1]?.element, 64],
      [leftRows[0]?.element, 28],
      [leftRows[1]?.element, 30],
      [rightRows[0]?.element, 26],
      [rightRows[1]?.element, 32]
    ].forEach(([element, height]) => {
      Object.defineProperty(element as Element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({ height })
      });
    });

    table.doLayout();
    await nextTick();

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
    expect(leftRows[0]?.attributes("style")).toContain("height: 48px");
    expect(rightRows[1]?.attributes("style")).toContain("height: 64px");
    expect(mainRows[1]?.attributes("style")).toContain("height: 64px");
  });

  it("show-summary 遇到功能列时，会把汇总标题放到第一个业务列", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" show-summary sum-text="总览">
          <xy-table-column type="selection" />
          <xy-table-column type="index" label="#" width="64" />
          <xy-table-column type="expand" width="60">
            <template #default="{ row }">
              <div>{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" width="180" />
          <xy-table-column prop="score" label="分数" width="120" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 96 }]
      })
    );

    await nextTick();

    const footerTexts = wrapper
      .findAll(".xy-table__footer-cell .xy-table__cell-text")
      .map((node) => node.text());

    expect(footerTexts).toEqual(["", "", "", "总览", "96"]);
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

  it("展开行在 fixed 面板中会渲染占位行，保持左右分区高度同步", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" height="180">
          <xy-table-column type="selection" fixed="left" />
          <xy-table-column type="index" label="#" width="64" fixed="left" />
          <xy-table-column type="expand" width="60">
            <template #default="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" width="180" />
          <xy-table-column fixed="right" prop="score" label="分数" width="120" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Billing Console", score: 96 },
          { id: 2, name: "Sales Admin", score: 88 }
        ]
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();

    expect(
      wrapper.findAll(".xy-table > .xy-table__body-wrapper .xy-table__body-scroll-view > .xy-table__body-table tbody > tr")
    ).toHaveLength(3);
    expect(wrapper.findAll(".xy-table__fixed-panel--body.is-left tbody > tr")).toHaveLength(3);
    expect(wrapper.find(".xy-table__fixed-panel--body.is-left .xy-table__expanded-row").exists()).toBe(true);
  });

  it("支持 lazy tree 数据展开", async () => {
    const load = vi.fn(
      (_row: { id: number }, _treeNode: unknown, resolve: (rows: Row[]) => void) => {
        resolve([{ id: 11, name: "子节点", score: 0, status: "启用" } as Row]);
      }
    );

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

  it("统一派发 scroll 事件，并支持 scrollbar-tabindex 与 append 插槽", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          height="120"
          show-summary
          scrollbar-tabindex="3"
        >
          <xy-table-column fixed="left" prop="name" label="名称" width="160" />
          <xy-table-column prop="status" label="状态" width="180" />
          <xy-table-column prop="score" label="分数" width="180" />
          <template #append>
            <div class="append-slot">滚动补充区域</div>
          </template>
        </xy-table>
      `,
      () => ({
        rows: Array.from({ length: 6 }, (_, index) => ({
          id: index + 1,
          name: `项目 ${index + 1}`,
          score: 100 - index,
          status: index % 2 === 0 ? "启用" : "停用"
        }))
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;
    const body = wrapper.find(".xy-table__body-scroll-wrap").element as HTMLDivElement;

    Object.defineProperty(body, "scrollLeft", { value: 0, writable: true, configurable: true });
    Object.defineProperty(body, "scrollTop", { value: 0, writable: true, configurable: true });
    Object.defineProperty(body, "clientWidth", { value: 220, configurable: true });
    Object.defineProperty(body, "clientHeight", { value: 120, configurable: true });
    Object.defineProperty(body, "scrollWidth", { value: 640, configurable: true });
    Object.defineProperty(body, "scrollHeight", { value: 360, configurable: true });

    const mockScrollTo: typeof body.scrollTo = ((leftOrOptions?: number | ScrollToOptions, top?: number) => {
      if (typeof leftOrOptions === "object" && leftOrOptions) {
        body.scrollLeft = leftOrOptions.left ?? body.scrollLeft;
        body.scrollTop = leftOrOptions.top ?? body.scrollTop;
        return;
      }

      if (typeof leftOrOptions !== "number") {
        return;
      }

      body.scrollLeft = leftOrOptions;
      body.scrollTop = top ?? body.scrollTop;
    }) as typeof body.scrollTo;

    body.scrollTo = mockScrollTo;

    await nextTick();
    instance.doLayout();
    await nextTick();

    expect(wrapper.find(".xy-table__body-scroll-wrap").attributes("tabindex")).toBe("3");
    expect(wrapper.findAll(".append-slot")).toHaveLength(1);
    expect(wrapper.find(".xy-table__append-wrapper").text()).toContain("滚动补充区域");

    instance.setScrollLeft(24);
    instance.setScrollTop(48);
    instance.scrollTo({
      left: 12,
      top: 36
    });
    await wrapper.find(".xy-table__fixed-panel--body.is-left").trigger("wheel", {
      deltaX: 5,
      deltaY: 7
    });

    expect(
      table
        .emitted("scroll")
        ?.map((event) => event[0] as { scrollLeft: number; scrollTop: number })
    ).toEqual([
      { scrollLeft: 24, scrollTop: 0 },
      { scrollLeft: 24, scrollTop: 48 },
      { scrollLeft: 12, scrollTop: 36 },
      { scrollLeft: 17, scrollTop: 43 }
    ]);
  });

  it("支持 renderHeader、nativeScrollbar 与 flexible", async () => {
    const wrapper = createTableWrapper(
      `
        <div class="table-shell" style="display: flex;">
          <xy-table
            :data="rows"
            row-key="id"
            height="120"
            flexible
            native-scrollbar
          >
            <xy-table-column
              prop="name"
              label="名称"
              :render-header="renderHeader"
            />
          </xy-table>
        </div>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }],
        renderHeader: ({ column }: { column: TableResolvedColumn<Row> }) =>
          h("span", { class: "custom-render-header" }, `自定义-${column.label}`)
      })
    );

    await nextTick();

    expect(wrapper.find(".custom-render-header").text()).toBe("自定义-名称");
    expect(wrapper.find(".xy-scrollbar__bar").exists()).toBe(false);
    expect(wrapper.find(".xy-table").element.parentElement?.style.minWidth).toBe("0");
  });

  it("table-layout=auto 时主表 body 会渲染测宽表头且不再输出 body colgroup", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" table-layout="auto">
          <xy-table-column prop="id" label="编号" />
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );

    await nextTick();
    await waitForAnimationFrame();
    await nextTick();

    expect(wrapper.find(".xy-table__body-table thead").exists()).toBe(true);
    expect(wrapper.find(".xy-table__body-table colgroup col").exists()).toBe(false);
    expect(wrapper.find(".xy-table__body-table tbody").exists()).toBe(true);
  });

  it("table-layout=auto 会将主表测得的列宽回灌到 header colgroup", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    expect(sizingHeaderCells).toHaveLength(2);

    [180, 260].forEach((width, index) => {
      Object.defineProperty(sizingHeaderCells[index]!.element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
          width
        })
      });
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const headerCols = wrapper.findAll(".xy-table__header-table colgroup col");

    expect(headerCols).toHaveLength(2);
    expect(headerCols[0]?.attributes("style")).toContain("width: 180px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 260px");
  });

  it("table-layout=auto 在 show-header=false 时会退回按 body 单元格测宽", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto" :show-header="false">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const bodyCells = wrapper.findAll(".xy-table__body-table tbody tr:first-child td[data-column-uid]");

    expect(bodyCells).toHaveLength(2);

    [210, 130].forEach((width, index) => {
      Object.defineProperty(bodyCells[index]!.element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
          width
        })
      });
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const bodyColgroup = wrapper.findAll(".xy-table__body-table colgroup col");

    expect(bodyColgroup).toHaveLength(0);

    const headerTable = wrapper.find(".xy-table__header-table");
    expect(headerTable.exists()).toBe(false);
  });

  it("table-layout=auto 遇到 fixed 列时会把主表测得列宽同步到固定分区", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto" row-key="id">
          <xy-table-column fixed="left" prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
          <xy-table-column fixed="right" prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    expect(sizingHeaderCells).toHaveLength(3);

    [220, 160, 140].forEach((width, index) => {
      Object.defineProperty(sizingHeaderCells[index]!.element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
          width
        })
      });
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const mainCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    const leftCols = wrapper.findAll(".xy-table__fixed-panel--header.is-left colgroup col");
    const rightCols = wrapper.findAll(".xy-table__fixed-panel--header.is-right colgroup col");

    expect(mainCols).toHaveLength(3);
    expect(mainCols[0]?.attributes("style")).toContain("width: 220px");
    expect(mainCols[1]?.attributes("style")).toContain("width: 160px");
    expect(mainCols[2]?.attributes("style")).toContain("width: 140px");
    expect(leftCols).toHaveLength(1);
    expect(leftCols[0]?.attributes("style")).toContain("width: 220px");
    expect(rightCols).toHaveLength(1);
    expect(rightCols[0]?.attributes("style")).toContain("width: 140px");
  });

  it("table-layout=auto + show-summary 时会把主表测得列宽同步到 footer", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto" show-summary>
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
          <xy-table-column prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    [240, 150, 120].forEach((width, index) => {
      Object.defineProperty(sizingHeaderCells[index]!.element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
          width
        })
      });
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const footerCols = wrapper.findAll(".xy-table__footer-main .xy-table__footer-table colgroup col");

    expect(footerCols).toHaveLength(3);
    expect(footerCols[0]?.attributes("style")).toContain("width: 240px");
    expect(footerCols[1]?.attributes("style")).toContain("width: 150px");
    expect(footerCols[2]?.attributes("style")).toContain("width: 120px");
  });

  it("table-layout=auto + show-summary + fixed 时会把主表测得列宽同步到左右 footer 分区", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto" row-key="id" show-summary>
          <xy-table-column fixed="left" prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
          <xy-table-column fixed="right" prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    mockSizingHeaderWidths(sizingHeaderCells, {
      名称: 260,
      状态: 150,
      分数: 130
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const mainFooterCols = wrapper.findAll(".xy-table__footer-main .xy-table__footer-table colgroup col");
    const leftFooterCols = wrapper.findAll(".xy-table__fixed-panel--footer.is-left colgroup col");
    const rightFooterCols = wrapper.findAll(".xy-table__fixed-panel--footer.is-right colgroup col");

    expect(mainFooterCols).toHaveLength(3);
    expect(mainFooterCols[0]?.attributes("style")).toContain("width: 260px");
    expect(mainFooterCols[1]?.attributes("style")).toContain("width: 150px");
    expect(mainFooterCols[2]?.attributes("style")).toContain("width: 130px");
    expect(leftFooterCols).toHaveLength(1);
    expect(leftFooterCols[0]?.attributes("style")).toContain("width: 260px");
    expect(rightFooterCols).toHaveLength(1);
    expect(rightFooterCols[0]?.attributes("style")).toContain("width: 130px");
  });

  it("table-layout=auto 下分组表头会按叶子列测宽，并同步到主表与 fixed header", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto" row-key="id">
          <xy-table-column label="基础信息">
            <xy-table-column fixed="left" prop="name" label="名称" />
            <xy-table-column prop="status" label="状态" />
          </xy-table-column>
          <xy-table-column prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");
    expect(sizingHeaderCells).toHaveLength(3);

    mockSizingHeaderWidths(sizingHeaderCells, {
      名称: 240,
      状态: 150,
      分数: 120
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const mainHeaderCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    const leftHeaderCols = wrapper.findAll(".xy-table__fixed-panel--header.is-left colgroup col");

    expect(wrapper.findAll(".xy-table__header-main thead tr")).toHaveLength(2);
    expect(mainHeaderCols).toHaveLength(3);
    expect(mainHeaderCols[0]?.attributes("style")).toContain("width: 240px");
    expect(mainHeaderCols[1]?.attributes("style")).toContain("width: 150px");
    expect(mainHeaderCols[2]?.attributes("style")).toContain("width: 120px");
    expect(leftHeaderCols).toHaveLength(1);
    expect(leftHeaderCols[0]?.attributes("style")).toContain("width: 240px");
    expect(wrapper.find(".xy-table__fixed-panel--header.is-left").text()).toContain("基础信息");
  });

  it("table-layout=auto 不会覆盖显式 width，未声明 width 的列仍会参与自动测宽", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto">
          <xy-table-column prop="name" label="名称" width="180" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    expect(sizingHeaderCells).toHaveLength(2);

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 320
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 140
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");

    expect(headerCols).toHaveLength(2);
    expect(headerCols[0]?.attributes("style")).toContain("width: 180px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 140px");
  });

  it("table-layout=auto 中用户拖拽后的列宽不会被后续自动测宽覆盖", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 140
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 120
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const headerCells = wrapper.findAll(".xy-table__header-main th");
    const resizeHandle = wrapper.find(".xy-table__header-main .xy-table__resize-handle");
    const tableRoot = wrapper.find(".xy-table").element as HTMLElement;

    Object.defineProperty(tableRoot, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        DOMRect.fromRect({
          x: 0,
          y: 0,
          width: 500,
          height: 200
        })
    });
    Object.defineProperty(headerCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        DOMRect.fromRect({
          x: 0,
          y: 0,
          width: 140,
          height: 40
        })
    });

    await resizeHandle.trigger("mousedown", {
      button: 0,
      clientX: 140
    });
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 260 }));
    window.dispatchEvent(new MouseEvent("mouseup", { clientX: 260 }));
    await nextTick();

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 100
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 180
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    const headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");

    expect(headerCols).toHaveLength(2);
    expect(headerCols[0]?.attributes("style")).toContain("width: 260px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 180px");
  });

  it("table-layout=auto 中列 width 从显式值切到 undefined 后，会重新交给自动测宽接管", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto">
          <xy-table-column prop="name" label="名称" :width="nameWidth" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        nameWidth: 180 as number | undefined,
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    let sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 320
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 140
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    let headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    expect(headerCols[0]?.attributes("style")).toContain("width: 180px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 140px");

    await wrapper.setData({
      nameWidth: undefined
    });
    await nextTick();
    await nextTick();

    sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");
    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 260
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 150
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    expect(headerCols[0]?.attributes("style")).toContain("width: 260px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 150px");
  });

  it("table-layout=auto 中列 width 从 undefined 切到显式值后，自动测宽会正确让位", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto">
          <xy-table-column prop="name" label="名称" :width="nameWidth" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        nameWidth: undefined as number | undefined,
        rows: [{ id: 1, name: "Billing Console", score: 100, status: "启用" }]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    let sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 240
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 120
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    let headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    expect(headerCols[0]?.attributes("style")).toContain("width: 240px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 120px");

    await wrapper.setData({
      nameWidth: 190
    });
    await nextTick();
    await nextTick();

    sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");
    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 320
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 160
      })
    });

    table.doLayout();
    await waitForAnimationFrame();
    await nextTick();

    headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    expect(headerCols[0]?.attributes("style")).toContain("width: 190px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 160px");
  });

  it("table-layout=auto 在内容尺寸变化后会通过 ResizeObserver 重新测宽", async () => {
    const resizeObserverCallbacks: ResizeObserverCallback[] = [];
    const observe = vi.fn();
    const disconnect = vi.fn();
    const hadResizeObserver = "ResizeObserver" in window;
    const originalResizeObserver = window.ResizeObserver;

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallbacks.push(callback);
      }

      observe = observe;
      disconnect = disconnect;
    }

    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: MockResizeObserver
    });

    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto">
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "短文本", score: 100, status: "启用" }]
      })
    );

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 120
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 100
      })
    });

    await waitForAnimationFrame();
    await nextTick();

    let headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    expect(headerCols[0]?.attributes("style")).toContain("width: 120px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 100px");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 280
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 140
      })
    });

    resizeObserverCallbacks.forEach((callback) => callback([], {} as ResizeObserver));
    await waitForAnimationFrame();
    await nextTick();

    headerCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    expect(headerCols[0]?.attributes("style")).toContain("width: 280px");
    expect(headerCols[1]?.attributes("style")).toContain("width: 140px");

    if (hadResizeObserver) {
      Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: originalResizeObserver
      });
    } else {
      // 恢复成“属性不存在”，避免 scrollbar 误判为可实例化
      delete (window as Window & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    }
  });

  it("table-layout=auto + show-summary 在内容尺寸变化后会同步更新 footer 列宽", async () => {
    const resizeObserverCallbacks: ResizeObserverCallback[] = [];
    const originalResizeObserver = window.ResizeObserver;
    const hadResizeObserver = "ResizeObserver" in window;

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallbacks.push(callback);
      }

      observe() {}
      disconnect() {}
    }

    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: MockResizeObserver
    });

    const wrapper = createTableWrapper(
      `
        <xy-table ref="tableRef" :data="rows" table-layout="auto" show-summary>
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "短文本", score: 100, status: "启用" }]
      })
    );

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 120
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 100
      })
    });

    await waitForAnimationFrame();
    await nextTick();

    let footerCols = wrapper.findAll(".xy-table__footer-main .xy-table__footer-table colgroup col");
    expect(footerCols[0]?.attributes("style")).toContain("width: 120px");
    expect(footerCols[1]?.attributes("style")).toContain("width: 100px");

    Object.defineProperty(sizingHeaderCells[0]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 260
      })
    });
    Object.defineProperty(sizingHeaderCells[1]!.element, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        width: 150
      })
    });

    resizeObserverCallbacks.forEach((callback) => callback([], {} as ResizeObserver));
    await waitForAnimationFrame();
    await nextTick();

    footerCols = wrapper.findAll(".xy-table__footer-main .xy-table__footer-table colgroup col");
    expect(footerCols[0]?.attributes("style")).toContain("width: 260px");
    expect(footerCols[1]?.attributes("style")).toContain("width: 150px");

    if (hadResizeObserver) {
      Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: originalResizeObserver
      });
    } else {
      delete (window as Window & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    }
  });

  it("table-layout=auto 下分组表头在内容尺寸变化后会重新测宽并同步 fixed header", async () => {
    const resizeObserverCallbacks: ResizeObserverCallback[] = [];
    const originalResizeObserver = window.ResizeObserver;
    const hadResizeObserver = "ResizeObserver" in window;

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallbacks.push(callback);
      }

      observe() {}
      disconnect() {}
    }

    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      writable: true,
      value: MockResizeObserver
    });

    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" table-layout="auto" row-key="id">
          <xy-table-column label="基础信息">
            <xy-table-column fixed="left" prop="name" label="名称" />
            <xy-table-column prop="status" label="状态" />
          </xy-table-column>
          <xy-table-column prop="score" label="分数" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "短文本", score: 100, status: "启用" }]
      })
    );

    await nextTick();

    const sizingHeaderCells = wrapper.findAll(".xy-table__body-sizing-header th[data-column-uid]");

    mockSizingHeaderWidths(sizingHeaderCells, {
      名称: 120,
      状态: 100,
      分数: 90
    });

    await waitForAnimationFrame();
    await nextTick();

    let mainHeaderCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    let leftHeaderCols = wrapper.findAll(".xy-table__fixed-panel--header.is-left colgroup col");
    expect(mainHeaderCols[0]?.attributes("style")).toContain("width: 120px");
    expect(mainHeaderCols[1]?.attributes("style")).toContain("width: 100px");
    expect(mainHeaderCols[2]?.attributes("style")).toContain("width: 90px");
    expect(leftHeaderCols[0]?.attributes("style")).toContain("width: 120px");

    mockSizingHeaderWidths(sizingHeaderCells, {
      名称: 260,
      状态: 150,
      分数: 140
    });

    resizeObserverCallbacks.forEach((callback) => callback([], {} as ResizeObserver));
    await waitForAnimationFrame();
    await nextTick();

    mainHeaderCols = wrapper.findAll(".xy-table__header-main .xy-table__header-table colgroup col");
    leftHeaderCols = wrapper.findAll(".xy-table__fixed-panel--header.is-left colgroup col");
    expect(mainHeaderCols[0]?.attributes("style")).toContain("width: 260px");
    expect(mainHeaderCols[1]?.attributes("style")).toContain("width: 150px");
    expect(mainHeaderCols[2]?.attributes("style")).toContain("width: 140px");
    expect(leftHeaderCols[0]?.attributes("style")).toContain("width: 260px");

    if (hadResizeObserver) {
      Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: originalResizeObserver
      });
    } else {
      delete (window as Window & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    }
  });

  it("支持 tooltipFormatter、表级默认项和列级关闭", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          tooltip-effect="light"
          :tooltip-options="{ enterable: false, offset: 18 }"
          show-overflow-tooltip
          :tooltip-formatter="tableTooltipFormatter"
        >
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" :show-overflow-tooltip="false" />
          <xy-table-column
            prop="score"
            label="分数"
            show-overflow-tooltip
            :tooltip-formatter="columnTooltipFormatter"
          />
        </xy-table>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "一段很长很长很长的名称",
            score: 7,
            status: "启用"
          }
        ],
        tableTooltipFormatter: ({ cellValue }: { cellValue: unknown }) => `表-${cellValue}`,
        columnTooltipFormatter: ({ cellValue }: { cellValue: unknown }) => `列-${cellValue}`
      })
    );

    await nextTick();

    const tooltips = wrapper.findAllComponents({ name: "XyTooltip" });

    expect(tooltips).toHaveLength(2);
    expect(tooltips[0]?.props()).toMatchObject({
      effect: "light",
      enterable: false,
      offset: 18,
      placement: "top",
      content: "表-一段很长很长很长的名称"
    });
    expect(tooltips[1]?.props()).toMatchObject({
      effect: "light",
      enterable: false,
      offset: 18,
      placement: "top",
      content: "列-7"
    });
  });

  it("表级和列级 tooltip 对象会按优先级合并", () => {
    const columns = normalizeColumns<Row>(
      [
        {
          uid: "name-column",
          key: "name",
          type: "default",
          prop: "name",
          label: "名称",
          columnKey: undefined,
          width: undefined,
          minWidth: undefined,
          realWidth: 160,
          align: "left",
          headerAlign: "left",
          className: "",
          labelClassName: "",
          formatter: undefined,
          sortable: false,
          sortMethod: undefined,
          sortBy: undefined,
          sortOrders: [],
          filters: [],
          filteredValue: undefined,
          filterMethod: undefined,
          filterMultiple: true,
          filterPlacement: "bottom-end",
          filterClassName: "",
          showOverflowTooltip: undefined,
          tooltipFormatter: undefined,
          overflowTooltipOptions: null,
          fixed: undefined,
          selectable: undefined,
          reserveSelection: false,
          index: undefined,
          resizable: true,
          children: [],
          level: 0,
          parentUid: undefined,
          headerSlot: undefined,
          cellSlot: undefined,
          leafCount: 1,
          colSpan: 1,
          rowSpan: 1,
          leafIndex: 0
        },
        {
          uid: "status-column",
          key: "status",
          type: "default",
          prop: "status",
          label: "状态",
          columnKey: undefined,
          width: undefined,
          minWidth: undefined,
          realWidth: 160,
          align: "left",
          headerAlign: "left",
          className: "",
          labelClassName: "",
          formatter: undefined,
          sortable: false,
          sortMethod: undefined,
          sortBy: undefined,
          sortOrders: [],
          filters: [],
          filteredValue: undefined,
          filterMethod: undefined,
          filterMultiple: true,
          filterPlacement: "bottom-end",
          filterClassName: "",
          showOverflowTooltip: false,
          tooltipFormatter: undefined,
          overflowTooltipOptions: null,
          fixed: undefined,
          selectable: undefined,
          reserveSelection: false,
          index: undefined,
          resizable: true,
          children: [],
          level: 0,
          parentUid: undefined,
          headerSlot: undefined,
          cellSlot: undefined,
          leafCount: 1,
          colSpan: 1,
          rowSpan: 1,
          leafIndex: 1
        },
        {
          uid: "score-column",
          key: "score",
          type: "default",
          prop: "score",
          label: "分数",
          columnKey: undefined,
          width: undefined,
          minWidth: undefined,
          realWidth: 160,
          align: "left",
          headerAlign: "left",
          className: "",
          labelClassName: "",
          formatter: undefined,
          sortable: false,
          sortMethod: undefined,
          sortBy: undefined,
          sortOrders: [],
          filters: [],
          filteredValue: undefined,
          filterMethod: undefined,
          filterMultiple: true,
          filterPlacement: "bottom-end",
          filterClassName: "",
          showOverflowTooltip: {
            placement: "right",
            popperClass: "column-tooltip"
          },
          tooltipFormatter: undefined,
          overflowTooltipOptions: null,
          fixed: undefined,
          selectable: undefined,
          reserveSelection: false,
          index: undefined,
          resizable: true,
          children: [],
          level: 0,
          parentUid: undefined,
          headerSlot: undefined,
          cellSlot: undefined,
          leafCount: 1,
          colSpan: 1,
          rowSpan: 1,
          leafIndex: 2
        }
      ] satisfies TableResolvedColumn<Row>[],
      {},
      {
        placement: "bottom",
        showArrow: false,
        popperClass: "table-tooltip"
      },
      "light",
      {
        enterable: false,
        offset: 18
      },
      false
    );

    expect(columns[0]?.overflowTooltipOptions).toMatchObject({
      effect: "light",
      enterable: false,
      offset: 18,
      placement: "bottom",
      showArrow: false,
      popperClass: "table-tooltip"
    });
    expect(columns[1]?.overflowTooltipOptions).toBeNull();
    expect(columns[2]?.overflowTooltipOptions).toMatchObject({
      effect: "light",
      enterable: false,
      offset: 18,
      placement: "right",
      showArrow: false,
      popperClass: "column-tooltip"
    });
  });

  it("fit 模式下手动拖拽后的列宽不会再次参与剩余宽度均分", () => {
    const createColumn = (uid: string, leafIndex: number): TableResolvedColumn<Row> => ({
      uid,
      key: uid,
      type: "default",
      prop: "name",
      label: uid,
      columnKey: undefined,
      width: undefined,
      minWidth: undefined,
      realWidth: 120,
      align: "left",
      headerAlign: "left",
      className: "",
      labelClassName: "",
      formatter: undefined,
      sortable: false,
      sortMethod: undefined,
      sortBy: undefined,
      sortOrders: [],
      filters: [],
      filteredValue: undefined,
      filterMethod: undefined,
      filterMultiple: true,
      filterPlacement: "bottom-end",
      filterClassName: "",
      showOverflowTooltip: undefined,
      tooltipFormatter: undefined,
      overflowTooltipOptions: null,
      fixed: undefined,
      selectable: undefined,
      reserveSelection: false,
      index: undefined,
      resizable: true,
      children: [],
      level: 0,
      parentUid: undefined,
      headerSlot: undefined,
      cellSlot: undefined,
      expandSlot: undefined,
      leafCount: 1,
      colSpan: 1,
      rowSpan: 1,
      leafIndex
    });

    const columns = normalizeColumns<Row>(
      [createColumn("name", 0), createColumn("status", 1), createColumn("score", 2)],
      {
        status: 220
      },
      undefined,
      undefined,
      undefined,
      true,
      580
    );

    expect(columns.map((column) => column.realWidth)).toEqual([180, 220, 180]);
  });

  it("支持 appendFilterPanelTo、filterPlacement 与 filterClassName", async () => {
    document.body.innerHTML = `<div id="filter-target"></div>`;

    const wrapper = createTableWrapper(
      `
        <xy-table :data="rows" row-key="id" append-filter-panel-to="#filter-target">
          <xy-table-column
            prop="status"
            label="状态"
            :filters="filters"
            filter-placement="top-start"
            filter-class-name="custom-filter-panel"
          />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, status: "启用" },
          { id: 2, status: "停用" }
        ],
        filters: [
          { text: "启用", value: "启用" },
          { text: "停用", value: "停用" }
        ]
      })
    );

    await nextTick();

    const trigger = wrapper.find(".xy-table__filter-trigger").element as HTMLButtonElement;
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({
        x: 20,
        y: 24,
        width: 18,
        height: 18
      })
    );

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();

    const panel = document.querySelector(
      "#filter-target .xy-table__filter-panel.custom-filter-panel"
    ) as HTMLElement | null;

    expect(panel).not.toBeNull();
    expect(panel?.classList.contains("custom-filter-panel")).toBe(true);
  });

  it("toggleRowSelection 第三个参数可覆盖 selectable，且 allowDragLastColumn=false 会隐藏最后一列拖拽手柄", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          border
          :allow-drag-last-column="false"
        >
          <xy-table-column type="selection" :selectable="selectable" />
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="status" label="状态" />
        </xy-table>
      `,
      () => ({
        rows: [
          { id: 1, name: "Billing Console", score: 99, status: "启用" },
          { id: 2, name: "Sales Admin", score: 88, status: "停用" }
        ],
        selectable: (row: Row) => row.id !== 1
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;
    const rows = (wrapper.vm as unknown as { rows: Row[] }).rows;

    await nextTick();

    instance.toggleRowSelection(rows[0], true);
    await nextTick();
    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([rows[0]]);

    instance.toggleRowSelection(rows[0], false, false);
    await nextTick();
    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([rows[0]]);

    expect(wrapper.findAll(".xy-table__header-main .xy-table__resize-handle")).toHaveLength(2);
  });

  it("受控 expand-row-keys 会派发 update:expandRowKeys，preserveExpandedContent 开启后折叠不销毁内容", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          :expand-row-keys="expandRowKeys"
          preserve-expanded-content
        >
          <xy-table-column type="expand">
            <template #default="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-table-column>
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "Billing Console", score: 99, status: "启用" }],
        expandRowKeys: [] as number[]
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });

    await nextTick();

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();

    expect(table.emitted("update:expandRowKeys")?.[0]?.[0]).toEqual([1]);
    await wrapper.setData({
      expandRowKeys: [1]
    });
    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("Billing Console");

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();

    expect(table.emitted("update:expandRowKeys")?.at(-1)?.[0]).toEqual([]);
    await wrapper.setData({
      expandRowKeys: []
    });
    await nextTick();

    expect(wrapper.find(".expanded-row").exists()).toBe(true);
    expect(wrapper.find(".xy-table__expanded-row").attributes("style")).toContain("display: none");

    await wrapper.setData({
      rows: [{ id: 1, name: "Billing Console V2", score: 99, status: "启用" }],
      expandRowKeys: []
    });
    await nextTick();

    expect(wrapper.find(".expanded-row").text()).toBe("Billing Console V2");
  });

  it("支持 updateKeyChildren 更新 lazy tree 子节点，并与 checkStrictly 共存", async () => {
    const load = vi.fn();
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren', checkStrictly: true }"
        >
          <xy-table-column type="selection" />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "父节点", score: 10, status: "启用", hasChildren: true }],
        load
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;
    const rows = (wrapper.vm as unknown as { rows: Row[] }).rows;

    await nextTick();

    instance.updateKeyChildren(1, [{ id: 11, name: "手动子节点", score: 6, status: "启用" } as Row]);
    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    expect(load).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("手动子节点");

    instance.toggleRowSelection(rows[0], true);
    await nextTick();

    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([rows[0]]);
  });

  it("默认树形联动选择下，updateKeyChildren 后会重算子节点选中态", async () => {
    const load = vi.fn();
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column type="selection" />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "父节点", score: 10, status: "启用", hasChildren: true }],
        load
      })
    );
    const table = wrapper.getComponent({ name: "XyTable" });
    const instance = table.vm as unknown as TableInstance<Row>;
    const rows = (wrapper.vm as unknown as { rows: Row[] }).rows;

    await nextTick();

    instance.toggleRowSelection(rows[0], true);
    await nextTick();
    expect(table.emitted("selection-change")?.at(-1)?.[0]).toEqual([rows[0]]);

    instance.updateKeyChildren(1, [
      { id: 11, name: "子节点 A", score: 6, status: "启用" } as Row,
      { id: 12, name: "子节点 B", score: 8, status: "启用" } as Row
    ]);
    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    const selectionRows = instance.getSelectionRows().map((row) => row.id).sort((a, b) => a - b);
    expect(selectionRows).toEqual([1, 11, 12]);
    expect(wrapper.findAll(".xy-table__body-scroll-view .xy-checkbox.is-checked")).toHaveLength(3);
  });

  it("默认树形联动选择下，updateKeyChildren 后取消部分子节点会让父节点进入半选", async () => {
    const load = vi.fn();
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column type="selection" />
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "父节点", score: 10, status: "启用", hasChildren: true }],
        load
      })
    );
    const instance = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;
    const rows = (wrapper.vm as unknown as { rows: Row[] }).rows;

    await nextTick();

    instance.toggleRowSelection(rows[0], true);
    await nextTick();

    instance.updateKeyChildren(1, [
      { id: 11, name: "子节点 A", score: 6, status: "启用" } as Row,
      { id: 12, name: "子节点 B", score: 8, status: "启用" } as Row
    ]);
    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    const childCheckboxes = wrapper.findAll(".xy-table__body-scroll-view tbody .xy-checkbox__original");
    await childCheckboxes[2]?.trigger("change");
    await nextTick();

    const selectionRows = instance.getSelectionRows().map((row) => row.id).sort((a, b) => a - b);
    expect(selectionRows).toEqual([11]);
    const bodyRows = wrapper.findAll(".xy-table__body-scroll-view tbody tr.xy-table__row");
    expect(bodyRows[0]?.find(".xy-checkbox__input").classes()).toContain("is-indeterminate");
  });

  it("lazy 树节点在整批数据切换后会清理旧缓存，切回同 key 时重新加载", async () => {
    const load = vi.fn((_row: Row, _treeNode: unknown, resolve: (rows: Row[]) => void) => {
      resolve([{ id: 11, name: "远程子节点", score: 6, status: "启用", hasChildren: false } as Row]);
    });
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "父节点", score: 10, status: "启用", hasChildren: true }],
        load
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();
    expect(load).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("远程子节点");

    await wrapper.setData({
      rows: [{ id: 9, name: "其他节点", score: 1, status: "停用", hasChildren: false }]
    });
    await nextTick();
    expect(wrapper.text()).not.toContain("远程子节点");

    await wrapper.setData({
      rows: [{ id: 1, name: "父节点二次出现", score: 10, status: "启用", hasChildren: true }]
    });
    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain("远程子节点");
  });

  it("tree + defaultExpandAll 在整批替换数据后会重新展开新的树节点", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "父节点 A",
            status: "启用",
            children: [{ id: 11, name: "子节点 A-1", status: "启用" }]
          }
        ]
      })
    );

    await nextTick();

    expect(wrapper.text()).toContain("子节点 A-1");

    await wrapper.setData({
      rows: [
        {
          id: 2,
          name: "父节点 B",
          status: "启用",
          children: [{ id: 21, name: "子节点 B-1", status: "启用" }]
        }
      ]
    });
    await nextTick();

    expect(wrapper.text()).toContain("子节点 B-1");
  });

  it("tree 数据筛选命中子节点时会保留祖先节点，并在清空筛选后恢复完整可见性", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column
            prop="name"
            label="名称"
            :filters="filters"
          />
        </xy-table>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "父节点",
            status: "启用",
            children: [{ id: 11, name: "命中子节点", status: "启用" }]
          },
          {
            id: 2,
            name: "另一父节点",
            status: "启用",
            children: [{ id: 21, name: "普通子节点", status: "启用" }]
          }
        ],
        filters: [{ text: "命中子节点", value: "命中子节点" }]
      })
    );
    const instance = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-option").trigger("click");
    await nextTick();
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    await nextTick();

    const textsAfterFilter = wrapper.text();
    expect(textsAfterFilter).toContain("父节点");
    expect(textsAfterFilter).toContain("命中子节点");
    expect(textsAfterFilter).not.toContain("另一父节点");
    expect(textsAfterFilter).not.toContain("普通子节点");

    instance.clearFilter();
    await nextTick();

    const textsAfterClear = wrapper.text();
    expect(textsAfterClear).toContain("父节点");
    expect(textsAfterClear).toContain("命中子节点");
    expect(textsAfterClear).toContain("另一父节点");
    expect(textsAfterClear).toContain("普通子节点");
  });

  it("tree 数据排序后会保持展开态，并对子树与根节点同时生效", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column prop="name" label="名称" />
          <xy-table-column prop="score" label="分数" sortable />
        </xy-table>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "父节点 A",
            score: 9,
            status: "启用",
            children: [
              { id: 11, name: "子节点 A-高", score: 8, status: "启用" },
              { id: 12, name: "子节点 A-低", score: 2, status: "启用" }
            ]
          },
          {
            id: 2,
            name: "父节点 B",
            score: 3,
            status: "启用",
            children: [{ id: 21, name: "子节点 B", score: 5, status: "启用" }]
          }
        ]
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("子节点 A-高");
    expect(wrapper.text()).toContain("子节点 A-低");

    await wrapper.findAll(".xy-table__header-cell")[1]?.trigger("click");
    await nextTick();

    const dataRows = wrapper.findAll(".xy-table__body-scroll-view tbody tr.xy-table__row");
    const texts = dataRows.map((row) => row.text());

    expect(texts[0]).toContain("父节点 B");
    expect(texts[1]).toContain("父节点 A");
    expect(texts[2]).toContain("子节点 A-低");
    expect(texts[3]).toContain("子节点 A-高");
  });

  it("lazy 节点加载空数组后不再保留树切换按钮，也不会重复触发 load", async () => {
    const load = vi.fn((_row: Row, _treeNode: unknown, resolve: (rows: Row[]) => void) => {
      resolve([]);
    });
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "空子节点父项", score: 10, status: "启用", hasChildren: true }],
        load
      })
    );

    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(1);
    expect(wrapper.find(".xy-table__tree-toggle").exists()).toBe(false);
  });

  it("lazy 节点在挂起加载期间会显示 loading，重复展开不会重复触发 load", async () => {
    type LoadResolver = (rows: Row[]) => void;

    let resolveLoad!: LoadResolver;
    const load = vi.fn((_row: Row, _treeNode: unknown, resolve: LoadResolver) => {
      resolveLoad = resolve;
    });
    const wrapper = createTableWrapper(
      `
        <xy-table
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "挂起父节点", score: 10, status: "启用", hasChildren: true }],
        load
      })
    );

    await nextTick();

    const toggle = wrapper.find(".xy-table__tree-toggle");
    await toggle.trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(1);
    expect(toggle.classes()).toContain("is-loading");
    expect(toggle.attributes("aria-busy")).toBe("true");

    await toggle.trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(1);

    resolveLoad([{ id: 11, name: "远程子节点", score: 6, status: "启用" } as Row]);
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain("远程子节点");
    expect(wrapper.find(".xy-table__tree-toggle").classes()).not.toContain("is-loading");
  });

  it("lazy 节点挂起加载时调用 updateKeyChildren 会结束 loading 并使用手动子节点", async () => {
    const wrapper = createTableWrapper(
      `
        <xy-table
          ref="tableRef"
          :data="rows"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <xy-table-column prop="name" label="名称" />
        </xy-table>
      `,
      () => ({
        rows: [{ id: 1, name: "挂起父节点", score: 10, status: "启用", hasChildren: true }],
        load: (_row: Row, _treeNode: unknown, _resolve: (rows: Row[]) => void) => {}
      })
    );
    const instance = wrapper.getComponent({ name: "XyTable" }).vm as unknown as TableInstance<Row>;

    await nextTick();

    await wrapper.find(".xy-table__tree-toggle").trigger("click");
    await nextTick();

    expect(wrapper.find(".xy-table__tree-toggle").classes()).toContain("is-loading");

    instance.updateKeyChildren(1, [
      { id: 11, name: "手动注入子节点", score: 5, status: "启用" } as Row
    ]);
    await nextTick();

    expect(wrapper.find(".xy-table__tree-toggle").classes()).not.toContain("is-loading");
    expect(wrapper.text()).toContain("手动注入子节点");
  });
});
