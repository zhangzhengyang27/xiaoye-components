<template>
  <div
    v-show="node.visible"
    ref="nodeRef"
    :class="nodeClasses"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="node.isLeaf ? undefined : expanded"
    :aria-disabled="node.disabled"
    :aria-checked="showCheckbox ? (node.indeterminate ? 'mixed' : `${node.checked}`) : undefined"
    :aria-selected="tree.props.highlightCurrent ? `${node.isCurrent}` : undefined"
    :aria-busy="node.loading ? 'true' : undefined"
    :aria-level="node.level"
    :aria-posinset="ariaPosInSet"
    :aria-setsize="ariaSetSize"
    :aria-describedby="statusTipId"
    :draggable="tree.props.draggable"
    :data-key="nodeIdentifier"
    @click.stop="handleClick"
    @contextmenu.stop.prevent="handleContextMenu"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop.prevent="handleDrop"
  >
    <div :class="`${ns.base.value}__node-content`" :style="contentStyle">
      <button
        v-if="!node.isLeaf"
        type="button"
        :class="expandIconClasses"
        :aria-label="expanded ? '收起节点' : '展开节点'"
        @click.stop="handleExpandIconClick"
      >
        <xy-icon v-if="expandIconName" :icon="expandIconName" />
        <component :is="expandIconComponent" v-else />
      </button>
      <span v-else :class="`${ns.base.value}__expand-placeholder`" />

      <span v-if="showCheckbox" :class="`${ns.base.value}__checkbox`" @click.stop>
        <xy-checkbox
          :model-value="node.checked"
          :indeterminate="node.indeterminate"
          :disabled="node.disabled"
          :tabindex="-1"
          @change="handleCheckChange"
        />
      </span>

      <span v-if="node.loading" :class="`${ns.base.value}__loading-icon`">
        <xy-icon :icon="loadingIcon" spin />
      </span>

      <tree-node-content :node="node" :render-content="renderContent" />

      <span
        v-if="node.loadFailed"
        :id="statusTipId"
        :class="`${ns.base.value}__status-tip`"
        role="status"
      >
        加载失败，点击重试
      </span>
    </div>

    <xy-collapse-transition>
      <div
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        :class="`${ns.base.value}__children`"
        role="group"
        @click.stop
      >
        <tree-node
          v-for="child in node.childNodes"
          :key="getChildKey(child)"
          :node="child"
          :props-mapping="propsMapping"
          :accordion="accordion"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :render-content="renderContent"
          @node-expand="handleChildNodeExpand"
        />
      </div>
    </xy-collapse-transition>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  provide,
  ref,
  watch
} from "vue";
import { useNamespace } from "@xiaoye/composables";
import { XyCheckbox } from "../../checkbox";
import { XyCollapseTransition } from "../../collapse-transition";
import { XyIcon } from "../../icon";
import { dragEventsKey } from "./model/use-drag-node";
import TreeNodeContent from "./tree-node-content.vue";
import { DEFAULT_TREE_LOADING_ICON } from "./tree";
import { NODE_INSTANCE_INJECTION_KEY, ROOT_TREE_INJECTION_KEY } from "./tokens";
import { handleCurrentChange } from "./model/util";
import type { PropType } from "vue";
import type { CheckboxValue } from "../../checkbox";
import type Node from "./model/node";
import type {
  RenderContentFunction,
  RootTreeType,
  TreeNodeClassValue,
  TreeNodeIcon,
  TreeOptionProps
} from "./tree.type";

export default defineComponent({
  name: "XyTreeNode",
  components: {
    TreeNodeContent,
    XyCheckbox,
    XyCollapseTransition,
    XyIcon
  },
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true
    },
    propsMapping: {
      type: Object as PropType<TreeOptionProps>,
      default: () => ({})
    },
    accordion: {
      type: Boolean,
      default: false
    },
    renderContent: {
      type: Function as PropType<RenderContentFunction | undefined>,
      default: undefined
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  emits: ["node-expand"],
  setup(props, ctx) {
    const ns = useNamespace("tree");
    const tree = inject(ROOT_TREE_INJECTION_KEY) as RootTreeType;
    const nodeRef = ref<HTMLElement | null>(null);
    const expanded = computed(() => Boolean(props.node.expanded));
    const childNodeRendered = ref(Boolean(props.node.expanded));
    const oldChecked = ref<boolean | undefined>();
    const oldIndeterminate = ref<boolean | undefined>();
    const instance = getCurrentInstance();
    const dragEvents = inject(dragEventsKey, null);

    provide(NODE_INSTANCE_INJECTION_KEY, instance);

    watch(
      () => props.node.getChildren(),
      () => {
        props.node.updateChildren();
      },
      {
        deep: true
      }
    );

    watch(
      () => props.node.indeterminate,
      (value) => {
        handleSelectChange(props.node.checked, value);
      }
    );

    watch(
      () => props.node.checked,
      (value) => {
        handleSelectChange(value, props.node.indeterminate);
      }
    );

    watch(
      () => props.node.childNodes.length,
      () => {
        props.node.reInitChecked();
      }
    );

    watch(
      () => props.node.expanded,
      (value) => {
        if (value) {
          childNodeRendered.value = true;
        }
      }
    );

    const nodeIdentifier = computed(() => {
      return props.node.key ?? props.node.id;
    });
    const visibleSiblingNodes = computed(() =>
      (props.node.parent?.childNodes ?? []).filter((child) => child.visible)
    );
    const ariaPosInSet = computed(() => {
      const index = visibleSiblingNodes.value.findIndex((child) => child === props.node);
      return index > -1 ? index + 1 : 1;
    });
    const ariaSetSize = computed(() => Math.max(visibleSiblingNodes.value.length, 1));
    const statusTipId = computed(() =>
      props.node.loadFailed ? `${ns.base.value}-status-${nodeIdentifier.value}` : undefined
    );

    const nodeClasses = computed(() => [
      `${ns.base.value}__node`,
      ns.is("expanded", expanded.value),
      ns.is("current", props.node.isCurrent),
      ns.is("hidden", !props.node.visible),
      ns.is("checked", !props.node.disabled && props.node.checked),
      props.node.loadFailed ? "is-load-failed" : "",
      props.node.disabled ? "is-disabled" : "",
      getNodeClass(props.node)
    ]);

    const expandIconClasses = computed(() => [
      `${ns.base.value}__expand-icon`,
      ns.is("leaf", props.node.isLeaf),
      ns.is("expanded", !props.node.isLeaf && expanded.value)
    ]);

    const contentStyle = computed(() => ({
      paddingLeft: `${Math.max(props.node.level - 1, 0) * (tree.props.indent ?? 18)}px`
    }));

    const expandIconName = computed(() =>
      typeof tree.props.icon === "string" ? tree.props.icon : undefined
    );

    const expandIconComponent = computed(() =>
      typeof tree.props.icon === "string" ? null : (tree.props.icon as TreeNodeIcon)
    );

    function getChildKey(node: Node) {
      return node.key ?? node.id;
    }

    function getNodeClass(node: Node): TreeNodeClassValue {
      const nodeClass = props.propsMapping.class;

      if (!nodeClass) {
        return undefined;
      }

      if (typeof nodeClass === "function") {
        return nodeClass(node.data as Record<string, unknown>, node);
      }

      return nodeClass;
    }

    function handleSelectChange(checked: boolean, indeterminate: boolean) {
      if (oldChecked.value !== checked || oldIndeterminate.value !== indeterminate) {
        tree.emit("check-change", props.node.data, checked, indeterminate);
      }

      oldChecked.value = checked;
      oldIndeterminate.value = indeterminate;
    }

    function focusSelf() {
      nodeRef.value?.focus();
    }

    function handleClick(event: MouseEvent) {
      focusSelf();
      tree.focusTreeItem(props.node);

      handleCurrentChange(tree.store, tree.emit, () => {
        if (tree.props.nodeKey) {
          tree.store.value.setCurrentNodeKey(nodeIdentifier.value);
        } else {
          tree.store.value.setCurrentNode(props.node);
        }
      });

      if (tree.props.expandOnClickNode) {
        handleExpandIconClick();
      }

      if (
        (tree.props.checkOnClickNode ||
          (props.node.isLeaf && tree.props.checkOnClickLeaf && props.showCheckbox)) &&
        !props.node.disabled
      ) {
        handleCheckChange(!props.node.checked);
      }

      tree.emit("node-click", props.node.data, props.node, instance, event);
    }

    function handleContextMenu(event: Event) {
      focusSelf();
      tree.emit("node-contextmenu", event, props.node.data, props.node, instance);
    }

    function handleExpandIconClick() {
      if (props.node.isLeaf) {
        return;
      }

      focusSelf();

      if (expanded.value) {
        props.node.collapse();
        tree.emit("node-collapse", props.node.data, props.node, instance);
        return;
      }

      props.node.expand(() => {
        ctx.emit("node-expand", props.node.data, props.node, instance);
      });
    }

    function handleCheckChange(value: CheckboxValue) {
      let nextValue = value === true;

      if (!tree.props.checkStrictly && props.node.childNodes.length > 0) {
        nextValue = props.node.childNodes.some((child) => !child.isEffectivelyChecked);
      }

      props.node.setChecked(nextValue, !tree.props.checkStrictly);

      nextTick(() => {
        const store = tree.store.value;

        tree.emit("check", props.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        });
      });
    }

    function handleChildNodeExpand(
      nodeData: Record<string, unknown>,
      node: Node,
      nodeInstance: ReturnType<typeof getCurrentInstance>
    ) {
      ctx.emit("node-expand", nodeData, node, nodeInstance);
    }

    function handleDragStart(event: DragEvent) {
      if (!tree.props.draggable || !dragEvents) {
        return;
      }

      dragEvents.treeNodeDragStart({
        event,
        treeNode: {
          node: props.node,
          $el: nodeRef.value
        }
      });
    }

    function handleDragOver(event: DragEvent) {
      event.preventDefault();

      if (!tree.props.draggable || !dragEvents) {
        return;
      }

      dragEvents.treeNodeDragOver({
        event,
        treeNode: {
          node: props.node,
          $el: nodeRef.value
        }
      });
    }

    function handleDrop(event: DragEvent) {
      event.preventDefault();
    }

    function handleDragEnd(event: DragEvent) {
      if (!tree.props.draggable || !dragEvents) {
        return;
      }

      dragEvents.treeNodeDragEnd(event);
    }

    return {
      ns,
      tree,
      nodeRef,
      expanded,
      childNodeRendered,
      nodeClasses,
      nodeIdentifier,
      expandIconClasses,
      expandIconName,
      expandIconComponent,
      loadingIcon: DEFAULT_TREE_LOADING_ICON,
      ariaPosInSet,
      ariaSetSize,
      statusTipId,
      contentStyle,
      getChildKey,
      handleClick,
      handleContextMenu,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleDragEnd,
      handleExpandIconClick,
      handleCheckChange,
      handleChildNodeExpand
    };
  }
});
</script>
