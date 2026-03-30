import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import XyConfigProvider from "../../config-provider";
import XyTable, { XyTableColumn } from "../index";
import type { TableInstance, TableResolvedColumn } from "../index";
import { normalizeColumns } from "../src/util";

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

    const mainRows = wrapper.findAll(".xy-table__body-wrapper > .xy-table__body-table tbody tr");
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

    expect(wrapper.findAll(".xy-table > .xy-table__body-wrapper > .xy-table__body-table tbody > tr")).toHaveLength(3);
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
    const body = wrapper.find(".xy-table__body-wrapper").element as HTMLDivElement;

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

    expect(wrapper.find(".xy-table__body-wrapper").attributes("tabindex")).toBe("3");
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
});
