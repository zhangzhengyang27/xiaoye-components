import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XyTree } from "@xiaoye/components";
import type { TreeInstance } from "@xiaoye/components";

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

afterEach(() => {
  mountedWrappers.forEach((wrapper) => wrapper.unmount());
  mountedWrappers.length = 0;
  document.body.innerHTML = "";
});

const mountedWrappers: VueWrapper[] = [];

const baseTreeData = [
  {
    id: 1,
    label: "一级 1",
    children: [
      {
        id: 11,
        label: "二级 1-1",
        children: [{ id: 111, label: "三级 1-1" }]
      }
    ]
  },
  {
    id: 2,
    label: "一级 2",
    children: [
      { id: 21, label: "二级 2-1" },
      { id: 22, label: "二级 2-2" }
    ]
  }
];

function mountTree(...args: Parameters<typeof mount>) {
  const wrapper = mount(...args);
  mountedWrappers.push(wrapper);
  return wrapper;
}

function createDataTransferMock() {
  const data = new Map<string, string>();

  return {
    effectAllowed: "move",
    dropEffect: "move",
    setData(type: string, value: string) {
      data.set(type, value);
    },
    getData(type: string) {
      return data.get(type) ?? "";
    }
  };
}

function mockRect(
  element: Element,
  {
    top,
    left,
    width,
    height
  }: {
    top: number;
    left: number;
    width: number;
    height: number;
  }
) {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      x: left,
      y: top,
      top,
      left,
      right: left + width,
      bottom: top + height,
      width,
      height,
      toJSON() {
        return this;
      }
    })
  });
}

function mockDragLayout(wrapper: VueWrapper, targetKey: string | number) {
  const root = wrapper.element as HTMLElement;
  root.scrollTop = 0;
  mockRect(root, {
    top: 0,
    left: 0,
    width: 320,
    height: 320
  });

  const target = wrapper.get(`[data-key="${String(targetKey)}"]`);
  const content = target.get(".xy-tree__node-content");
  const anchor = target.find(".xy-tree__expand-icon").exists()
    ? target.get(".xy-tree__expand-icon")
    : target.get(".xy-tree__expand-placeholder");

  mockRect(content.element, {
    top: 100,
    left: 0,
    width: 240,
    height: 40
  });
  mockRect(anchor.element, {
    top: 110,
    left: 8,
    width: 20,
    height: 20
  });
}

describe("XyTree", () => {
  it("在开发态对重复 node-key 发出告警", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    mountTree(XyTree, {
      props: {
        data: [
          { id: 1, label: "节点 1" },
          { id: 1, label: "节点 1-重复" }
        ],
        nodeKey: "id"
      }
    });

    expect(warnSpy).toHaveBeenCalledWith("[Tree] 检测到重复的 node-key：1。请确保树节点 key 全局唯一。");

    warnSpy.mockRestore();
  });

  it("支持基础渲染、空态插槽与 default-expand-all", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true
      },
      slots: {
        empty: "<div class='custom-empty'>没有节点</div>"
      }
    });

    expect(wrapper.findAll(".xy-tree__node")).toHaveLength(6);

    await wrapper.setProps({ data: [] });

    expect(wrapper.find(".custom-empty").text()).toBe("没有节点");
  });

  it("支持节点点击、高亮当前节点与 current-change", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        highlightCurrent: true
      },
      attachTo: document.body
    });

    await wrapper.find(".xy-tree__node-content").trigger("click");

    expect(wrapper.emitted("node-click")?.[0]?.[0]).toMatchObject({ id: 1 });
    expect(wrapper.emitted("current-change")?.[0]?.[0]).toMatchObject({ id: 1 });
    expect(wrapper.find(".xy-tree__node").classes()).toContain("is-current");
  });

  it("支持复选联动、半选状态、check-strictly 与默认勾选", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        showCheckbox: true,
        defaultCheckedKeys: [111]
      }
    });
    const api = wrapper.vm as TreeInstance;

    expect(api.getCheckedKeys()).toEqual([1, 11, 111]);

    const secondCheckbox = wrapper.findAll<HTMLInputElement>(".xy-checkbox__original")[1];
    await secondCheckbox?.setValue(true);

    expect(wrapper.emitted("check")?.length).toBeGreaterThan(0);
    expect(wrapper.emitted("check-change")?.length).toBeGreaterThan(0);

    await wrapper.setProps({ checkStrictly: true });
    api.setCheckedKeys([2]);
    await nextTick();

    expect(api.getCheckedKeys()).toEqual([2]);
  });

  it("支持 defaultExpandedKeys 与 autoExpandParent=true/false 的差异", async () => {
    const wrapperWithAutoExpand = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandedKeys: [111]
      }
    });

    expect(wrapperWithAutoExpand.findAll(".xy-tree__node.is-expanded")).toHaveLength(3);

    const wrapperWithoutAutoExpand = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandedKeys: [11],
        autoExpandParent: false
      }
    });

    expect(wrapperWithoutAutoExpand.findAll(".xy-tree__node.is-expanded")).toHaveLength(0);

    await wrapperWithoutAutoExpand.get('[data-key="1"] .xy-tree__node-content').trigger("click");
    await nextTick();

    expect(wrapperWithoutAutoExpand.findAll(".xy-tree__node.is-expanded")).toHaveLength(2);
  });

  it("支持过滤、自动展开与默认插槽", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        filterNodeMethod: (value: string, data: { label: string }) =>
          !value || data.label.includes(value)
      },
      slots: {
        default: ({ data }: { data: { label: string } }) =>
          h("strong", { class: "custom-label" }, data.label)
      }
    });
    const api = wrapper.vm as TreeInstance;

    expect(wrapper.find(".custom-label").text()).toContain("一级 1");

    api.filter("三级");
    await nextTick();
    await nextTick();

    const visibleLabels = wrapper
      .findAll(".xy-tree__node:not(.is-hidden) .custom-label")
      .map((node) => node.text());

    expect(visibleLabels).toContain("三级 1-1");
    expect(visibleLabels).toContain("一级 1");
  });

  it("支持 filter + lazy 组合下保留祖先链并自动展开已加载分支", async () => {
    const load = vi.fn((node: { level: number; key?: number }, resolve: (data: unknown[]) => void) => {
      if (node.level === 1) {
        resolve([{ id: 11, label: "二级目录" }]);
        return;
      }

      resolve([{ id: 111, label: "命中过滤的节点", isLeaf: true }]);
    });

    const wrapper = mountTree(XyTree, {
      props: {
        data: [{ id: 1, label: "一级目录" }],
        nodeKey: "id",
        lazy: true,
        props: {
          label: "label",
          isLeaf: "isLeaf"
        },
        load,
        filterNodeMethod: (value: string, data: { label: string }) =>
          !value || data.label.includes(value)
      }
    });
    const api = wrapper.vm as TreeInstance;

    await wrapper.get('[data-key="1"] .xy-tree__expand-icon').trigger("click");
    await nextTick();
    await wrapper.get('[data-key="11"] .xy-tree__expand-icon').trigger("click");
    await nextTick();
    await wrapper.get('[data-key="11"] .xy-tree__expand-icon').trigger("click");
    await nextTick();

    api.filter("命中");
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain("命中过滤的节点");
    expect(wrapper.get('[data-key="11"]').classes()).toContain("is-expanded");
  });

  it("支持懒加载、失败重试与 updateKeyChildren", async () => {
    const load = vi
      .fn()
      .mockImplementationOnce((_node, _resolve, reject) => reject())
      .mockImplementationOnce((_node, resolve) =>
        resolve([{ id: 101, label: "懒加载节点", isLeaf: true }])
      );

    const wrapper = mountTree(XyTree, {
      props: {
        data: [{ id: 1, label: "根节点" }],
        nodeKey: "id",
        lazy: true,
        props: {
          label: "label",
          isLeaf: "isLeaf"
        },
        load
      }
    });
    const api = wrapper.vm as TreeInstance;
    const expandIcon = wrapper.find(".xy-tree__expand-icon");

    await expandIcon.trigger("click");
    await nextTick();

    expect(wrapper.get('[data-key="1"]').classes()).toContain("is-load-failed");
    expect(wrapper.text()).toContain("加载失败，点击重试");

    await expandIcon.trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain("懒加载节点");
    expect(wrapper.get('[data-key="1"]').classes()).not.toContain("is-load-failed");

    api.updateKeyChildren(1, [{ id: 102, label: "替换后的节点" }]);
    await nextTick();

    expect(wrapper.text()).toContain("替换后的节点");
  });

  it("支持 props.isLeaf 在懒加载下提前标记叶子节点", async () => {
    const load = vi.fn();
    const wrapper = mountTree(XyTree, {
      props: {
        data: [{ id: 1, label: "叶子节点", isLeaf: true }],
        nodeKey: "id",
        lazy: true,
        props: {
          label: "label",
          isLeaf: "isLeaf"
        },
        load
      }
    });

    expect(wrapper.find(".xy-tree__expand-icon").exists()).toBe(false);

    await wrapper.get('[data-key="1"] .xy-tree__node-content').trigger("click");

    expect(load).not.toHaveBeenCalled();
  });

  it("支持 render-content、实例方法与节点增删改", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true,
        showCheckbox: true,
        renderContent: (_render: typeof h, { data }: { data: { label: string } }) =>
          h("span", { class: "rendered-label" }, `${data.label}-自定义`)
      }
    });
    const api = wrapper.vm as TreeInstance;

    expect(wrapper.find(".rendered-label").text()).toContain("自定义");

    api.setCurrentKey(11);
    api.setCheckedKeys([111]);
    api.append({ id: 3, label: "新增节点" });
    await nextTick();

    expect(api.getCurrentKey()).toBe(11);
    expect(api.getCheckedKeys()).toEqual([1, 11, 111]);
    expect(wrapper.text()).toContain("新增节点");

    api.insertBefore({ id: 31, label: "前置节点" }, 3);
    api.insertAfter({ id: 32, label: "后置节点" }, 3);
    api.remove({ id: 3, label: "新增节点" });
    await nextTick();

    expect(wrapper.text()).toContain("前置节点");
    expect(wrapper.text()).toContain("后置节点");
  });

  it("支持 setCheckedKeys 的 leafOnly 一致性", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        showCheckbox: true
      }
    });
    const api = wrapper.vm as TreeInstance;

    api.setCheckedKeys([1], true);
    await nextTick();

    expect(api.getCheckedKeys().sort()).toEqual([1, 11, 111]);
    expect(api.getHalfCheckedKeys()).toEqual([]);
    expect(api.getHalfCheckedNodes()).toEqual([]);
  });

  it("支持 setCurrentKey / setCurrentNode 自动展开父链但不展开自身", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id"
      }
    });
    const api = wrapper.vm as TreeInstance;

    api.setCurrentKey(1);
    await nextTick();
    expect(wrapper.findAll(".xy-tree__node.is-expanded")).toHaveLength(0);

    api.setCurrentKey(11);
    await nextTick();
    expect(wrapper.findAll(".xy-tree__node.is-expanded")).toHaveLength(1);

    api.setCurrentNode({ id: 111, label: "三级 1-1" });
    await nextTick();
    expect(wrapper.findAll(".xy-tree__node.is-expanded")).toHaveLength(2);
    expect(wrapper.findAll(".xy-tree__node.is-current")).toHaveLength(1);
  });

  it("支持键盘在可见节点间移动与触发展开", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id"
      },
      attachTo: document.body
    });

    await wrapper.trigger("focus");
    await nextTick();

    const firstNode = wrapper.find(".xy-tree__node");
    await firstNode.trigger("keydown", { key: "ArrowRight" });
    await nextTick();

    expect(wrapper.text()).toContain("二级 1-1");
  });

  it("支持 check-on-click-leaf 控制叶子节点点击勾选", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        showCheckbox: true,
        defaultExpandAll: true,
        checkOnClickLeaf: false
      }
    });
    const api = wrapper.vm as TreeInstance;

    await wrapper.get('[data-key="21"] .xy-tree__node-content').trigger("click");

    expect(api.getCheckedKeys()).toEqual([]);

    await wrapper.get('[data-key="21"] .xy-checkbox__original').setValue(true);

    expect(api.getCheckedKeys()).toEqual([21]);
  });

  it("在非 show-checkbox 模式下不会因为节点点击产生 checkedNodes", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true
      }
    });
    const api = wrapper.vm as TreeInstance;

    await wrapper.get('[data-key="21"] .xy-tree__node-content').trigger("click");

    expect(api.getCheckedNodes()).toEqual([]);
    expect(api.getCheckedKeys()).toEqual([]);
  });

  it("支持 node-contextmenu 事件", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true
      }
    });

    await wrapper.get('[data-key="21"]').trigger("contextmenu");

    expect(wrapper.emitted("node-contextmenu")?.[0]?.[1]).toMatchObject({ id: 21 });
  });

  it("支持 props.class 的字符串和函数形式", async () => {
    const wrapperWithStringClass = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        props: {
          class: "is-manual-class"
        }
      }
    });

    expect(wrapperWithStringClass.get('[data-key="1"]').classes()).toContain("is-manual-class");

    const wrapperWithFunctionClass = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true,
        props: {
          class: (data: { id: number }) => (data.id === 21 ? "is-leaf-hit" : "")
        }
      }
    });

    expect(wrapperWithFunctionClass.get('[data-key="21"]').classes()).toContain("is-leaf-hit");
  });

  it("支持 exposes 的边界使用：getNode、setCurrentNode、setCheckedNodes", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true,
        showCheckbox: true
      }
    });
    const api = wrapper.vm as TreeInstance;
    const targetNode = api.getNode(11);

    expect(targetNode).not.toBeNull();
    expect(api.getNode(999)).toBeNull();

    api.setCurrentNode(targetNode!);
    api.setCheckedNodes([{ id: 21, label: "二级 2-1" }], true);
    await nextTick();

    expect(api.getCurrentKey()).toBe(11);
    expect(api.getCheckedKeys()).toEqual([21]);
  });

  it("支持过滤后的键盘导航只在可见节点间移动", async () => {
    const wrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true,
        filterNodeMethod: (value: string, data: { label: string }) =>
          !value || data.label.includes(value)
      }
    });
    const api = wrapper.vm as TreeInstance;

    api.filter("2-1");
    await nextTick();
    await nextTick();

    const firstVisibleNode = wrapper.get('[data-key="2"]');
    (firstVisibleNode.element as HTMLElement).focus();
    await firstVisibleNode.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    expect((document.activeElement as HTMLElement | null)?.dataset.key).toBe("21");
  });

  it("支持多棵树实例并存时的键盘导航隔离", async () => {
    const wrapper = mount({
      attachTo: document.body,
      components: {
        XyTree
      },
      data() {
        return {
          rows: [
            { id: 1, label: "one" },
            { id: 2, label: "two" }
          ]
        };
      },
      template: `
        <div>
          <xy-tree :data="rows" node-key="id" default-expand-all />
          <xy-tree :data="rows" node-key="id" default-expand-all />
        </div>
      `
    });
    mountedWrappers.push(wrapper);

    const treeWrappers = wrapper.findAllComponents(XyTree);
    const secondTreeNodes = treeWrappers[1]?.findAll('[role="treeitem"]') ?? [];
    let focused = false;

    Object.defineProperty(secondTreeNodes[1]?.element ?? {}, "focus", {
      configurable: true,
      value: () => {
        focused = true;
      }
    });

    await secondTreeNodes[0]?.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    expect(focused).toBe(true);
  });

  it("支持键盘导航跳过 disabled 节点", async () => {
    const wrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "一级 1" },
          { id: 2, label: "一级 2", disabled: true },
          { id: 3, label: "一级 3" }
        ],
        nodeKey: "id",
        props: {
          disabled: "disabled",
          label: "label"
        }
      }
    });

    const first = wrapper.get('[data-key="1"]');
    (first.element as HTMLElement).focus();
    await first.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    expect((document.activeElement as HTMLElement | null)?.dataset.key).toBe("3");
  });

  it("补齐 aria 语义：树节点层级、选中态与集合位置信息", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true,
        highlightCurrent: true,
        currentNodeKey: 21,
        showCheckbox: true
      }
    });

    const target = wrapper.get('[data-key="21"]');

    expect(wrapper.attributes("aria-multiselectable")).toBe("true");
    expect(target.attributes("aria-level")).toBe("2");
    expect(target.attributes("aria-selected")).toBe("true");
    expect(target.attributes("aria-posinset")).toBe("1");
    expect(target.attributes("aria-setsize")).toBe("2");
  });

  it("支持 getNodePath，并在缺失 node-key 时抛错", () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        defaultExpandAll: true
      }
    });
    const api = wrapper.vm as TreeInstance & {
      getNodePath: (data: number) => Array<{ label: string }>;
    };

    expect(api.getNodePath(111).map((item) => item.label)).toEqual(["一级 1", "二级 1-1", "三级 1-1"]);
    expect(api.getNodePath(999)).toEqual([]);

    const noKeyWrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData)
      }
    });
    const noKeyApi = noKeyWrapper.vm as TreeInstance & {
      getNodePath: (data: number) => Array<{ label: string }>;
    };

    expect(() => noKeyApi.getNodePath(1)).toThrow("[Tree] nodeKey is required in getNodePath");
  });

  it("支持重复设置 currentKey 时始终只保留一个当前高亮节点", async () => {
    const rows = ref<Array<{ id: number; label: string; children?: Array<{ id: number; label: string; children?: Array<{ id: number; label: string }> }> }>>(structuredClone(baseTreeData));
    const wrapper = mount({
      components: {
        XyTree
      },
      setup() {
        return {
          rows
        };
      },
      template: `
        <xy-tree
          :data="rows"
          node-key="id"
          highlight-current
        />
      `
    });
    mountedWrappers.push(wrapper);
    const api = wrapper.findComponent(XyTree).vm as TreeInstance;

    api.setCurrentKey(1);
    await nextTick();
    expect(wrapper.findAll(".xy-tree__node.is-current")).toHaveLength(1);

    rows.value = [
      ...rows.value,
      {
        id: 4,
        label: "一级 4"
      }
    ];
    await nextTick();

    api.setCurrentKey(4);
    await nextTick();

    expect(wrapper.findAll(".xy-tree__node.is-current")).toHaveLength(1);
    expect(wrapper.get('[data-key="4"]').classes()).toContain("is-current");
  });

  it("支持 custom children / label 映射与动态数据更新", async () => {
    const rows = ref([
      {
        id: 1,
        l: "一级 1",
        c: [{ id: 11, l: "二级 1-1" }]
      }
    ]);

    const wrapper = mount({
      components: {
        XyTree
      },
      setup() {
        return {
          rows
        };
      },
      template: `
        <xy-tree
          :data="rows"
          node-key="id"
          default-expand-all
          :props="{ children: 'c', label: 'l' }"
        />
      `
    });
    mountedWrappers.push(wrapper);
    const api = wrapper.findComponent(XyTree).vm as TreeInstance;

    expect((api.getNode(1)?.data as { l: string } | undefined)?.l).toBe("一级 1");

    rows.value[0]?.c?.push({ id: 12, l: "新增节点" });
    rows.value = [...rows.value];
    await nextTick();

    expect((api.getNode(12)?.data as { l: string } | undefined)?.l).toBe("新增节点");
    expect(wrapper.text()).toContain("新增节点");
  });

  it("支持 renderAfterExpand=false 时先渲染子节点结构", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: structuredClone(baseTreeData),
        nodeKey: "id",
        renderAfterExpand: false
      }
    });

    expect(wrapper.find('[data-key="11"]').exists()).toBe(true);
    expect(wrapper.get('[data-key="11"]').isVisible()).toBe(false);

    await wrapper.get('[data-key="1"] .xy-tree__node-content').trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain("二级 1-1");
    expect(wrapper.get('[data-key="1"]').classes()).toContain("is-expanded");
  });

  it("支持 empty 插槽渲染", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: []
      },
      slots: {
        empty: "<div class='tree-empty-slot'>EmptySlot</div>"
      }
    });

    expect(wrapper.get(".tree-empty-slot").text()).toBe("EmptySlot");
  });

  it("支持 defaultCheckedKeys 与 disabled 节点组合的一致性", async () => {
    const wrapper = mountTree(XyTree, {
      props: {
        data: [
          {
            id: "1",
            label: "node-1",
            children: [
              { id: "1-1", label: "node-1-1" },
              { id: "1-2", label: "node-1-2", disabled: true }
            ]
          }
        ],
        nodeKey: "id",
        showCheckbox: true,
        defaultExpandAll: true,
        defaultCheckedKeys: ["1-1", "1-2"],
        props: {
          disabled: "disabled",
          label: "label"
        }
      }
    });
    const api = wrapper.vm as TreeInstance;

    expect(api.getCheckedKeys().sort()).toEqual(["1", "1-1", "1-2"]);
  });

  it("支持 lazy + disabled 节点时的勾选一致性", async () => {
    const load = vi.fn((node, resolve) => {
      if (node.level === 0) {
        resolve([{ id: "a", label: "a" }]);
        return;
      }

      resolve([
        { id: "b", label: "b", isLeaf: true, disabled: true },
        { id: "c", label: "c" }
      ]);
    });

    const wrapper = mountTree(XyTree, {
      props: {
        data: [],
        nodeKey: "id",
        showCheckbox: true,
        lazy: true,
        load,
        props: {
          label: "label",
          disabled: "disabled",
          isLeaf: "isLeaf"
        }
      }
    });
    const api = wrapper.vm as TreeInstance;

    await wrapper.get('[data-key="a"] .xy-tree__expand-icon').trigger("click");
    await nextTick();
    await nextTick();

    await wrapper.findAll<HTMLInputElement>(".xy-checkbox__original")[0]?.setValue(true);

    expect(api.getCheckedKeys()).toEqual(["c"]);
  });

  it("支持 checkDescendants=false 时不在懒节点勾选时加载后代", async () => {
    const load = vi.fn((_node, resolve) => resolve([{ id: 11, label: "子节点", isLeaf: true }]));
    const wrapper = mountTree(XyTree, {
      props: {
        data: [{ id: 1, label: "根节点" }],
        nodeKey: "id",
        showCheckbox: true,
        lazy: true,
        props: {
          label: "label",
          isLeaf: "isLeaf"
        },
        load,
        checkDescendants: false
      }
    });
    const api = wrapper.vm as TreeInstance;

    api.setChecked(1, true, true);
    await nextTick();

    expect(load).not.toHaveBeenCalled();
    expect(api.getCheckedKeys()).toEqual([1]);
  });

  it("支持 checkDescendants=true 时在懒节点勾选时加载后代", async () => {
    const load = vi.fn((_node, resolve) => resolve([{ id: 11, label: "子节点", isLeaf: true }]));
    const wrapper = mountTree(XyTree, {
      props: {
        data: [{ id: 1, label: "根节点" }],
        nodeKey: "id",
        showCheckbox: true,
        lazy: true,
        props: {
          label: "label",
          isLeaf: "isLeaf"
        },
        load,
        checkDescendants: true
      }
    });
    const api = wrapper.vm as TreeInstance;

    api.setChecked(1, true, true);
    await nextTick();
    await nextTick();

    expect(load).toHaveBeenCalledTimes(1);
    expect(api.getCheckedKeys()).toEqual([1, 11]);
  });

  it("支持 checkStrictly 与 checkDescendants 组合时保持严格模式优先", async () => {
    const load = vi.fn((_node, resolve) => resolve([{ id: 11, label: "子节点", isLeaf: true }]));
    const wrapper = mountTree(XyTree, {
      props: {
        data: [{ id: 1, label: "根节点" }],
        nodeKey: "id",
        showCheckbox: true,
        lazy: true,
        props: {
          label: "label",
          isLeaf: "isLeaf"
        },
        load,
        checkDescendants: true,
        checkStrictly: true
      }
    });
    const api = wrapper.vm as TreeInstance;

    api.setChecked(1, true, true);
    await nextTick();

    expect(load).not.toHaveBeenCalled();
    expect(api.getCheckedKeys()).toEqual([1]);
  });

  it("支持 lazy 且无 node-key 时的键盘导航容错", async () => {
    const wrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [{ label: "region1" }, { label: "region2" }],
        lazy: true,
        load: (
          node: { level: number; data?: { label?: string } },
          resolve: (data: Array<{ label: string }>) => void
        ) => {
          if (node.level === 0) {
            resolve([{ label: "region1" }, { label: "region2" }]);
            return;
          }

          if ((node.data as { label?: string } | undefined)?.label === "region1") {
            resolve([{ label: "zone1" }, { label: "zone2" }]);
            return;
          }

          resolve([]);
        },
        props: {
          label: "label",
          children: "children"
        }
      }
    });

    await nextTick();
    const firstNode = wrapper.findAll('[role="treeitem"]')[0];
    const secondNode = wrapper.findAll('[role="treeitem"]')[1];
    let focused = false;

    Object.defineProperty(secondNode?.element ?? {}, "focus", {
      configurable: true,
      value: () => {
        focused = true;
      }
    });

    await firstNode?.trigger("keydown", { key: "ArrowDown" });
    expect(focused).toBe(true);
  });

  it("支持 draggable 的 after 落点和事件顺序", async () => {
    const wrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "节点 1" },
          { id: 2, label: "节点 2" }
        ],
        nodeKey: "id",
        draggable: true
      }
    });
    const api = wrapper.vm as TreeInstance;
    const dataTransfer = createDataTransferMock();
    const source = wrapper.get('[data-key="1"]');
    const target = wrapper.get('[data-key="2"]');

    mockDragLayout(wrapper, 2);

    await source.trigger("dragstart", { dataTransfer });
    await target.trigger("dragover", { dataTransfer, clientY: 139 });
    await source.trigger("dragend", { dataTransfer });
    await nextTick();

    expect(wrapper.emitted("node-drag-start")?.length).toBe(1);
    expect(wrapper.emitted("node-drag-enter")?.length).toBe(1);
    expect(wrapper.emitted("node-drag-over")?.length).toBe(1);
    expect(wrapper.emitted("node-drag-end")?.[0]?.[2]).toBe("after");
    expect(wrapper.emitted("node-drop")?.[0]?.[2]).toBe("after");
    expect(wrapper.emitted("node-drop")?.[0]?.[4]).toMatchObject({
      oldParent: null,
      newParent: null,
      oldIndex: 0,
      newIndex: 1
    });
    expect((api.getNode(1) as any)?.previousSibling?.key).toBe(2);
  });

  it("支持 draggable 的 before 和 inner 落点", async () => {
    const beforeWrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "节点 1" },
          { id: 2, label: "节点 2" }
        ],
        nodeKey: "id",
        draggable: true
      }
    });
    const beforeApi = beforeWrapper.vm as TreeInstance;
    const beforeDataTransfer = createDataTransferMock();

    mockDragLayout(beforeWrapper, 1);

    await beforeWrapper.get('[data-key="2"]').trigger("dragstart", { dataTransfer: beforeDataTransfer });
    await beforeWrapper.get('[data-key="1"]').trigger("dragover", {
      dataTransfer: beforeDataTransfer,
      clientY: 101
    });
    await beforeWrapper.get('[data-key="2"]').trigger("dragend", { dataTransfer: beforeDataTransfer });
    await nextTick();

    expect(beforeWrapper.emitted("node-drop")?.[0]?.[2]).toBe("before");
    expect((beforeApi.getNode(2) as any)?.nextSibling?.key).toBe(1);

    const innerWrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "节点 1" },
          { id: 2, label: "节点 2" }
        ],
        nodeKey: "id",
        draggable: true
      }
    });
    const innerApi = innerWrapper.vm as TreeInstance;
    const innerDataTransfer = createDataTransferMock();

    mockDragLayout(innerWrapper, 2);

    await innerWrapper.get('[data-key="1"]').trigger("dragstart", { dataTransfer: innerDataTransfer });
    await innerWrapper.get('[data-key="2"]').trigger("dragover", {
      dataTransfer: innerDataTransfer,
      clientY: 120
    });
    await innerWrapper.get('[data-key="1"]').trigger("dragend", { dataTransfer: innerDataTransfer });
    await nextTick();

    expect(innerWrapper.emitted("node-drop")?.[0]?.[2]).toBe("inner");
    expect((innerApi.getNode(2) as any)?.childNodes?.[0]?.key).toBe(1);
  });

  it("支持 allowDrag / allowDrop 拦截拖拽", async () => {
    const blockedDragWrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "节点 1" },
          { id: 2, label: "节点 2" }
        ],
        nodeKey: "id",
        draggable: true,
        allowDrag: (node: { key: number }) => node.key !== 1
      }
    });
    const blockedTransfer = createDataTransferMock();

    await blockedDragWrapper.get('[data-key="1"]').trigger("dragstart", { dataTransfer: blockedTransfer });

    expect(blockedDragWrapper.emitted("node-drag-start")).toBeUndefined();

    const blockedDropWrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "节点 1" },
          { id: 2, label: "节点 2" }
        ],
        nodeKey: "id",
        draggable: true,
        allowDrop: () => false
      }
    });
    const blockedDropApi = blockedDropWrapper.vm as TreeInstance;
    const blockedDropTransfer = createDataTransferMock();

    mockDragLayout(blockedDropWrapper, 2);

    await blockedDropWrapper.get('[data-key="1"]').trigger("dragstart", { dataTransfer: blockedDropTransfer });
    await blockedDropWrapper.get('[data-key="2"]').trigger("dragover", {
      dataTransfer: blockedDropTransfer,
      clientY: 120
    });
    await blockedDropWrapper.get('[data-key="1"]').trigger("dragend", { dataTransfer: blockedDropTransfer });
    await nextTick();

    expect(blockedDropWrapper.emitted("node-drag-end")?.[0]?.[2]).toBe("none");
    expect(blockedDropWrapper.emitted("node-drop")).toBeUndefined();
    expect((blockedDropApi.getNode(1) as any)?.nextSibling?.key).toBe(2);
  });

  it("支持拖拽悬停自动展开折叠节点", async () => {
    vi.useFakeTimers();

    const wrapper = mountTree(XyTree, {
      attachTo: document.body,
      props: {
        data: [
          { id: 1, label: "节点 1" },
          {
            id: 2,
            label: "节点 2",
            children: [{ id: 21, label: "子节点 2-1" }]
          }
        ],
        nodeKey: "id",
        draggable: true
      }
    });

    const dataTransfer = createDataTransferMock();
    mockDragLayout(wrapper, 2);

    await wrapper.get('[data-key="1"]').trigger("dragstart", { dataTransfer });
    await wrapper.get('[data-key="2"]').trigger("dragover", {
      dataTransfer,
      clientY: 120
    });

    vi.advanceTimersByTime(260);
    await nextTick();

    expect(wrapper.get('[data-key="2"]').classes()).toContain("is-expanded");

    vi.useRealTimers();
  });
});
