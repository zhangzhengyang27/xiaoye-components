import { computed, ref, shallowRef, toRaw, watch, type ComputedRef, type Ref } from "vue";
import { cloneFilterValues, getColumnStateKey, type TableBodyRow, type TableCellSlotProps, type TableFilterValue, type TableFilterValues, type TableHeaderCell, type TableProps, type TableResolvedColumn, type TableSortOrder, type TableSummaryValue, type TableTreeNode } from "../table";
import { buildHeaderRows, collectDescendantKeys, defaultCompare, flattenColumns, getColumnByStateKey, getFixedOffsets, getRowIdentity, getTreeChildren, getTreeColumn, hasFixedColumns, isOrderActive, matchesFilter, normalizeColumns, projectColumnsByFixed, resolveSortValue, resolveSummary, resolveTreeNode, resolveTreeProps } from "../util";

interface SourceNode<T = Record<string, unknown>> {
  row: T;
  key: string | number;
  parentKey: string | number | null;
  level: number;
  sourceIndex: number;
  treeNode: TableTreeNode;
  children: SourceNode<T>[];
}

export interface TableStore<T = Record<string, unknown>> {
  normalizedColumns: ComputedRef<TableResolvedColumn<T>[]>;
  leafColumns: ComputedRef<TableResolvedColumn<T>[]>;
  leftFixedColumns: ComputedRef<TableResolvedColumn<T>[]>;
  rightFixedColumns: ComputedRef<TableResolvedColumn<T>[]>;
  leftFixedLeafColumns: ComputedRef<TableResolvedColumn<T>[]>;
  rightFixedLeafColumns: ComputedRef<TableResolvedColumn<T>[]>;
  headerRows: ComputedRef<TableHeaderCell<T>[][]>;
  bodyRows: ComputedRef<TableBodyRow<T>[]>;
  summaryValues: ComputedRef<TableSummaryValue[]>;
  treeColumn: ComputedRef<TableResolvedColumn<T> | undefined>;
  selectionColumn: ComputedRef<TableResolvedColumn<T> | undefined>;
  fixedOffsets: ComputedRef<{
    left: Record<string, number>;
    right: Record<string, number>;
  }>;
  currentRowKey: ComputedRef<string | number | null>;
  sortProp: ComputedRef<string | undefined>;
  sortOrder: ComputedRef<TableSortOrder>;
  filterPanelColumnUid: Ref<string | null>;
  hasFixedColumns: ComputedRef<boolean>;
  hasLeftFixedColumns: ComputedRef<boolean>;
  hasRightFixedColumns: ComputedRef<boolean>;
  hasTree: ComputedRef<boolean>;
  isCurrentRow: (row: T, rowIndex: number) => boolean;
  isHoveredRow: (row: T) => boolean;
  isRowSelected: (row: T) => boolean;
  isRowSelectionIndeterminate: (row: T) => boolean;
  isAllSelected: ComputedRef<boolean>;
  isSelectionIndeterminate: ComputedRef<boolean>;
  isRowExpanded: (row: T) => boolean;
  isRowExpandable: (row: T, rowIndex: number) => boolean;
  getColumnSortOrder: (column: TableResolvedColumn<T>) => TableSortOrder;
  getColumnFilterValues: (column: TableResolvedColumn<T>) => TableFilterValue[];
  getCellValue: (row: T, column: TableResolvedColumn<T>, rowIndex: number) => unknown;
  getSummaryValue: (column: TableResolvedColumn<T>) => TableSummaryValue;
  getCellMeta: (
    row: T,
    rowIndex: number,
    column: TableResolvedColumn<T>,
    columnIndex: number,
    expanded?: boolean,
    treeNode?: TableTreeNode
  ) => TableCellSlotProps<T>;
  setCurrentRow: (row?: T | null) => void;
  cycleSortOrder: (column: TableResolvedColumn<T>) => void;
  clearSort: () => void;
  clearFilter: (columnKeys?: string | string[]) => void;
  sort: (prop: string, order: TableSortOrder) => void;
  toggleFilterPanel: (column: TableResolvedColumn<T>) => void;
  isFilterPanelOpen: (column: TableResolvedColumn<T>) => boolean;
  closeFilterPanel: () => void;
  setColumnFilters: (column: TableResolvedColumn<T>, values: TableFilterValue[]) => void;
  toggleRowSelection: (row: T, selected?: boolean) => void;
  toggleAllSelection: () => void;
  clearSelection: () => void;
  getSelectionRows: () => T[];
  toggleRowExpansion: (row: T, expanded?: boolean) => void;
  toggleTreeRow: (row: T) => void;
  setHoveredRow: (row?: T | null) => void;
  getRowKey: (row: T, rowIndex: number) => string | number;
  setColumnWidth: (uid: string, width: number) => void;
}

export function useTableStore<T extends Record<string, unknown>>(options: {
  props: TableProps<T>;
  columns: ComputedRef<TableResolvedColumn<T>[]>;
  fitWidth?: ComputedRef<number>;
  emit: (event: string, ...args: any[]) => void;
}): TableStore<T> {
  const { props, columns, emit, fitWidth } = options;
  const filterPanelColumnUid = ref<string | null>(null);
  const widthOverrides = ref<Record<string, number>>({});
  const innerCurrentRowKey = ref<string | number | null>(props.defaultCurrentRowKey ?? null);
  const innerSortProp = ref<string | undefined>(props.defaultSort?.prop);
  const innerSortOrder = ref<TableSortOrder>(props.defaultSort?.order ?? null);
  const innerFilterValues = ref<TableFilterValues>(cloneFilterValues(props.defaultFilterValues));
  const innerExpandKeys = shallowRef(new Set<string | number>());
  const innerTreeExpandKeys = shallowRef(new Set<string | number>());
  const selectionKeys = shallowRef(new Set<string | number>());
  const hoveredRowKey = ref<string | number | null>(null);
  const lazyChildrenMap = shallowRef<Map<string | number, T[]>>(new Map());
  const lazyLoadingKeys = shallowRef(new Set<string | number>());
  const hasInitializedDefaultExpand = ref(false);

  const treeProps = computed(() => resolveTreeProps(props.treeProps));
  const normalizedColumns = computed(() =>
    normalizeColumns(
      columns.value,
      widthOverrides.value,
      props.showOverflowTooltip,
      props.fit,
      fitWidth?.value
    )
  );
  const leafColumns = computed(() => flattenColumns(normalizedColumns.value));
  const leftFixedColumns = computed(() => projectColumnsByFixed(normalizedColumns.value, "left"));
  const rightFixedColumns = computed(() => projectColumnsByFixed(normalizedColumns.value, "right"));
  const leftFixedLeafColumns = computed(() => flattenColumns(leftFixedColumns.value));
  const rightFixedLeafColumns = computed(() => flattenColumns(rightFixedColumns.value));
  const headerRows = computed(() => buildHeaderRows(normalizedColumns.value));
  const fixedOffsets = computed(() => getFixedOffsets(normalizedColumns.value));
  const treeColumn = computed(() => getTreeColumn(normalizedColumns.value));
  const selectionColumn = computed(() =>
    leafColumns.value.find((column) => column.type === "selection")
  );
  const hasFixed = computed(() => hasFixedColumns(normalizedColumns.value));
  const hasLeftFixed = computed(() => leftFixedLeafColumns.value.length > 0);
  const hasRightFixed = computed(() => rightFixedLeafColumns.value.length > 0);
  const currentRowKey = computed(() =>
    props.currentRowKey !== undefined ? props.currentRowKey : innerCurrentRowKey.value
  );
  const sortProp = computed(() =>
    props.sortProp !== undefined ? props.sortProp : innerSortProp.value
  );
  const sortOrder = computed<TableSortOrder>(() =>
    props.sortOrder !== undefined ? props.sortOrder : innerSortOrder.value
  );
  const resolvedFilterValues = computed<TableFilterValues>(() => {
    const nextValues = cloneFilterValues(innerFilterValues.value);

    leafColumns.value.forEach((column) => {
      const stateKey = getColumnStateKey(column);

      if (!stateKey) {
        return;
      }

      if (Array.isArray(column.filteredValue)) {
        nextValues[stateKey] = [...column.filteredValue];
        return;
      }

      if (props.filterValues && stateKey in props.filterValues) {
        nextValues[stateKey] = [...(props.filterValues[stateKey] ?? [])];
      }
    });

    return nextValues;
  });
  const activeSortColumn = computed(() =>
    leafColumns.value.find((column) => {
      const stateKey = getColumnStateKey(column);
      return stateKey && stateKey === sortProp.value && isOrderActive(sortOrder.value);
    })
  );

  const sourceNodes = computed(() => {
    let sourceIndex = 0;

    const build = (rows: T[], level: number, parentKey: string | number | null): SourceNode<T>[] =>
      rows.map((row) => {
        const currentIndex = sourceIndex;
        const key = getRowIdentity(row, currentIndex, props.rowKey);
        sourceIndex += 1;
        const expanded = innerTreeExpandKeys.value.has(key);
        const loading = lazyLoadingKeys.value.has(key);
        const treeNode = resolveTreeNode(
          row,
          key,
          level,
          expanded,
          loading,
          Boolean(props.lazy),
          treeProps.value,
          lazyChildrenMap.value
        );
        const children = build(
          getTreeChildren(row, treeProps.value, lazyChildrenMap.value, key),
          level + 1,
          key
        );

        return {
          row,
          key,
          parentKey,
          level,
          sourceIndex: currentIndex,
          treeNode,
          children
        };
      });

    return build(props.data, 0, null);
  });

  const sourceNodeRecords = computed(() => {
    const records: SourceNode<T>[] = [];
    const walk = (nodes: SourceNode<T>[]) => {
      nodes.forEach((node) => {
        records.push(node);
        walk(node.children);
      });
    };

    walk(sourceNodes.value);
    return records;
  });
  const sourceNodeMap = computed(() => {
    const map = new Map<string | number, SourceNode<T>>();
    sourceNodeRecords.value.forEach((record) => {
      map.set(record.key, record);
    });
    return map;
  });
  const sourceRowsMap = computed(() => {
    const map = new Map<string | number, T>();
    sourceNodeRecords.value.forEach((record) => {
      map.set(record.key, record.row);
    });
    return map;
  });

  const processedNodes = computed(() => {
    const filterRows = (nodes: SourceNode<T>[]): SourceNode<T>[] =>
      nodes
        .map((node) => {
          const children = filterRows(node.children);
          const rowMatched = leafColumns.value.every((column) =>
            matchesFilter(node.row, column, getColumnFilterValues(column))
          );

          if (!rowMatched && children.length === 0) {
            return null;
          }

          return {
            ...node,
            children
          };
        })
        .filter((node): node is SourceNode<T> => Boolean(node));

    const sortRows = (nodes: SourceNode<T>[]): SourceNode<T>[] => {
      const nextNodes = nodes.map((node) => ({
        ...node,
        children: sortRows(node.children)
      }));

      if (!activeSortColumn.value || activeSortColumn.value.sortable === "custom" || !isOrderActive(sortOrder.value)) {
        return nextNodes;
      }

      const direction = sortOrder.value === "ascending" ? 1 : -1;
      const column = activeSortColumn.value;

      return [...nextNodes].sort((left, right) => {
        if (column.sortMethod) {
          return column.sortMethod(left.row, right.row) * direction;
        }

        const sourceRows = nextNodes.map((item) => item.row);
        const sortRules = Array.isArray(column.sortBy)
          ? column.sortBy
          : column.sortBy
            ? [column.sortBy]
            : column.prop
              ? [column.prop]
              : [];

        for (const rule of sortRules) {
          const compared = defaultCompare(
            resolveSortValue(left.row, left.sourceIndex, sourceRows, rule),
            resolveSortValue(right.row, right.sourceIndex, sourceRows, rule)
          );

          if (compared !== 0) {
            return compared * direction;
          }
        }

        return left.sourceIndex - right.sourceIndex;
      });
    };

    return sortRows(filterRows(sourceNodes.value));
  });

  const bodyRows = computed<TableBodyRow<T>[]>(() => {
    const rows: TableBodyRow<T>[] = [];
    const walk = (nodes: SourceNode<T>[]) => {
      nodes.forEach((node) => {
        rows.push({
          row: node.row,
          rowIndex: rows.length,
          key: node.key,
          treeNode: node.treeNode,
          expanded: isRowExpandedByKey(node.key)
        });

        if (node.treeNode.expanded) {
          walk(node.children);
        }
      });
    };

    walk(processedNodes.value);
    return rows;
  });
  const summaryValues = computed(() =>
    resolveSummary(
      leafColumns.value,
      bodyRows.value.map((item) => item.row),
      props.sumText,
      props.summaryMethod
    )
  );
  const summaryValueMap = computed(() => {
    const map = new Map<string, TableSummaryValue>();

    leafColumns.value.forEach((column, index) => {
      map.set(column.uid, summaryValues.value[index]);
    });

    return map;
  });
  const hasTree = computed(() =>
    props.lazy ||
    sourceNodeRecords.value.some((node) => node.level > 0 || node.treeNode.hasChildren)
  );
  const visibleSelectableKeys = computed(() =>
    bodyRows.value
      .filter((item) => isSelectable(item.row, item.rowIndex))
      .map((item) => item.key)
  );
  const isAllSelected = computed(() => {
    const keys = visibleSelectableKeys.value;

    if (keys.length === 0) {
      return false;
    }

    return keys.every((key) => selectionKeys.value.has(key));
  });
  const isSelectionIndeterminate = computed(() => {
    const keys = visibleSelectableKeys.value;

    if (keys.length === 0) {
      return false;
    }

    const selectedCount = keys.filter((key) => selectionKeys.value.has(key)).length;
    return selectedCount > 0 && selectedCount < keys.length;
  });

  function sameSet(left: ReadonlySet<string | number>, right: ReadonlySet<string | number>) {
    if (left.size !== right.size) {
      return false;
    }

    for (const value of left) {
      if (!right.has(value)) {
        return false;
      }
    }

    return true;
  }

  watch(
    sourceNodeRecords,
    (records) => {
      const availableKeys = new Set(records.map((item) => item.key));
      const expandableKeys = records
        .filter((item) => isExpandableRecord(item))
        .map((item) => item.key);
      const treeExpandableKeys = records
        .filter((item) => item.treeNode.hasChildren)
        .map((item) => item.key);

      if (!hasInitializedDefaultExpand.value) {
        if (props.defaultExpandAll) {
          if (props.expandRowKeys === undefined) {
            innerExpandKeys.value = new Set(expandableKeys);
          }

          innerTreeExpandKeys.value = new Set(treeExpandableKeys);
        }

        hasInitializedDefaultExpand.value = true;
      } else {
        const nextExpandKeys = new Set(
          [...innerExpandKeys.value].filter((key) => availableKeys.has(key))
        );
        const nextTreeExpandKeys = new Set(
          [...innerTreeExpandKeys.value].filter((key) => availableKeys.has(key))
        );

        if (!sameSet(innerExpandKeys.value, nextExpandKeys)) {
          innerExpandKeys.value = nextExpandKeys;
        }

        if (!sameSet(innerTreeExpandKeys.value, nextTreeExpandKeys)) {
          innerTreeExpandKeys.value = nextTreeExpandKeys;
        }
      }

      if (props.currentRowKey === undefined && currentRowKey.value != null && !availableKeys.has(currentRowKey.value)) {
        innerCurrentRowKey.value = null;
      }

      if (hoveredRowKey.value != null && !availableKeys.has(hoveredRowKey.value)) {
        hoveredRowKey.value = null;
      }

      if (!selectionColumn.value?.reserveSelection || !props.rowKey) {
        const nextSelectionKeys = new Set(
          [...selectionKeys.value].filter((key) => availableKeys.has(key))
        );

        if (!sameSet(selectionKeys.value, nextSelectionKeys)) {
          selectionKeys.value = nextSelectionKeys;
        }
      }
    },
    {
      immediate: true
    }
  );

  function getRowKey(row: T, rowIndex: number) {
    return getRowIdentity(row, rowIndex, props.rowKey);
  }

  function getColumnFilterValues(column: TableResolvedColumn<T>) {
    const stateKey = getColumnStateKey(column);
    return stateKey ? resolvedFilterValues.value[stateKey] ?? [] : [];
  }

  function getColumnSortOrder(column: TableResolvedColumn<T>) {
    const stateKey = getColumnStateKey(column);

    if (!stateKey || stateKey !== sortProp.value) {
      return null;
    }

    return sortOrder.value ?? null;
  }

  function getSummaryValue(column: TableResolvedColumn<T>) {
    return summaryValueMap.value.get(column.uid);
  }

  function getCellValue(row: T, column: TableResolvedColumn<T>, rowIndex: number) {
    const rawValue = column.prop ? row[column.prop as keyof T] : undefined;

    if (column.formatter) {
      return column.formatter(row, column, rawValue, rowIndex);
    }

    if (column.type === "index") {
      if (typeof column.index === "function") {
        return column.index(rowIndex);
      }

      if (typeof column.index === "number") {
        return column.index + rowIndex;
      }

      return rowIndex + 1;
    }

    return rawValue;
  }

  function getCellMeta(
    row: T,
    rowIndex: number,
    column: TableResolvedColumn<T>,
    columnIndex: number,
    expanded = false,
    treeNode?: TableTreeNode
  ) {
    return {
      row,
      rowIndex,
      column,
      columnIndex,
      value: getCellValue(row, column, rowIndex),
      expanded,
      treeNode
    };
  }

  function isCurrentRow(row: T, rowIndex: number) {
    return Object.is(getRowKey(row, rowIndex), currentRowKey.value);
  }

  function isHoveredRow(row: T) {
    const record = getRecordByRow(row);
    return record ? Object.is(record.key, hoveredRowKey.value) : false;
  }

  function getRecordByRow(row: T) {
    const rawRow = toRaw(row);
    const directMatch = sourceNodeRecords.value.find((item) => toRaw(item.row) === rawRow);

    if (directMatch) {
      return directMatch;
    }

    if (!props.rowKey) {
      return null;
    }

    return (
      sourceNodeRecords.value.find((item) =>
        Object.is(item.key, getRowIdentity(rawRow, item.sourceIndex, props.rowKey))
      ) ?? null
    );
  }

  function collectDescendantKeysFromRecord(record: SourceNode<T>) {
    const keys: Array<string | number> = [];
    const walk = (nodes: SourceNode<T>[]) => {
      nodes.forEach((node) => {
        keys.push(node.key);
        walk(node.children);
      });
    };

    walk(record.children);
    return keys;
  }

  function isSelectable(row: T, rowIndex: number) {
    return selectionColumn.value?.selectable ? selectionColumn.value.selectable(row, rowIndex) : true;
  }

  function getSelectionRows() {
    return [...selectionKeys.value]
      .map((key) => sourceRowsMap.value.get(key))
      .filter((row): row is T => row !== undefined);
  }

  function emitSelectionChange() {
    emit("selection-change", getSelectionRows());
  }

  function setSelectionKeys(nextKeys: Set<string | number>, changedRow?: T, emitSelectAll = false) {
    selectionKeys.value = new Set(nextKeys);

    if (changedRow) {
      emit("select", getSelectionRows(), changedRow);
    }

    if (emitSelectAll) {
      emit("select-all", getSelectionRows());
    }

    emitSelectionChange();
  }

  function syncAncestorSelection(nextKeys: Set<string | number>, startParentKey: string | number | null) {
    if (treeProps.value.checkStrictly || startParentKey == null) {
      return;
    }

    let parentKey: string | number | null = startParentKey;

    while (parentKey != null) {
      const parent = sourceNodeMap.value.get(parentKey);

      if (!parent) {
        break;
      }

      const descendants = collectDescendantKeys(
        parent.row,
        parent.key,
        treeProps.value,
        lazyChildrenMap.value,
        props.rowKey
      ).filter((key) => sourceRowsMap.value.has(key));
      const fallbackDescendants = collectDescendantKeysFromRecord(parent);
      const branchKeys = props.rowKey ? descendants : fallbackDescendants;
      const selectableDescendants = branchKeys.filter((key) => {
        const row = sourceRowsMap.value.get(key);
        const record = sourceNodeMap.value.get(key);

        if (!row || !record) {
          return false;
        }

        return isSelectable(row, record.sourceIndex);
      });

      if (selectableDescendants.length > 0 && selectableDescendants.every((key) => nextKeys.has(key))) {
        nextKeys.add(parent.key);
      } else {
        nextKeys.delete(parent.key);
      }

      parentKey = parent.parentKey;
    }
  }

  function isRowSelected(row: T) {
    const record = getRecordByRow(row);
    return record ? selectionKeys.value.has(record.key) : false;
  }

  function isRowSelectionIndeterminate(row: T) {
    if (treeProps.value.checkStrictly) {
      return false;
    }

    const record = getRecordByRow(row);

    if (!record) {
      return false;
    }

    const descendants = collectDescendantKeys(
      row,
      record.key,
      treeProps.value,
      lazyChildrenMap.value,
      props.rowKey
    ).filter((key) => sourceRowsMap.value.has(key));
    const branchKeys = props.rowKey ? descendants : collectDescendantKeysFromRecord(record);

    if (branchKeys.length === 0) {
      return false;
    }

    const selectedCount = branchKeys.filter((key) => selectionKeys.value.has(key)).length;
    return selectedCount > 0 && selectedCount < branchKeys.length;
  }

  function toggleRowSelection(row: T, selected?: boolean) {
    const record = getRecordByRow(row);

    if (!record || !isSelectable(row, record.sourceIndex)) {
      return;
    }

    const nextKeys = new Set(selectionKeys.value);
    const shouldSelect = selected ?? !nextKeys.has(record.key);

    if (shouldSelect) {
      nextKeys.add(record.key);
    } else {
      nextKeys.delete(record.key);
    }

    if (hasTree.value && !treeProps.value.checkStrictly) {
      const descendants = collectDescendantKeys(
        row,
        record.key,
        treeProps.value,
        lazyChildrenMap.value,
        props.rowKey
      );
      const branchKeys = props.rowKey ? descendants : collectDescendantKeysFromRecord(record);

      branchKeys.forEach((key) => {
        if (shouldSelect) {
          nextKeys.add(key);
        } else {
          nextKeys.delete(key);
        }
      });

      syncAncestorSelection(nextKeys, record.parentKey);
    }

    setSelectionKeys(nextKeys, row);
  }

  function toggleAllSelection() {
    const nextKeys = new Set(selectionKeys.value);
    const shouldSelect =
      !(isSelectionIndeterminate.value && props.selectOnIndeterminate === false) &&
      !isAllSelected.value;

    visibleSelectableKeys.value.forEach((key) => {
      if (shouldSelect) {
        nextKeys.add(key);
      } else {
        nextKeys.delete(key);
      }
    });

    setSelectionKeys(nextKeys, undefined, true);
  }

  function clearSelection() {
    selectionKeys.value = new Set();
    emitSelectionChange();
  }

  function setCurrentRow(row?: T | null) {
    const previousRow = currentRowKey.value != null ? sourceRowsMap.value.get(currentRowKey.value) ?? null : null;
    const nextRecord = row ? getRecordByRow(row) : null;
    const nextKey = nextRecord?.key ?? null;

    if (Object.is(nextKey, currentRowKey.value)) {
      return;
    }

    if (props.currentRowKey === undefined) {
      innerCurrentRowKey.value = nextKey;
    }

    emit("update:currentRowKey", nextKey);
    emit("current-change", row ?? null, previousRow);
  }

  function setHoveredRow(row?: T | null) {
    if (!row) {
      hoveredRowKey.value = null;
      return;
    }

    const record = getRecordByRow(row);
    hoveredRowKey.value = record?.key ?? null;
  }

  function setSortState(column: TableResolvedColumn<T> | undefined, prop: string | undefined, order: TableSortOrder, emitChange = true) {
    if (props.sortProp === undefined) {
      innerSortProp.value = prop;
    }

    if (props.sortOrder === undefined) {
      innerSortOrder.value = order;
    }

    emit("update:sortProp", prop);
    emit("update:sortOrder", order);

    if (emitChange && column) {
      emit("sort-change", {
        column,
        prop,
        order
      });
    }
  }

  function cycleSortOrder(column: TableResolvedColumn<T>) {
    const stateKey = getColumnStateKey(column);

    if (!column.sortable || !stateKey) {
      return;
    }

    const orders: TableSortOrder[] =
      column.sortOrders.length > 0 ? column.sortOrders : ["ascending", "descending", null];
    const currentOrder = getColumnSortOrder(column);
    const currentIndex = orders.findIndex((item) => item === currentOrder);
    const nextOrder = orders[(currentIndex + 1 + orders.length) % orders.length];
    const nextProp = nextOrder === null ? undefined : stateKey;

    filterPanelColumnUid.value = null;
    setSortState(column, nextProp, nextOrder);
  }

  function clearSort() {
    setSortState(activeSortColumn.value, undefined, null, Boolean(activeSortColumn.value));
  }

  function sort(prop: string, order: TableSortOrder) {
    const column = getColumnByStateKey(normalizedColumns.value, prop);

    if (!column) {
      return;
    }

    setSortState(column, order ? prop : undefined, order);
  }

  function buildNextFilterState(column: TableResolvedColumn<T>, values: TableFilterValue[]) {
    const stateKey = getColumnStateKey(column);

    if (!stateKey) {
      return resolvedFilterValues.value;
    }

    const nextValues = cloneFilterValues(resolvedFilterValues.value);

    if (values.length > 0) {
      nextValues[stateKey] = [...values];
    } else {
      delete nextValues[stateKey];
    }

    return nextValues;
  }

  function setColumnFilters(column: TableResolvedColumn<T>, values: TableFilterValue[]) {
    const nextValues = buildNextFilterState(column, values);
    const stateKey = getColumnStateKey(column);

    if (!stateKey) {
      return;
    }

    if (props.filterValues === undefined && column.filteredValue === undefined) {
      innerFilterValues.value = nextValues;
    }

    emit("update:filterValues", nextValues);
    emit("filter-change", nextValues);
  }

  function clearFilter(columnKeys?: string | string[]) {
    const targetKeys = columnKeys
      ? Array.isArray(columnKeys)
        ? columnKeys
        : [columnKeys]
      : leafColumns.value
          .map((column) => getColumnStateKey(column))
          .filter((key): key is string => Boolean(key));

    const nextValues = cloneFilterValues(resolvedFilterValues.value);
    targetKeys.forEach((key) => {
      delete nextValues[key];
    });

    if (props.filterValues === undefined) {
      innerFilterValues.value = nextValues;
    }

    emit("update:filterValues", nextValues);
    emit("filter-change", nextValues);
  }

  function toggleFilterPanel(column: TableResolvedColumn<T>) {
    const stateKey = getColumnStateKey(column);

    if (!stateKey || column.filters.length === 0) {
      return;
    }

    filterPanelColumnUid.value = filterPanelColumnUid.value === column.uid ? null : column.uid;
  }

  function isFilterPanelOpen(column: TableResolvedColumn<T>) {
    return filterPanelColumnUid.value === column.uid;
  }

  function closeFilterPanel() {
    filterPanelColumnUid.value = null;
  }

  function isExpandableRecord(record: SourceNode<T>) {
    if (!leafColumns.value.some((column) => column.type === "expand")) {
      return false;
    }

    return props.rowExpandable ? props.rowExpandable(record.row, record.sourceIndex) : true;
  }

  function isRowExpandable(row: T, rowIndex: number) {
    return props.rowExpandable ? props.rowExpandable(row, rowIndex) : true;
  }

  function isRowExpandedByKey(key: string | number) {
    const controlledKeys = props.expandRowKeys ? new Set(props.expandRowKeys) : null;
    return controlledKeys ? controlledKeys.has(key) : innerExpandKeys.value.has(key);
  }

  function isRowExpanded(row: T) {
    const record = getRecordByRow(row);
    return record ? isRowExpandedByKey(record.key) : false;
  }

  function toggleRowExpansion(row: T, expanded?: boolean) {
    const record = getRecordByRow(row);

    if (!record || !isExpandableRecord(record)) {
      return;
    }

    const nextKeys = new Set(props.expandRowKeys ?? innerExpandKeys.value);
    const nextExpanded = expanded ?? !nextKeys.has(record.key);

    if (nextExpanded) {
      nextKeys.add(record.key);
    } else {
      nextKeys.delete(record.key);
    }

    if (props.expandRowKeys === undefined) {
      innerExpandKeys.value = nextKeys;
    }

    const expandedRows = [...nextKeys]
      .map((key) => sourceRowsMap.value.get(key))
      .filter((item): item is T => item !== undefined);

    emit("expand-change", row, expandedRows);
  }

  function setTreeExpanded(key: string | number, expanded: boolean) {
    const nextKeys = new Set(innerTreeExpandKeys.value);

    if (expanded) {
      nextKeys.add(key);
    } else {
      nextKeys.delete(key);
    }

    innerTreeExpandKeys.value = nextKeys;
  }

  function toggleTreeRow(row: T) {
    const record = getRecordByRow(row);

    if (!record || !record.treeNode.hasChildren) {
      return;
    }

    const expanded = !innerTreeExpandKeys.value.has(record.key);
    setTreeExpanded(record.key, expanded);
    const latestRecord = sourceNodeMap.value.get(record.key);

    if (expanded && latestRecord?.treeNode.isLazy && props.load) {
      loadLazyChildren(latestRecord);
    }

    emit("expand-change", row, expanded);
  }

  function loadLazyChildren(record: SourceNode<T>) {
    if (!props.load || lazyChildrenMap.value.has(record.key) || lazyLoadingKeys.value.has(record.key)) {
      return;
    }

    const nextLoadingKeys = new Set(lazyLoadingKeys.value);
    nextLoadingKeys.add(record.key);
    lazyLoadingKeys.value = nextLoadingKeys;

    props.load(record.row, record.treeNode, (rows) => {
      const nextLazyChildrenMap = new Map(lazyChildrenMap.value);
      nextLazyChildrenMap.set(record.key, Array.isArray(rows) ? rows : []);
      lazyChildrenMap.value = nextLazyChildrenMap;

      const latestLoadingKeys = new Set(lazyLoadingKeys.value);
      latestLoadingKeys.delete(record.key);
      lazyLoadingKeys.value = latestLoadingKeys;
    });
  }

  function setColumnWidth(uid: string, width: number) {
    widthOverrides.value = {
      ...widthOverrides.value,
      [uid]: Math.max(40, Math.round(width))
    };
  }

  return {
    normalizedColumns,
    leafColumns,
    leftFixedColumns,
    rightFixedColumns,
    leftFixedLeafColumns,
    rightFixedLeafColumns,
    headerRows,
    bodyRows,
    summaryValues,
    treeColumn,
    selectionColumn,
    fixedOffsets,
    currentRowKey,
    sortProp,
    sortOrder,
    filterPanelColumnUid,
    hasFixedColumns: hasFixed,
    hasLeftFixedColumns: hasLeftFixed,
    hasRightFixedColumns: hasRightFixed,
    hasTree,
    isCurrentRow,
    isHoveredRow,
    isRowSelected,
    isRowSelectionIndeterminate,
    isAllSelected,
    isSelectionIndeterminate,
    isRowExpanded,
    isRowExpandable,
    getColumnSortOrder,
    getColumnFilterValues,
    getCellValue,
    getSummaryValue,
    getCellMeta,
    setCurrentRow,
    cycleSortOrder,
    clearSort,
    clearFilter,
    sort,
    toggleFilterPanel,
    isFilterPanelOpen,
    closeFilterPanel,
    setColumnFilters,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    getSelectionRows,
    toggleRowExpansion,
    toggleTreeRow,
    setHoveredRow,
    getRowKey,
    setColumnWidth
  };
}
