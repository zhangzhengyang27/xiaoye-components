import { reactive } from "vue";
import type TreeStore from "./tree-store";
import { NODE_KEY, getNodeKey, markNodeData } from "./util";
import type {
  FakeNode,
  TreeData,
  TreeKey,
  TreeNodeChildState,
  TreeNodeData,
  TreeNodeLoadedDefaultProps,
  TreeNodeOptions,
  TreeOptionProps
} from "../tree.type";

function getChildState(nodes: Node[]): TreeNodeChildState {
  let all = true;
  let none = true;
  let isEffectivelyChecked = true;

  nodes.forEach((node) => {
    if (node.checked !== true || node.indeterminate) {
      all = false;
    }

    if (node.checked !== false || node.indeterminate) {
      none = false;
    }

    if (!node.isEffectivelyChecked) {
      isEffectivelyChecked = false;
    }
  });

  return {
    all,
    none,
    half: !all && !none,
    isEffectivelyChecked
  };
}

function reInitChecked(node: Node): void {
  if (node.childNodes.length === 0 || node.loading) {
    node.isEffectivelyChecked = node.disabled || node.checked;
    return;
  }

  const { all, none, half, isEffectivelyChecked } = getChildState(node.childNodes);

  node.isEffectivelyChecked = isEffectivelyChecked;

  if (all) {
    node.checked = true;
    node.indeterminate = false;
  } else if (half) {
    node.checked = false;
    node.indeterminate = true;
  } else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }

  const { parent } = node;

  if (!parent || parent.level === 0 || node.store.checkStrictly) {
    return;
  }

  reInitChecked(parent);
}

function getPropertyFromData(node: Node, prop: "children" | "label" | "disabled" | "isLeaf" | "class") {
  const props = node.store.props as TreeOptionProps;
  const data = node.data as TreeNodeData | null;

  if (!data) {
    return undefined;
  }

  const config = (props as Record<string, unknown>)[prop];

  if (typeof config === "function") {
    return config(data, node);
  }

  if (typeof config === "string") {
    return data[config];
  }

  if (config !== undefined) {
    return config;
  }

  return data[prop];
}

let nodeIdSeed = 0;

class Node {
  id = nodeIdSeed++;
  text: string | null = null;
  checked = false;
  indeterminate = false;
  data!: TreeData | TreeNodeData;
  expanded = false;
  parent: Node | null = null;
  visible = true;
  isCurrent = false;
  store!: TreeStore;
  isLeafByUser: boolean | undefined = undefined;
  isLeaf: boolean | undefined = undefined;
  level = 0;
  loaded = false;
  childNodes: Node[] = [];
  loading = false;
  loadFailed = false;
  isEffectivelyChecked = false;

  constructor(options: TreeNodeOptions) {
    Object.assign(this, options);

    if (this.parent) {
      this.level = this.parent.level + 1;
    }
  }

  initialize() {
    if (!this.store) {
      throw new Error("[Tree] store is required");
    }

    this.store.registerNode(this);

    const props = this.store.props;

    if (props.isLeaf !== undefined) {
      const isLeaf = getPropertyFromData(this, "isLeaf");

      if (typeof isLeaf === "boolean") {
        this.isLeafByUser = isLeaf;
      }
    }

    if ((this.level === 0 && Array.isArray(this.data)) || (!this.store.lazy && this.data)) {
      this.setData(this.data);

      if (this.store.defaultExpandAll) {
        this.expanded = true;
      }
    } else if (this.level > 0 && this.store.lazy && this.store.defaultExpandAll && !this.isLeafByUser) {
      this.expand();
    }

    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }

    const defaultExpandedKeys = this.store.defaultExpandedKeys;

    if (
      this.store.key &&
      this.key !== null &&
      defaultExpandedKeys &&
      defaultExpandedKeys.includes(this.key)
    ) {
      this.expand(undefined, this.store.autoExpandParent);
    }

    if (
      this.store.key &&
      this.store.currentNodeKey !== undefined &&
      this.key === this.store.currentNodeKey
    ) {
      if (this.store.currentNode) {
        this.store.currentNode.isCurrent = false;
      }

      this.store.currentNode = this;
      this.store.currentNode.isCurrent = true;
    }

    if (this.store.lazy) {
      this.store._initDefaultCheckedNode(this);
    }

    this.updateLeafState();
  }

  setData(data: TreeData | TreeNodeData): void {
    if (!Array.isArray(data)) {
      markNodeData(this, data);
    }

    this.data = data;
    this.childNodes = [];

    let children: TreeData = [];

    if (this.level === 0 && Array.isArray(this.data)) {
      children = this.data;
    } else {
      const resolvedChildren = getPropertyFromData(this, "children");
      children = Array.isArray(resolvedChildren) ? resolvedChildren : [];
    }

    children.forEach((child) => {
      this.insertChild({ data: child });
    });
  }

  get label(): string {
    const value = getPropertyFromData(this, "label");
    return value == null ? "" : String(value);
  }

  get key(): TreeKey | null {
    if (Array.isArray(this.data)) {
      return null;
    }

    return getNodeKey(this.store.key, this.data) ?? getNodeKey(undefined, this.data) ?? null;
  }

  get disabled(): boolean {
    return Boolean(getPropertyFromData(this, "disabled"));
  }

  get nextSibling(): Node | null {
    if (!this.parent) {
      return null;
    }

    const index = this.parent.childNodes.indexOf(this);
    return index > -1 ? this.parent.childNodes[index + 1] ?? null : null;
  }

  get previousSibling(): Node | null {
    if (!this.parent) {
      return null;
    }

    const index = this.parent.childNodes.indexOf(this);
    return index > 0 ? this.parent.childNodes[index - 1] : null;
  }

  contains(target: Node, deep = true): boolean {
    return this.childNodes.some((child) => child === target || (deep && child.contains(target)));
  }

  remove(): void {
    this.parent?.removeChild(this);
  }

  insertChild(child?: FakeNode | Node, index?: number, batch = false): void {
    if (!child) {
      throw new Error("[Tree] insertChild requires child");
    }

    let insertedNode: Node;

    if (child instanceof Node) {
      insertedNode = child;
    } else {
      if (!batch) {
        const children = this.getChildren(true);

        if (children && !children.includes(child.data)) {
          if (index === undefined || index < 0) {
            children.push(child.data);
          } else {
            children.splice(index, 0, child.data);
          }
        }
      }

      insertedNode = reactive(
        new Node({
          data: child.data,
          parent: this,
          store: this.store
        })
      ) as Node;

      insertedNode.initialize();
    }

    insertedNode.level = this.level + 1;
    insertedNode.parent = this;

    if (index === undefined || index < 0) {
      this.childNodes.push(insertedNode);
    } else {
      this.childNodes.splice(index, 0, insertedNode);
    }

    this.updateLeafState();
  }

  insertBefore(child: FakeNode | Node, ref: Node): void {
    const index = this.childNodes.indexOf(ref);
    this.insertChild(child, index);
  }

  insertAfter(child: FakeNode | Node, ref: Node): void {
    const index = this.childNodes.indexOf(ref);
    this.insertChild(child, index === -1 ? undefined : index + 1);
  }

  removeChild(child: Node): void {
    const children = this.getChildren() ?? [];
    const dataIndex = children.indexOf(child.data as TreeNodeData);

    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }

    const index = this.childNodes.indexOf(child);

    if (index > -1) {
      this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }

    this.updateLeafState();
  }

  removeChildByData(data: TreeNodeData | null): void {
    const targetNode = this.childNodes.find((child) => child.data === data);

    if (targetNode) {
      this.removeChild(targetNode);
    }
  }

  expand(callback?: (() => void) | null, expandParent = false): void {
    const done = () => {
      if (this.store.accordion && this.parent) {
        this.parent.childNodes.forEach((sibling) => {
          if (sibling !== this) {
            sibling.collapse();
          }
        });
      }

      if (expandParent) {
        let parent = this.parent;

        while (parent && parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }

      this.expanded = true;
      callback?.();
    };

    if (this.shouldLoadData()) {
      this.loadData(
        (data) => {
          if (Array.isArray(data)) {
            if (this.checked) {
              this.setChecked(true, true);
            } else if (!this.store.checkStrictly) {
              reInitChecked(this);
            }
          }

          done();
        },
        this.checked ? { checked: true } : {}
      );
      return;
    }

    done();
  }

  doCreateChildren(array: TreeData, defaultProps: TreeNodeLoadedDefaultProps = {}): void {
    array.forEach((item) => {
      this.insertChild(
        {
          data: item,
          ...defaultProps
        } as FakeNode,
        undefined,
        true
      );
    });
  }

  collapse(): void {
    this.expanded = false;
  }

  shouldLoadData() {
    return Boolean(this.store.lazy && this.store.load && !this.loaded && !this.isLeaf);
  }

  updateLeafState(): void {
    if (this.store.lazy && !this.loaded && this.isLeafByUser !== undefined) {
      this.isLeaf = this.isLeafByUser;
      this.isEffectivelyChecked = Boolean(this.isLeaf && this.disabled);
      return;
    }

    if (!this.store.lazy || this.loaded) {
      this.isLeaf = this.childNodes.length === 0;
      this.isEffectivelyChecked = Boolean(this.isLeaf && this.disabled);
      return;
    }

    this.isLeaf = false;
  }

  setChecked(value?: boolean | "half", deep = false, recursion = false, passValue = false) {
    this.indeterminate = value === "half";
    this.checked = value === true;
    this.isEffectivelyChecked = !this.childNodes.length && (this.disabled || this.checked);

    if (this.store.checkStrictly) {
      return;
    }

    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      const handleDescendants = () => {
        if (!deep) {
          return;
        }

        this.childNodes.forEach((child) => {
          passValue = passValue || value !== false;

          const nextChecked = child.disabled && child.isLeaf ? child.checked : passValue;
          child.setChecked(nextChecked, deep, true, passValue);
        });

        const { all, half, isEffectivelyChecked } = getChildState(this.childNodes);

        if (!all) {
          this.checked = all;
          this.indeterminate = half;
        }

        this.isEffectivelyChecked = this.childNodes.length === 0
          ? this.disabled || this.checked
          : isEffectivelyChecked;
      };

      if (this.shouldLoadData()) {
        this.loadData(
          () => {
            handleDescendants();
            reInitChecked(this);
          },
          {
            checked: value !== false
          }
        );
        return;
      }

      handleDescendants();
    }

    if (!this.parent || this.parent.level === 0 || recursion) {
      return;
    }

    reInitChecked(this.parent);
  }

  getChildren(forceInit = false): TreeData | null {
    if (this.level === 0) {
      return Array.isArray(this.data) ? this.data : null;
    }

    if (!this.data || Array.isArray(this.data)) {
      return null;
    }

    const childrenKey = this.store.props.children ?? "children";

    if (this.data[childrenKey] === undefined) {
      this.data[childrenKey] = null;
    }

    if (forceInit && !Array.isArray(this.data[childrenKey])) {
      this.data[childrenKey] = [];
    }

    return Array.isArray(this.data[childrenKey]) ? this.data[childrenKey] : null;
  }

  updateChildren(): void {
    const newData = this.getChildren() ?? [];
    const oldData = this.childNodes.map((node) => node.data as TreeNodeData);
    const newDataMap = new Map<TreeKey, { index: number; data: TreeNodeData }>();
    const newNodes: Array<{ index: number; data: TreeNodeData }> = [];

    newData.forEach((item, index) => {
      const key = item[NODE_KEY] as TreeKey | undefined;
      const isNodeExists =
        key !== undefined && oldData.some((oldItem) => oldItem && oldItem[NODE_KEY] === key);

      if (isNodeExists && key !== undefined) {
        newDataMap.set(key, { index, data: item });
      } else {
        newNodes.push({ index, data: item });
      }
    });

    if (!this.store.lazy) {
      oldData.forEach((item) => {
        const oldKey = item?.[NODE_KEY] as TreeKey | undefined;

        if (oldKey !== undefined && !newDataMap.has(oldKey)) {
          this.removeChildByData(item);
        }
      });
    }

    newNodes.forEach(({ index, data }) => {
      this.insertChild({ data }, index);
    });

    this.updateLeafState();
  }

  loadData(
    callback?: (data?: TreeData) => void,
    defaultProps: TreeNodeLoadedDefaultProps = {}
  ) {
    if (!this.store.lazy || !this.store.load || this.loaded || this.loading) {
      callback?.();
      return;
    }

    this.loading = true;
    this.loadFailed = false;

    const resolve = (children: TreeData) => {
      if (this.level > 0 && !Array.isArray(this.data)) {
        const targetChildren = this.getChildren(true);

        if (targetChildren) {
          targetChildren.splice(0, targetChildren.length, ...children);
        }
      }

      this.childNodes = [];
      this.doCreateChildren(children, defaultProps);
      this.loaded = true;
      this.loading = false;
      this.loadFailed = false;
      this.updateLeafState();
      callback?.(children);
    };

    const reject = () => {
      this.loading = false;
      this.loadFailed = true;
    };

    this.store.load(this, resolve, reject);
  }

  eachNode(callback: (node: Node) => void) {
    const queue: Node[] = [this];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        continue;
      }

      callback(current);
      queue.unshift(...current.childNodes);
    }
  }

  reInitChecked() {
    if (!this.store.checkStrictly) {
      reInitChecked(this);
    }
  }
}

export default Node;
