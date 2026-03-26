import { h, ref, type Component } from "vue";
import {
  type CheckedInfo,
  type RenderContentContext,
  XyTree,
  type TreeInstance,
  type TreeKey,
  type TreeNodeData,
  type TreeOptionProps,
  type TreeProps
} from "xiaoye-components";

const CustomIcon = {} as Component;

const treeProps: TreeProps = {
  data: [
    {
      id: 1,
      label: "控制台",
      children: [{ id: 11, label: "账单" }]
    }
  ],
  nodeKey: "id",
  emptyText: "暂无节点",
  renderAfterExpand: true,
  checkStrictly: false,
  defaultExpandAll: false,
  expandOnClickNode: true,
  checkOnClickNode: false,
  checkOnClickLeaf: true,
  autoExpandParent: true,
  defaultCheckedKeys: [11],
  defaultExpandedKeys: [1],
  currentNodeKey: 1,
  showCheckbox: true,
  lazy: false,
  highlightCurrent: true,
  accordion: false,
  indent: 20,
  icon: CustomIcon,
  props: {
    children: "children",
    label: "label",
    disabled: "disabled",
    isLeaf: (data) => Boolean(data.isLeaf),
    class: (data) => (data.disabled ? "is-disabled" : "")
  },
  filterNodeMethod: (value, data) => String(data.label).includes(String(value)),
  load: (_node, resolve, _reject) => resolve([])
};

const optionProps: TreeOptionProps = {
  label: (data) => String(data.label),
  children: "children",
  disabled: (data) => Boolean(data.disabled),
  isLeaf: "isLeaf",
  class: {
    "is-custom": true
  }
};

void treeProps;
void optionProps;

const nodeData: TreeNodeData = {
  id: 1,
  label: "控制台"
};

const nodeKey: TreeKey = 1;

const checkedInfo: CheckedInfo = {
  checkedKeys: [1],
  checkedNodes: [nodeData],
  halfCheckedKeys: [],
  halfCheckedNodes: []
};

const renderContext = {} as RenderContentContext;

void nodeData;
void nodeKey;
void checkedInfo;
void renderContext;

const treeRef = ref<TreeInstance | null>(null);

treeRef.value?.filter("账单");
treeRef.value?.updateKeyChildren(1, [{ id: 12, label: "替换节点" }]);
treeRef.value?.getCheckedNodes();
treeRef.value?.setCheckedNodes([{ id: 11, label: "账单" }]);
treeRef.value?.getCheckedKeys();
treeRef.value?.setCheckedKeys([11]);
treeRef.value?.setChecked(11, true, true);
treeRef.value?.setChecked({ id: 1, label: "控制台" }, true, false);
treeRef.value?.getHalfCheckedNodes();
treeRef.value?.getHalfCheckedKeys();
treeRef.value?.getCurrentKey();
treeRef.value?.getCurrentNode();
treeRef.value?.setCurrentKey(11);
treeRef.value?.setCurrentNode({ id: 1, label: "控制台" });
treeRef.value?.getNode(1);
treeRef.value?.remove({ id: 11, label: "账单" });
treeRef.value?.append({ id: 2, label: "新增" });
treeRef.value?.insertBefore({ id: 3, label: "前置" }, 2);
treeRef.value?.insertAfter({ id: 4, label: "后置" }, 2);

const vnode = h(
  XyTree,
  {
    data: [{ id: 1, label: "控制台" }],
    nodeKey: "id",
    icon: "mdi:chevron-right"
  },
  {
    default: ({ data }: { data: { label: string } }) => data.label,
    empty: () => "empty"
  }
);

void vnode;

const invalidTreeProps: TreeProps = {
  data: [],
  // @ts-expect-error currentNodeKey should be string or number
  currentNodeKey: {}
};

void invalidTreeProps;
