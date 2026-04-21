import { flushPromises, mount } from "@vue/test-utils";
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

  it("支持 valueType、formatter、render、renderHTML 和 emptyValue 显示协议", () => {
    const wrapper = mountHost(
      `
        <xy-pro-table :data="rows" :columns="columns" :pagination="false" />
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "成员工作台",
            status: "enabled",
            tags: ["core", "urgent"],
            progress: 76,
            budget: 128000.5,
            updatedAt: "2026-04-18T14:30:00+08:00",
            htmlNote: "可信 <strong class='html-flag'>HTML</strong>",
            emptyNote: null
          }
        ],
        columns: [
          {
            prop: "status",
            label: "状态",
            valueType: "select",
            options: [
              { label: "启用", value: "enabled", status: "success" },
              { label: "停用", value: "disabled", status: "danger" }
            ]
          },
          {
            prop: "tags",
            label: "标签",
            valueType: "tag",
            options: [
              { label: "核心项目", value: "core", status: "primary" },
              { label: "加急", value: "urgent", status: "warning" }
            ]
          },
          {
            prop: "progress",
            label: "进度",
            valueType: "progress"
          },
          {
            prop: "budget",
            label: "预算",
            valueType: "money"
          },
          {
            prop: "updatedAt",
            label: "更新时间",
            valueType: "datetime"
          },
          {
            prop: "emptyNote",
            label: "空值",
            emptyValue: "暂无备注"
          },
          {
            prop: "name",
            label: "格式化",
            formatter: (_row: Row, _column: unknown, value: unknown) =>
              `名称：${String(value ?? "-")}`
          },
          {
            prop: "name",
            key: "render",
            label: "render",
            render: (value: unknown) => h("strong", { class: "render-flag" }, String(value ?? "-"))
          },
          {
            prop: "htmlNote",
            label: "html",
            renderHTML: (value: unknown) => `<span class="html-wrapper">${String(value ?? "")}</span>`
          },
          {
            prop: "name",
            key: "copy",
            label: "copy",
            valueType: "copy"
          }
        ] as ProTableColumn<Row>[]
      })
    );

    expect(wrapper.text()).toContain("启用");
    expect(wrapper.find(".xy-display-value__status-dot.is-success").exists()).toBe(true);
    expect(wrapper.text()).toContain("核心项目");
    expect(wrapper.text()).toContain("加急");
    expect(wrapper.find(".xy-progress").exists()).toBe(true);
    expect(wrapper.text()).toContain("¥128,000.50");
    expect(wrapper.text()).toContain("2026/04/18");
    expect(wrapper.text()).toContain("暂无备注");
    expect(wrapper.text()).toContain("名称：成员工作台");
    expect(wrapper.find(".render-flag").exists()).toBe(true);
    expect(wrapper.find(".html-wrapper .html-flag").exists()).toBe(true);
    expect(wrapper.find(".xy-text__action").exists()).toBe(true);
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

  it("支持 request、视图筛选与工作台动作", async () => {
    const request = vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          name: "发票中心",
          status: "启用"
        }
      ],
      total: 1
    });

    const wrapper = mountHost(
      `
        <xy-pro-table
          title="远程列表"
          :data="[]"
          :columns="columns"
          :request="{ request, requestParams: requestParams, immediate: true }"
          :views="views"
          :workbench="{ refresh: true, filter: true, export: true }"
          @request-success="requestEvents.push($event)"
        />
      `,
      () => ({
        request,
        requestParams: {
          tenantId: "demo"
        },
        requestEvents: [] as Array<Row[]>,
        columns: [
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "status",
            label: "状态"
          }
        ] as ProTableColumn<Row>[],
        views: {
          searchModel: {
            keyword: "发票"
          },
          searchFields: [
            {
              prop: "keyword",
              label: "关键词",
              component: "input"
            }
          ],
          filterModel: {
            status: "enabled"
          },
          filterFields: [
            {
              prop: "status",
              label: "状态",
              component: "select",
              options: [
                {
                  label: "启用",
                  value: "enabled"
                }
              ]
            }
          ],
          savedViews: [
            {
              key: "all",
              label: "全部"
            }
          ]
        }
      })
    );

    await flushPromises();

    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0]?.[0]).toMatchObject({
      tenantId: "demo",
      keyword: "发票",
      status: "enabled",
      activeViewKey: "all"
    });
    expect(wrapper.text()).toContain("全部");
    expect(wrapper.find(".xy-search-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("刷新");
    expect((wrapper.vm as unknown as { requestEvents: Array<Row[]> }).requestEvents).toHaveLength(1);
  });

  it("连续触发 request 时只保留最后一次响应结果", async () => {
    const resolvers: Array<(value: { data: Row[]; total: number }) => void> = [];
    const request = vi.fn(
      () =>
        new Promise<{ data: Row[]; total: number }>((resolve) => {
          resolvers.push(resolve);
        })
    );

    const wrapper = mountHost(
      `
        <xy-pro-table
          :data="[]"
          :columns="columns"
          :request="{ request, requestParams, immediate: true }"
          :table-props="{ rowKey: 'id' }"
          @request-success="requestEvents.push($event)"
        />
      `,
      () => ({
        request,
        requestParams: {
          keyword: "first"
        },
        requestEvents: [] as Array<Row[]>,
        columns: [
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "status",
            label: "状态"
          }
        ] as ProTableColumn<Row>[]
      })
    );

    await nextTick();
    expect(request).toHaveBeenCalledTimes(1);

    await wrapper.setData({
      requestParams: {
        keyword: "second"
      }
    });
    await nextTick();
    expect(request).toHaveBeenCalledTimes(2);

    resolvers[1]?.({
      data: [
        {
          id: 2,
          name: "最新结果",
          status: "启用"
        }
      ],
      total: 1
    });
    await flushPromises();

    expect(wrapper.text()).toContain("最新结果");
    expect((wrapper.vm as unknown as { requestEvents: Array<Row[]> }).requestEvents).toHaveLength(1);

    resolvers[0]?.({
      data: [
        {
          id: 1,
          name: "过期结果",
          status: "停用"
        }
      ],
      total: 1
    });
    await flushPromises();

    expect(wrapper.text()).toContain("最新结果");
    expect(wrapper.text()).not.toContain("过期结果");
    expect((wrapper.vm as unknown as { requestEvents: Array<Row[]> }).requestEvents).toHaveLength(1);
  });

  it("支持编辑态 expose 和批量操作条", async () => {
    const wrapper = mountHost(
      `
        <div>
          <xy-pro-table
            ref="tableRef"
            :data="rows"
            :columns="columns"
            :editable="{ enabled: true, mode: 'row' }"
            :batch-actions="[{ key: 'archive', label: '批量归档' }]"
            :table-select="{ enabled: true, mode: 'multiple' }"
            :table-props="{ rowKey: 'id' }"
            @edit-submit="editEvents.push($event.rows)"
          />
          <button class="start-edit" @click="$refs.tableRef.startEdit(rows[0])">开始编辑</button>
          <button class="submit-edit" @click="$refs.tableRef.submitEdit(rows[0])">提交编辑</button>
        </div>
      `,
      () => ({
        rows: [
          {
            id: 1,
            name: "账单中心",
            status: "启用"
          }
        ],
        columns: [
          {
            type: "selection"
          },
          {
            prop: "name",
            label: "名称",
            editable: true
          },
          {
            prop: "status",
            label: "状态"
          }
        ] as ProTableColumn<Row>[],
        editEvents: [] as Array<Row[]>
      })
    );

    (
      wrapper.vm as unknown as {
        $refs: { tableRef?: { toggleRowSelection: (row: Row, selected?: boolean) => void } };
        rows: Row[];
      }
    ).$refs.tableRef?.toggleRowSelection(
      (wrapper.vm as unknown as { rows: Row[] }).rows[0],
      true
    );
    await nextTick();
    expect(wrapper.find(".xy-pro-table__batch-bar").exists()).toBe(true);

    await wrapper.find(".start-edit").trigger("click");
    await nextTick();
    expect(wrapper.find(".xy-pro-table__edit-footer").exists()).toBe(true);

    await wrapper.find(".submit-edit").trigger("click");
    await nextTick();
    expect((wrapper.vm as unknown as { editEvents: Array<Row[]> }).editEvents).toHaveLength(1);
  });

  it("支持右键菜单、虚拟列表和导出打印入口", async () => {
    const openMock = vi.fn(() => ({
      document: {
        write: vi.fn(),
        close: vi.fn()
      },
      focus: vi.fn(),
      print: vi.fn(),
      close: vi.fn()
    }));
    const createObjectURLMock = vi.fn(() => "blob:demo");
    const revokeObjectURLMock = vi.fn();
    const appendAnchorClick = vi.fn();
    const originalOpen = window.open;
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;

    window.open = openMock as unknown as typeof window.open;
    URL.createObjectURL = createObjectURLMock;
    URL.revokeObjectURL = revokeObjectURLMock;

    const createElementSpy = vi.spyOn(document, "createElement");
    createElementSpy.mockImplementation(((tagName: string) => {
      const element = document.createElementNS("http://www.w3.org/1999/xhtml", tagName) as HTMLElement;

      if (tagName === "a") {
        (element as HTMLAnchorElement).click = appendAnchorClick;
      }

      return element;
    }) as typeof document.createElement);

    const wrapper = mountHost(
      `
        <xy-pro-table
          :data="rows"
          :columns="columns"
          :virtual="{ enabled: true, itemSize: 40, height: 200 }"
          :contextmenu="{ rowItems: [{ key: 'detail', label: '查看详情' }] }"
          :workbench="{ export: true, print: true }"
          :export-options="{ filename: 'members' }"
          :print-options="{ title: '成员列表' }"
          :table-props="{ rowKey: 'id' }"
          @contextmenu-select="contextmenuEvents.push($event)"
          @export="exportEvents.push($event)"
          @print="printEvents.push($event)"
        />
      `,
      () => ({
        rows: Array.from({ length: 60 }, (_, index) => ({
          id: index + 1,
          name: `成员-${index + 1}`,
          status: index % 2 === 0 ? "启用" : "停用"
        })),
        columns: [
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "status",
            label: "状态"
          }
        ] as ProTableColumn<Row>[],
        contextmenuEvents: [] as Array<unknown>,
        exportEvents: [] as Array<unknown>,
        printEvents: [] as Array<unknown>
      })
    );

    await wrapper.find(".xy-table__row").trigger("contextmenu");
    await nextTick();
    expect(document.body.querySelector(".xy-pro-table__contextmenu")).not.toBeNull();

    (document.body.querySelector(".xy-pro-table__contextmenu-item") as HTMLButtonElement)?.click();
    await nextTick();
    expect((wrapper.vm as unknown as { contextmenuEvents: Array<unknown> }).contextmenuEvents).toHaveLength(1);

    expect(wrapper.find(".xy-table__virtual-spacer-row").exists()).toBe(true);

    const toolbarButtons = wrapper.findAll(".xy-pro-table__toolbar-extra .xy-button");
    await toolbarButtons.at(-2)?.trigger("click");
    await toolbarButtons.at(-1)?.trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as { exportEvents: Array<unknown> }).exportEvents).toHaveLength(1);
    expect((wrapper.vm as unknown as { printEvents: Array<unknown> }).printEvents).toHaveLength(1);
    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(appendAnchorClick).toHaveBeenCalledTimes(1);
    expect(openMock).toHaveBeenCalledTimes(1);

    createElementSpy.mockRestore();
    window.open = originalOpen;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });
});
