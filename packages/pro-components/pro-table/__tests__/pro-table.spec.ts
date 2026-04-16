import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyProTable, XySearchForm } from "@xiaoye/pro-components";
import type { ProTableColumn } from "@xiaoye/pro-components";
import { XyTag } from "@xiaoye/components";

interface Row {
  id: number;
  name: string;
  owner?: string;
  score?: number;
  status: "启用" | "停用";
}

function mountHost(template: string, data: () => Record<string, unknown>, methods = {}) {
  return mount({
    components: {
      XyProTable,
      XySearchForm,
      XyTag
    },
    template,
    data,
    methods
  });
}

describe("XyProTable", () => {
  it("支持工具栏动作、工具栏插槽、搜索区和分页联动", async () => {
    const columns: ProTableColumn<Row>[] = [
      {
        prop: "name",
        label: "名称"
      },
      {
        prop: "status",
        label: "状态",
        slot: "status"
      }
    ];

    const wrapper = mountHost(
      `
        <xy-pro-table
          title="成员列表"
          description="统一承接工具栏、搜索区和分页联动。"
          :data="rows"
          :columns="columns"
          :toolbar-actions="actions"
          :total="30"
          :table-props="{ rowKey: 'id' }"
          @toolbar-action="toolbarEvents.push($event)"
          @update:current-page="pageEvents.push($event)"
          @page-change="handlePageChange"
        >
          <template #toolbar-main>
            <div class="toolbar-main-slot">自定义标题区</div>
          </template>
          <template #toolbar-left>
            <span class="toolbar-left-slot">批量操作</span>
          </template>
          <template #toolbar-right>
            <span class="toolbar-right-slot">更多操作</span>
          </template>
          <template #search>
            <xy-search-form :model="searchModel" :fields="searchFields" />
          </template>
          <template #status="{ row }">
            <span class="status-slot">状态：{{ row.status }}</span>
          </template>
        </xy-pro-table>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "账单中心",
            status: "启用"
          }
        ],
        columns,
        actions: [
          {
            key: "create",
            label: "新建成员",
            type: "primary"
          }
        ],
        searchModel: {
          keyword: "账单"
        },
        searchFields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input"
          }
        ],
        toolbarEvents: [] as Array<{ key: string }>,
        pageEvents: [] as number[],
        pageChangeEvents: [] as Array<[number, number]>
      }),
      {
        handlePageChange(
          this: { pageChangeEvents: Array<[number, number]> },
          page: number,
          pageSize: number
        ) {
          this.pageChangeEvents.push([page, pageSize]);
        }
      }
    );

    expect(wrapper.text()).toContain("自定义标题区");
    expect(wrapper.find(".toolbar-left-slot").exists()).toBe(true);
    expect(wrapper.find(".toolbar-right-slot").exists()).toBe(true);
    expect(wrapper.find(".xy-search-form").exists()).toBe(true);
    expect(wrapper.find(".status-slot").text()).toContain("状态：启用");

    await wrapper.get(".xy-button--primary").trigger("click");

    expect((wrapper.vm as unknown as { toolbarEvents: Array<{ key: string }> }).toolbarEvents[0]).toMatchObject({
      key: "create"
    });

    await wrapper.get(".xy-pagination__button--next").trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as { pageEvents: number[] }).pageEvents).toEqual([2]);
    expect((wrapper.vm as unknown as { pageChangeEvents: Array<[number, number]> }).pageChangeEvents).toEqual([
      [2, 10]
    ]);
  });

  it("loading 优先于 empty，且 loading 关闭后空态可见", async () => {
    const wrapper = mountHost(
      `
        <xy-pro-table :data="rows" :columns="columns" :loading="loading">
          <template #loading>
            <div class="loading-slot">加载中</div>
          </template>
          <template #empty>
            <div class="empty-slot">暂无结果</div>
          </template>
        </xy-pro-table>
      `,
      () => ({
        loading: true,
        rows: [] as Row[],
        columns: [
          {
            prop: "name",
            label: "名称"
          }
        ] as ProTableColumn<Row>[]
      })
    );

    expect(wrapper.find(".loading-slot").exists()).toBe(true);
    expect(wrapper.find(".empty-slot").exists()).toBe(false);

    await wrapper.setData({
      loading: false
    });
    await nextTick();

    expect(wrapper.find(".empty-slot").exists()).toBe(true);
  });

  it("支持 children、hidden、footer-meta 和分页边界", async () => {
    const wrapper = mountHost(
      `
        <div>
          <xy-pro-table
            class="without-pagination"
            :data="rows"
            :columns="nestedColumns"
            :pagination="false"
          >
            <template #footer-meta>
              <span class="footer-meta">当前无分页</span>
            </template>
          </xy-pro-table>
          <xy-pro-table
            class="without-total"
            :data="rows"
            :columns="nestedColumns"
          />
        </div>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "账单中心",
            owner: "小叶",
            status: "启用"
          }
        ],
        nestedColumns: [
          {
            label: "基础信息",
            children: [
              {
                prop: "name",
                label: "名称"
              },
              {
                prop: "owner",
                label: "负责人",
                hidden: true
              }
            ]
          },
          {
            prop: "status",
            label: "状态"
          }
        ] as ProTableColumn<Row>[]
      })
    );

    expect(wrapper.text()).toContain("基础信息");
    expect(wrapper.findAll(".xy-table__header-row").length).toBeGreaterThan(1);
    expect(wrapper.text()).not.toContain("负责人");
    expect(wrapper.find(".footer-meta").exists()).toBe(true);
    expect(wrapper.find(".without-pagination .xy-pagination").exists()).toBe(false);
    expect(wrapper.find(".without-total .xy-pagination").exists()).toBe(false);
  });

  it("会完整转发表格事件并暴露实例方法", async () => {
    const wrapper = mountHost(
      `
        <div>
          <xy-pro-table
            ref="tableRef"
            :data="rows"
            :columns="columns"
            :total="8"
          :table-props="{ rowKey: 'id' }"
          @row-click="rowClickEvents.push($event)"
          @selection-change="selectionEvents.push($event)"
          @sort-change="sortEvents.push($event)"
          @filter-change="filterEvents.push($event)"
          @expand-change="handleExpandChange"
        >
            <template #expand="{ row }">
              <div class="expanded-row">{{ row.name }}</div>
            </template>
          </xy-pro-table>
          <button class="invoke-methods" @click="invokeMethods">调用实例方法</button>
        </div>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "账单中心",
            score: 90,
            status: "启用"
          },
          {
            id: 2,
            name: "成员工作台",
            score: 80,
            status: "停用"
          }
        ],
        columns: [
          {
            type: "selection"
          },
          {
            type: "expand",
            slot: "expand"
          },
          {
            prop: "name",
            label: "名称",
            sortable: true
          },
          {
            prop: "status",
            label: "状态",
            filters: [
              { text: "启用", value: "启用" },
              { text: "停用", value: "停用" }
            ]
          }
        ] as ProTableColumn<Row>[],
        rowClickEvents: [] as Array<Row>,
        selectionEvents: [] as Array<Row[]>,
        sortEvents: [] as Array<{ prop?: string; order?: string | null }>,
        filterEvents: [] as Array<Record<string, unknown>>,
        expandEvents: [] as Array<[Row, Row[] | boolean]>,
        selectedRowsSnapshot: [] as Row[]
      }),
      {
        handleExpandChange(
          this: { expandEvents: Array<[Row, Row[] | boolean]> },
          row: Row,
          expandedRows: Row[] | boolean
        ) {
          this.expandEvents.push([row, expandedRows]);
        },
        invokeMethods(this: {
          $refs: { tableRef?: { toggleRowSelection: (row: Row, selected?: boolean) => void; getSelectionRows: () => Row[]; sort: (prop: string, order: "ascending" | "descending" | null) => void; clearSort: () => void; refreshLayout: () => void; scrollTo: (left: number, top?: number) => void } };
          rows: Row[];
          selectedRowsSnapshot: Row[];
        }) {
          this.$refs.tableRef?.toggleRowSelection(this.rows[0], true);
          this.$refs.tableRef?.sort("name", "ascending");
          this.$refs.tableRef?.clearSort();
          this.$refs.tableRef?.refreshLayout();
          this.$refs.tableRef?.scrollTo(0, 0);
          this.selectedRowsSnapshot = this.$refs.tableRef?.getSelectionRows() ?? [];
        }
      }
    );

    await wrapper.find(".xy-table__row").trigger("click");
    await nextTick();
    expect((wrapper.vm as unknown as { rowClickEvents: Row[] }).rowClickEvents).toHaveLength(1);

    await wrapper.find(".xy-table__filter-trigger").trigger("click");
    await nextTick();
    await wrapper.find(".xy-table__filter-option").trigger("click");
    await nextTick();
    await wrapper.find(".xy-table__filter-panel-action").trigger("click");
    await nextTick();
    expect((wrapper.vm as unknown as { filterEvents: Array<Record<string, unknown>> }).filterEvents[0]).toEqual({
      status: ["启用"]
    });

    await wrapper.find(".xy-table__expand-trigger").trigger("click");
    await nextTick();
    expect(wrapper.find(".expanded-row").exists()).toBe(true);
    expect((wrapper.vm as unknown as { expandEvents: Array<[Row, Row[] | boolean]> }).expandEvents).toHaveLength(1);

    await wrapper.find(".invoke-methods").trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as { selectionEvents: Array<Row[]> }).selectionEvents.at(-1)).toEqual([
      {
        id: 1,
        name: "账单中心",
        score: 90,
        status: "启用"
      }
    ]);
    expect((wrapper.vm as unknown as { sortEvents: Array<{ prop?: string; order?: string | null }> }).sortEvents.some((item) => item.prop === "name")).toBe(true);
    expect((wrapper.vm as unknown as { selectedRowsSnapshot: Row[] }).selectedRowsSnapshot).toHaveLength(1);
  });

  it("允许在 search 插槽中组合 SearchForm", () => {
    const wrapper = mountHost(
      `
        <xy-pro-table :data="rows" :columns="columns">
          <template #search>
            <xy-search-form :model="searchModel" :fields="searchFields" />
          </template>
        </xy-pro-table>
      `,
      () => ({
        rows: [] as Row[],
        columns: [
          {
            prop: "name",
            label: "名称"
          }
        ] as ProTableColumn<Row>[],
        searchModel: {
          keyword: ""
        },
        searchFields: [
          {
            prop: "keyword",
            label: "关键词",
            component: "input"
          }
        ]
      })
    );

    expect(wrapper.find(".xy-search-form").exists()).toBe(true);
  });
});
