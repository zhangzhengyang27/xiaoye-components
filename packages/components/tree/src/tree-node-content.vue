<script lang="ts">
import { defineComponent, h, inject, renderSlot } from "vue";
import { useNamespace } from "@xiaoye/composables";
import { NODE_INSTANCE_INJECTION_KEY, ROOT_TREE_INJECTION_KEY } from "./tokens";
import type { PropType } from "vue";
import type Node from "./model/node";
import type { RenderContentFunction } from "./tree.type";

export default defineComponent({
  name: "XyTreeNodeContent",
  props: {
    node: {
      type: Object as PropType<Node>,
      required: true
    },
    renderContent: {
      type: Function as PropType<RenderContentFunction | undefined>,
      default: undefined
    }
  },
  setup(props) {
    const ns = useNamespace("tree");
    const nodeInstance = inject(NODE_INSTANCE_INJECTION_KEY, null);
    const tree = inject(ROOT_TREE_INJECTION_KEY);

    if (!tree) {
      throw new Error("[Tree] missing root tree context");
    }

    return () => {
      const node = props.node;
      const { data, store } = node;

      if (props.renderContent) {
        return props.renderContent(h, {
          _self: nodeInstance,
          node,
          data,
          store
        });
      }

      return renderSlot(tree.slots, "default", { node, data }, () => [
        h(
          "span",
          {
            class: `${ns.base.value}__node-label`
          },
          node.label
        )
      ]);
    };
  }
});
</script>
