import { defineComponent } from "vue";

export const TableRenderSlot = defineComponent({
  name: "XyTableRenderSlot",
  props: {
    render: {
      type: Function,
      required: true
    },
    slotProps: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    return () => props.render(props.slotProps);
  }
});
