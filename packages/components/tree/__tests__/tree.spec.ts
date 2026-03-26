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

describe("XyTree", () => {
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
    await expandIcon.trigger("click");
    await nextTick();

    expect(load).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain("懒加载节点");

    api.updateKeyChildren(1, [{ id: 102, label: "替换后的节点" }]);
    await nextTick();

    expect(wrapper.text()).toContain("替换后的节点");
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
});
