import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import { XyProTable } from "@xiaoye/pro-components";

const sortableMock = vi.hoisted(() => ({
  instances: [] as Array<{
    options: {
      onEnd?: (payload: {
        oldIndex?: number;
        newIndex?: number;
      }) => void;
    };
  }>
}));

vi.mock("sortablejs", () => ({
  default: {
    create: vi.fn((_element, options) => {
      const instance = {
        options,
        destroy: vi.fn()
      };
      sortableMock.instances.push(instance);
      return instance;
    })
  }
}));

describe("XyProTable drag", () => {
  it("启用 draggableRow / draggableColumn 时会挂载 sortable 并派发事件", async () => {
    const wrapper = mount(XyProTable, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, name: "控制台" },
          { id: 2, name: "账单中心" }
        ],
        columns: [
          { prop: "name", label: "名称" },
          { prop: "id", label: "编号" }
        ],
        draggableRow: true,
        draggableColumn: true,
        tableProps: {
          rowKey: "id"
        }
      }
    });

    await nextTick();
    await nextTick();

    expect(sortableMock.instances).toHaveLength(2);

    sortableMock.instances[0]?.options.onEnd?.({
      oldIndex: 0,
      newIndex: 1
    });

    sortableMock.instances[1]?.options.onEnd?.({
      oldIndex: 0,
      newIndex: 1
    });

    expect(wrapper.emitted("drag-row-change")?.[0]?.[0]).toMatchObject([
      { id: 2, name: "账单中心" },
      { id: 1, name: "控制台" }
    ]);
    expect(wrapper.emitted("drag-column-change")?.[0]?.[0]).toMatchObject([
      { prop: "id", label: "编号" },
      { prop: "name", label: "名称" }
    ]);
  });
});
