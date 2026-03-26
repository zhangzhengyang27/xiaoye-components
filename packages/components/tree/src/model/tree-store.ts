import Node from "./node";
import { NODE_KEY, getNodeKey } from "./util";
import type {
  FilterValue,
  TreeData,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
  TreeStoreNodesMap,
  TreeStoreOptions
} from "../tree.type";

export default class TreeStore {
  currentNode: Node | null = null;
  currentNodeKey: TreeKey | null = null;
  nodesMap: TreeStoreNodesMap = {};
  root!: Node;
  data!: TreeData;
  lazy = false;
  load?: TreeStoreOptions["load"];
  filterNodeMethod?: TreeStoreOptions["filterNodeMethod"];
  key?: string;
  defaultCheckedKeys?: TreeKey[];
  checkStrictly = false;
  defaultExpandedKeys?: TreeKey[];
  autoExpandParent = false;
  defaultExpandAll = false;
  accordion = false;
  props: TreeOptionProps = {
    children: "children",
    label: "label",
    disabled: "disabled"
  };

  constructor(options: TreeStoreOptions) {
    Object.assign(this, options);
  }

  initialize() {
    this.root = new Node({
      data: this.data,
      store: this
    });
    this.root.initialize();

    if (this.lazy && this.load && this.root.childNodes.length === 0) {
      this.load(
        this.root,
        (data) => {
          this.root.childNodes = [];
          this.root.doCreateChildren(data);
          this.root.loaded = true;
          this.root.updateLeafState();
          this._initDefaultCheckedNodes();
        },
        () => {
          this.root.loading = false;
        }
      );
      return;
    }

    this._initDefaultCheckedNodes();
  }

  filter(value: FilterValue): void {
    const traverse = (node: TreeStore | Node) => {
      const childNodes = node instanceof TreeStore ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        child.visible = !value
          ? true
          : Boolean(this.filterNodeMethod?.call(child, value, child.data as TreeNodeData, child));
        traverse(child);
      });

      if (!(node instanceof TreeStore) && !node.visible && childNodes.length > 0) {
        node.visible = childNodes.some((child) => child.visible);
      }

      if (!value) {
        return;
      }

      if (!(node instanceof TreeStore) && node.visible && !node.isLeaf) {
        if (!this.lazy || node.loaded) {
          node.expand();
        }
      }
    };

    traverse(this);
  }

  setData(newVal: TreeData): void {
    const instanceChanged = newVal !== this.root.data;

    if (instanceChanged) {
      this.nodesMap = {};
      this.root.setData(newVal);
      this._initDefaultCheckedNodes();
      this.setCurrentNodeKey(this.currentNodeKey);
      return;
    }

    this.root.updateChildren();
  }

  getNode(data: TreeKey | TreeNodeData | Node): Node | null {
    if (data instanceof Node) {
      return data;
    }

    const lookupKey = this.key ?? NODE_KEY;
    const key = typeof data === "object" ? getNodeKey(lookupKey, data) : data;

    if (key === undefined || key === null) {
      return null;
    }

    return this.nodesMap[String(key)] ?? null;
  }

  insertBefore(data: TreeNodeData, refData: TreeKey | TreeNodeData | Node): void {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertBefore({ data }, refNode);
  }

  insertAfter(data: TreeNodeData, refData: TreeKey | TreeNodeData | Node): void {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertAfter({ data }, refNode);
  }

  remove(data: TreeNodeData | Node): void {
    const node = this.getNode(data);

    if (!node || !node.parent) {
      return;
    }

    if (node === this.currentNode) {
      this.currentNode = null;
    }

    node.parent.removeChild(node);
  }

  append(data: TreeNodeData, parentData?: TreeNodeData | TreeKey | Node): void {
    const parentNode = parentData !== undefined ? this.getNode(parentData) : this.root;
    parentNode?.insertChild({ data });
  }

  _initDefaultCheckedNodes(): void {
    const defaultCheckedKeys = this.defaultCheckedKeys ?? [];

    defaultCheckedKeys.forEach((checkedKey) => {
      const node = this.nodesMap[String(checkedKey)];

      if (node) {
        node.setChecked(true, !this.checkStrictly);
      }
    });
  }

  _initDefaultCheckedNode(node: Node): void {
    const defaultCheckedKeys = this.defaultCheckedKeys ?? [];

    if (node.key !== null && defaultCheckedKeys.includes(node.key)) {
      node.setChecked(true, !this.checkStrictly);
    }
  }

  setDefaultCheckedKey(newVal: TreeKey[]): void {
    this.defaultCheckedKeys = newVal;
    this._initDefaultCheckedNodes();
  }

  registerNode(node: Node): void {
    if (!node || !node.data) {
      return;
    }

    const lookupKey = node.key ?? node.id;
    this.nodesMap[String(lookupKey)] = node;
  }

  deregisterNode(node: Node): void {
    node.childNodes.forEach((child) => {
      this.deregisterNode(child);
    });

    const lookupKey = node.key ?? node.id;
    delete this.nodesMap[String(lookupKey)];
  }

  getCheckedNodes(leafOnly = false, includeHalfChecked = false): TreeNodeData[] {
    const checkedNodes: TreeNodeData[] = [];

    const traverse = (node: TreeStore | Node) => {
      const childNodes = node instanceof TreeStore ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        if (
          (child.checked || (includeHalfChecked && child.indeterminate)) &&
          (!leafOnly || child.isLeaf)
        ) {
          checkedNodes.push(child.data as TreeNodeData);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  }

  getCheckedKeys(leafOnly = false): TreeKey[] {
    const lookupKey = this.key ?? NODE_KEY;
    return this.getCheckedNodes(leafOnly)
      .map((data) => data[lookupKey] as TreeKey | undefined)
      .filter((key): key is TreeKey => key !== undefined && key !== null);
  }

  getHalfCheckedNodes(): TreeNodeData[] {
    const nodes: TreeNodeData[] = [];

    const traverse = (node: TreeStore | Node) => {
      const childNodes = node instanceof TreeStore ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        if (child.indeterminate) {
          nodes.push(child.data as TreeNodeData);
        }

        traverse(child);
      });
    };

    traverse(this);

    return nodes;
  }

  getHalfCheckedKeys(): TreeKey[] {
    const lookupKey = this.key ?? NODE_KEY;
    return this.getHalfCheckedNodes()
      .map((data) => data[lookupKey] as TreeKey | undefined)
      .filter((key): key is TreeKey => key !== undefined && key !== null);
  }

  _getAllNodes(): Node[] {
    return Object.values(this.nodesMap);
  }

  updateChildren(key: TreeKey, data: TreeData): void {
    const node = this.nodesMap[String(key)];

    if (!node) {
      return;
    }

    [...node.childNodes].forEach((child) => {
      this.remove(child);
    });

    data.forEach((child) => {
      this.append(child, node.data as TreeNodeData);
    });
  }

  _setCheckedKeys(
    key: string,
    leafOnly = false,
    checkedKeys: Record<TreeKey, boolean>
  ) {
    const allNodes = this._getAllNodes().sort((left, right) => left.level - right.level);
    const cache: Record<TreeKey, boolean> = Object.create(null);
    const lookupKeys = Object.keys(checkedKeys);

    allNodes.forEach((node) => {
      if (node.level > 0) {
        node.setChecked(false, false);
      }
    });

    const cacheCheckedChild = (node: Node) => {
      node.childNodes.forEach((child) => {
        const childKey = (child.data as TreeNodeData)?.[key] as TreeKey | undefined;

        if (childKey !== undefined) {
          cache[childKey] = true;
        }

        if (child.childNodes.length > 0) {
          cacheCheckedChild(child);
        }
      });
    };

    allNodes.forEach((node) => {
      if (node.level === 0) {
        return;
      }

      const nodeKey = (node.data as TreeNodeData)?.[key] as TreeKey | undefined;

      if (nodeKey === undefined) {
        return;
      }

      const checked = lookupKeys.includes(String(nodeKey));

      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }

        return;
      }

      if (node.childNodes.length > 0) {
        cacheCheckedChild(node);
      }

      if (node.isLeaf || this.checkStrictly) {
        node.setChecked(true, false);
        return;
      }

      node.setChecked(true, true);

      if (leafOnly) {
        node.setChecked(false, false, true);
        node.eachNode((current) => {
          if (current !== node && !current.isLeaf) {
            current.setChecked(false, false, true);
          }

          current.reInitChecked();
        });
      }
    });
  }

  setCheckedNodes(array: TreeNodeData[], leafOnly = false): void {
    const lookupKey = this.key ?? NODE_KEY;
    const checkedKeys: Record<TreeKey, boolean> = {};

    array.forEach((item) => {
      const itemKey = item?.[lookupKey] as TreeKey | undefined;

      if (itemKey !== undefined) {
        checkedKeys[itemKey] = true;
      }
    });

    this._setCheckedKeys(lookupKey, leafOnly, checkedKeys);
  }

  setCheckedKeys(keys: TreeKey[], leafOnly = false): void {
    const checkedKeys: Record<TreeKey, boolean> = {};
    const lookupKey = this.key ?? NODE_KEY;

    keys.forEach((key) => {
      checkedKeys[key] = true;
    });

    this.defaultCheckedKeys = keys;
    this._setCheckedKeys(lookupKey, leafOnly, checkedKeys);
  }

  setDefaultExpandedKeys(keys: TreeKey[]) {
    this.defaultExpandedKeys = keys ?? [];

    this.defaultExpandedKeys.forEach((key) => {
      const node = this.getNode(key);
      node?.expand(undefined, this.autoExpandParent);
    });
  }

  setChecked(data: TreeKey | TreeNodeData, checked: boolean, deep: boolean): void {
    const node = this.getNode(data);
    node?.setChecked(checked, deep);
  }

  getCurrentNode() {
    return this.currentNode;
  }

  setCurrentNode(currentNode: Node | null): void {
    if (this.currentNode) {
      this.currentNode.isCurrent = false;
    }

    this.currentNode = currentNode;

    if (this.currentNode) {
      this.currentNode.isCurrent = true;
    }
  }

  setUserCurrentNode(node: Node, shouldAutoExpandParent = true): void {
    this.setCurrentNode(node);

    if (shouldAutoExpandParent && node.level > 1) {
      node.parent?.expand(undefined, true);
    }
  }

  setCurrentNodeKey(key: TreeKey | null, shouldAutoExpandParent = true): void {
    this.currentNodeKey = key;

    if (key === null || key === undefined) {
      this.setCurrentNode(null);
      return;
    }

    const node = this.getNode(key);

    if (!node) {
      return;
    }

    this.setCurrentNode(node);

    if (shouldAutoExpandParent && node.level > 1) {
      node.parent?.expand(undefined, true);
    }
  }
}
