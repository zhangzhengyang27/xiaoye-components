import { defineComponent } from "vue";

export const TableRenderValue = defineComponent({
  name: "XyTableRenderValue",
  props: {
    value: {
      type: null,
      default: ""
    }
  },
  setup(props) {
    return () => props.value as never;
  }
});
