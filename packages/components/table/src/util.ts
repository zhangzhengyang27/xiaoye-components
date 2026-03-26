import {
  TABLE_DEFAULT_COLUMN_WIDTH,
  TABLE_DEFAULT_TREE_PROPS,
  TABLE_EXPAND_COLUMN_WIDTH,
  TABLE_INDEX_COLUMN_WIDTH,
  TABLE_SELECTION_COLUMN_WIDTH,
  TABLE_SUM_TEXT
} from "./config";
import type {
  TableFilterValue,
  TableHeaderCell,
  TableProps,
  TableResolvedColumn,
  TableRowKey,
  TableSection,
  TableSortOrder,
  TableSpanMethodContext,
  TableSpanResult,
  TableSummaryMethodContext,
  TableSummaryValue,
  TableTreeNode,
  TableTreeProps
} from "./table";
import { toNumberSize } from "./table";

export function getRowIdentity<T>(row: T, rowIndex: number, rowKey?: TableRowKey<T>) {
  if (typeof rowKey === "function") {
    return rowKey(row, rowIndex);
  }

  if (rowKey) {
    return row[rowKey] as string | number;
  }

  return rowIndex;
}

export function flattenColumns<T>(columns: TableResolvedColumn<T>[]) {
  const leafColumns: TableResolvedColumn<T>[] = [];

  const visit = (column: TableResolvedColumn<T>) => {
    if (column.children.length > 0) {
      column.children.forEach(visit);
      return;
    }

    leafColumns.push(column);
  };

  columns.forEach(visit);

  return leafColumns;
}

export function normalizeColumns<T>(
  columns: TableResolvedColumn<T>[],
  widthOverrides: Record<string, number>,
  tableShowOverflowTooltip?: boolean,
  fit = true,
  containerWidth?: number
) {
  const maxLevel = getMaxLevel(columns);
  let leafIndex = 0;
  const leafWidthOverrides: Record<string, number> = {};

  const baseColumns = columns.map((column) =>
    normalizeColumn(column, widthOverrides, tableShowOverflowTooltip, maxLevel)
  );
  const leafColumns = flattenColumns(baseColumns);

  if (fit && containerWidth && containerWidth > 0) {
    const totalWidth = leafColumns.reduce((sum, column) => sum + column.realWidth, 0);
    const extraWidth = Math.floor(containerWidth - totalWidth);

    if (extraWidth > 0 && leafColumns.length > 0) {
      const flexibleColumns = leafColumns.filter((column) => column.width === undefined);
      const targetColumns = flexibleColumns.length > 0 ? flexibleColumns : leafColumns;
      const evenExtra = Math.floor(extraWidth / targetColumns.length);
      let remainder = extraWidth % targetColumns.length;

      targetColumns.forEach((column) => {
        leafWidthOverrides[column.uid] = column.realWidth + evenExtra + (remainder > 0 ? 1 : 0);
        if (remainder > 0) {
          remainder -= 1;
        }
      });
    }
  }

  const normalize = (column: TableResolvedColumn<T>): TableResolvedColumn<T> => {
    const children = column.children.map(normalize);
    const isLeaf = children.length === 0;
    const realWidth = isLeaf
      ? (leafWidthOverrides[column.uid] ?? column.realWidth)
      : children.reduce((sum, child) => sum + child.realWidth, 0);
    const leafCount = isLeaf ? 1 : children.reduce((sum, item) => sum + item.leafCount, 0);
    const normalized: TableResolvedColumn<T> = {
      ...column,
      children,
      realWidth,
      leafCount,
      colSpan: leafCount,
      rowSpan: isLeaf ? maxLevel - column.level + 1 : 1,
      leafIndex: isLeaf ? leafIndex : (children[0]?.leafIndex ?? leafIndex)
    };

    if (isLeaf) {
      normalized.leafIndex = leafIndex;
      leafIndex += 1;
    }

    return normalized;
  };

  return baseColumns.map(normalize);
}

function normalizeColumn<T>(
  column: TableResolvedColumn<T>,
  widthOverrides: Record<string, number>,
  tableShowOverflowTooltip: boolean | undefined,
  maxLevel: number
): TableResolvedColumn<T> {
  const children = column.children.map((child) =>
    normalizeColumn(child, widthOverrides, tableShowOverflowTooltip, maxLevel)
  );
  const isLeaf = children.length === 0;
  const realWidth = isLeaf
    ? resolveColumnWidth(column, widthOverrides)
    : children.reduce((sum, child) => sum + child.realWidth, 0);
  const leafCount = isLeaf ? 1 : children.reduce((sum, item) => sum + item.leafCount, 0);

  return {
    ...column,
    children,
    realWidth,
    leafCount,
    colSpan: leafCount,
    rowSpan: isLeaf ? maxLevel - column.level + 1 : 1,
    showOverflowTooltip: column.showOverflowTooltip ?? tableShowOverflowTooltip
  };
}

export function buildHeaderRows<T>(columns: TableResolvedColumn<T>[]) {
  const rows: TableHeaderCell<T>[][] = [];

  const visit = (column: TableResolvedColumn<T>) => {
    if (!rows[column.level]) {
      rows[column.level] = [];
    }

    rows[column.level].push({
      column,
      colSpan: column.colSpan,
      rowSpan: column.rowSpan,
      leafColumns: flattenColumns([column]),
      leafStartIndex: column.leafIndex
    });

    column.children.forEach(visit);
  };

  columns.forEach(visit);

  return rows;
}

export function getFixedLeafColumns<T>(
  columns: TableResolvedColumn<T>[],
  position: "left" | "right"
) {
  return flattenColumns(columns).filter((column) => column.fixed === position);
}

export function getUnfixedLeafColumns<T>(columns: TableResolvedColumn<T>[]) {
  return flattenColumns(columns).filter((column) => !column.fixed);
}

export function sumColumnWidths<T>(columns: Array<Pick<TableResolvedColumn<T>, "realWidth">>) {
  return columns.reduce((sum, column) => sum + column.realWidth, 0);
}

export function projectColumnsByFixed<T>(
  columns: TableResolvedColumn<T>[],
  section: Exclude<TableSection, "main">
) {
  const project = (column: TableResolvedColumn<T>): TableResolvedColumn<T> | null => {
    const children = column.children
      .map((child) => project(child))
      .filter((item): item is TableResolvedColumn<T> => Boolean(item));

    if (children.length === 0 && column.fixed !== section) {
      return null;
    }

    const leafCount =
      children.length > 0 ? children.reduce((sum, item) => sum + item.leafCount, 0) : 1;
    const realWidth =
      children.length > 0
        ? children.reduce((sum, item) => sum + item.realWidth, 0)
        : column.realWidth;

    return {
      ...column,
      fixed: section,
      children,
      leafCount,
      colSpan: leafCount,
      rowSpan: children.length > 0 ? 1 : column.rowSpan,
      realWidth
    };
  };

  return finalizeColumnTree(
    columns
      .map((column) => project(column))
      .filter((item): item is TableResolvedColumn<T> => Boolean(item))
  );
}

export function getFixedOffsets<T>(columns: TableResolvedColumn<T>[]) {
  const leafColumns = flattenColumns(columns);
  const left: Record<string, number> = {};
  const right: Record<string, number> = {};

  let leftOffset = 0;
  leafColumns.forEach((column) => {
    if (column.fixed !== "left") {
      return;
    }

    left[column.uid] = leftOffset;
    leftOffset += column.realWidth;
  });

  let rightOffset = 0;
  [...leafColumns].reverse().forEach((column) => {
    if (column.fixed !== "right") {
      return;
    }

    right[column.uid] = rightOffset;
    rightOffset += column.realWidth;
  });

  return {
    left,
    right
  };
}

export function defaultCompare(left: unknown, right: unknown) {
  if (left === right) {
    return 0;
  }

  if (left === undefined || left === null) {
    return -1;
  }

  if (right === undefined || right === null) {
    return 1;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), "zh-CN", {
    numeric: true,
    sensitivity: "base"
  });
}

export function resolveSortValue<T>(
  row: T,
  rowIndex: number,
  rows: T[],
  rule: string | ((row: T, rowIndex: number, rows: T[]) => unknown)
) {
  if (typeof rule === "function") {
    return rule(row, rowIndex, rows);
  }

  return row[rule as keyof T];
}

export function matchesFilter<T>(
  row: T,
  column: TableResolvedColumn<T>,
  selectedValues: TableFilterValue[]
) {
  if (selectedValues.length === 0) {
    return true;
  }

  if (column.filterMethod) {
    return selectedValues.some((value) => column.filterMethod?.(value, row, column));
  }

  if (!column.prop) {
    return true;
  }

  const cellValue = row[column.prop as keyof T];
  return selectedValues.some((value) => Object.is(value, cellValue));
}

export function normalizeSpanResult<T>(
  spanMethod: TableProps<T>["spanMethod"],
  context: TableSpanMethodContext<T>
): TableSpanResult {
  if (!spanMethod) {
    return {
      rowspan: 1,
      colspan: 1
    };
  }

  const result = spanMethod(context);

  if (!result) {
    return {
      rowspan: 1,
      colspan: 1
    };
  }

  if (Array.isArray(result)) {
    return {
      rowspan: Number(result[0] ?? 1),
      colspan: Number(result[1] ?? 1)
    };
  }

  return {
    rowspan: Number(result.rowspan ?? 1),
    colspan: Number(result.colspan ?? 1)
  };
}

export function resolveSummary<T>(
  columns: TableResolvedColumn<T>[],
  data: T[],
  sumText?: string,
  summaryMethod?: (context: TableSummaryMethodContext<T>) => TableSummaryValue[]
) {
  if (summaryMethod) {
    const values = summaryMethod({
      columns,
      data
    });
    return columns.map((column, index) => values[index]);
  }

  return columns.map((column, index) => {
    if (index === 0) {
      return sumText ?? TABLE_SUM_TEXT;
    }

    if (!column.prop) {
      return "";
    }

    const numericValues = data
      .map((row) => row[column.prop as keyof T] as unknown)
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

    if (numericValues.length === 0) {
      return "";
    }

    return numericValues.reduce((sum, value) => sum + value, 0);
  });
}

export function resolveTreeProps(treeProps?: TableTreeProps): Required<TableTreeProps> {
  return {
    ...TABLE_DEFAULT_TREE_PROPS,
    ...treeProps
  };
}

export function getTreeChildren<T>(
  row: T,
  treeProps: Required<TableTreeProps>,
  lazyChildrenMap: Map<string | number, T[]>,
  key: string | number
) {
  const fromLazyMap = lazyChildrenMap.get(key);

  if (fromLazyMap) {
    return fromLazyMap;
  }

  const children = row[treeProps.children as keyof T];
  return Array.isArray(children) ? (children as T[]) : [];
}

export function resolveTreeNode<T>(
  row: T,
  key: string | number,
  level: number,
  expanded: boolean,
  loading: boolean,
  lazy: boolean,
  treeProps: Required<TableTreeProps>,
  lazyChildrenMap: Map<string | number, T[]>
): TableTreeNode {
  const children = getTreeChildren(row, treeProps, lazyChildrenMap, key);
  const hasChildren = children.length > 0 || Boolean(row[treeProps.hasChildren as keyof T]);

  return {
    key,
    level,
    expanded,
    loading,
    hasChildren,
    isLazy: lazy && Boolean(row[treeProps.hasChildren as keyof T]) && children.length === 0,
    visible: true
  };
}

export function collectDescendantKeys<T>(
  row: T,
  key: string | number,
  treeProps: Required<TableTreeProps>,
  lazyChildrenMap: Map<string | number, T[]>,
  rowKey: TableRowKey<T> | undefined
) {
  const result: Array<string | number> = [];
  const walk = (currentRow: T, currentKey: string | number) => {
    const children = getTreeChildren(currentRow, treeProps, lazyChildrenMap, currentKey);

    children.forEach((child, index) => {
      const childKey = getRowIdentity(child, index, rowKey);
      result.push(childKey);
      walk(child, childKey);
    });
  };

  walk(row, key);
  return result;
}

export function resolveColumnWidth<T>(
  column: Pick<TableResolvedColumn<T>, "type" | "width" | "minWidth" | "uid">,
  widthOverrides: Record<string, number>
) {
  if (widthOverrides[column.uid]) {
    return widthOverrides[column.uid];
  }

  if (column.type === "selection") {
    return toNumberSize(column.width ?? column.minWidth, TABLE_SELECTION_COLUMN_WIDTH);
  }

  if (column.type === "index") {
    return toNumberSize(column.width ?? column.minWidth, TABLE_INDEX_COLUMN_WIDTH);
  }

  if (column.type === "expand") {
    return toNumberSize(column.width ?? column.minWidth, TABLE_EXPAND_COLUMN_WIDTH);
  }

  return toNumberSize(column.width ?? column.minWidth, TABLE_DEFAULT_COLUMN_WIDTH);
}

export function getMaxLevel<T>(columns: TableResolvedColumn<T>[]) {
  let maxLevel = 0;

  const visit = (column: TableResolvedColumn<T>) => {
    maxLevel = Math.max(maxLevel, column.level);
    column.children.forEach(visit);
  };

  columns.forEach(visit);

  return maxLevel;
}

function finalizeColumnTree<T>(columns: TableResolvedColumn<T>[]) {
  if (columns.length === 0) {
    return columns;
  }

  const maxLevel = getMaxLevel(columns);
  let leafIndex = 0;

  const visit = (column: TableResolvedColumn<T>): TableResolvedColumn<T> => {
    const children = column.children.map(visit);
    const isLeaf = children.length === 0;
    const nextLeafCount = isLeaf ? 1 : children.reduce((sum, item) => sum + item.leafCount, 0);
    const nextColumn: TableResolvedColumn<T> = {
      ...column,
      children,
      leafCount: nextLeafCount,
      colSpan: nextLeafCount,
      rowSpan: isLeaf ? maxLevel - column.level + 1 : 1,
      leafIndex: isLeaf ? leafIndex : (children[0]?.leafIndex ?? leafIndex)
    };

    if (isLeaf) {
      nextColumn.leafIndex = leafIndex;
      leafIndex += 1;
    }

    return nextColumn;
  };

  return columns.map(visit);
}

export function getTreeColumn<T>(columns: TableResolvedColumn<T>[]) {
  const leafColumns = flattenColumns(columns);
  return (
    leafColumns.find((column) => column.type === "default") ??
    leafColumns.find((column) => column.type !== "expand") ??
    leafColumns[0]
  );
}

export function getColumnByStateKey<T>(columns: TableResolvedColumn<T>[], key: string) {
  return flattenColumns(columns).find((column) => column.columnKey === key || column.prop === key);
}

export function hasFixedColumns<T>(columns: TableResolvedColumn<T>[]) {
  return flattenColumns(columns).some((column) => column.fixed);
}

export function isOrderActive(order: TableSortOrder) {
  return order === "ascending" || order === "descending";
}
