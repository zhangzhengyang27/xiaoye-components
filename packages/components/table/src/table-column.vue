<script setup lang="ts" generic="T extends Record<string, unknown>">
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  shallowRef,
  type VNode
} from "vue";
import { tableColumnContextKey, tableContextKey } from "./tokens";
import type { TableColumnContext, TableColumnRegistration, TableContext } from "./tokens";
import type {
  TableCellSlotProps,
  TableExpandSlotProps,
  TableFilterIconSlotProps,
  TableColumnProps,
  TableHeaderSlotProps,
  TableResolvedColumn
} from "./table";
import { normalizeFixed, normalizeSortOrders, toNumberSize } from "./table";

defineOptions({
  name: "XyTableColumn"
});

const props = withDefaults(defineProps<TableColumnProps<T>>(), {
  type: "default",
  prop: undefined,
  property: undefined,
  label: "",
  columnKey: undefined,
  width: undefined,
  minWidth: undefined,
  align: "left",
  headerAlign: undefined,
  className: "",
  labelClassName: "",
  formatter: undefined,
  renderHeader: undefined,
  sortable: false,
  sortMethod: undefined,
  sortBy: undefined,
  sortOrders: undefined,
  filters: () => [],
  filteredValue: undefined,
  filterMethod: undefined,
  filterMultiple: true,
  filterPlacement: "bottom-start",
  filterClassName: "",
  showOverflowTooltip: undefined,
  tooltipFormatter: undefined,
  fixed: undefined,
  selectable: undefined,
  reserveSelection: false,
  index: undefined,
  resizable: true
});

const slots = defineSlots<{
  default?: (props: TableCellSlotProps<T>) => unknown;
  header?: (props: TableHeaderSlotProps<T>) => unknown;
  "filter-icon"?: (props: TableFilterIconSlotProps) => unknown;
  expand?: (props: TableExpandSlotProps<T>) => unknown;
}>();
const instance = getCurrentInstance();
const table = inject(tableContextKey, null) as TableContext<T> | null;
const parentColumn = inject(tableColumnContextKey, null) as TableColumnContext<T> | null;
const uid = `xy-table-column-${instance?.uid ?? Math.random().toString(36).slice(2, 10)}`;
const order = ref(instance?.uid ?? 0);
const childRegistrations = shallowRef<TableColumnRegistration<T>[]>([]);

function hasNestedColumnVNode(nodes: VNode[] | undefined): boolean {
  if (!nodes || nodes.length === 0) {
    return false;
  }

  return nodes.some((node) => {
    const type = node.type as { name?: string; __name?: string } | symbol | string;

    if (typeof type === "object" && (type.name === "XyTableColumn" || type.__name === "table-column")) {
      return true;
    }

    if (Array.isArray(node.children)) {
      return hasNestedColumnVNode(node.children as VNode[]);
    }

    return false;
  });
}

function registerChildColumn(column: TableColumnRegistration<T>) {
  childRegistrations.value = [...childRegistrations.value, column].sort(
    (left, right) => left.order.value - right.order.value
  );
}

function unregisterChildColumn(targetUid: string) {
  childRegistrations.value = childRegistrations.value.filter((column) => column.uid !== targetUid);
}

provide(tableColumnContextKey, {
  uid,
  level: parentColumn ? parentColumn.level + 1 : 0,
  registerChildColumn,
  unregisterChildColumn
} as never);

const descriptor = computed<TableResolvedColumn<T>>(() => ({
  uid,
  key: props.columnKey ?? props.prop ?? props.property ?? uid,
  type: props.type,
  prop: props.prop ?? props.property,
  label: props.label,
  columnKey: props.columnKey,
  width: props.width,
  minWidth: props.minWidth,
  realWidth: toNumberSize(props.width ?? props.minWidth),
  align: props.align,
  headerAlign: props.headerAlign ?? props.align,
  className: props.className,
  labelClassName: props.labelClassName,
  formatter: props.formatter,
  renderHeader: props.renderHeader,
  sortable: props.sortable,
  sortMethod: props.sortMethod,
  sortBy: props.sortBy,
  sortOrders: props.sortable ? normalizeSortOrders(props.sortOrders) : [],
  filters: props.filters,
  filteredValue: props.filteredValue,
  filterMethod: props.filterMethod,
  filterMultiple: props.filterMultiple,
  filterPlacement: props.filterPlacement,
  filterClassName: props.filterClassName,
  showOverflowTooltip: props.showOverflowTooltip,
  tooltipFormatter: props.tooltipFormatter,
  overflowTooltipOptions: null,
  fixed: normalizeFixed(props.fixed),
  selectable: props.selectable,
  reserveSelection: props.reserveSelection,
  index: props.index,
  resizable: props.resizable,
  children: childRegistrations.value
    .slice()
    .sort((left, right) => left.order.value - right.order.value)
    .map((column) => column.descriptor.value),
  level: parentColumn ? parentColumn.level + 1 : 0,
  parentUid: parentColumn?.uid,
  headerSlot: slots.header,
  filterIconSlot: slots["filter-icon"],
  cellSlot: slots.default,
  expandSlot: slots.expand,
  leafCount: 1,
  colSpan: 1,
  rowSpan: 1,
  leafIndex: 0
}));

const slotProbeProps = computed<TableCellSlotProps<T>>(() => ({
  row: {} as T,
  rowIndex: -1,
  column: descriptor.value,
  columnIndex: -1,
  value: undefined,
  expanded: false,
  treeNode: undefined
}));

const shouldRenderNestedColumns = computed(() => {
  const slotNodes = slots.default?.(slotProbeProps.value);

  return (
    props.type === "default" &&
    !props.prop &&
    hasNestedColumnVNode(Array.isArray(slotNodes) ? (slotNodes as VNode[]) : undefined)
  );
});

const registration = {
  uid,
  order,
  descriptor
} as TableColumnRegistration<T>;

function resolveAnchorNode() {
  const node = (instance?.subTree?.el ?? instance?.vnode?.el) as Node | null | undefined;
  return node ?? null;
}

function updateRenderOrder() {
  const anchorNode = resolveAnchorNode();

  if (!anchorNode?.parentNode) {
    return;
  }

  const targetNode = anchorNode as ChildNode;
  const siblings = Array.from(anchorNode.parentNode.childNodes);
  const nextOrder = siblings.indexOf(targetNode);

  if (nextOrder >= 0 && nextOrder !== order.value) {
    order.value = nextOrder;
  }
}

onBeforeMount(() => {
  if (parentColumn) {
    parentColumn.registerChildColumn(registration);
    return;
  }

  table?.registerColumn(registration);
});

onMounted(() => {
  updateRenderOrder();
});

onUpdated(() => {
  updateRenderOrder();
});

onBeforeUnmount(() => {
  if (parentColumn) {
    parentColumn.unregisterChildColumn(uid);
    return;
  }

  table?.unregisterColumn(uid);
});
</script>

<template>
  <div v-if="shouldRenderNestedColumns" class="xy-table-column__hidden">
    <slot v-bind="slotProbeProps" />
  </div>
</template>
